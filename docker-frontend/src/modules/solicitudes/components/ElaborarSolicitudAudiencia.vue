<template>
<AppForm
  id="solicitud-audiencia"
  :form-submitted="formSubmitted"
  validation-scope="elaborarAudiencia"
>
  <h4 class="ml-2">
    ¿Desea derivar la Materialización al Equipo Jurídico?
  </h4>
  <AppSelectButton
    id="deriva-materializacion"
    v-model="formData.derivarEquipoJuridico"
    class="col-12 md:col-4 lg:col-3 mb-5"
    option-label="name"
    option-value="value"
    :options="[
      { name: 'Si', value: false },
      { name: 'No', value: true }
    ]"
    :rules="{ required }"
    @change="clearMaterializacion"
  />
  <div
    v-if="formData.derivarEquipoJuridico !== null"
    class="col-12"
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
  </div>
  <AgregarDocumentoSolicitud />
  <AppBtnNextTeleported
    class="ml-8"
    label="Enviar Solicitud"
    @click="enviarSolicitud"
  />
</AppForm>
</template>

<script setup>
import { provide, reactive, onMounted } from 'vue'

import MaterializaFiscal from '@/modules/gestion-solicitudes/components/MaterializaFiscal.vue'
import MaterializaEquipoJuridico from '@/modules/gestion-solicitudes/components/MaterializaEquipoJuridico.vue'
import AgregarDocumentoSolicitud from '@/modules/gestion-solicitudes/components/AgregarDocumentoSolicitud.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

import { requestUtil } from '@/utils'
import { useAppToast, useFormValidation, useConfirmDialog } from '@/modules/common/composables'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'
import { useDocumentoStore } from '@/modules/global/composables'

const { documento_getDocumentosByIdDenuncia } = useDocumentoStore()
const { idDenuncia, idCausa, gestionSolicitudes_getPlantillaMaterializaFiscal, gestionSolicitudes_enviarSolicitud } = useGestionSolicitudesStore()
const { toastError, TOAST_MESSAGES, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const formData = reactive({
  // elaborar solicitud Audiencia
  derivarEquipoJuridico: null,
  // materializa fiscal
  idTribunalFiscal: null,
  // elaborar escrito
  idPlantillaEscritoFiscal: null,
  materializacionTextoFiscal: '',
  // materializa equipo juridico
  idTribunalEquipoJuridico: null,
  idTipoAudienciaEquipoJuridico: null,
  instruccionesEquipoJuridico: '',
  // revisar escrito
  revisarEscrito: null,
  // documentosSeleccionados
  documentosSeleccionados: [],
  carpetaInvestigacion: null
})

provide('materializar-solicitud', formData)

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'elaborarAudiencia'
})

onMounted(() => getDocumentos())

function clearMaterializacion () {
  formData.idTribunalFiscal = null
  formData.idTipoAudienciaFiscal = null
}

const plantillaEscritoFiscal = [
  {
    name: 'Plantilla 1',
    value: 1
  },
  {
    name: 'Plantilla 2',
    value: 2
  }
]

function enviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  launchConfirmDialog({
    header: 'Solicitar Audiencia',
    message: '¿Está seguro de enviar la Solicitud?',
    acceptLabel: 'Aceptar',
    accept: () => {
      postEnviarSolicitud()
    }
  })
}
function postEnviarSolicitud () {
  requestUtil({
    action: gestionSolicitudes_enviarSolicitud,
    payload: { contract: getContract() },
    resolve: () => {
      toastSuccess('La solicitud ha sido enviada con éxito')
      console.log('enviarSolicitud')
    },
    // loader: (l) => { loader.value = l },
    reject: () => toastError('Ocurrió un error al enviar la solicitud')
  })
}

function getContract () {
  return {
    idOrigenActividad: idCausa.value, // envio del idCausa
    idTipoOrigenActividad: 'string', // llamar al mantenedor /actividad/tipo-origen/1, envio del id del tipo origen CAUSA
    idTipoActividad: 'tipoActividad.value', // viene desde el selector de solicitudes
    idSubtipoActividad: 'actividadesSubtipo.value', // viene desde el selector de solicitudes
    idSubSubtipoActividad: 'actividadesSubSubtipo.value', // viene desde el selector el id || null
    idUnidadOrigen: 'string', // valor idFiscalia que trae en el resumen de la causa
    idUnidadDestino: 'string', // id del tribunal seleccionado
    instruccionFiscal: 'string', // si en caso se muestra el campo instrucciones del fiscal
    idFiscalia: 'string', // valor idFiscalia que trae en el resumen de la causa
    seDerivaEquipoJuridico: true, // valor de la seleccion de deriva equipo juridico
    seRevisaEscrito: true, // valor de la seleccion de revisar escrito, en caso seDerivaEquipoJuridico es false, este campo tambn es false
    idPlantilla: null, // aun no operativo, enviar null
    textoHito: 'string', // en caso se escribe el texto, se envia en string el html generado
    atributos: [
      {
        idAtributoMantenedor: 'string',
        valor: 'string'
      }
    ],
    idsDocumentos: [
      // ids de documentos seleccionados
      'string'
    ]
  }
}

function getDocumentos () {
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    // loader: (l) => { loader.value = l },
    reject: () => toastError('Ocurrió un error al cargar los documentos')
  })
}

function getPlantillaInstruccionFiscal () {
  requestUtil({
    action: gestionSolicitudes_getPlantillaMaterializaFiscal,
    payload: {
      ruc: '12345678901',
      idPlantilla: formData.idPlantillaEscritoFiscal
    },
    resolve: ({ data }) => {
      formData.materializacionTextoFiscal = data.texto
    }
  })
}

function guardarEscritoFiscal () {
  requestUtil({
    action: 'guardarEscritoFiscal',
    payload: {
      idDenuncia,
      idPlantilla: formData.idPlantillaEscritoFiscal,
      texto: formData.materializacionTextoFiscal
    }
  })
}
</script>
