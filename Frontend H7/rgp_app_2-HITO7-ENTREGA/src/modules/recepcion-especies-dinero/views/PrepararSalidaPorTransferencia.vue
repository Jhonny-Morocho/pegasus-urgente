<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperior"
  page-title="Salida Transferencia Dineros en Depósito"
/>
<AppSteps
  class="mr-4 col-4"
  :model="salidaTransferenciaDinerosDepositoSteps"
/>
<div class="wrapper-routes">
  <RouterView @next-step="handleNextStep" />
</div>
<AppBtnsSteps
  :button-back-disabled="$route.path === `/custodia`"
  @back-step="handleBackStep"
/>
</template>

<script setup>
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useConfirmDialog } from '@/modules/common/composables'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import { useRoute, useRouter } from 'vue-router'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const router = useRouter()
const route = useRoute()
const { launchConfirmDialog } = useConfirmDialog()
function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}
const salidaTransferenciaDinerosDepositoSteps = [
  {
    label: 'Revisar Solicitud',
    to: `/custodia/custodio/salida-transferencia-dinero/revisar-solicitud`
  },
  {
    label: 'Acta de Salida por Transferencia',
    to: `/custodia/custodio/salida-transferencia-dinero/acta-salida-transferencia`
  }
]

function handleBackStep () {
  const salidaTransferenciaDinerosDepositoToBack = salidaTransferenciaDinerosDepositoSteps.findIndex((s) => s.to === route.path)
  if (salidaTransferenciaDinerosDepositoToBack === 0) {
    router.push('/custodia/custodio')
  } else {
    launchConfirmDialog({
      header: 'Salida popr Transferencia de Dineros',
      message: `Se encuentra ppor salir con un Registro de Salida por transferencia de Dineros Inconcluso`,
      accept: () => {
        router.push('/custodia/custodio')
      }

    })
    // router.push(salidaTransferenciaDinerosDepositoSteps[salidaTransferenciaDinerosDepositoToBack - 1].to)
  }
}
function handleNextStep (to) {
  router.push(to)
}
</script>
