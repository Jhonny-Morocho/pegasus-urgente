<template>
<div
  class="app-select-button flex flex-column field"
  :class="[
    { 'mb-1': v$.model.$invalid && formSubmittedAppForm },
    [$attrs.class]
  ]"
>
  <SelectButton
    :id="id"
    v-model="v$.model.$model"
    :class="{ 'p-invalid': v$.model.$invalid && formSubmittedAppForm }"
    v-bind="vBind"
  />

  <small
    v-if="(v$.model.$invalid && formSubmittedAppForm) || v$.model.$pending.$response"
    class="p-error-message p-error"
  >
    <span>
      {{ v$.$silentErrors[0].$message }}
    </span>
  </small>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { useValidationComponent, defaultValidationComponentProps } from '../composables'

export default defineComponent({
  name: 'AppSelectButton',

  inheritAttrs: false,

  props: {
    ...defaultValidationComponentProps,
    modelValue: {
      type: [String, Number, Object, Boolean],
      default: () => null
    }
  },

  setup: () => ({ ...useValidationComponent() })
})
</script>
