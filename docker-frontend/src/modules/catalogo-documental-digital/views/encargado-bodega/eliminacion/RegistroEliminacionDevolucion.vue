<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registro de devolución de documento físico"
  />

  <AppSteps
    :model="stepsEliminarDocumento"
    :readonly="true"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>
  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
// COMPONENTS

// UTILS

import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

// COMPOSABLES

// VALUES

const itemsMenuSuperior = [

  {
    label: 'Actualizar',
    icon: 'pi pi-replay'
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download'
  }
]
const stepsEliminarDocumento = [
  {
    label: 'Ingresar datos de la eliminación de documento físico',
    to: { name: 'CddRDDDatosDevolucion' }
  },
  {
    label: 'Firmar Comprobante',
    to: { name: 'CddRDDFirmarComprobante' }
  }
]
// LOGIC

</script>

<style >
.steps a.p-menuitem-link.router-link-active-exact span.p-steps-title, .steps span.p-menuitem-link span.p-steps-title, .steps a.p-menuitem-link span.p-steps-title  {
  max-width: 14rem
}
.p-steps ul {
  margin-right: 1300px;
}
</style>
