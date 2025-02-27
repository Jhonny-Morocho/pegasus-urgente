<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Recepción de Partes"
    steps-action-btns
  />

  <AppSteps
    class="col-4"
    :model="registroParteFormularioSteps"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :button-back-disabled="$route.path === '/ingreso/registrar-parte/registro'"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { onMounted } from 'vue'
import { useOficinaPartesStore } from '@/modules/global/composables/'

const { oficinaPartes_LIMPIAR_PARTES } = useOficinaPartesStore()

const route = useRoute()
const router = useRouter()

const registroParteFormularioSteps = [
  {
    label: 'Registro Parte Denuncia',
    to: '/ingreso/registrar-parte/registro'
  },
  {
    label: 'Detalle Parte Denuncia',
    to: '/ingreso/registrar-parte/detalle-denuncia'
    // command: () => console.log('command')
  }
]

oficinaPartes_LIMPIAR_PARTES()
onMounted(() => {
  router.push('/ingreso/registrar-parte/registro')
})

function handleBackStep () {
  const denunciaFisicaFormulatioStepIndexToBack = registroParteFormularioSteps.findIndex((s) => s.to === route.path)

  console.log(denunciaFisicaFormulatioStepIndexToBack, 'form')

  router.push(registroParteFormularioSteps[denunciaFisicaFormulatioStepIndexToBack - 1].to)
}

function handleNextStep (to) {
  router.push(to)
}

function salirABandeja () {
  router.push({ name: 'BandejaSolicitarDocumentacion' })
}

const itemsMenuSuperior = [
  {
    label: 'Salir',

    icon: 'pi pi-sign-out',
    command: () => salirABandeja()
  }
]
</script>
