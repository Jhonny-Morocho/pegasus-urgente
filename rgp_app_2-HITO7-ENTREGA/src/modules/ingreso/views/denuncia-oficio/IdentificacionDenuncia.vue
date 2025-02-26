<template>
<section>
  <AppForm
    id="identificacion-denuncia"
    :form-submitted="formSubmitted"
    validation-scope="identificacionDenunciaOficio"
  >
    <div
      class="grid"
    >
      <IdentificacionDenuncia
        ref="identificacion"
        class="col-12"
        :loading="loading"
        :tipo-fieldset-identificacion="tipoFieldsetIdentificacion"
      />
      <RucRit
        ref="rucRit"
        class="col-12 md:col-8"
      />
      <FiscaliaLocal
        ref="fiscaliaLocal"
        class="col-12"
        :loading="loading"
      />
    </div>
  </AppForm>
  <AppBtnNextTeleported
    label="Sujetos Intervinientes"
    :loading="loadingStepSujetos"
    @click="handleSubmitForm"
  />
</section>
</template>

<script setup>
import { defineEmits, onMounted, ref } from 'vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

import IdentificacionDenuncia from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaIdentificacionDenunciaFieldset.vue'
import RucRit from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaRucRitFieldset.vue'
import FiscaliaLocal from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaFiscaliaLocalFieldset.vue'
import { useAppToast, useFormValidation, useAppGlobalProperties } from '@/modules/common/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import {

  useIdentificacionDenunciaStore
} from '@/modules/ingreso/composables'
import { useMantenedorStore, usePamStore } from '@/modules/global/composables'

const { $userFiscaliaActual } = useAppGlobalProperties()
const identificacion = ref(null)
const rucRit = ref(null)
const fiscaliaLocal = ref(null)
const { procesoPam } = usePamStore()

const loadingStepSujetos = ref(false)
const loading = ref(false)
const { toastError, TOAST_MESSAGES } = useAppToast()

const {
  identificacionDenuncia_addIdentificacion,
  identificacionDenuncia_getByIdDenuncia,
  identificacionDenuncia
} = useIdentificacionDenunciaStore()

const {
  mantenedor_getTipoDenunciaId, mantenedor_getCodigoFiscaliaById,
  mantenedor_getIdFiscaliaByCodigo, mantenedor_getIdRegionByCodigo,
  mantenedor_getIdTiposFiscaliaByDescripcion, mantenedor_getTipoFiscalia,
  mantenedor_getIdTiposFiscaliaByCodigoFiscalia
} = useMantenedorStore()

const { isFormValid, formSubmitted } = useFormValidation({
  formData: {},
  validationScope: 'identificacionDenunciaOficio'
})

onMounted(() => {
  getIdentificacionDenuncia()
})

async function getDataMantenedores () {
  await requestUtil({ action: mantenedor_getTipoFiscalia })
}
getDataMantenedores()

function getIdentificacionDenuncia () {
  loadingStepSujetos.value = true
  loading.value = true
  requestUtil({
    action: identificacionDenuncia_getByIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value.idDenuncia
    },
    resolve: (r) => {
      setTimeout(() => { setData(r) }, 2000)
    }
  })
}
const tipoFieldsetIdentificacion = 'oficio'
const tipoDenunciaOficio = mantenedor_getTipoDenunciaId('DE OFICIO')

function setData (data) {
  if (!data.fechaDeDenuncia) data.fechaDenuncia = new Date()
  if (data.fechaIngreso) data.fechaDenuncia = data.fechaIngreso
  console.log(data)
  identificacion.value?.populateData({
    ...data,
    idTipoDenuncia: data.tipoDenuncia ?? tipoDenunciaOficio,
    esFiscalDenunciante: data.esFiscalDenunciante,
    esReservada: data.esReservada,
    fechaDeDenuncia: dateTimeUtil.formatToFrontendWithTime(data.fechaDenuncia),
    medioDeRecepcion: 'Presencial'
  })
  if (data.idFiscaliaMantenedor) {
    fiscaliaLocal.value.populateData({
      ...data,
      tipoFiscalia: mantenedor_getIdTiposFiscaliaByDescripcion(data.tipoFiscalia),
      nombreFiscalia: data.idFiscaliaMantenedor.toUpperCase(),
      region: data.regionFiscalia,
      numeroFiscalia: mantenedor_getCodigoFiscaliaById(data.idFiscaliaMantenedor)
    })
  } else {
    fiscaliaLocal.value.populateData({
      tipoFiscalia: mantenedor_getIdTiposFiscaliaByCodigoFiscalia($userFiscaliaActual.value.idFiscalia),
      nombreFiscalia: mantenedor_getIdFiscaliaByCodigo($userFiscaliaActual.value.idFiscalia),
      region: mantenedor_getIdRegionByCodigo($userFiscaliaActual.value.region.toString()),
      numeroFiscalia: $userFiscaliaActual.value.fiscalia
    })
  }
  loadingStepSujetos.value = false
  loading.value = false
}

const emit = defineEmits(['next-step'])

function nextStep () {
  emit(
    'next-step',
    '/ingreso/denuncia-oficio/nueva-denuncia/sujetos-intervinientes'
  )
}

async function handleSubmitForm () {
  const formData = {
    ...identificacion.value.formData,
    ...fiscaliaLocal.value.formData
  }

  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const payload = {
    identificadorUnicoDenuncia: identificacionDenuncia.value?.identificadorUnicoDenuncia,
    idMedioRecepcion: 'Oficio',
    idTipoDenuncia: tipoDenunciaOficio,
    fechaIngreso: dateTimeUtil.formatToBackendWithTime(formData?.fechaDenuncia),
    idFuncionarioRol: 'formData.usuarioRecepcionaDenuncia SIN ID', // OJO Falta ID
    esFiscalDenunciante: identificacion.value.formData.esFiscalDenunciante,
    formaEnvio: identificacion.value.formData.formaEnvio,
    esReservada: identificacion.value.formData.esReservada,
    tipoDenuncia: 'oficio',
    idDenuncia: procesoPam.value.idDenuncia,
    numeroOficio: identificacion.value.formData.numeroOficio,
    idFiscalia: formData.nombreFiscalia,
    tipoFiscalia: formData.tipoFiscalia,
    region: formData.region

  }
  requestUtil({
    action: identificacionDenuncia_addIdentificacion,
    payload: payload,
    loader: (v) => (loadingStepSujetos.value = v),
    resolve: () => {
      nextStep()
    }
  })
}
</script>
