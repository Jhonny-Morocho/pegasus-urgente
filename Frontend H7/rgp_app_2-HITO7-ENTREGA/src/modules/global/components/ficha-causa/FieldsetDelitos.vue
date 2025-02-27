<template>
<section>
  <AppFieldset legend="Delitos">
    <TablaDelitos
      :data-delitos="props.dataDelitos"
      :es-ficha-causa="true"
      v-bind="{ ...$attrs }"
      @tabla-delito:eliminar="eliminarDelito"
      @tabla-delito:modificar="setModoEdicion"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'

const props = defineProps({
  dataDelitos: propTypes.array
})

</script>
