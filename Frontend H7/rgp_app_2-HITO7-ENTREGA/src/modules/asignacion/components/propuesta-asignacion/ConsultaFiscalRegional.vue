<template>
<AppDropdown
  id="id-tipo-impacto"
  v-model="tipoImpacto"
  class="col-4 p-fluid mb-4"
  label="Seleccionar Impacto"
  option-label="descripcion"
  option-value="descripcion"
  :options="optionsTipoImpacto"
  show-clear
  @change="changeImpacto"
/>

<AppFieldset
  class="w-full"
  legend="Consulta al Fiscal Regional (*)"
>
  <Editor
    id="consulta-fiscal"
    v-model="consultaFR"
    class="col-12"
    editor-style="height: 256px"
  />
</AppFieldset>
</template>
<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import { propTypes } from '@/modules/common/types'

const emit = defineEmits(['update:consulta', 'change:impacto'])

const props = defineProps({
  consulta: propTypes.string,
  optionsTipoImpacto: propTypes.array
})

const tipoImpacto = ref('')

const consultaFR = computed({
  get: () => props.consulta,
  set: (value) => emit('update:consulta', value)
})

function changeImpacto () {
  emit('change:impacto', tipoImpacto.value)
}

</script>
