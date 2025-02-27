<template>
<div class="w-full col-12">
  <AppTextarea
    id="editor-instrucciones-especificas"
    v-model="formData.instruccionesEquipoJuridico"
    auto-resize
    class="px-2"
    cols="100"
    label="Instrucciones Específicas"
    rows="6"
    :rules="{ required }"
  />
</div>
<div
  v-if="unidadPolicialOptions"
  class="col-12 grid"
>
  <div class="col-12 md:col-4">
    <h4 class="mb-2">
      ¿Desea agregar Unidad Policial?
    </h4>
    <AppSelectButton
      id="desea-agregar-unidad-policial"
      v-model="formData.agregaUnidadPolicial"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
      :rules="{
        required
      }"
    />
  </div>
  <AppDropdown
    v-if="formData.agregaUnidadPolicial"
    id="institucion"
    v-model="formData.institucion"
    class="col-12 md:col-6 lg:col-4 my-auto"
    label="Institución"
    :options="institucionOptions"
    :rules="{ required }"
    show-clear
  />
  <AppDropdown
    v-if="formData.agregaUnidadPolicial"
    id="unidad-policial"
    v-model="formData.unidadPolicial"
    class="col-12 md:col-6 lg:col-4 my-auto"
    label="Unidad Policial"
    :options="unidadPolicialOptions"
    :rules="{ required }"
    show-clear
  />
</div>
<div
  v-if="hasRevisaEscrito"
  class="col-12 md:col-4"
>
  <h4 class="mb-2">
    ¿Desea Revisar Escrito?
  </h4>
  <AppSelectButton
    id="revisar-escrito"
    v-model="formData.revisarEscrito"
    option-label="name"
    option-value="value"
    :options="[
      { name: 'Si', value: true },
      { name: 'No', value: false }
    ]"
    :rules="{ required }"
  />
</div>
<div
  v-else
  class="col-12 md:col-4"
>
  <p class="text-center">
    Archivo Provisional con Consulta
  </p>
  <AppSelectButton
    id="archivo-provisional-consulta"
    v-model="formData.archivoProvisionalConConsulta"
    option-label="name"
    option-value="value"
    :options="[
      { name: 'Si', value: true },
      { name: 'No', value: false }
    ]"
  />
</div>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useFormValidation } from '@/modules/common/composables'

const props = defineProps({
  modelValue: propTypes.object,
  institucionOptions: propTypes.array,
  unidadPolicialOptions: { type: Array, default: () => null },
  hasRevisaEscrito: Boolean
})

const { required } = useFormValidation()

const formData = ref(props.modelValue)

const emit = defineEmits(['update:modelValue'])

watch(formData.value, (newValues) => {
  emit('update:modelValue', newValues)
})
</script>
