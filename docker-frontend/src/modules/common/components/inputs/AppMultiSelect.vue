<template>
<div
  class="flex flex-column field"
  :class="[[$attrs.class]]"
>
  <span class="p-float-label">
    <MultiSelect
      :id="id"
      v-model="v$.model.$model"
      class="p-inputtext-sm"
      :class="{ 'p-invalid': v$.model.$invalid && formSubmittedAppForm }"
      empty-filter-message="Sin resultados"
      :filter="vBind.options?.length > 4"
      v-bind="vBind"
      :show-clear="showClear && !!v$.model.$model"
    />
    <label
      :class="{ 'text-error': v$.model.$invalid && formSubmittedAppForm }"
      :for="id"
    >
      {{ label
      }}<template v-if="showRequiredIndicator">(<span class="text-error">*</span>
        <span>)</span>
      </template>
    </label>

    <small
      v-if="
        (v$.model.$invalid && formSubmittedAppForm) ||
          v$.model.$pending.$response
      "
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

import {
  useValidationComponent,
  defaultValidationComponentProps
} from '../../composables'

export default defineComponent({
  name: 'AppDropdown',

  inheritAttrs: false,

  props: {
    ...defaultValidationComponentProps,
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number, Object],
      default: null
    }
  },

  setup: () => ({ ...useValidationComponent() })
})
</script>

<style lang="scss" scoped>
.p-error-message {
  position: absolute;
}
.text-error {
  top: 50% !important;
}
</style>
