<template>
<div
  v-for="(panel, index) in Object.keys(paneles)"
  :key="index"
  class="flex col-12"
>
  <Checkbox
    :id="panel"
    v-model="panelesSeleccionados"
    :value="panel"
    @change="updatePanel(panel)"
  />
  <span class="ml-3">{{ paneles[panel].label }}</span>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usePanelesStore } from '../../composables'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'

const { paneles_updatePanel, paneles } = usePanelesStore()
const { toastSuccess, toastWarning } = useAppToast()

const updatePanel = (panel) => {
  const panelSeleccioando = paneles.value[panel]
  requestUtil({
    action: paneles_updatePanel,
    payload: { panel: panelSeleccioando },
    resolve: (added) => {
      added ? toastSuccess(`${panelSeleccioando.label} agregado de la vista principal.`) : toastWarning(`${panelSeleccioando.label} eliminado de la vista principal.`)
    }
  })
}

const panelesSeleccionados = ref([])

onMounted(() => {
  console.log({ paneles })
  panelesSeleccionados.value = Object.keys(paneles.value).filter((panel) => paneles.value[panel].display === true)
})
</script>

<style>
p:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
