<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  :page-description="`Nombre de Causa: ${resumenCausa.nombreCausa}`"
  :page-subtitle="`RUC: ${resumenCausa.ruc}`"
  page-title="Evaluar Solicitud de Reapertura de Causa"
/>
<section class="mt-4">
  <div class="grid w-full mt-4">
    <AppFieldset
      class="col-5 mr-5"
      legend="Solicitud Reapertura Causa"
    >
      <div class="col-12 pl-4">
        <p><strong>Id Solicitud: </strong>{{ solicitudReapertura?.id }}</p>
        <p>
          <strong>Fecha Solicitud: </strong>{{ solicitudReapertura?.fechaSolicitud }}
        </p>
        <p>
          <strong>Nombre del Solicitante: </strong>{{ solicitudReapertura?.solicitante }}
        </p>
        <p>
          <strong>Correo del Solicitante: </strong>{{ solicitudReapertura?.correoSolicitante }}
        </p>
        <p>
          <strong>Teléfono del Solicitante: </strong>{{ solicitudReapertura?.telefono }}
        </p>
      </div>
    </AppFieldset>
    <AppFieldset
      class="col-6"
      legend="Documentos Adjuntos"
    >
      <div class="col-12 pl-4">
        <div v-if="tables.documentos.isLoading">
          <LoaderSkeleton />
        </div>
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
        <TablaDocumentos
          v-model:first="tables.documentos.firstRecord"
          :loading="tables.documentos.isLoading"
          read-only
          :rows="paginacionDocumentos?.tamanoPagina"
          :total-records="paginacionDocumentos?.elementosTotales"
          :value="filtroDocumentos"
          @page="getDocumentos"
        />
      </div>
    </AppFieldset>
  </div>

  <AppFieldset legend="Texto Solicitud de Reapertura">
    <div class="texto col-12 p-4">
      {{ solicitudReapertura?.texto }}
    </div>
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />

  <AppBtnRightTeleported>
    <Button
      id="btn-rechazar"
      class="p-button-outlined p-button-danger px-5 mr-4"
      icon="pi pi-times-circle"
      icon-pos="right"
      label="Rechazar Reapertura"
      @click="openConfirmarRechazoReapertura"
    />
    <Button
      id="btn-aprobar"
      class="btn-primary px-5"
      icon="pi pi-check-circle"
      icon-pos="right"
      label="Aprobar Reapertura"
      @click="openConfirmarAprobacionReapertura"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
/*eslint-disable*/
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import TablaDocumentos from '../../components/evaluar-solitud-reapertura/TablaDocumentos.vue';
import ModalRechazoReaperturaVue from '@/modules/termino-postermino/components/modals/ModalRechazoReapertura.vue';
import {
  useMenuSuperior,
  usePostermino,
  useTermino
} from '@/modules/termino-postermino/composables';
import {
  useAppToast,
  useConfirmDialog,
  useAppDialog
} from '@/modules/common/composables';
import { appUtil, requestUtil } from '@/utils';
import { useRouter } from 'vue-router';
import { computed, onMounted, reactive, ref } from 'vue';
import { useDocumentoStore, usePamStore } from '@/modules/global/composables';

const router = useRouter();

const handleBackStep = () => {
  router.push({ name: 'BandejaFiscal' });
};

const { launchConfirmDialog } = useConfirmDialog();
const { launchDialog } = useAppDialog();
const { toastSuccess } = useAppToast();

const { ruc, resumenCausa, idDenuncia } = useTermino();

const {
  // solicitudReapertura,
  postermino_postDecisionSolicitudReapertura,
  postermino_getSolicitudReapertura,
  termino_PamCompletarEvaluarSolicitudReapertura
} = usePostermino();

const { itemsMenuSuperior } = useMenuSuperior({ ruc });

const tables = reactive({
  documentos: {
    firstRecord: 0,
    isLoading: false
  }
});

/* === DOCUMENTOS === */

const { documentos, documento_getDocumentosByIdDenuncia } = useDocumentoStore();

const inputFiltro = ref('');
const { includeWord } = appUtil;
const filtroDocumentos = computed(() => {
  const docs = documentos.value;
  if (inputFiltro.value) {
    return docs?.filter(
      (documento) =>
        includeWord(documento.nombre, inputFiltro.value) ||
        includeWord(documento.descripcion, inputFiltro.value)
    );
  }
  return docs;
});

async function getDocumentosEnCausa() {
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value
    }
  });
}

/*************************/

const solicitudReapertura = ref();
async function getSolicitudReapertura() {
  requestUtil({
    action: postermino_getSolicitudReapertura,
    payload: { idCausa: resumenCausa.value.idCausa },
    resolve: (data) => {
      solicitudReapertura.value = data;
      console.log(solicitudReapertura.value);
    }
  });
}

function openConfirmarRechazoReapertura() {
  launchDialog({
    component: ModalRechazoReaperturaVue,
    header: 'Rechazar Apertura',
    confirmLabel: 'Confirmar Rechazo',
    accept: async (data) => {
      postDecisionSolicitudReapertura(false);
    }
  });
}

async function openConfirmarAprobacionReapertura() {
  launchConfirmDialog({
    message: `¿Estas seguro de Aprobar Reapertura?`,
    header: 'Aprobar Reapertura',
    accept: () => {
      postDecisionSolicitudReapertura(true);
    }
  });
}

const postDecisionSolicitudReapertura = (esAprobada) => {
  requestUtil({
    action: postermino_postDecisionSolicitudReapertura,
    payload: {
      ...solicitudReapertura.value,
      esAprobada
    },
    resolve: () => {
      terminarTareaEvaluarSolicitudReapertura(esAprobada);
    }
  });
};

const { procesoPam } = usePamStore();

const terminarTareaEvaluarSolicitudReapertura = (apruebaSolicitud) => {
  requestUtil({
    action: termino_PamCompletarEvaluarSolicitudReapertura,
    payload: {
      apruebaSolicitud,
      accionTermino: '',
      taskId: procesoPam.value?.taskId
    },
    resolve: () => {
      setTimeout(() => {
        toastSuccess('Exitoso! Reapertura Aprobada');
        router.push({ name: 'BandejaFiscal' });
      }, 300);
    }
  });
};

onMounted(async () => {
  getSolicitudReapertura();
  getDocumentosEnCausa();
});
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.texto {
  border-radius: 8px;
  border: solid 1px #222;
}
</style>
