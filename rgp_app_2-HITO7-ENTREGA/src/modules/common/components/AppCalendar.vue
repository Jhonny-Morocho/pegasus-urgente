<template>
<div
  class="flex flex-column field"
  :class="[
    { 'mb-1': v$.model.$invalid && formSubmittedAppForm },
    [$attrs.class]
  ]"
>
  <span class="p-float-label">
    <Calendar
      :id="id"
      v-model="v$.model.$model"
      :class="{ 'p-invalid': v$.model.$invalid && formSubmittedAppForm }"
      :date-format="dateFormat"
      v-bind="vBind"
      :hide-on-date-time-select="true"
      input-class="p-inputtext-sm"
      :max-date="maxDate"
      :min-date="minDate"
      show-button-bar
      show-icon
      @blur="v$.model.$commit"
    />
    <label
      :class="{ 'text-error': v$.model.$invalid && formSubmittedAppForm }"
      :for="id"
    >
      {{ label }}<template v-if="showRequiredIndicator">(<span class="text-error">*</span>
        <span>)</span>
      </template>
    </label>

    <small
      v-if="(v$.model.$invalid && formSubmittedAppForm) || v$.model.$pending.$response"
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

import { useValidationComponent, defaultValidationComponentProps } from '../composables'

export default defineComponent({
  name: 'AppCalendar',

  inheritAttrs: false,

  props: {
    ...defaultValidationComponentProps,
    label: {
      type: String,
      default: 'Fecha'
    },
    dateFormat: {
      type: String,
      default: 'dd-mm-yy'
    },
    minDate: {
      type: [String, Date],
      default: () => null
    },
    maxDate: {
      type: [String, Date],
      default: () => new Date()
    },
    modelValue: {
      type: [String, Date],
      default: () => null
    }
  },

  setup: () => ({ ...useValidationComponent() })
})
</script>
