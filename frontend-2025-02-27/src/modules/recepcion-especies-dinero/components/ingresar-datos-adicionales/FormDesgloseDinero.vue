<template>
<AppForm
  id="formAddDinero"
  class="grid col-12"
  :form-submitted="formSubmitted"
  validation-scope="formAddDinero"
>
  <p
    v-if="data?.tipoMoneda"
    class="m-2 col-12 grid"
    style="font-size: 1.2em"
  >
    <span class="font-bold mr-2"> Tipo de Moneda: </span>
    {{ mantenedor_getNombreMoneda(data?.tipoMoneda) ?? "No Definido" }}
  </p>
  <div
    v-else
    class="w-full grid my-3 mx-auto"
  >
    <AppDropdown
      id="tipo-moneda"
      v-model="formData.tipoMoneda"
      class="col-12 md:col-6 lg:col-3 mb-auto"
      label="Tipo de Moneda"
      option-label="descripcion"
      option-value="id"
      :options="tipoMoneda"
      :retrieve-data-action="mantenedor_geTipoMoneda"
      :rules="{
        required,
      }"
      show-clear
    />
  </div>
  <AppDropdown
    id="denominacion"
    v-model="formData.denominacion"
    class="col-12 md:col-6 lg:col-3"
    label="Denominación"
    option-label="descripcion"
    option-value="id"
    :options="denominacionDinero"
    :retrieve-data-action="mantenedor_getDenominacionDinero"
    :rules="{
      required,
    }"
    show-clear
  />
  <AppDropdown
    id="tipo-dinero"
    v-model="formData.tipo"
    class="col-12 md:col-6 lg:col-3"
    label="Tipo de dinero"
    option-label="descripcion"
    option-value="id"
    :options="tipoDinero"
    :retrieve-data-action="mantenedor_getTipoDinero"
    :rules="{
      required,
    }"
    show-clear
  />
  <AppInputNumber
    id="cantidad-dinero"
    v-model="formData.cantidadDinero"
    class="col-12 md:col-6 lg:col-3"
    label="Cantidad"
    :min="0"
    :rules="{ required, maxLength: maxLength(10) }"
    show-buttons
    :step="1"
    :use-grouping="false"
  />
  <AppInputNumber
    id="total"
    v-model="formData.total"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Total"
    :min="0"
  />
  <div class="flex justify-content-center mt-2 mb-4 col-12">
    <Button
      v-if="!editando"
      class="btn-form"
      :icon="
        loaderAddDetalleDinero ? 'pi pi-spinner pi-spin' : 'pi pi-plus-circle'
      "
      icon-pos="right"
      label="Agregar Dinero"
      style="width: auto"
      @click="agregarDinero"
    />
    <div v-else>
      <Button
        class="p-button-outlined p-button-warning mx-1"
        icon="pi pi-times"
        label="Cancelar"
        style="width: auto"
        @click="cancelarEdicion"
      />
      <Button
        class="p-button-warning mx-1"
        icon="pi pi-pencil"
        label="Modificar Dinero"
        style="width: auto"
        @click="agregarDinero"
      />
    </div>
  </div>
</AppForm>
</template>
<script setup>
import { reactive, defineProps, watch, defineEmits } from 'vue'
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { propTypes } from '@/modules/common/types'

defineProps({
  readOnly: Boolean,
  data: propTypes.object
})

const formData = reactive({
  tipoMoneda: null,
  denominacion: null,
  tipo: null,
  cantidadDinero: null,
  total: null
})

watch(
  () => formData.denominacion,
  () => {
    formData.total = formData.denominacion
      ? formData.cantidadDinero *
        +mantenedor_getNombreDenominacionDinero(formData.denominacion)
      : 0
  }
)
watch(
  () => formData.cantidadDinero,
  () => {
    formData.total = formData.cantidadDinero
      ? formData.cantidadDinero *
        +mantenedor_getNombreDenominacionDinero(formData.denominacion)
      : 0
  }
)

const {
  mantenedor_getNombreMoneda,
  mantenedor_geTipoMoneda,
  tipoMoneda,
  mantenedor_getNombreDenominacionDinero,
  mantenedor_getDenominacionDinero,
  denominacionDinero,
  mantenedor_getTipoDinero,
  tipoDinero
} = useMantenedorStore()

const { formSubmitted, required, maxLength, isFormValid } = useFormValidation({
  formData,
  validationScope: 'formAddDinero'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const emit = defineEmits(['add-desglose'])

function agregarDinero () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('add-desglose', {
    ...formData,
    denominacion: formData.denominacion.toString(),
    tipo: formData.tipo.toString()
  })
}
</script>
