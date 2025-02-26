<template>
<h3> {{ observacion }}</h3>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  observacion: {
    type: String,
    default: () => null
  }
})

</script>
<style scoped>
h3{
    font-weight: 300;
}
</style>
