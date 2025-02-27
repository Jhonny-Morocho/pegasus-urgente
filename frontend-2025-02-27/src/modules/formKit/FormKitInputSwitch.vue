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
<label
  v-if="contexto.attrs.labelLeft"
  class="mr-2"
  :for="contexto.id"
>{{ contexto.attrs.labelLeft }}</label>

<InputSwitch
  :id="contexto.id"
  v-model="model"
  :class="contexto.attrs.class"
  :false-value="contexto.attrs.falseValue ?? undefined"
  :name="contexto.name"
  :true-value="contexto.attrs.trueValue ?? undefined"
  @input="handleInput"
/>
<label
  v-if="contexto.attrs.labelRight"
  class="ml-2"
  :for="contexto.id"
>{{ contexto.attrs.labelRight }}</label>
</template>
