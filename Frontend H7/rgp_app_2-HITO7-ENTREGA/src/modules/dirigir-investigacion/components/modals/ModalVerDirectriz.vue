<template>
<section>
  <p>
    {{ directriz }}
  </p>
</section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  directriz: {
    type: String,
    default: ''
  }
})
</script>
