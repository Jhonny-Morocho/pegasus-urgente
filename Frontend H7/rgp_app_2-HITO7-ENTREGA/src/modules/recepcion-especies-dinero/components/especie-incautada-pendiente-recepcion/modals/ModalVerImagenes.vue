<template>
<div class="grid">
  <div
    class="col-12 md:col-6 text-center"
  >
    <i
      class="pi pi-images"
      style="font-size:4em"
    />
  </div>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  imagenes: {
    type: Array,
    default: () => {
      return []
    }
  }
})
</script>
