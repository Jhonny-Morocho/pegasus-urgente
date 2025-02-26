<template>
<div>
  <Button
    aria-controls="overlay_menu"
    aria-haspopup="true"
    class="p-button-rounded p-button-outlined btn-primary-outline"
    icon="pi pi-ellipsis-v"
    type="button"
    @click=" toggleActions($event, slotProps) "
  />

  <Menu
    id="overlay_menu"
    ref="refMenuOptions"
    :model="menuOptions"
    popup
  />
</div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

import { propTypes } from '../types/prop.types'

defineProps({
  slotProps: propTypes.object,
  menuOptions: propTypes.array,
  modelValue: propTypes.object

})

const emit = defineEmits(['update:modelValue'])

const refMenuOptions = ref(null)

function toggleActions (event, slotProps) {
  emit('update:modelValue', slotProps.data)
  refMenuOptions.value.toggle(event)
}
</script>
