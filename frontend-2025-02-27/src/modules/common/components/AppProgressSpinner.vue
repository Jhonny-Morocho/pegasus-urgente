<template>
<div
  class="loader_container"
  :style="containerStyles"
>
  <ProgressSpinner
    animation-duration="1s"
    :fill="backgroundColor"
    stroke-width="3"
    :style="'width: 100%; height: 100%;'"
  />
  <img
    alt=""
    class="loader_img"
    src="@/assets/images/logoFiscaliadeChile.svg"
  >
</div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppProgressSpinner',
  props: {
    backgroundColor: {
      type: String,
      default: '#adb5bd'
    },
    size: {
      type: String,
      default: '90px'
    }
  },
  computed: {
    containerStyles () {
      return `width: ${this.size}; height: ${this.size};`
    }
  }
})
</script>
<style lang="scss">
.loader_container {
  position: relative;
  width: fit-content;
  margin: 0 auto;

  .loader_img {
    width: 55%;
    height: 55%;
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
  }
}

@keyframes p-progress-spinner-color {
  0% {
    stroke: #f5dfca;
  }
  100% {
    stroke: #febc7e;
  }
}
</style>
