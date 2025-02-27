<template>
<section
  id="loaderContainer"
  class="mt-3 relative"
  :style="containerStyles"
>
  <Skeleton size="100%" />
  <AppProgressSpinner id="loader" />
</section>
</template>
<script>
import { defineComponent } from 'vue'
import AppProgressSpinner from '@/modules/common/components/AppProgressSpinner.vue'

export default defineComponent({
  name: 'LoaderSkeleton',
  components: { AppProgressSpinner },
  props: {
    height: {
      default: '50vh',
      type: String
    }
  },
  computed: {
    containerStyles () {
      return `height: ${this.height}; width: 100%;`
    }
  }
})
</script>
<style lang="scss" scoped>
#loader {
  position: absolute;
  top: 50%;
  right: 50%;
  align-self: center;
  transform: translate(50%, -50%);
}
</style>
