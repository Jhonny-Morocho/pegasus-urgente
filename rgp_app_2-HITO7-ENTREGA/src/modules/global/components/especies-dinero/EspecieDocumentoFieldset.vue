<template>
<section class="col-12">
  <AppFieldset
    class="col-12"
    legend="Documento"
  >
    <AppDropdown
      id="tipo-documento"
      v-model="formData.tipoDocumento"
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Tipo de documento"
      option-label="descripcion"
      option-value="descripcion"
      :options="tipoDocumentoEspecie"
      :retrieve-data-action="mantenedor_getTipoDocumentoEspecie"
      show-clear
    />
    <AppInputNumber
      id="numero-documento"
      v-model="formData.numero"
      class="col-12 md:col-6 lg:col-4"
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
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Serie"
    />
    <AppInput
      id="institucion-documento"
      v-model="formData.institucion"
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Institución"
    />
    <AppCalendar
      id="fecha-documento"
      v-model="formData.fecha"
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Fecha"
      show-time
    />
    <AppInputNumber
      id="valor-documento"
      v-model="formData.valor"
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Valor"
      :min="0"
      mode="decimal"
      show-buttons
      :use-grouping="false"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { useEspeciesDineroInject } from '@/modules/global/composables/useEspeciesDinero'

const { tipoDocumentoEspecie, mantenedor_getTipoDocumentoEspecie } = useMantenedorStore()
const { especiesDineroInject } = useEspeciesDineroInject()

const formData = especiesDineroInject

defineProps({
  readOnly: Boolean
})

</script>
