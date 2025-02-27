<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${resumenCausa.ruc}`"
  page-title="Solicitar Sobreseimiento definitivo"
/>
<section class="mt-4 mb-2">
  <ResumenCausa
    :colapse="true"
    :hide-alerta="true"
  />

  <AppFieldset
    legend="Relaciones"
    :toggleable="true"
  >
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
      <InputText
        id="filter-text"
        v-model="inputFiltro"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
      />
    </div>
    <LoaderSkeleton
      v-if="tables.relaciones.isLoading"
      height="220px"
    />
    <TablaRelaciones
      v-else
      v-model:first="tables.relaciones.firstRecord"
      v-model:selection="formData.relacionesSeleccionadas"
      :loading="tables.relaciones.isLoading"
      read-only
      selectable
      :total-records="paginacion?.elementosTotales"
      :value="filtroRelaciones"
      @page="getRelaciones"
      @relacion:ver-directriz="verDirectriz"
    />
  </AppFieldset>
  <AppFieldset legend="Solicitud de Audiencia de Sobreseimiento Definitivo">
    <AppForm
      id="solicitar-sobreseimiento-form"
      class="w-full"
      :form-submitted="formSubmitted"
      validation-scope="solicitar-sobreseimiento-form"
    >
      <ComunicarCierreEscrito
        v-model="formData"
        :causa="resumenCausa"
        class="col-12"
        :is-sobreseimiento="true"
      />
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      icon="pi pi-save"
      icon-pos="right"
      label="Enviar Solicitud"
      @click="handleDecision"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
/*eslint-disable*/
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AppFieldset from '@/modules/common/components/AppFieldset.vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import ResumenCausa from '@/modules/termino-postermino/views/revisar-antecedentes-causa/ResumenCausa.vue';
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue';
import ComunicarCierreEscrito from '../../components/ComunicarCierreEscrito.vue';
import { useRouter } from 'vue-router';
import { requestUtil, appUtil } from '@/utils';
import { onMounted, ref, computed, reactive } from 'vue';
import { useMenuSuperior, usePostermino, useTermino } from '../../composables';
import {
  useMantenedorStore,
  usePamStore,
  useRelacionesStore
} from '@/modules/global/composables';
import {
  useConfirmDialog,
  useFormValidation,
  useAppToast
} from '@/modules/common/composables';

const { launchConfirmDialog } = useConfirmDialog();
const { toastError, toastSuccess } = useAppToast();
const router = useRouter();
const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' });
};

const formData = reactive({
  seDerivaEquipoJuridico: null,
  idTribunal: '',
  idPlantilla: null,
  documentosSeleccionados: [],
  textoFiscal: null,
  instruccionFiscal: null,
  seRevisaEscrito: null,
  adjuntaCarpeta: false,
  idMotivoSobreseimiento: null,
  relacionesSeleccionadas: []
});

const { formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'solicitar-sobreseimiento-form'
});

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  documentos: {
    firstRecord: 0,
    isLoading: false
  }
});

/* === Causa === */

const {
  ruc,
  resumenCausa,
  idDenuncia
  // termino_getAntecedentesCausa
} = useTermino();
const {
  termino_PamCompletarSolicitarSobreseimientoDefinitivo,
  postermino_postSobreseimientoDefinitivo
} = usePostermino();

const { mantenedor_getMotivosSobreseimiento } = useMantenedorStore();

const { itemsMenuSuperior } = useMenuSuperior({ ruc });

/* === Relaciones === */

const { paginacion, relaciones, relaciones_getRelaciones } =
  useRelacionesStore();

const inputFiltro = ref('');
const { includeWord } = appUtil;

const filtroRelaciones = computed(() => {
  const relations = relaciones.value;
  if (inputFiltro.value) {
    return relations?.filter(
      (relations) =>
        includeWord(relations.nombreCompletoVictima, inputFiltro.value) ||
        includeWord(relations.nombreCompletoImputado, inputFiltro.value) ||
        includeWord(relations.delito, inputFiltro.value) ||
        includeWord(relations.estado, inputFiltro.value) ||
        includeWord(relations.etapa, inputFiltro.value)
    );
  }
  return relations;
});

async function getRelaciones(pagination = undefined) {
  if (!pagination) {
    tables.relaciones.firstRecord = 0;
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  };

  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: idDenuncia.value, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  });
}

/* *************** */

async function handleDecision() {
  if (formData.relacionesSeleccionadas.length === 0) {
    toastError('Por favor seleccione al menos una relación.');
  }
  launchConfirmDialog({
    message: `¿Está seguro de Enviar la Solicitud?`,
    header: 'Enviar Solicitud',
    accept: () => {
      postSobreseimientoDefinitivo();
    }
  });
}

const postSobreseimientoDefinitivo = () => {
  const {
    seDerivaEquipoJuridico,
    idTribunal: idJuzgado,
    idPlantilla,
    documentosSeleccionados: idsDocumento,
    textoFiscal: textoEscrito,
    instruccionFiscal,
    seRevisaEscrito,
    relacionesSeleccionadas,
    idMotivoSobreseimiento
  } = formData;
  requestUtil({
    action: postermino_postSobreseimientoDefinitivo,
    payload: {
      idCausa: resumenCausa.value.idCausa,
      idFiscalia: '0a5f2032-9c4f-4ebb-b87f-5b2eb5684e1a',
      idFiscal: 'Thomas',
      seDerivaEquipoJuridico,
      idPlantilla,
      idsDocumento,
      idJuzgado,
      textoEscrito,
      seRevisaEscrito,
      instruccionFiscal,
      idsRelacion: relacionesSeleccionadas.map((r) => r.idRelacionDelito),
      idMotivoSobreseimiento,
      esSolicitudAudiencia: true
    },
    resolve: () => {
      terminarTareaRevisarCausa();
    }
  });
};
/* Terminar Tarea PAM */

const { procesoPam } = usePamStore();

const terminarTareaSolicitarSobreseimientoDefinitivo = () => {
  requestUtil({
    action: termino_PamCompletarSolicitarSobreseimientoDefinitivo,
    payload: {
      taskId: procesoPam.value?.taskId,
      accionTermino: ''
    },
    resolve: () => {
      setTimeout(() => {
        router.push({ name: 'BandejaFiscal' });
        toastSuccess('Evaluación enviada');
      }, 500);
    }
  });
};

onMounted(async () => {
  getRelaciones();
  requestUtil({ action: mantenedor_getMotivosSobreseimiento });
});
</script>
