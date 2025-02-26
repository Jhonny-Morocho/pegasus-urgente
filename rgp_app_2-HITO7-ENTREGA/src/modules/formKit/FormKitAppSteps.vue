<script>
import { onMounted, ref } from 'vue'
// Components
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
      const value = props.context.value
      if (value) model.value = value
    })

    return {
      contexto: props.context,
      model
    }
  }
}

</script>

<template>
<AppSteps :model="model" />
</template>
