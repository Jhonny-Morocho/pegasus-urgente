<template>
<AppDropdown
  id="tipo-documento"
  v-model="formData.tipoDocumento"
  class="col-12 lg:col-4"
  :disabled="readOnly"
  label="Tipo de documento"
  option-label="descripcion"
  option-value="descripcion"
  :options="tipoDocumentoEspecie"
  show-clear
/>
<AppInputNumber
  id="numero-documento"
  v-model="formData.numero"
  class="col-12 lg:col-4"
  :disabled="readOnly"
  label="Número"
  :min="0"
  mode="decimal"
  show-buttons
  :use-grouping="false"
/>
<AppInput
  id="serie-documento"
  v-model="formData.serie"
  class="col-12 lg:col-4"
  :disabled="readOnly"
  label="Serie"
/>
<AppInput
  id="institucion-documento"
  v-model="formData.institucion"
  class="col-12 lg:col-4"
  :disabled="readOnly"
  label="Institución"
/>
<AppCalendar
  id="fecha-documento"
  v-model="formData.fecha"
  class="col-12 lg:col-4"
  :disabled="readOnly"
  label="Fecha"
  show-time
/>
<AppInputNumber
  id="valor-documento"
  v-model="formData.valor"
  class="col-12 lg:col-4"
  :disabled="readOnly"
  label="Valor"
  :min="0"
  mode="decimal"
  show-buttons
  :use-grouping="false"
/>
</template>

<script setup>
import { defineProps, reactive } from 'vue'

const formData = reactive(getFormDataInitial())
defineProps({
  readOnly: Boolean
})

function getFormDataInitial () {
  return {
    tipoDocumento: '',
    numero: null,
    serie: '',
    institucion: '',
    fecha: '',
    valor: null
  }
}
</script>
