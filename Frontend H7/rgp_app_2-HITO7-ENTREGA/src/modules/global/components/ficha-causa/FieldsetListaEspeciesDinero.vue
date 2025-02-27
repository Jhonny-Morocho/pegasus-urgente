<template>
<section>
  <AppFieldset legend="Especies/Dinero">
    <TablaEspeciesDinero
      :data-especies-dinero="props.dataEspeciesDinero"
      :es-ficha-causa="false"
      :is-editando="editando"
      v-bind="{ ...$attrs }"
      @tabla-especies:editar-especie="editarEspecie"
      @tabla-especies:eliminar-especie="eliminarEspecie"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
import TablaEspeciesDinero from '@/modules/global/components/especies-dinero/TablaEspeciesDinero.vue'

const props = defineProps({
  dataEspeciesDinero: propTypes.array
})

</script>
