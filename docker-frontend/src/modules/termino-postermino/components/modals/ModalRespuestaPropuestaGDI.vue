<template>
<hr>
<section
  v-if="props.isTransferencia"
  class="p-4"
>
  <h3>La siguiente causa será transferida</h3>
  <ul class="flex flex-column gap-2 list-none px-0">
    <li><strong>RUC: </strong>{{ props.rucCausaTransferida }}</li>
  </ul>
</section>
<section
  v-if="props.isAgrupacion"
  class="p-4"
>
  <h1>src\modules\termino-postermino\components\modals\ModalRespuestaPropuestaGDI.vue</h1>
</section>
<section
  v-if="props.rechazaPropuesta"
  class="p-4"
>
  <AppForm
    id="form-rechazo-propuesta"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="form-rechazo-propuesta"
  >
    <AppTextarea
      id="motivo-rechazo"
      v-model="formData.motivoRechazo"
      class="w-full mb-0"
      label="Motivo del Rechazo"
      rows="5"
      :rules="{ required }"
    />
  </AppForm>
</section>
<section class="flex flex-row-reverse gap-3 px-4 pb-2">
  <Button
    v-if="props.rechazaPropuesta"
    class="px-6 btn-primary"
    label="Rechazar"
    @click="handleRechazoPropuesta"
  />
  <Button
    v-else
    class="px-6 btn-primary"
    label="Aprobar"
    @click="handleApruebaPropuesta"
  />
  <Button
    class="px-4 p-button-text"
    icon="pi pi-times"
    icon-pos="right"
    label="Cancelar"
    @click="handleCancelar"
  />
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { inject, reactive } from 'vue'

const dialogRef = inject('dialogRef')

const props = reactive({
  isTransferencia: dialogRef.value?.data?.isTransferencia,
  isAgrupacion: dialogRef.value?.data?.isAgrupacion,
  rechazaPropuesta: dialogRef.value?.data?.rechazaPropuesta,
  rucCausaTransferida: dialogRef.value?.data?.rucCausaTransferida,
  rucCausasReasignadas: dialogRef.value?.data?.rucCausasReasignadas
})

const { TOAST_MESSAGES, toastError } = useAppToast()

const formData = reactive({
  motivoRechazo: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-rechazo-propuesta'
})

function handleApruebaPropuesta () {
  dialogRef.value.close(true)
}

function handleRechazoPropuesta () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  dialogRef.value.close(formData)
}

function handleCancelar () {
  dialogRef.value.close()
}
</script>
