<template>
<Steps v-bind="$attrs">
  <template #item="{item}">
    <section class="flex flex-column align-items-center text-center justify-content-center">
      <button
        class="step-number"
        :class="currentStep === item.key ? 'active' : ''"
      >
        {{ item.key }}
      </button>
      <span
        class="step-label"
        :class="currentStep === item.key ? 'active' : ''"
      >
        {{ item.label }}
      </span>
    </section>
  </template>
</Steps>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  currentStep: propTypes.number
})
</script>
<style lang="scss" scoped>
.step-number{
  min-width: 1.714rem;
  height: 1.714rem;
  padding: 0;
  border: none;
  border-radius: 100% ;
  font-size: 0.857rem;
  background-color: #9e9d9e;
  color: #ffffff;
  margin-bottom: 10px;
  line-height: 1.714rem;
  text-align: center;
    &.active{
        background-color: $secondary-color;
        color: #000;
        font-weight: bold;
    }
}

.step-label{
    font-size: 14px;
    &.active{
     font-weight: bold;
    }
}
</style>
