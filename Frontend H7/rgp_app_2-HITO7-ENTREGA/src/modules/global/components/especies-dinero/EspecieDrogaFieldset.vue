<template>
<section class="col-12">
  <AppFieldset
    class="col-12"
    legend="Droga"
  >
    <div class="col-12 grid">
      <AppInput
        id="tipo-contenedor"
        v-model="formData.tipoContenedor"
        class="col-3"
        :disabled="readOnly"
        label="Tipo Contendor"
      />
      <AppInputNumber
        id="cantidad-contenedores"
        v-model="formData.cantidadContenedores"
        class="col-3"
        label="Número de Contenedores"
        :min="0"
        show-buttons
        :use-grouping="false"
      />
      <AppDropdown
        id="unidad-medida"
        v-model="formData.unidadMedida"
        class="col-3"
        label="Unidad de Medida"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Metro', value: 1 },
          { name: 'Kilogramo', value: 2 },
          {name: 'Litro', value: 3}
        ]"
        show-clear
      />
      <AppInput
        id="peso-bruto"
        v-model="formData.pesoBruto"
        class="col-3"
        :disabled="readOnly"
        label="Peso Bruto"
      />
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { reactive, defineProps } from 'vue'
defineProps({
  readOnly: Boolean
})

const formData = reactive({
  tipoContenedor: '',
  cantidadContenedores: 0,
  unidadMedida: '',
  pesoBruto: ''
})
</script>
