<template>
<AppForm
  class="col-12"
  :form-submitted="formSubmitted"
  validation-scope="preparar-escrito-form"
>
  <ComunicarCierreEscrito
    v-model="formData"
    class="col-12"
    :fiscalia="fiscaliaLocal"
    :is-solicitud-audiencia="true"
  />
</AppForm>
<AppBtnRightTeleported>
  <Button
    class="p-button-outlined px-5 mr-6"
    label="Volver a Revisar Antecedentes de la Causa"
    @click="goBack"
  />
  <Button
    class="btn-primary px-5"
    :disabled="formData.seDerivaEquipoJuridico === null"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Solicitud"
    @click="enviarSolicitud"
  />
</AppBtnRightTeleported>
</template>

<script setup>
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import ComunicarCierreEscrito from '@/modules/termino-postermino/components/ComunicarCierreEscrito.vue'
import AppForm from '@/modules/common/components/AppForm.vue'
import { reactive } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { dateTimeUtil, requestUtil } from '@/utils'

const router = useRouter()
function goBack () {
  router.push({ name: 'MedidasCautelares' })
}

const { toastSuccess } = useAppToast()

const formData = reactive({
  seDerivaEquipoJuridico: null,
  nombreTribunal: '',
  idPlantilla: null,
  materializacionTextoFiscal: null,
  revisarEscrito: null,
  documentosSeleccionados: [],
  adjuntaCarpeta: false,
  idTipoAudiencia: null,
  idOtroTipoAudiencia: null
})

const { formSubmitted, isFormValid } = useFormValidation({ formData, validationScope: 'preparar-escrito-form' })

// *** Uncomment To implement Pinia Store: *** //

// const tramitarAudienciaStore = useTramitarAudienciaStore()
// === import methods === //
// const { tramitarAudiencia_postSolicitudAudiencia } = tramitarAudienciaStore
// === import variables and makes it reactive === //
// const { causa } = storeToRefs(tramitarAudienciaStore)

const {
  resumenCausa,
  relacionesSeleccionadas,
  especiesSeleccionadas,
  documentosSeleccionados,
  medidasCautelares,
  tramitarAudiencia_postSolicitudAudiencia,
  tramitarAudiencia_RESET_MEDIDAS_CAUTELARES
} = useTramitarAudiencia()

async function enviarSolicitud () {
  // terminado los steps se envia toda la data...
  if (!isFormValid()) {
    return
  }
  const solicitudRelaciones = relacionesSeleccionadas.value.value?.map(r => {
    return { idRelacion: r.idRelacionDelito }
  })
  const solicitudEspecies = especiesSeleccionadas.value.value?.map(e => {
    return { idEspecie: e.idEspecie }
  })
  const solicitudDocumentos = Object.values(documentosSeleccionados.value)?.map(d => {
    return { idDocumento: d.id }
  })
  const solicitudMedidasCautelares = medidasCautelares.value?.map(e => {
    return {
      idImputado: e.imputado.id,
      idMedidaCautelar: e.medida,
      descripcion: e.descripcionMedidaCautelar
    }
  })
  requestUtil({
    action: tramitarAudiencia_postSolicitudAudiencia,
    payload: {
      idCausa: resumenCausa.value.idCausa,
      derivarMaterializacion: formData.seDerivaEquipoJuridico,
      idFiscalia: 'f0a0a0a0-a0a0-0a0a-0a0a-0a0a0a0a0a0a',
      idFiscal: 'f0a0a0a0-a0a0-0a0a-0a0a-0a0a0a0a0a0a',
      idTribunal: formData.idTribunal,
      idTipoAudiencia: '625713D0-6A64-41FB-B01A-E4F0E6ADDF8C',
      instruccionesEscrito: formData.instruccionFiscal ?? '',
      escrito: formData.textoFiscal,
      idPlantilla: formData.idPlantilla,
      deseaRevisarEscrito: !!formData.revisarEscrito,
      fecha_creacion: dateTimeUtil.formatToBackendWithTime(),
      solicitudRelaciones,
      solicitudEspecies,
      solicitudDocumentos,
      solicitudMedidasCautelares,
      esReservada: true,
      esUrgente: true,
      adjuntarCarpeta: false,
      esDeBandeja: false
    },
    resolve: () => {
      tramitarAudiencia_RESET_MEDIDAS_CAUTELARES()
      toastSuccess('Exitoso! Audiencia Solicitada')
      setTimeout(() => {
        router.push({ name: 'TABandejaTramitarAudiencia' })
      }, 400)
    }
  })
}
</script>
