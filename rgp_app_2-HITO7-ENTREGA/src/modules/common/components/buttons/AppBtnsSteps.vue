<template>
<section class="buttons-steps z-5">
  <article class="buttons-steps__actions">
    <div>
      <Button
        v-if="!noButtonBack"
        class="buttons-steps__actions--back px-4"
        :disabled="buttonBackDisabled"
        icon="pi pi-arrow-left"
        label="Volver"
        :loading="$attrs?.loading"
        @click="emit('back-step')"
      />
    </div>
    <div class="buttons-steps__actions--right">
      <div id="btn-right-teleported" />
      <div
        id="btn-next-teleported"
        class="ml-3"
      />
    </div>
  </article>
</section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  buttonBackDisabled: Boolean,
  noButtonBack: Boolean
})

const emit = defineEmits(['back-step'])
</script>

<style lang="scss" scoped>
.buttons-steps {
  position: fixed;
  bottom: 0;
  height: 55px;
  width: calc(100% - #{$sidebar-width});
  transform: translateX(-#{$page-content-padding});
  background-color: #dee2e6;

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding-right: 1rem;
    padding-left: 1rem;

    &--back {
      background-color: $secondary-color;
      transition: all 0.5s ease;
      &:hover {
        background-color: $secondary-color-hover;
      }
    }
    &--right {
      display: flex;
    }
  }
}

@media (min-width: 920px) {
  .buttons-steps {
    position: fixed;
    bottom: 0;
    height: 55px;
    background-color: #dee2e6;

    &__actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;

      &--back {
        background-color: $secondary-color;
        transition: all 0.5s ease;
        &:hover {
          background-color: $secondary-color-hover;
        }
      }
      &--right {
        display: flex;
      }
    }
  }
}
</style>
