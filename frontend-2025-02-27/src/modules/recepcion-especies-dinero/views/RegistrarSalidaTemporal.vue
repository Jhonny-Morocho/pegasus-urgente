<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar Salida Temporal"
  />

  <AppSteps
    class="mr-4 col-6"
    :model="registroSalidaTemporalSteps"
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

const registroSalidaTemporalSteps = [
  {
    label: 'Registrar Salida Temporal',
    to: `/custodia/custodio/registrar-salida-temporal/registrar-salida-temporal-de-especie`
  },
  {
    label: 'Acta Salida Temporal',
    to: `/custodia/custodio/registrar-salida-temporal/acta-salida-temporal`
  }
]

function handleBackStep () {
  const registroSalidaTemporalIndexToBack = registroSalidaTemporalSteps.findIndex((s) => s.to === route.path)
  if (registroSalidaTemporalIndexToBack === 0) {
    router.push('/custodia/custodio')
  } else {
    launchConfirmDialog({
      header: 'Registrar Ingreso',
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
