<template>
<div class="col-12">
  <AppDropdown
    id="agrupar"
    class="col-3 p-fluid"
    label="Agrupar por"
    option-label="value"
    option-value="id"
    :options="motivoAgrupacion"
    show-clear
  />
</div>
<AppFieldsetCustom
  class="pb-3"
  :panel="paneles.historial"
>
  <AppFilters class="w-full mb-6" />
  <TablaHistorialCausa :value="historialCausa" />
</AppFieldsetCustom>
</template>

<script setup>
import AppFieldsetCustom from '@/modules/common/components/AppFieldsetCustom.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaHistorialCausa from '@/modules/tramitar-audiencia/components/tables/TablaHistorialCausa.vue'
import { usePanelesStore } from '@/modules/tramitar-audiencia/composables'
import { ref } from 'vue-demi'

const historialCausa = ref([])
const { paneles } = usePanelesStore()

const motivoAgrupacion = [
  {
    id: 1,
    value: 'Actividad'
  },
  {
    id: 2,
    value: 'Etapa del Proceso'
  },
  {
    id: 2,
    value: 'Autor o Ejecutor'
  }
]
</script>
