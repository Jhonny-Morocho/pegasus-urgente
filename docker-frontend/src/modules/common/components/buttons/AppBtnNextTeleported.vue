<template>
<Teleport
  v-if="isMounted"
  to="#btn-next-teleported"
>
  <Button
    class="buttons-steps__actions--next px-4"
    :icon="noIcon ? undefined : 'pi pi-arrow-right'"
    icon-pos="right"
    :label="label"
    v-bind="$attrs"
  />
</Teleport>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'

defineProps({
  label: {
    type: String,
    default: 'Siguiente'
  },
  noIcon: Boolean
})

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>
<script>
export default {
  inheritAttrs: false
}
</script>
<style lang="scss" scoped>
.buttons-steps {
  &__actions {
    &--next {
      background-color: $primary-color;
      transition: all 0.5s ease;

      &:hover{
        background-color: $primary-color-hover !important;
      }
    }
  }
}
</style>
