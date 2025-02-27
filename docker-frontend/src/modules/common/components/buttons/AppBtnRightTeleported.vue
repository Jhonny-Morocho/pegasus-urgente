<template>
<Teleport
  v-if="isMounted"
  to="#btn-right-teleported"
>
  <slot v-if="$slots.default" />
  <Button
    v-else
    class="buttons-steps__actions--right"
    icon-pos="right"
    :label="label"
    v-bind="{...$attrs, class: undefined}"
  />
</Teleport>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'

defineProps({
  label: {
    type: String,
    default: ''
  }
})

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<style lang="scss" scoped>
.buttons-steps {
  &__actions {
    &--right {
      background-color: #A1ABBA;
    }
  }
}
</style>
