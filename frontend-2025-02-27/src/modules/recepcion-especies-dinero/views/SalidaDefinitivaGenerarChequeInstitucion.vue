<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Salida Definitiva Dineros: Generar Cheque para institución"
  />

  <AppSteps
    class="mr-4"
    :model="salidaDefinitivaGenerarChequeinstitucionSteps"
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

import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import { useAppGlobalProperties } from '@/modules/common/composables'

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

const salidaDefinitivaGenerarChequeinstitucionSteps = [
  {
    label: 'Validar Dineros para Generar Cheque',
    to: `/custodia/custodio/salida-definitiva-generar-cheque-institucion/validar-dineros-generar-cheque`
  },
  {
    label: 'Solicitar Liquición de Depósitos a Plazo',
    to: `/custodia/custodio/salida-definitiva-generar-cheque-institucion/solicitar-liquidacion-deposito-plazo`
  },
  {
    label: 'Registrar Cheque',
    to: `/custodia/custodio/salida-definitiva-generar-cheque-institucion/registrar-cheque`
  }
]
function handleBackStep () {
  const salidaDefinitivaGenerarChequeinstitucionToBack = salidaDefinitivaGenerarChequeinstitucionSteps.findIndex((s) => s.to === route.path)
  if (salidaDefinitivaGenerarChequeinstitucionToBack === 0) {
    router.push('/custodia/custodio')
  } else {
    router.push(salidaDefinitivaGenerarChequeinstitucionSteps[salidaDefinitivaGenerarChequeinstitucionToBack - 1].to)
  }
}

function handleNextStep (to) {
  router.push(to)
}
</script>
