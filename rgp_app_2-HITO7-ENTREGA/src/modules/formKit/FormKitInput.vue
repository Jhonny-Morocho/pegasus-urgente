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
    const rules = useFormkitRules(props.context.attrs.rules)
    const model = ref()
    onMounted(() => {
      const inputValue = props.context.value
      if (inputValue) model.value = inputValue
    })
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
<AppInput
  :id="contexto.id"
  v-model="model"
  :class="contexto.attrs.class"
  :disabled="contexto.disabled"
  :label="contexto.attrs.appLabel"
  :name="contexto.node.name"
  :rules="rules"
  @input="handleInput"
/>
</template>
