<template>
<main class="mt-4">
  <AppFieldset
    legend="Resumen Causa"
    toggleable
  >
    <LoaderSkeleton
      v-if="isLoading.resumenCausa"
      height="369px"
    />
    <DetalleResumenCausa
      v-else
      :resumen-causa="resumenCausa"
    />
  </AppFieldset>
  <AppFieldset
    v-if="atributos.hasSelectorSujeto"
    legend="Seleccionar Sujeto"
  >
    <TablaSelectorSujeto
      v-model:first="sujetosFirst"
      v-model:selection="sujetosSeleccionados"
      :loading="isLoading.getSujetos"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="sujetosIntervinientes"
      @page="getSujetos"
    />
  </AppFieldset>
  <AppBtnNextTeleported
    v-if="!isTelefonica"
    class="btn-primary"
    :disabled="!sujetosSeleccionados.length"
    icon="pi pi-arrow-right"
    label="Elaborar Escrito"
    :loading="isSomethingLoading"
    @click="handleNextStep"
  />
  <AppBtnNextTeleported
    v-else
    class="btn-primary"
    :disabled="!sujetosSeleccionados.length"
    icon="pi pi-send"
    label="Enviar Solicitud"
    :loading="isSomethingLoading"
    @click="openConfirmarEnvioSolicitud"
  />
</main>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import DetalleResumenCausa from '@/modules/dirigir-investigacion/components/resumen-causa/DetalleResumenCausa.vue'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import TablaSelectorSujeto from '@/modules/dirigir-investigacion/components/TablaSelectorSujeto.vue'
import { useActividadStore, useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useRouter } from 'vue-router'
import { useAppGlobalProperties, useAppToast, useConfirmDialog } from '@/modules/common/composables'

const router = useRouter()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()

const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  ruc,
  resumenCausa,
  idDenuncia,
  causa,
  dirigirInvestigacion_getResumenCausa
} = useDirigirInvestigacionStore()

const {
  atributos,
  isTelefonica,
  isCitacion,
  dataSelector,
  solicitudes_SET_DATA_SELECTOR_SOLICITUD,
  solicitudes_SET_RESUMEN_CAUSA
} = useSolicitudesStore()

const { actividad_enviarSolicitud } = useActividadStore()

const {
  sujetosIntervinientes,
  paginacion,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()

const {
  tipoOrigen,
  mantenedor_getTipoOrigenActividad,
  mantenedor_getFiscalias
} = useMantenedorStore()

const isLoading = reactive({
  resumenCausa: false,
  getSujetos: false,
  enviarSolicitud: false,
  getTipoOrigenActividad: false,
  getFiscalia: false
})

const isSomethingLoading = computed(() => {
  const loadingStates = Object.values(isLoading)
  return loadingStates.some(loading => loading)
})

const sujetosFirst = ref(0)
const sujetosSeleccionados = ref([])
const idFiscalia = ref()

const idsRelacionSujeto = computed(() => sujetosSeleccionados.value?.map(sujeto => sujeto?.idRelacionSujeto))

const tipoOrigenCausa = computed(() => {
  const origenCausa = tipoOrigen.value?.find((origen) => origen.codigo === '1') // CODIGO 1: ORIGEN CAUSA
  return origenCausa
})

const idCausa = computed(() => causa.value?.data?.causa?.idCausa)

function handleNextStep () {
  solicitudes_SET_DATA_SELECTOR_SOLICITUD({
    ...dataSelector.value,
    idsRelacionSujeto: idsRelacionSujeto.value
  })

  router.push({ name: isCitacion.value ? 'DISCitacionElaboracionEscrito' : 'DISComunicacionElaboracionEscrito' })
}

function openConfirmarEnvioSolicitud () {
  launchConfirmDialog({
    header: 'Enviar Solicitud',
    message: '¿Está seguro de Enviar Solicitud?',
    accept: () => enviarSolicitud()
  })
}

function enviarSolicitud () {
  const solicitud = {
    idOrigenActividad: idCausa.value, // envio del idCausa
    idTipoOrigenActividad: tipoOrigenCausa.value?.id, // llamar al mantenedor /actividad/tipo-origen/1, envio del id del tipo origen CAUSA
    idTipoActividad: dataSelector.value?.idTipoActividad, // el id del tipo Actividad seleccionado en el selector
    idSubtipoActividad: dataSelector.value?.subtipoActividad?.id, // el id del subtipo Actividad seleccionado en el selector
    idSubSubtipoActividad: dataSelector.value?.idSubSubtipoActividad, //  el id del subsubtipo Actividad seleccionado en el selector
    idUnidadOrigen: idFiscalia.value, // valor idFiscalia, se puede sacar del resumen de la causa
    idUnidadDestino: null, // idTribunal seleccionado en el step 2, si es telefonica, enviar null
    idUnidadEjecutora: null, // idTribunal seleccionado en el step 2, si es telefonica, enviar null
    instruccionFiscal: null, // si en caso se muestra el campo instrucciones del fiscal, guardar aqui
    idFiscalia: idFiscalia.value, // valor idFiscalia, se puede sacar del resumen de la causa
    seDerivaEquipoJuridico: false, // valor de la seleccion de deriva equipo juridico (step 2)
    seRevisaEscrito: false, // valor de la seleccion de revisar escrito (step 2), en caso seDerivaEquipoJuridico es false, este campo tambn es false
    idPlantilla: null, // aun no operativo, enviar null
    textoHito: null, // en caso se escribe el texto, se envia en string el html ingresado
    idsDocumento: [], // documentos seleccionados o sino enviar null
    idsRelacionDelito: [], // en caso de ser ambito relacion, envio de idsRelacionDelito seleccioandos, codigo 5
    idsRelacionSujeto: idsRelacionSujeto.value, // en caso de ser ambito sujeto, envio de idRelacionSujeto del sujeto seleccioando, codigo 14
    fechaEscrito: dataSelector.value?.fechaSolicitud // fecha del escrito que se indico en el selector si en caso vino el flag
  }

  requestUtil({
    action: actividad_enviarSolicitud,
    payload: {
      solicitud: solicitud
    },
    loader: (l) => { isLoading.enviarSolicitud = l },
    resolve: () => {
      toastSuccess('Solicitud Enviada!')
      router.push({ name: 'DIDesarrolloInvestigacion' })
    }
  })
}

function getResumenCausa () {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: ruc.value },
    loader: (l) => { isLoading.resumenCausa = l },
    resolve: () => {
      solicitudes_SET_RESUMEN_CAUSA(resumenCausa.value)
    }
  })
}

function getSujetos (pagination = undefined) {
  if (!pagination) {
    sujetosFirst.value = 0
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => { isLoading.getSujetos = l }
  })
}

function getTipoOrigenActividad () {
  requestUtil({
    action: mantenedor_getTipoOrigenActividad,
    loader: (l) => { isLoading.getTipoOrigenActividad = l }
  })
}

function getFiscalia () {
  requestUtil({
    action: mantenedor_getFiscalias,
    payload: {
      params: {
        codigo: $userFiscaliaActual.value?.fiscalia
      }
    },
    loader: (l) => { isLoading.getFiscalia = l },
    resolve: ([fiscalia]) => {
      idFiscalia.value = fiscalia?.id
    }
  })
}

onMounted(() => {
  getResumenCausa()
  getSujetos()
  getTipoOrigenActividad()
  getFiscalia()
})
</script>
