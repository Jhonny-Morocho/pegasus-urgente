<template>
<main>
  <AppFieldset
    id="resumen-causa"
    legend="Resumen de la Causa"
    toggleable
  >
    <LoaderSkeleton
      v-if="resumenCausa.isLoading"
      height="15vh"
    />
    <ResumenCausa
      v-else
      :cantidad="cantidad"
      :resumen-causa="resumenCausa.data"
    />
  </AppFieldset>
  <AppFieldset
    v-if="origenCausa === flujoOrigen.DENUNCIA_FISICA"
    id="informacion-denuncia"
    hidden
    legend="Información de la Denuncia"
    toggleable
  >
    <LoaderSkeleton
      v-if="isLoading.infoDenuncia"
      height="15vh"
    />
    <InformacionDenuncia v-else />
  </AppFieldset>
  <AppFieldset
    id="datos-denunciante"
    legend="Datos del Denunciante"
    toggleable
  >
    <TablaSujetos
      v-model:first="sujetosDenunciantes.first"
      is-denunciante
      :loading="sujetosDenunciantes.isLoading || isLoading.mantenedor"
      :rows="sujetosDenunciantes.paginacion?.tamanoPagina"
      :total-records="sujetosDenunciantes.paginacion?.elementosTotales"
      :value="sujetosDenunciantes.data"
      @page="getSujetosDenunciantes"
      @ver-ficha-sujeto="sendToFichaSujeto"
    />
  </AppFieldset>
  <AppFieldset
    id="lista-intervinientes"
    legend="Lista de Sujetos/Intervinientes"
    toggleable
  >
    <TablaSujetos
      v-model:first="sujetosIntervinientes.first"
      :loading="sujetosIntervinientes.isLoading || isLoading.mantenedor"
      :rows="sujetosIntervinientes.paginacion?.tamanoPagina"
      :total-records="sujetosIntervinientes.paginacion?.elementosTotales"
      :value="sujetosIntervinientes.data"
      @page="getSujetosIntervientes"
      @ver-ficha-sujeto="sendToFichaSujeto"
      @ver-representados="openModalVerRepresentados"
    />
  </AppFieldset>
  <AppFieldset
    id="lista-delitos"
    legend="Lista de Delitos"
    toggleable
  >
    <TablaDelitos
      v-model:first="delitos.first"
      :loading="delitos.isLoading || isLoading.mantenedor"
      :rows="delitos.paginacion?.tamanoPagina"
      :total-records="delitos.paginacion?.elementosTotales"
      :value="delitos.data"
      @page="getDelitos"
      @ver-delito="openModalVerDelito"
      @ver-ubicacion="openModalVerUbicacion"
    />
  </AppFieldset>
  <AppFieldset
    id="relaciones"
    legend="Relaciones"
    toggleable
  >
    <TablaRelaciones
      v-model:first="relaciones.first"
      :loading="relaciones.isLoading"
      :rows="relaciones.paginacion?.tamanoPagina"
      :total-records="relaciones.paginacion?.elementosTotales"
      :value="relaciones.data"
      @page="getRelaciones"
    />
  </AppFieldset>
  <AppFieldset
    id="relato"
    legend="Relato del Hecho"
    toggleable
  >
    <LoaderSkeleton
      v-if="relato.isLoading"
      height="15vh"
    />
    <RelatoCausa
      v-else
      :relato="relato.data"
    />
  </AppFieldset>
  <AppFieldset
    id="lista-especies"
    legend="Lista de Especies/Dinero"
    toggleable
  >
    <TablaEspecies
      v-model:first="especies.first"
      :loading="especies.isLoading || isLoading.mantenedor"
      :rows="especies.paginacion?.tamanoPagina"
      :total-records="especies.paginacion?.elementosTotales"
      :value="especies.data"
      @page="getEspeciesDinero"
      @ver-registro-especie="openModalRegistroEspecie"
    />
  </AppFieldset>
  <AppFieldset
    id="diligencias"
    legend="Diligencias"
    toggleable
  >
    <TablaDiligencias
      v-model:first="diligencias.first"
      :loading="diligencias.isLoading || isLoading.mantenedor"
      :rows="diligencias.paginacion?.tamanoPagina"
      :total-records="diligencias.paginacion?.elementosTotales"
      :value="diligencias.data"
      @page="getDiligencias"
      @ver-diligencia="openModalVerDiligencia"
      @ver-solicitud="openModalVerDocumentoSolicitud"
    />
  </AppFieldset>
  <AppFieldset
    id="anotaciones"
    legend="Anotaciones"
    toggleable
  >
    <TablaAnotaciones
      v-model:first="anotaciones.first"
      :loading="anotaciones.isLoading"
      :rows="anotaciones.paginacion?.tamanoPagina"
      :total-records="anotaciones.paginacion?.elementosTotales"
      :value="anotaciones.data"
      @page="getAnotaciones"
      @ver-anotacion="openModalVerAnotacion"
    />
  </AppFieldset>
  <AppFieldset
    id="audiencias"
    disabled
    legend="Audiencias"
    toggleable
  >
    <TablaAudiencias
      :loading="isLoading.audiencias"
      :value="[]"
    />
  </AppFieldset>
  <AppFieldset
    id="causas-agrupadas"
    disabled
    legend="Causas Agrupadas"
    toggleable
  >
    <TablaCausasAgrupadas
      :loading="isLoading.causasAgrupadas"
      :value="[]"
    />
  </AppFieldset>
</main>
</template>

<script setup>
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import ResumenCausa from '../components/informacion-causa/ResumenCausa.vue'
import InformacionDenuncia from '../components/informacion-causa/InformacionDenuncia.vue'
import TablaSujetos from '../components/informacion-causa/TablaSujetos.vue'
import TablaDelitos from '../components/informacion-causa/TablaDelitos.vue'
import TablaRelaciones from '../components/informacion-causa/TablaRelaciones.vue'
import RelatoCausa from '../components/informacion-causa/RelatoCausa.vue'
import TablaEspecies from '../components/informacion-causa/TablaEspecies.vue'
import TablaDiligencias from '../components/informacion-causa/TablaDiligencias.vue'
import TablaAnotaciones from '../components/informacion-causa/TablaAnotaciones.vue'
import TablaAudiencias from '../components/informacion-causa/TablaAudiencias.vue'
import TablaCausasAgrupadas from '../components/informacion-causa/TablaCausasAgrupadas.vue'
import ModalVerDelito from '../components/modals/ModalVerDelito.vue'
import ModalVerUbicacionDelito from '../components/modals/ModalVerUbicacionDelito.vue'
import ModalVerRegistroEspecie from '../components/modals/ModalVerRegistroEspecie.vue'
import ModalVerDiligencia from '../components/modals/ModalVerDiligencia.vue'
import ModalVerAnotacion from '../components/modals/ModalVerAnotacion.vue'
import { useAppDialog, useDynamicDialog } from '@/modules/common/composables'
import { defineProps, onMounted, reactive } from 'vue'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { useFichaCausa, useFichaCausaStore, useFichaCausaData } from '../composables'
import ModalVerRepresentados from '../components/modals/ModalVerRepresentados.vue'
import { useRouter } from 'vue-router'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

defineProps({
  ruc: {
    type: String,
    required: true
  }
})

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { flujoOrigen } = useFichaCausa()

const { origenCausa, fichaCausa_SET_SUJETO_SELECCIONADO } = useFichaCausaStore()

const {
  sujetosIntervinientes,
  sujetosDenunciantes,
  delitos,
  relaciones,
  relato,
  especies,
  diligencias,
  anotaciones,
  cantidad,
  resumenCausa,
  getSujetosIntervientes,
  getSujetosDenunciantes,
  getDelitos,
  getRelaciones,
  getRelato,
  getEspeciesDinero,
  getDiligencias,
  getAnotaciones,
  getAntecedentesCausa
} = useFichaCausaData()

const {
  mantenedor_getTiposSujetos,
  mantenedor_getPaises,
  mantenedor_getTipoSexo,
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getComunas,
  mantenedor_getRegiones,
  mantenedor_getEstadosCausa,
  mantenedor_getAmbitoEspecie,
  mantenedor_getFamiliaEspecies,
  mantenedor_getAllTiposEspecie,
  mantenedor_getInstituciones,
  mantenedor_getEstadosDiligencia
} = useMantenedorStore()

const router = useRouter()

const isLoading = reactive({
  infoDenuncia: false,
  audiencias: false,
  causasAgrupadas: false,
  mantenedor: false
})

function openModalVerDelito (data) {
  launchDialog({
    component: ModalVerDelito,
    header: 'Ver Delito',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    acceptClass: 'hidden',
    width: '80%',
    props: {
      data: data
    }
  })
}

function openModalVerUbicacion (data) {
  launchDialog({
    component: ModalVerUbicacionDelito,
    header: 'Ver Ubicación',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    acceptClass: 'hidden',
    width: '60%',
    props: {
      direccionDelito: data?.direccionDelito
    }
  })
}

function openModalRegistroEspecie (data) {
  launchDialog({
    component: ModalVerRegistroEspecie,
    header: 'Ver Registro Especie/Dinero',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    acceptClass: 'hidden',
    width: '80%',
    props: {
      data: data
    }
  })
}

function openModalVerDiligencia (data) {
  launchDialog({
    component: ModalVerDiligencia,
    header: 'Ver Diligencia',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    acceptClass: 'hidden',
    width: '80%',
    props: {
      data: data
    }
  })
}

function openModalVerDocumentoSolicitud (idDocumentoSolicitud) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: idDocumentoSolicitud
    }
  })
}

function openModalVerAnotacion (data) {
  launchDialog({
    component: ModalVerAnotacion,
    header: 'Ver Anotación',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    acceptClass: 'hidden',
    width: '80%',
    props: {
      data: data
    }
  })
}

function openModalVerRepresentados (data) {
  launchDialog({
    component: ModalVerRepresentados,
    header: 'Ver Representados',
    cancelIcon: '',
    cancelLabel: 'Cerrar',
    acceptClass: 'hidden',
    width: '80%',
    props: {
      data: data
    }
  })
}

function sendToFichaSujeto (sujeto) {
  // POR HACER, MANDARLO A LA FICHA CAUSA
  console.log('🚀 ~ file: InformacionCausa.vue ~ line 351 ~ sendToFichaSujeto ~ sujeto', sujeto)
  requestUtil({
    action: fichaCausa_SET_SUJETO_SELECCIONADO,
    payload: sujeto,
    resolve: () => {
      const routeData = router.resolve({ name: 'FichaSujeto' })
      window.open(routeData.href, '_blank')
    }
  })
}

function getDataMantenedor () {
  requestUtil({
    action: mantenedor_getEstadosCausa,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getTiposSujetos,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getPaises,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getTipoSexo,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getTiposDelito,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getFamiliasDelito,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getComunas,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getRegiones,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getAmbitoEspecie,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getFamiliaEspecies,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getAllTiposEspecie,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getInstituciones,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
  requestUtil({
    action: mantenedor_getEstadosDiligencia,
    loader: (l) => {
      isLoading.mantenedor = l
    }
  })
}

onMounted(() => {
  getDataMantenedor()
  getSujetosIntervientes()
  getSujetosDenunciantes()
  getDelitos()
  getRelaciones()
  getRelato()
  getEspeciesDinero()
  getDiligencias()
  getAnotaciones()
  getAntecedentesCausa()
})
</script>
