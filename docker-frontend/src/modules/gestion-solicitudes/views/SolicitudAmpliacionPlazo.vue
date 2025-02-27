<template>
<section class="mx-3 mt-3">
  <PageHeader
    class="mb-5"
    :items-menu-superior="itemsMenuSuperior"
    page-description="RUC: 22123456789"
    page-title="Solicitud Ampliación de Plazo de Diligencia"
  />
  <AntecedentesSolicitud
    :data="antecedentesSolicitud"
    hide-instrucciones-fiscal
    ver-solicitud
  />
  <PideCuenta
    button-label="Ver Mensaje"
    :data="pideCuentaAutomatico"
    title="Pide Cuenta Automático"
  />
  <PideCuenta
    button-label="Ver Detalle"
    :data="nuevoPideCuenta"
    title="Nuevo Pide Cuenta"
  />
  <SolicitudAmpliacion :data="solicitud" />

  <AppFieldset
    class="w-full"
    legend="Documentos adjuntos a la solicitud"
    :toggleable="true"
  >
    <div class="col-12 mb-3">
      <AppFilters
        v-model="solicitudAmpliacion.filters"
        no-date-filters
        @filter="getDocumentosAdjuntos"
      />
    </div>
    <TablaDocumentos
      v-model="documentosSeleccionados"
      v-model:first="solicitudAmpliacion.firstRecord"
      v-model:selection="documentosSeleccionados"
      :action-options="opciones"
      :loading="solicitudAmpliacion.isLoading"
      :value="documentosAdjuntos"
      @page="getDocumentosAdjuntos"
    />
  </AppFieldset>
  <RespuestaSolicitud v-model="formData" />
  <div class="mt-8">
    <AppFooterBtns
      label="Enviar Resultado"
      @back-step="handleBackStep"
      @next-step="handleEviarResultado"
    />
  </div>
</section>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// composables
import { usePageHeaderOptions } from '../composables'
// components
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import PideCuenta from '@/modules/gestion-solicitudes/components/PideCuenta.vue'
import TablaDocumentos from '@/modules/gestion-solicitudes/components/tablas/TablaDocumentos.vue'
import AntecedentesSolicitud from '@/modules/gestion-solicitudes/components/AntecedentesSolicitud.vue'
import RespuestaSolicitud from '@/modules/gestion-solicitudes/components/RespuestaSolicitud.vue'
import SolicitudAmpliacion from '@/modules/gestion-solicitudes/components/SolicitudAmpliacion.vue'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'
import { requestUtil } from '@/utils'
import { useConfirmDialog } from '@/modules/common/composables'

const router = useRouter()
const { itemsMenuSuperior } = usePageHeaderOptions()

const {
  antecedentesSolicitud,
  pideCuentaAutomatico,
  solicitud,
  documentosAdjuntos,
  nuevoPideCuenta,
  idDenuncia,
  gestionSolicitudes_getSolicitud,
  gestionSolicitudes_getAntecedentes,
  gestionSolicitudes_getPideCuentaAutomatico,
  gestionSolicitudes_getNuevoPideCuenta,
  gestionSolicitudes_getDocumentosAdjuntos,
  gestionSolicitudes_postResponderSolicitudAmpliacionPlazo
} = useGestionSolicitudesStore()

const solicitudAmpliacion = reactive({
  isLoading: false,
  filters: {
    buscador: undefined,
    prioritario: undefined
  },
  firstRecord: 0
})

const formData = reactive({
  decidirSolicitud: '',
  plazo: '',
  observacion: ''
})

const documentosSeleccionados = ref()

const opciones = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Imprimir',
        command: () => {
          console.log('a')
        }
      },
      {
        label: 'Descargar',
        command: () => {
          console.log('a')
        }
      },
      {
        label: 'Ver Documento',
        command: () => {
          console.log('a')
        }
      }
    ]
  }
])

function getAntecedentes () {
  requestUtil({
    action: gestionSolicitudes_getAntecedentes,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function getSolicitud () {
  requestUtil({
    action: gestionSolicitudes_getSolicitud,
    payload: {
      idDenuncia: idDenuncia.value
    },
    loader: (l) => (solicitudAmpliacion.isLoading = l)
  })
}
function getPideCuentaAutomatico () {
  requestUtil({
    action: gestionSolicitudes_getPideCuentaAutomatico,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}
function getNuevoPideCuenta () {
  requestUtil({
    action: gestionSolicitudes_getNuevoPideCuenta,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function getDocumentosAdjuntos () {
  requestUtil({
    action: gestionSolicitudes_getDocumentosAdjuntos,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

const { launchConfirmDialog } = useConfirmDialog()

function handleBackStep () {
  router.push({ name: 'BandejaFiscalGestion' })
}

function handleEviarResultado () {
  launchConfirmDialog({
    header: 'Responder Solicitud',
    message: `¿Está seguro de Responder la Solicitud?`,
    accept: () => {
      requestUtil({
        action: gestionSolicitudes_postResponderSolicitudAmpliacionPlazo,
        payload: {
          idDenuncia: idDenuncia.value,
          params: formData
        }
      })
      router.push({ name: 'BandejaFiscalGestion' })
    }
  })
}

onMounted(() => {
  getAntecedentes()
  getSolicitud()
  getPideCuentaAutomatico()
  getDocumentosAdjuntos()
  getNuevoPideCuenta()
})
</script>
