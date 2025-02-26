<template>
<section class="page-header">
  <div class="">
    <h2>
      {{ pageTitle }}
    </h2>
    <p class="mt-2">
      {{ pageSubtitle }}
    </p>
    <p class="mt-2">
      {{ pageDescription }}
    </p>
  </div>
  <div
    v-if="!hideItemsMenuSuperior"
    class="btns-header shadow-3"
  >
    <Menubar
      class="prueba"
      :model="itemsMenuSuperior"
    />
  </div>
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import Menubar from 'primevue/menubar'
import { propTypes } from '../types/prop.types'

defineProps({
  pageTitle: propTypes.string,
  pageSubtitle: propTypes.string,
  itemsMenuSuperior: propTypes.array,
  hideItemsMenuSuperior: Boolean,
  pageDescription: propTypes.string
})
</script>

<style lang="scss">
.prueba {
  .p-menubar-root-list {
    .p-menuitem {
      a {
        /* background-color: rgb(127, 172, 255); */
        font-size: 13px !important;
        font-weight: 500;
        span {
          color: #4c5b73 !important;
        }
        &:hover span {
          color: #3f51b5 !important;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.p-menubar {
  padding: 0;
  height: 2.2rem;
}

.p-menu .p-submenu-header {
  display: none !important;
}
.page-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
  align-items: flex-start;
}

@media (min-width: 920px) {
  .page-header {
    flex-direction: row;
    justify-content: space-between;
  }
}
.btns-header {
  display: flex;
  background-color: #e4e8ef;
  border-radius: 4px;
  & .p-button-text {
    color: #4c5b73;
  }

  &__separator {
    width: 1px;
    background-color: #d0d5de;
    margin: 4px 0;
  }
}
@media (min-width: 920px) {
  .btns-header {
    margin: 0 1%;
    display: flex;
    margin-top: 0;
    flex-direction: row;
    margin-bottom: 4px;
    align-items: flex-start;
  }
}
</style>
