<template>
<form
  autocomplete="off"
  class="p-fluid"
  v-bind="$attrs"
>
  <slot />
</form>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppForm',

  props: {
    formSubmitted: {
      type: [Boolean, Object],
      required: true,
      default: () => null
    },
    validationScope: {
      type: String,
      required: true
    },
    formReadonly: Boolean,
    formValidationDisabled: Boolean
  }
})
</script>
