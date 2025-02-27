<template>
<hr>
<AppForm
  id="form-nombre-causa"
  class="grid mt-3"
  :form-submitted="formSubmitted"
  validation-scope="form-nombre-causa"
>
  <p class="col-12">
    <strong>Nombre Actual de la Causa: </strong>{{ props?.nombreCausaActual }}
  </p>
  <AppInput
    id="nombre-causa"
    v-model="formData.nombreCausa"
    class="col-12"
    label="Nombre Causa"
    :rules="{ required }"
  />
</AppForm>
<section class="w-full flex align-items-center justify-content-end gap-3">
  <Button
    class="p-button-text px-3"
    icon="pi pi-times"
    label="Cancelar"
    @click="dialogRef?.close()"
  />
  <Button
    class="btn-primary px-3"
    icon="pi pi-save"
    icon-pos="right"
    label="Cambiar Nombre"
    @click="cambiarNombre"
  />
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { inject, reactive } from 'vue'

const dialogRef = inject('dialogRef')

const props = reactive({ ...dialogRef.value?.data })

const { toastError } = useAppToast()

const formData = reactive({
  nombreCausa: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-nombre-causa'
})

function cambiarNombre () {
  if (!isFormValid()) {
    toastError('No puedes dejar la causa sin nombre')
    return
  }
  dialogRef.value?.close(formData)
}
</script>
