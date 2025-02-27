<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Ingreso de Especies"
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
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'

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

const ingresoEspeciesYDinerosSteps = [
  {
    label: 'Ingresar NUE',
    to: `/custodia/custodio/ingresar-transferencia-especie/ingreso-de-nue`
  },
  {
    label: 'Ingresar datos adicionales',
    to: `/custodia/custodio/ingresar-transferencia-especie/ingresar-datos-adicionales`
  },
  {
    label: 'Asignar Ubicación',
    to: `/custodia/custodio/ingresar-transferencia-especie/asignar-ubicacion`
  },
  {
    label: 'Generar Etiqueta',
    to: '/custodia/custodio/ingresar-transferencia-especie/generar-etiqueta-ingreso'
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
