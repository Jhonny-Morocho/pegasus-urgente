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
<AppInputMask
  :id="contexto.id"
  v-model="model"
  :class="contexto.attrs.class"
  :label="contexto.attrs.appLabel"
  :mask="contexto.attrs.mask"
  :name="contexto.name"
  :rules="rules"
  @input="handleInput"
/>
</template>
