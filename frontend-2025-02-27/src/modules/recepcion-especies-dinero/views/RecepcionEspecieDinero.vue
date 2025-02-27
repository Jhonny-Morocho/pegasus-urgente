<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Recepción de Especies y Dinero"
  />

  <AppSteps
    class="mr-4"
    :model="recepcionEspeciesYDinerosSteps"
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
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import ModalAdvertenciaRecepcionInconclusa from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/modals/ModalAdvertenciaRecepcionInconclusa.vue'
import { useAppDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)
const { $hasSomeRoles } = useAppGlobalProperties()
const { launchDialog } = useAppDialog()
const router = useRouter()
const route = useRoute()
const usuario = ref('')
const subtitulo = ref('')

function actualizar () {
  console.log('actualizar')
}

function exportar () {
  console.log('exportar')
}

onMounted(() => {
  if ($hasSomeRoles(['admin'])) {
    usuario.value = 'Custodio'
    subtitulo.value = 'Nuevo Procedimiento'
  } else {
    usuario.value = 'Policía Turno'
    subtitulo.value = 'Nuevo Procedimiento'
  }
})

const recepcionEspeciesYDinerosSteps = [
  {
    label: 'Seleccionar NUE a recepcionar',
    to: `/custodia/custodio/nueva-recepcion/identificacion-nue`
  },
  {
    label: 'Listado de Especies Incautadas Pendientes de Recepción',
    to: `/custodia/custodio/nueva-recepcion/especies-incautadas-pendientes-de-recepcion`
  },
  {
    label: 'Comprobante de Recepción/Rechazo',
    to: `/custodia/custodio/nueva-recepcion/comprobante-de-recepcion-rechazo`
  }
]

function handleBackStep () {
  if (route.path === '/custodia/custodio/nueva-recepcion/especies-incautadas-pendientes-de-recepcion') {
    launchDialog({
      component: ModalAdvertenciaRecepcionInconclusa,
      header: `En Proceso de Recepción`,
      width: '30%',
      confirmLabel: 'Salir',
      accept: () => {
        router.push('/custodia/custodio')
        // Agregan funcionalidad que marque la tarea como inconclusa en la bandeja
      }
    })
  } else {
    const recepcionEspeciesDineroIndexToBack = recepcionEspeciesYDinerosSteps.findIndex((s) => s.to === route.path)
    console.log(recepcionEspeciesDineroIndexToBack)
    if (recepcionEspeciesDineroIndexToBack === 0) {
      router.push('/custodia/custodio')
    } else {
      router.push(recepcionEspeciesYDinerosSteps[recepcionEspeciesDineroIndexToBack - 1].to)
    }
  }
}

function handleNextStep (to) {
  router.push(to)
}
</script>
