<template>
<RouterView v-slot="{ Component }">
  <Transition name="nested">
    <Suspense
      v-if="Component"
      timeout="0"
    >
      <template #default>
        <Component :is="Component" />
      </template>
      <template #fallback>
        <AppBanner />
      </template>
    </Suspense>
  </Transition>
</RouterView>
</template>

<script setup>
import { usePrimeVue } from 'primevue/config'

import { useAppToast } from './modules/common/composables'

import store from '@/store'
// hará watch al estado de toast global puesto en la store common
// para ser usado desde cualquier archivo mediante el cambio de estado
useAppToast(true)

// configura traducciones de primevue
const primevue = usePrimeVue()
primevue.config.locale.clear = 'Limpiar'
primevue.config.locale.today = 'Hoy'
primevue.config.locale.emptyMessage = 'No hay opciones disponibles'
primevue.config.locale.monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
primevue.config.locale.dayNamesMin = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
</script>

<script>
export default {
  name: 'AppComponent',

  beforeCreate () {
    if (!store.state.session.user) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.p-fieldset .p-fieldset-legend > a {
  background-color: #e9ecef !important;
}
.p-fieldset .p-fieldset-legend {
  background-color: #e9ecef !important;
}
.p-tabview{
  padding: 1rem 0;
}
.p-tabview .p-tabview-panels {
  padding: 2rem 0rem 0 0rem !important;
  margin-bottom: 6%;
}
.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button {
  background: $primary-color;
  transition: all 0.4s ease;
}
.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button:hover {
  background: $primary-color-hover;
}
/* rules that target nested elements */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.5s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}
</style>
