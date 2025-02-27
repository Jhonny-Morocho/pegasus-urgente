<template>
<main class="mt-4">
  <AppForm
    id="solicitud-citacion-comunicacion"
    :form-submitted="formSubmitted"
    validation-scope="solicitud-citacion-comunicacion"
  >
    <section class="col-12 md:col-4 flex flex-column gap-2">
      <h4 class="w-full">
        ¿Desea derivar la Materialización al Equipo Jurídico?
      </h4>
      <AppSelectButton
        id="deriva-equipo-juridico"
        v-model="formData.derivarEquipoJuridico"
        class="w-full"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
        @change="resetForm"
      />
    </section>
    <section
      v-if="formData.derivarEquipoJuridico !== null"
      class="w-full"
    >
      <MaterializaEquipoJuridico
        v-if="formData.derivarEquipoJuridico"
        v-model="formData"
      />
      <MaterializaFiscal
        v-else
        v-model="formData"
        :plantilla-options="plantillaEscritoFiscal"
        @get-plantilla="getPlantillaInstruccionFiscal"
        @guardar-escrito="guardarEscritoFiscal"
      />
    </section>
    <LoaderSkeleton
      v-if="isLoading.getDocumentos"
      class="mt-4 w-full"
      height="40vh"
    />
    <AgregarDocumentoSolicitud
      v-else
      class="mt-4"
    />
  </AppForm>
  <AppBtnNextTeleported
    class="btn-primary"
    icon="pi pi-send"
    label="Enviar Solicitud"
    :loading="isSomethingLoading"
    @click="openConfirmarEnvioSolicitud"
  />
</main>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { reactive, provide, onMounted, computed, ref } from 'vue'
import { useAppGlobalProperties, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import MaterializaEquipoJuridico from '@/modules/gestion-solicitudes/components/MaterializaEquipoJuridico.vue'
import MaterializaFiscal from '@/modules/gestion-solicitudes/components/MaterializaFiscal.vue'
import AgregarDocumentoSolicitud from '@/modules/gestion-solicitudes/components/AgregarDocumentoSolicitud.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { requestUtil } from '@/utils'
import { useActividadStore, useDocumentoStore, useMantenedorStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const router = useRouter()

const { toastSuccess } = useAppToast()

const { launchConfirmDialog } = useConfirmDialog()

const { dataSelector } = useSolicitudesStore()

const { actividad_enviarSolicitud } = useActividadStore()

const { documento_getDocumentosByIdDenuncia } = useDocumentoStore()

const { idDenuncia, causa, resumenCausa } = useDirigirInvestigacionStore()

const { tipoOrigen, mantenedor_getTipoOrigenActividad, mantenedor_getFiscalias } = useMantenedorStore()

const { $userFiscaliaActual } = useAppGlobalProperties()

const idCausa = computed(() => causa.value?.data?.causa?.idCausa)

const formData = reactive({
  // elaborar solicitud Audiencia
  derivarEquipoJuridico: null,
  // materializa fiscal
  idTribunal: null,
  // elaborar escrito
  idPlantillaEscritoFiscal: null,
  materializacionTextoFiscal: '',
  // materializa equipo juridico
  idTipoAudienciaEquipoJuridico: null,
  instruccionesEquipoJuridico: '',
  // revisar escrito
  revisarEscrito: false,
  // documentosSeleccionados
  documentosSeleccionados: [],
  carpetaInvestigacion: null,
  ...dataSelector.value
})

const { required, formSubmitted, resetFormData } = useFormValidation({
  formData,
  validationScope: 'solicitud-citacion-comunicacion'
})

provide('materializar-solicitud', formData)

const idFiscalia = ref()

const isLoading = reactive({
  getDocumentos: false,
  getTipoOrigenActividad: false,
  getFiscalia: false,
  enviarSolicitud: false
})

const isSomethingLoading = computed(() => {
  const loadingStates = Object.values(isLoading)
  return loadingStates.some(loading => loading)
})

const tipoOrigenCausa = computed(() => {
  const origenCausa = tipoOrigen.value?.find((origen) => origen.codigo === '1') // CODIGO 1: ORIGEN CAUSA
  return origenCausa
})

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
    idTipoActividad: formData?.idTipoActividad, // el id del tipo Actividad seleccionado en el selector
    idSubtipoActividad: formData?.subtipoActividad?.id, // el id del subtipo Actividad seleccionado en el selector
    idSubSubtipoActividad: formData?.idSubSubtipoActividad, //  el id del subsubtipo Actividad seleccionado en el selector
    idUnidadOrigen: idFiscalia.value, // valor idFiscalia, se puede sacar del resumen de la causa
    idUnidadDestino: formData.idTribunal, // idTribunal seleccionado en el step 2, si es telefonica, enviar null
    idUnidadEjecutora: formData.idTribunal, // idTribunal seleccionado en el step 2, si es telefonica, enviar null
    instruccionFiscal: formData.instruccionesEquipoJuridico, // si en caso se muestra el campo instrucciones del fiscal, guardar aqui
    idFiscalia: idFiscalia.value, // valor idFiscalia, se puede sacar del resumen de la causa
    seDerivaEquipoJuridico: formData.derivarEquipoJuridico, // valor de la seleccion de deriva equipo juridico (step 2)
    seRevisaEscrito: formData.revisarEscrito, // valor de la seleccion de revisar escrito (step 2), en caso seDerivaEquipoJuridico es false, este campo tambn es false
    idPlantilla: null, // aun no operativo, enviar null
    textoHito: formData.materializacionTextoFiscal, // en caso se escribe el texto, se envia en string el html ingresado
    idsDocumento: [], // documentos seleccionados o sino enviar null
    idsRelacionDelito: [], // en caso de ser ambito relacion, envio de idsRelacionDelito seleccioandos, codigo 5
    idsRelacionSujeto: formData?.idsRelacionSujeto, // en caso de ser ambito sujeto, envio de idRelacionSujeto del sujeto seleccioando, codigo 14
    fechaEscrito: formData?.fechaSolicitud // fecha del escrito que se indico en el selector si en caso vino el flag
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

function guardarEscritoFiscal () {
  console.log('🚀 ~ file: ElaboracionEscrito.vue:85 ~ guardarEscritoFiscal ~ guardarEscritoFiscal')
}

function resetForm () {
  const derivarEquipoJuridico = formData.derivarEquipoJuridico
  resetFormData()
  formData.derivarEquipoJuridico = derivarEquipoJuridico
}

function getDocumentos () {
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => { isLoading.getDocumentos = l }
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
  getDocumentos()
  getTipoOrigenActividad()
  getFiscalia()
})

const plantillaEscritoFiscal = []

function getPlantillaInstruccionFiscal () {
  formData.materializacionTextoFiscal = ''
}
</script>
