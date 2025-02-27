<template>
<section class="app-banner">
  <AppProgressSpinner
    background-color="transparent"
    size="200px"
  />
</section>
</template>
<!-- a -->
<script>
import { defineComponent } from 'vue'
import AppProgressSpinner from './AppProgressSpinner.vue'

export default defineComponent({
  name: 'AppBanner',
  components: { AppProgressSpinner }
})
</script>

<style lang="scss" scoped>
.app-banner {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    max-width: 360px;
  }
}
</style>
