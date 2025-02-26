<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar Inspección Visual"
  />

  <AppSteps
    class="mr-4"
    :model="ingresoEspeciesYDinerosSteps"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :button-back-disabled="$route.path === `/custodia`"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const router = useRouter()
const route = useRoute()

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

const ingresoEspeciesYDinerosSteps = [
  {
    label: 'Datos de Inspección',
    to: `/custodia/custodio/registrar-inspeccion-visual/datos-inspeccion-visual`
  },
  {
    label: 'Comprobante de Inspección Visual',
    to: `/custodia/custodio/registrar-inspeccion-visual/comprobante-inspeccion-visual`
  },
  {
    label: 'Comprobante de Término de Inspección Visual',
    to: `/custodia/custodio/registrar-inspeccion-visual/comprobante-termino-inspeccion-visual`
  }
]
function handleBackStep () {
  const ingresoEspeciesDineroIndexToBack = ingresoEspeciesYDinerosSteps.findIndex((s) => s.to === route.path)
  if (ingresoEspeciesDineroIndexToBack === 0) {
    router.push('/custodia/custodio')
  } else {
    router.push(ingresoEspeciesYDinerosSteps[ingresoEspeciesDineroIndexToBack - 1].to)
  }
}

function handleNextStep (to) {
  router.push(to)
}
</script>
