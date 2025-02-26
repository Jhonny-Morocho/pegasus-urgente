<template>
<AppFieldset legend="¿Es hallazgo?">
  <div class="col-12 md:col-4">
    <span>
      <AppSelectButton
        id="esHallazgo"
        v-model="form.esHallazgo"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
      />
    </span>
  </div>
  <div class="col-12 px-0">
    <AppDropdown
      id="viaInformacionAportada"
      v-model="form.hallazgoDe"
      class="col-12"
      :disabled="!form.esHallazgo"
      label="Hallazgo de "
      option-label="descripcion"
      option-value="id"
      :options="tipoHallazgo"
      show-clear
    />
  </div>
</AppFieldset>
</template>
<script setup>
import { reactive, defineExpose } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'

function initialData () {
  return {
    esHallazgo: false,
    hallazgoDe: null
  }
}

const form = reactive(initialData())
const { tipoHallazgo } = useMantenedorStore()

function populateForm (data) {
  Object.keys(form).forEach((key) => {
    form[key] = data[key]
  })
}

function resetForm () {
  Object.assign(form, initialData())
}
defineExpose({ form, populateForm, resetForm })
</script>
