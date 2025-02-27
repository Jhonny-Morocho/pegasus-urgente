<template>
<Fieldset
  v-bind="$attrs"
  class="pt-3 mb-5"
>
  <template #legend>
    <div class="flex">
      <span class="mr-4">{{ panel.label }}</span>
      <i
        class="cursor-pointer text-primary text-xl"
        :class="panel.display ? 'pi pi-star-fill' : 'pi pi-star'"
        @click="updatePanel(panel)"
      />
    </div>
  </template>
  <div class="grid">
    <slot />
  </div>
  <slot name="bottom" />
</Fieldset>
</template>

<script setup>
import { usePanelesStore } from '@/modules/tramitar-audiencia/composables'
import { requestUtil } from '@/utils'
import { defineProps } from 'vue'
import { useAppToast } from '../composables'
import { propTypes } from '../types'

defineProps({
  panel: propTypes.object
})

const { paneles_updatePanel } = usePanelesStore()
const { toastSuccess, toastWarning } = useAppToast()

const updatePanel = (panel) => {
  requestUtil({
    action: paneles_updatePanel,
    payload: { panel: panel },
    resolve: (added) => {
      added ? toastSuccess(`${panel.label} agregado de la vista principal.`) : toastWarning(`${panel.label} eliminado de la vista principal.`)
    }
  })
}
</script>
