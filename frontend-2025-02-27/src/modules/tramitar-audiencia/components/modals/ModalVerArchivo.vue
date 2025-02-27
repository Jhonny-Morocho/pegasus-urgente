<template>
<section class="mt-4">
  <img
    v-if="docUrl"
    id="detalle-documento"
    alt="img-detalle-documento"
    class="w-full"
    :src="docUrl"
  >
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  docUrl: propTypes.string
})
</script>
