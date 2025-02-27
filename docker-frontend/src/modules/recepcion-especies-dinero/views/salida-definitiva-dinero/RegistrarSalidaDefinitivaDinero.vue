<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar Salida Definitiva"
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
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import { useConfirmDialog } from '@/modules/common/composables'

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
    label: 'Registrar Salida Definitiva',
    to: `/custodia/custodio/registrar-salida-definitiva-dinero/registrar-salida-definitiva`
  },
  {
    label: 'Generar Comprobante de Entrega',
    to: `/custodia/custodio/registrar-salida-definitiva-dinero/generar-comprobante-entrega`
  }
]

const { launchConfirmDialog } = useConfirmDialog()

function handleBackStep () {
  launchConfirmDialog({
    header: 'Registrar Salida Definitiva',
    message: 'Se encuentra por salir con un Registro Salida Definitiva inconcluso.',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Salir',
    acceptIcon: '',
    accept: () => {
      const ingresoEspeciesDineroIndexToBack = ingresoEspeciesYDinerosSteps.findIndex((s) => s.to === route.path)
      if (ingresoEspeciesDineroIndexToBack === 0) {
        router.push('/custodia/custodio')
      } else {
        router.push(ingresoEspeciesYDinerosSteps[ingresoEspeciesDineroIndexToBack - 1].to)
      }
    }
  })
}

function handleNextStep (data) {
  if (data === 'registrar-salida') {
    launchConfirmDialog({
      header: 'Registrar Salida Definitiva',
      message: '¿Está seguro de Registrar Salida Definitiva?',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Aceptar',
      acceptIcon: '',
      accept: () => {
        router.push('/custodia/custodio')
      }
    })
  } else {
    router.push(data)
  }
}
</script>
