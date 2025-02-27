<template>
<section>
  <AppFieldset
    class="pb-3 mt-4"
    :legend="data?.titulo"
  >
    <TablaConsolidarResultados :value="data?.valores" />
  </AppFieldset>
</section>
</template>
<script setup>
import TablaConsolidarResultados from '@/modules/tramitar-audiencia/components/consolidar-resultado-audiencia/TablaConsolidarResultados.vue'
import defineProps from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  data: propTypes.object
})
</script>
