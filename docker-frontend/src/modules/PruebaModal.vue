<template>
<AppForm
  :form-submitted="formSubmitted"
  validation-scope="formFoo"
>
  <AppInput
    id="text"
    v-model="formData.text"
    label="Text"
    :rules="{ required }"
  />
  <AppInput
    id="text"
    v-model="formData.apellido"
    label="Apellido"
    :rules="{ required }"
  />

  edad: {{ edad }}
</AppForm>
</template>

<script setup>
import { defineProps, defineExpose, reactive } from 'vue'

import { appUtil } from '@/utils'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      text: '',
      apellido: ''
    })
  },
  edad: {
    type: Number,
    default: 5
  }
})

const formData = reactive(appUtil.clone(props.data))

const { isFormValid, formSubmitted, required } = useFormValidation({ formData, validationScope: 'formFoo' })

const { toastError } = useAppToast()

function retrieveData (retrieveCb) {
  console.log('isFormValid', isFormValid())

  if (!isFormValid()) {
    toastError('Los campos no son correctos')
    return
  }

  retrieveCb?.(formData)
}

defineExpose({ retrieveData })
</script>
