<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Salida por Transferencia Especies/Dinero "
  />

  <AppSteps
    class="mr-4 col-4"
    :model="salidaPorTransferenciaDeEspeciesSteps"
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

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import { useConfirmDialog } from '@/modules/common/composables'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { launchConfirmDialog } = useConfirmDialog()

const router = useRouter()
const route = useRoute()

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

const salidaPorTransferenciaDeEspeciesSteps = [
  {
    label: 'Revisar Solicitud',
    to: `/custodia/custodio/salida-por-transferencia-de-especies/revisar-solicitud-salida-transferencia`
  },
  {
    label: 'Acta Salida por Transferencia',
    to: `/custodia/custodio/salida-transferencia-especie/acta-salida-por-transferencia-especie`
  }
]

function handleBackStep () {
  const salidaPorTransferenciaDeEspeciesIndexToBack = salidaPorTransferenciaDeEspeciesSteps.findIndex((s) => s.to === route.path)
  if (salidaPorTransferenciaDeEspeciesIndexToBack === 0) {
    router.push('/custodia/custodio')
  } else {
    launchConfirmDialog({
      header: 'Registro de Salida por Transferencia',
      message: 'Se encuentra por salir con un Registro de Salida inconcluso.',
      acceptLabel: 'Salir',
      accept: () => {
        router.push({ name: 'BandejaCustodio' })
      }
    })
  }
}

function handleNextStep (to) {
  router.push(to)
}

</script>
