<template>
<AppInput
  v-model="model"
  :custom-validation="customRutValidation"
  v-bind="customAttrs"
  :rules="customRules"
  @input="handleRutInput"
/>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref, getCurrentInstance } from 'vue'
import { useFormValidation } from '@/modules/common/composables'

import { validate, format } from '@fiquu/cl-rut'
import { propTypes } from '../../types/prop.types'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  rules: propTypes.object
})

// evita pasar la prop rules porque tiene un manejo local
const customAttrs = computed(() => {
  const { rules, ...restAttrs } = getCurrentInstance().attrs

  return restAttrs
})

const emit = defineEmits(['update:modelValue'])

const { rutValid, required } = useFormValidation()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit(`update:modelValue`, value)
})

// si existe la prop rules: { required } la agrega dinamicamente
// y por defecto siempre usa rutValid
const customRules = computed(() => {
  const _customRules = {}

  if (props.rules?.required) {
    _customRules.required = required
  }
  _customRules.rutValid = rutValid

  return _customRules
})

// indica en AppInput si la validación es correcta cada vez que se hace input
const customRutValidation = ref(false)

function handleRutInput ({ target: { value } }) {
  let localValue

  if (!value) {
    model.value = ''
    customRutValidation.value = false
    return
  }

  localValue = value

  if (value.length > 3) {
    localValue = format(value.replace('-', ''))
  }
  model.value = localValue

  customRutValidation.value = !validate(localValue)
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>
