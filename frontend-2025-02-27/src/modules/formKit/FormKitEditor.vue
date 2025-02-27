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
<Editor
  :id="contexto.id"
  v-model="model"
  :class="context.attrs.class"
  :disabled="contexto.disabled"
  :editor-style="context.attrs.editorStyle"
  :name="context.name"
  :placeholder="context.attrs.placeholder"
  :readonly="context.attrs.readonly"
  :rules="rules"
  @text-change="handleInput"
/>
</template>
