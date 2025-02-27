<template>
<div class="flex">
  <AppInput
    id="nueBuscar"
    v-model="nueBuscar"
    class="my-auto w-full"
    :disabled="loading"
    :label="label"
    style="border-radius: 4px 0px 0px 4px; height: 35px;"
  />
  <Button
    class="p-button btn-primary my-auto"
    :disabled="!nueBuscar || loading"
    :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-search'"
    style="border-radius: 0px 4px 4px 0px; height:35px; max-width: 35px;"
    @click="emit('buscar-nue', nueBuscar)"
  />
</div>
</template>
<script setup>
import { defineEmits, ref, defineProps, onMounted, defineExpose } from 'vue'
import { propTypes } from '@/modules/common/types'

const nueBuscar = ref()

const emit = defineEmits(['buscar-nue'])

const props = defineProps({
  nue: propTypes.number,
  label: {
    type: String,
    default: 'Ingrese un valor'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  if (props.nue) {
    nueBuscar.value = props.nue
  }
})

function limpiarCampo () {
  nueBuscar.value = ''
}

defineExpose({
  limpiarCampo
})
</script>
