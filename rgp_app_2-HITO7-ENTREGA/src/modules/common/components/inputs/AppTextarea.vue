<template>
<div
  class="flex flex-column field"
  :class="[
    { 'mb-1': v$.model.$invalid && formSubmittedAppForm || customValidation },
    [$attrs.class]
  ]"
>
  <span class="p-float-label">
    <Textarea
      :id="id"
      v-model="v$.model.$model"
      class="p-inputtext-sm"
      :class="{ 'p-invalid': v$.model.$invalid && formSubmittedAppForm || customValidation }"
      v-bind="vBind"
      :maxlength="maxLength"
    />
    <label
      :class="{ 'text-error': v$.model.$invalid && formSubmittedAppForm || customValidation }"
      :for="id"
    >
      {{ label }}<template v-if="showRequiredIndicator">(<span class="text-error">*</span>
        <span>)</span>
      </template>
    </label>

    <small
      v-if="(v$.model.$invalid && formSubmittedAppForm || customValidation) || v$.model.$pending.$response"
      class="p-error-message p-error"
    >
      <span>
        {{ v$.$silentErrors[0].$message }}
      </span>
    </small>
  </span>
</div>
</template>

<script>
import { defineComponent } from 'vue'

import { useValidationComponent, defaultValidationComponentProps } from '../../composables'

export default defineComponent({
  name: 'AppTextarea',

  inheritAttrs: false,

  props: {
    ...defaultValidationComponentProps,
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: null
    },
    customValidation: Boolean
  },

  setup: () => ({ ...useValidationComponent() })
})
</script>
