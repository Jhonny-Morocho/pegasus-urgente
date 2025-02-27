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
    function handleSelect () {
      props.context?.node.input(model.value)
    }
    return {
      handleInput,
      contexto: props.context,
      rules,
      model,
      handleSelect
    }
  }
}
</script>

<template>
<AppCalendar
  :id="contexto.id"
  v-model="model"
  :class="contexto.attrs.class"
  :date-format="contexto.attrs.dateFormat"
  :disabled="contexto.disabled"
  :label="contexto.attrs.appLabel"
  :name="contexto.node.name"
  :rules="rules"
  :year-range="contexto.attrs.yearRange"
  @date-select="handleSelect"
  @input="handleInput"
/>
</template>
