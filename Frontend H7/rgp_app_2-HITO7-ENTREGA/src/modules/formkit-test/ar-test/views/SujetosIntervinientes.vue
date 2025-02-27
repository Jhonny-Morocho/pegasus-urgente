<template>
<FormKit
  v-model="data"
  type="group"
>
  <FormKitSchema
    :data="data"
    :schema="schema"
  />
</FormKit>
<button @click="handleSubmit">
  Submit
</button>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FormKitSchema } from '@formkit/vue'
import { useFormValidation } from '@/modules/common/composables'
import { apiRGP } from '@/config/axios'

const data = ref({})

const schema = reactive([])

onMounted(async () => {
  const { data } = await apiRGP.get('https://apimocha.com/pegasus/form')
  schema.push(data)
})

const { isFormValid } = useFormValidation({
  formData: data.value,
  validationScope: 'formBuilderScope'
})

function handleSubmit () {
  if (!isFormValid()) {
    return
  }

  console.log('backObjResponse')
}

</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
.setup-container {
  width: 100%;
  background-color: #f1f1f1;
}
.preview {
  width: 100%;
  background-color: #f8f8f5;
}
</style>
