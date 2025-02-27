<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${resumenCausa.ruc}`"
  page-title="Reactivar Causa Penal"
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
      :loading="tables.relaciones.isLoading"
      read-only
      :total-records="paginacion?.elementosTotales"
      :value="filtroRelaciones"
      @page="getRelaciones"
    />
  </AppFieldset>
  <div class="col-4 mb-4">
    <h4 class="mb-2">
      ¿Desea Elaborar una Solicitud al Tribunal?
    </h4>
    <AppSelectButton
      id="solicitud-tribunal"
      v-model="formData.esSolicitudAudiencia"
      class="col-12 p-fluid"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
      :rules="{ required }"
    />
  </div>
  <AppFieldset
    v-if="formData.esSolicitudAudiencia"
    legend="Solicitud de Audiencia para Reactivar Causa"
  >
    <AppForm
      id="reactivar-causa-form"
      class="w-full"
      :form-submitted="formSubmitted"
      validation-scope="reactivar-causa-form"
    >
      <ComunicarCierreEscrito
        v-model="formData"
        :causa="resumenCausa"
        class="col-12"
        :is-reactivar-causa="true"
      />
    </AppForm>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnRightTeleported>
    <Button
      class="btn-primary px-5"
      :disabled="!formData.esSolicitudAudiencia"
      icon="pi pi-save"
      icon-pos="right"
      label="Enviar Solicitud"
      @click="handleDecision"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import ResumenCausa from '@/modules/termino-postermino/views/revisar-antecedentes-causa/ResumenCausa.vue'
import TablaRelaciones from '@/modules/termino-postermino/components/tablas/TablaRelaciones.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import ComunicarCierreEscrito from '../../components/ComunicarCierreEscrito.vue'
import { useRouter } from 'vue-router'
import { requestUtil, appUtil } from '@/utils'
import { onMounted, ref, computed, reactive } from 'vue'
import { useMenuSuperior, usePostermino, useTermino } from '../../composables'
import { usePamStore, useRelacionesStore } from '@/modules/global/composables'
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'

const { toastSuccess } = useAppToast()

const { launchConfirmDialog } = useConfirmDialog()

const router = useRouter()
const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' })
}

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  documentos: {
    firstRecord: 0,
    isLoading: false
  }
})

const formData = reactive({
  seDerivaEquipoJuridico: null,
  idTribunal: '',
  idPlantilla: null,
  documentosSeleccionados: [],
  textoFiscal: null,
  instruccionFiscal: null,
  seRevisaEscrito: null,
  adjuntaCarpeta: false,
  idMotivoReapertura: null,
  esSolicitudAudiencia: null
})
/*eslint-disable*/
const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'reactivar-causa-form'
});

const { ruc, resumenCausa, idDenuncia } = useTermino();
const {
  termino_PamCompletarReactivarCausaPenal,
  postermino_postReactivarCausa
} = usePostermino();

const { itemsMenuSuperior } = useMenuSuperior({ ruc });

/* === RELACIONES === */
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
    loader: (l) => (tables.relaciones.isLoading = l),
    resolve: (d) => console.log(d)
  });
}

/************************/

/************************/

async function handleDecision() {
  launchConfirmDialog({
    message: `¿Está seguro de Enviar la Solicitud?`,
    header: 'Enviar Solicitud',
    accept: () => {
      postReactivarCausaPenal();
    }
  });
}

const postReactivarCausaPenal = () => {
  const {
    seDerivaEquipoJuridico,
    idTribunal: idJuzgado,
    idPlantilla,
    documentosSeleccionados: idsDocumento,
    textoFiscal: textoEscrito,
    instruccionFiscal,
    seRevisaEscrito,
    idMotivoReapertura,
    esSolicitudAudiencia
  } = formData;
  requestUtil({
    action: postermino_postReactivarCausa,
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
      idsRelacion: [],
      idMotivoSobreseimiento: idMotivoReapertura,
      esSolicitudAudiencia
    },
    resolve: () => {
      terminarTareaReactivarCausaPenal();
    }
  });
};

/* Terminar Tarea PAM */

const { procesoPam } = usePamStore();

const terminarTareaReactivarCausaPenal = () => {
  requestUtil({
    action: termino_PamCompletarReactivarCausaPenal,
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
});
</script>
