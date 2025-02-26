<script>
import { onMounted, ref } from 'vue'
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

    function handleInput () {
      props.context?.node.input(model.value)
    }
    return {
      handleInput,
      contexto: props.context,
      model
    }
  }
}

</script>

<template>
<AppCheckbox
  :id="contexto.id"
  v-model="model"
  :binary="contexto.attrs.binary"
  :class="contexto.attrs.class"
  :disabled="contexto.disabled"
  :label="contexto.attrs.appLabel"
  :label-left="contexto.attrs.labelLeft"
  :name="contexto.node.name"
  @input="handleInput"
/>
</template>
