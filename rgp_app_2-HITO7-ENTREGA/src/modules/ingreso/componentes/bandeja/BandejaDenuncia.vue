<template>
<TabView
  v-model:activeIndex="tab.active"
  class="tabview"
  @tab-change="handleTabChange"
>
  <TabPanel
    v-for="item in tab.items"
    :key="item.title"
    :header="item.title"
  >
    <AppFilters
      v-bind="$attrs"
      @filter="emit('filter')"
    />

    <slot name="table" />
  </TabPanel>
</TabView>
</template>

<script setup>
import { reactive, useAttrs, defineEmits } from 'vue'

import AppFilters from '@/modules/common/components/AppFilters.vue'

const emit = defineEmits(['filter'])
const attrs = useAttrs()

const tab = reactive({
  active: 0,
  items: [
    { title: 'Tareas En Curso', origenTabla: 'curso' },
    { title: 'Tareas Por Vencer', origenTabla: 'tareas-por-vencer' },
    { title: 'Tareas Vencidas', origenTabla: 'tareas-vencidas' },
    { title: 'Tareas Prioritarias', origenTabla: 'prioritario' },
    { title: 'Tareas Completadas', origenTabla: 'tareas-completadas' }
  ]
})

function handleTabChange ({ index }) {
  Object.assign(attrs.modelValue, {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    actualTabDenuncia: tab.items[index].origenTabla
  })

  emit('filter')
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>
