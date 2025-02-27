<script>
import { onMounted, ref } from 'vue'
import { useFormkitRules } from '@/modules/global/composables/useFormkitRules'
export default {
  props: {
    context: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    const model = ref()
    onMounted(() => {
      const inputValue = props.context.value
      if (inputValue) model.value = inputValue
    })

    const rules = useFormkitRules(props.context.attrs.rules)
    function handleInput () {
      props.context?.node.input(model.value)
    }
    return {
      handleInput,
      contexto: props.context,
      rules,
      model
    }
  }
}

</script>

<template>
<AppDropdown
  :id="contexto.id"
  v-model="model"
  :class="contexto.attrs.class"
  :disabled="contexto.disabled"
  :filter="contexto.attrs.filter ?? false"
  :label="contexto.attrs.appLabel"
  :name="contexto.node.name"
  :option-label="contexto?.attrs?.optionLabel ?? 'descripcion'"
  :option-value="contexto?.attrs?.optionValue ?? 'id'"
  :options="contexto?.attrs?.options"
  :retrieve-data-action="contexto.attrs.retrievedData"
  :rules="rules"
  :show-clear="contexto.attrs.showClear ?? false"
  @change="handleInput"
/>
</template>
