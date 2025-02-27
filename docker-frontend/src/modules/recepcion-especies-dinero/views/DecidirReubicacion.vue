<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-title="flujoReal !== 'busqueda' ? `Reubicar y Reetiquetar Especie por ${(flujoReal.charAt(0).toUpperCase() + flujoReal.slice(1))}` : 'Reubicar Especie/Dinero'"
  />

  <AppSteps
    class="mr-4"
    :model="flujoReal !== 'busqueda' ? decidirReubicacionSteps : decidirReubicacionConBusqeudaRueSteps"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :button-back-disabled="$route.path === `/custodia/custodio`"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useBandejaCustodioStore, useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const { $hasSomeRoles } = useAppGlobalProperties()

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

const { flujo } = useBandejaCustodioStore()

const flujoReal = router.currentRoute.value.fullPath.includes('busqueda') ? 'busqueda' : flujo

const decidirReubicacionSteps = [
  {
    label: `Datos Causa a ${flujoReal.value?.charAt(0).toUpperCase() + flujoReal.value?.slice(1)} / Principal`,
    to: '/custodia/custodio/decidir-reubicacion/datos-causa-agrupar-principal'
  },
  {
    label: 'Seleccionar Reubicación',
    to: '/custodia/custodio/decidir-reubicacion/seleccionar-reubicacion'
  },
  {
    label: 'Generar Etiqueta',
    to: '/custodia/custodio/decidir-reubicacion/generar-etiqueta'
  }
]

const decidirReubicacionConBusqeudaRueSteps = [
  {
    label: 'Búsqueda por RUE',
    to: '/custodia/custodio/decidir-reubicacion/busqueda-por-rue'
  },
  {
    label: 'Seleccionar Reubicación',
    to: '/custodia/custodio/decidir-reubicacion/seleccionar-reubicacion'
  },
  {
    label: 'Generar Etiqueta',
    to: '/custodia/custodio/decidir-reubicacion/generar-etiqueta'
  }
]

function handleBackStep () {
  const array = flujo.value === 'busqueda' ? decidirReubicacionConBusqeudaRueSteps : decidirReubicacionSteps
  const decidirReubicacionIndexToBack = array.findIndex((s) => s.to === route.path)
  if (decidirReubicacionIndexToBack === 0) {
    router.push('/custodia/custodio')
  } else {
    router.push(array[decidirReubicacionIndexToBack - 1].to)
  }
}

function handleNextStep (to) {
  router.push(to)
}
</script>
