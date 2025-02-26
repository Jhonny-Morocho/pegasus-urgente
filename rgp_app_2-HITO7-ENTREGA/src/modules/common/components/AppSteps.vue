<template>
<Steps
  ref="steps"
  class="steps"
  v-bind="$attrs"
  :readonly="!$hasSomeRoles(['admin'])"
/>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const $route = useRoute()

const steps = ref(null)

watch($route, () => {
  removeScrollEvent()

  setTimeout(() => {
    nextEl = stepsEl.nextSibling
    window.onscroll = scrollFn

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 1)
})

let nextEl, stepsEl

const sticky = 80

function scrollFn () {
  if (window.scrollY > sticky) {
    stepsEl.classList.add('steps__sticky', 'shadow-2')
    nextEl.classList.add('steps__sticky__next-sibling')
  } else {
    stepsEl.classList.remove('steps__sticky', 'shadow-2')
    nextEl.classList.remove('steps__sticky__next-sibling')
  }
}

function removeScrollEvent () {
  window.removeEventListener('scroll', scrollFn)
}

onMounted(() => {
  stepsEl = steps.value.$el
  nextEl = stepsEl.nextSibling

  window.onscroll = scrollFn
})

onBeforeUnmount(() => {
  removeScrollEvent()
})
</script>

<style lang="scss">
.steps {
  &.p-steps {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    z-index: 0.2 !important;
  }

  ul > li {
    align-items: baseline !important;
  }

  a.router-link-active-exact > span.p-steps-number {
    background-color: $secondary-color !important;
  }

  a.p-menuitem-link.router-link-active-exact,
  span.p-menuitem-link,
  a.p-menuitem-link {
    display: flex !important;
    flex-direction: column !important;
    padding: 8px 0 !important;

    span.p-steps-number {
      margin-bottom: 4px;
      z-index: 0 !important;
    }
    & span.p-steps-title {
      text-align: center;
      max-width: 7rem;
      white-space: normal;
    }
  }

  &__sticky {
    z-index: 100;
    background-color: white;
    position: fixed !important;
    width: calc(100% - #{$sidebar-width});
    margin-left: -#{$page-content-padding};
    margin-right: -#{$page-content-padding};
    padding-left: $page-content-padding;
    padding-right: $page-content-padding;
    top: $navbar-height;

    transition: box-shadow 0.25s;

    &__next-sibling {
      margin-top: 102px;
    }
  }
}
.p-tabview .p-tabview-panels {
  margin-right: 9% !important;
}
.p-tabview-nav-content {
  margin-right: 10% !important;
}
.p-steps .p-steps-item.p-disabled {
  z-index: 0 !important;
}
@media (min-width: 960px) {
  .p-tabview-nav-content {
    width: 100% !important;
  }
  .p-tabview .p-tabview-panels {
    width: 100% !important;
  }
}
</style>
