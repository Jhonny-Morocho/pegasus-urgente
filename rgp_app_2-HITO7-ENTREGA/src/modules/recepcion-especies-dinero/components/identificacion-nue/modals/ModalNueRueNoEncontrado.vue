<template>
<div class="flex justify-content-center py-5">
  <i
    class="pi pi-exclamation-triangle mr-2"
    style="font-size: 2rem"
  />
  <h3
    class="mt-2"
  >
    {{ body }}
  </h3>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  body: propTypes.string
})
</script>
