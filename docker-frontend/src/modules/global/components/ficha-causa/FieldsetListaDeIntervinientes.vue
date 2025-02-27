<template>
<section>
  <AppFieldset
    legend="Lista de Sujetos/Intervinientes"
  >
    <TablaSujetos
      :es-ficha-causa="true"
      :list-value="props?.dataIntervinientes"
      v-bind="{ ...$attrs }"
      @set-sujeto-editar="setModoEdicion"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'

const props = defineProps({
  dataIntervinientes: propTypes.array
})

</script>
