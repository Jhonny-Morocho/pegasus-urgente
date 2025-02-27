<template>
<section>
  <AppFieldset legend="Relaciones">
    <TablaRelaciones
      :data-relaciones=" props.dataRelaciones "
      :es-ficha-causa="true"
      :is-editando="editando"
      v-bind="{ ...$attrs }"
      @relacion:editar-relacion="setModoEdicion"
      @relacion:eliminar-relacion="eliminarRelacion"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import TablaRelaciones from '@/modules/global/components/relaciones/TablaRelaciones.vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'

const props = defineProps({
  dataRelaciones: propTypes.array

})

</script>
