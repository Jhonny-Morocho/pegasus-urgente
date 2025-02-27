<template>
<section>
  <AppForm
    id="registro-parte"
    :form-submitted="formSubmitted"
    validation-scope="formRegistroParte"
  >
    <AppFieldset
      class="p-fluid"
      legend="Registro parte Denuncia"
    >
      <AppCalendar
        id="fecha-hora-denuncia"
        v-model="formData.fechaRecepcionDenuncia"
        class="col-12 md:col-6 lg:col-4"
        disabled
        label="Fecha/Hora Recepción Denuncia"
        :rules="{
          required,
        }"
        show-time
      />
      <AppInput
        id="numero-referencia"
        v-model="formData.numeroDeReferencia"
        class="col-12 md:col-6 lg:col-4"
        label="Número de referencia o carátula"
        max-length="16"
        :rules="{
          required,
        }"
      />
    </AppFieldset>

    <IdentificacionDenunciaInformacionInstitucion
      ref="informacionInstitucionRef"
      class="col-12"
      is-registro-parte
      validation-scope="formRegistroParte"
    />

    <AppBtnNextTeleported
      label="Detalle Denuncia"
      :loading="loadingStepDetalleD"
      @click="handleNextStep"
    />
  </AppForm>
</section>
</template>
<script setup>
import { defineEmits, ref, reactive, onMounted } from 'vue'
import IdentificacionDenunciaInformacionInstitucion from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaInformacionInstitucion.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useOficinaPartesStore } from '@/modules/global/composables/useOficinaPartesStore'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import { useRoute } from 'vue-router'

const { required } = useFormValidation()
const { toastError, TOAST_MESSAGES } = useAppToast()
const { oficinaPartes_registrarParte, registroParte } = useOficinaPartesStore()

const formData = reactive({
  fechaRecepcionDenuncia: new Date(),
  numeroDeReferencia: ''
})
const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData: {},
  validationScope: 'formRegistroParte'
})

const router = useRoute()

const informacionInstitucionRef = ref(null)
const loadingStepDetalleD = ref(false)

const emit = defineEmits(['next-step'])

if (router?.params.reset === 'true') {
  resetFormData()
}
onMounted(() => {
  populateData(registroParte.value)
})

function populateData (data) {
  Object.assign(formData, data)
  // Informacion Institucion
  if (registroParte.value) {
    informacionInstitucionRef.value?.populateData(data)
  }
}

function handleNextStep () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const payloadRegistarParte = {
    ...informacionInstitucionRef.value.formData,
    fechaRecepcionDenuncia: dateTimeUtil.formatToBackendWithTime(formData.fechaRecepcionDenuncia),
    numeroDeReferencia: formData.numeroDeReferencia
  }
  requestUtil({
    action: oficinaPartes_registrarParte,
    payload: payloadRegistarParte,
    resolve: () => {
      loadingStepDetalleD.value = true
      setTimeout(() => {
        loadingStepDetalleD.value = false
        emit('next-step', '/ingreso/registrar-parte/detalle-denuncia')
      }, 600)
    },
    reject: (err) => {
      toastError('Se ha producido un error')
      console.log(err)
    }
  })
}
</script>
