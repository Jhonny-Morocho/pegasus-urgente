
<script>
export default {
  props: {
    context: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props) {
    return {
      contexto: props.context
    }
  }
}

</script>

<template>
<AppFieldset
  :id="contexto.id"
  :class="contexto.attrs.class"
  :legend="contexto.attrs.legend"
>
  <FormKitSchema :schema="contexto.attrs.schema" />
</AppFieldset>
</template>
