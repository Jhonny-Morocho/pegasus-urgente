<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Solicitud de creación de catálogo documental digital"
  />

  <AppFieldset legend="Antecedentes del Catálogo">
    <LoaderSkeleton
      v-show="progressLoader"
      class="col-12"
    />

    <AntecedentesCatalogo
      v-show="!progressLoader"
      ref="creacionCatalogo"
    />
  </AppFieldset>

  <AppFieldset
    class="p-fluid"
    legend="Últimas solicitudes realizadas"
  >
    <div class="col-12">
      <AppFilters
        v-model="tablaSolicitudes.filters"
        :no-date-filters="true"
        @filter="getDataTablaSolicitudes"
      />
    </div>
    <div v-if="tablaSolicitudes.isLoading">
      <LoaderSkeleton />
    </div>
    <TablaSolicitudCreacion
      v-else
      v-model:first="tablaSolicitudes.firstRecord"
      :loading="tablaSolicitudes.isLoading"
      :rows="paginacionCatalogo?.tamanoPagina"
      style="width: 100%"
      :total-records="paginacionCatalogo?.elementosTotales"
      :value="solicitudesCatalogo"
      @page="getDataTablaSolicitudes"
    />
  </AppFieldset>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnNextTeleported
    label="Crear Catálogo"
    :loading="loadingCrearCatalogo"
    @click="handleCrearCatalogo()"
  />
</section>
</template>

<script setup>
/* eslint-disable */
import AppFilters from '@/modules/common/components/AppFilters.vue';
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue';
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue';
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue';
import TablaSolicitudCreacion from '@/modules/catalogo-documental-digital/components/solicitud-creacion/TablaSolicitudCreacion.vue';
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AntecedentesCatalogo from '@/modules/catalogo-documental-digital/components/solicitud-creacion/AntecedentesCatalogo.vue';
import store from '@/store';
import { ref, reactive, onMounted } from 'vue';
import { requestUtil } from '@/utils';
import { useRouter } from 'vue-router';
import { useConfirmDialog, useAppToast } from '@/modules/common/composables';
import {
  useCreacionYGestionDeCDD,
  useMantenedorCDD
} from '@/modules/catalogo-documental-digital/composables';

const router = useRouter();
const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast();
const {
  solicitudesCatalogo,
  paginacionCatalogo,
  creacionYGestionDeCDD_getDataSolicitudes
} = useCreacionYGestionDeCDD();

const {
  mantenedorCDD_getNivelAcceso,
  mantenedorCDD_getFormatoRecepcion,
  mantenedorCDD_getClaseDocumental,
  mantenedorCDD_getProcedencia,
  mantenedorCDD_getNivelFirma,
  mantenedorCDD_getIdiomas,
  mantenedorCDD_getDisponibilidad
} = useMantenedorCDD();
const loadingCrearCatalogo = ref(false);
const progressLoader = ref(false);

onMounted(async () => {
  setUserData();
  getDataTablaSolicitudes();
  getMantenedores();
});

function getMantenedores() {
  requestUtil({ action: mantenedorCDD_getNivelAcceso });
  requestUtil({ action: mantenedorCDD_getFormatoRecepcion });
  requestUtil({ action: mantenedorCDD_getClaseDocumental });
  requestUtil({ action: mantenedorCDD_getProcedencia });
  requestUtil({ action: mantenedorCDD_getNivelFirma });
  requestUtil({ action: mantenedorCDD_getIdiomas });
  requestUtil({ action: mantenedorCDD_getDisponibilidad });
}

const tablaSolicitudes = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
});

const solicitante = reactive({
  id_solicitante: store.state.session.user.sub,
  nombre: store.state.session.user.name
});

function getDataTablaSolicitudes(pagination = undefined) {
  if (!pagination) {
    tablaSolicitudes.firstRecord = 0;
  }
  requestUtil({
    action: creacionYGestionDeCDD_getDataSolicitudes,
    payload: {
      idSolicitante: solicitante.id_solicitante,
      params: {
        search: tablaSolicitudes.filters.buscador?.trim().length
          ? tablaSolicitudes.filters.buscador
          : undefined,
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    }
  });
}

const { creacionYGestionDeCDD_addCatalogo } = useCreacionYGestionDeCDD();

const creacionCatalogo = ref(null);

const { launchConfirmDialog } = useConfirmDialog();

function handleCrearCatalogo() {
  if (!creacionCatalogo.value.isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid);
    return;
  }

  launchConfirmDialog({
    header: 'Crear Catálogo',
    message: '¿Está seguro de querer enviar Solicitud de Creación?',
    accept: () => {
      crearCatalogo();
    }
  });
}

async function crearCatalogo() {
  progressLoader.value = true;
  requestUtil({
    action: creacionYGestionDeCDD_addCatalogo,
    payload: {
      solicitante,
      ...creacionCatalogo.value.formData
    },
    resolve: () => {
      progressLoader.value = false;
      toastSuccess('La solicitud ha sido enviada con éxito');
      creacionCatalogo.value.resetFormData();
      getDataTablaSolicitudes();
      showSolicitudIngresadaAlert();
    },
    reject: () => {
      progressLoader.value = false;
      creacionCatalogo.value.resetFormData();
      toastError('Hubo un error al enviar la solicitud. Intente nuevamente.');
    }
  });
}

function showSolicitudIngresadaAlert() {
  launchConfirmDialog({
    header: 'Catálogo creado',
    icon: 'pi pi-check',
    message:
      'Catálogo creado correctamente en el sistema.\nPara modificar atributos del Catálogo ver Actualización de Catálogo',
    acceptLabel: 'Cerrar',
    rejectClass: 'hidden'
  });
}

function handleBackStep() {
  router.push({ name: 'BandejaFiscalCdd' });
}

function setUserData() {
  const fiscalia = store.state.session.user.fiscalias.find(
    (f) => f.default === true
  );
  solicitante.fiscalia = fiscalia.fiscalia;
  solicitante.telefono = store.state.session.user.telefono;
  solicitante.correo = store.state.session.user.correo;
  solicitante.anexo = store.state.session.user.anexo;
  solicitante.cargo = store.state.session.user.cargo;
}

const itemsMenuSuperior = [
  {
    label: 'Actualizar',
    icon: 'pi pi-refresh'
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download'
  }
];
</script>
<style scoped>
.end {
  text-align: end;
}

.question {
  color: black;
  background-color: transparent;
  padding: 16px 16px 0px 0px;
}
.question:hover {
  color: black;
  background-color: transparent;
}
</style>
