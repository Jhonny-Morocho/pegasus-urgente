<template>
<div class="field-checkbox">
  <label
    v-if="labelLeft"
    class="mr-2"
    :for="id"
  >{{ labelLeft }}</label>
  <Checkbox
    :id="id"
    v-model="model"
    binary
    v-bind="vBind"
  />
  <label :for="id">{{ label }}</label>
</div>
</template>

<script>
import { defineComponent } from 'vue'

import { useModelWrapper, useValidationComponent } from '../composables'
import { propTypes } from '../types/prop.types'

export default defineComponent({
  name: 'AppCheckbox',

  props: {
    id: {
      type: String,
      required: true
    },
    label: propTypes.string,
    modelValue: Boolean,
    labelLeft: propTypes.string
  },

  setup () {
    const model = useModelWrapper()
    const validation = useValidationComponent()

    return {
      model,
      formReadonly: validation.formReadonly,
      ...validation
    }
  }
})
</script>
