<template>
<main>
  <TheNavbar />

  <div class="page-wrapper">
    <TheSidebar
      v-if="showHide"
      @show-hide-sidebar="showHideSideBar"
    />

    <div :class="showHide ? 'page-content-sb' : 'page-content'">
      <RouterView />
    </div>
  </div>

  <Toast position="bottom-center" />

  <ConfirmDialog />

  <AppDialog />

  <DynamicDialog />
</main>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStore } from '@/modules/session/composables'
import { requestUtil } from '@/utils'

const { session_getUserInfo } = useSessionStore()

await requestUtil({ // NO QUITAR EL AWAIT
  action: session_getUserInfo
})

const showHide = ref(true)

function showHideSideBar (d) {
  showHide.value = false
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
}
.page-content-sb {
  margin-left: $sidebar-width;
  margin-top: $navbar-height;
  padding: $page-content-padding;
  width: calc(100% - 155px);
}
.page-content {
  margin-left: 0;
  margin-top: $navbar-height;
  padding: $page-content-padding;
  width: 100%
}
</style>
