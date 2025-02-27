<template>
<div class="col-12 mt-0 pt-0">
  <MapInput
    id="map"
    :auto-complete="false"
    class="col-12 mt-0 pt-0"
    :draggable="false"
    :height="'h-28rem'"
    :position="coordenadas"
    :zoom="18"
  />
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'

const props = defineProps({
  coordenadasDireccion: propTypes.object
})
const coordenadas = {
  latitude: props.coordenadasDireccion.lat,
  longitude: props.coordenadasDireccion.lon
}
</script>
