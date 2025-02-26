<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Salida Transferencia Dineros en Caja Fuerte"
  />
  <AppSteps :model="itemSteps" />
  <div class="wrapper-routes">
    <RouterView
      @next-step="handleNextStep"
    />
  </div>
  <AppBtnsSteps
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables/useItemsMenuSuperiorCadena.js'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useRoute, useRouter } from 'vue-router'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(exportar, actualizar)

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

const itemSteps = [
  {
    label: 'Salida Transferencia Dineros Caja Fuerte',
    to: '/custodia/custodio/especie-dinero/salida-transferencia-dineros-caja-fuerte/step-transferencia-dineros-caja-fuerte'
  },
  {
    label: 'Acta Salida por Transferencia',
    to: '/custodia/custodio/especie-dinero/salida-transferencia-dineros-caja-fuerte/step-acta-salida-por-transferencia'
  }
]

const router = useRouter()

const route = useRoute()

function handleBackStep () {
  const salidaTransferenciaIndexToBack = itemSteps.findIndex((s) => s.to === route.path)
  if (salidaTransferenciaIndexToBack === 0) {
    router.push('/custodia/custodio')
  } else {
    router.push(itemSteps[salidaTransferenciaIndexToBack - 1].to)
  }
}

function handleNextStep (to, form) {
  console.log('dataForm', form)
  router.push(to)
}
</script>
