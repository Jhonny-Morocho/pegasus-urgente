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
      { name: 'Si', value: true },
      { name: 'No', value: false }
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
import { provide, reactive } from 'vue'
import MaterializaFiscal from '@/modules/gestion-solicitudes/components/MaterializaFiscal.vue'
import AgregarDocumentoSolicitud from '@/modules/gestion-solicitudes/components/AgregarDocumentoSolicitud.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import MaterializaEquipoJuridico from '@/modules/gestion-solicitudes/components/MaterializaEquipoJuridico.vue'

import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useGestionSolicitudesStore } from '@/modules/gestion-solicitudes/composables/useGestionSolicitudesStore'

const { idDenuncia, gestionSolicitudes_getPlantillaMaterializaFiscal } = useGestionSolicitudesStore()
const { toastError, TOAST_MESSAGES } = useAppToast()

const formData = reactive({
  // elaborar solicitud Audiencia
  derivarEquipoJuridico: null,
  // materializa fiscal
  idTribunalFiscal: null,
  idTipoAudienciaFiscal: null,
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
  carpetaInvestigacion: null,
  tribunalesOptions: [],
  tipoAudienciaOptions: []
})

provide('materializar-solicitud', formData)

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'elaborarAudiencia'
})

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
  console.log('enviarSolicitud')
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
