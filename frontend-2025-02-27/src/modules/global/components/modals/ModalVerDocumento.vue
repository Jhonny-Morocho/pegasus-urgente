<template>
<section class="grid mx-auto shadow-3">
  <div class="col-11">
    <img
      v-if="docUrl"
      id="imagen-sujeto-delictual"
      alt="img-sujeto-interviniente"
      class="w-full"
      :src="docUrl"
    >
    <img
      v-else
      id="imagen-sujeto-delictual"
      alt="img-sujeto-interviniente"
      class="w-full"
      src="@/assets/images/docAlcoholemia.png"
    >
  </div>
</section>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  docUrl: propTypes.string
})
</script>
