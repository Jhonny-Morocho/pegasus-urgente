<template>
<AppForm
  :form-submitted="formSubmitted"
  validation-scope="recahzo-reapertura-causa"
>
  <AppTextarea
    id="motivo-rechazo"
    v-model="formData.motivoRechazo"
    class="col-12"
    cols="100"
    label="Motivo Rechazo"
    rows="5"
    :rules="{ required }"
  />
</AppForm>
</template>

<script setup>
import { defineProps, reactive, defineExpose } from 'vue'
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import { appUtil } from '@/utils'

const { toastWarning } = useAppToast()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      motivoRechazo: ''
    })
  }
})

const formData = reactive(appUtil.clone(props.data))

const { formSubmitted, isFormValid, required } = useFormValidation({ formData, validationScope: 'recahzo-reapertura-causa' })

function retrieveData (retrieveCb) {
  if (formData.motivoRechazo.length <= 0 || !isFormValid) {
    toastWarning('Debe especificar el motivo del rechazo')
    return
  }

  retrieveCb?.(formData)
}

defineExpose({ retrieveData })
</script>
