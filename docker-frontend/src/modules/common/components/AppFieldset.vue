<template>
<Fieldset
  v-bind="$attrs"
  class="pt-3"
  :class="noMarginBottom ? 'mb-0' : 'mb-5'"
>
  <div class="grid">
    <AppProgressSpinner v-if="$attrs.loading" />
    <slot v-else />
  </div>
  <slot
    v-if="!$attrs.loading"
    name="bottom"
  />
</Fieldset>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  noMarginBottom: Boolean
})
</script>
