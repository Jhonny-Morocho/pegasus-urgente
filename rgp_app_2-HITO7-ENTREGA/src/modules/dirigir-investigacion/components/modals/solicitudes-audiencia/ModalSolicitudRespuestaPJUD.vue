<template>
<div>
  <div
    v-if="isWithError"
    class="mt-2 flex flex-column gap-3"
  >
    <div><strong>Codigo Error: </strong>{{ data?.codigoError }}</div>
    <div><strong>Codigo Inteconexion: </strong>{{ data?.codigoInterconexionError }}</div>
    <div>
      <p class="mb-1">
        <strong>Descripcion Error: </strong>
      </p>
      <span>{{ data?.descripcionError }}</span>
    </div>
  </div>
  <div
    v-else
    class="mt-2 flex flex-column gap-3"
  >
    <div><strong>Codigo Inteconexion: </strong>{{ data?.codigoInterconexionError }}</div>
    <p>La Solicitud ha sido enviada con exito!</p>
  </div>
</div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  data: propTypes.object
})

const isWithError = ref(props.data.isWithError || false)
</script>
