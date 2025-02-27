<template>
<section>
  <PageHeader
    page-title="Solicitar Documentación Faltante"
    steps-action-btns
    @action:exit="$router.push('/ingreso/solicitar-documentacion')"
  />

  <AppSteps
    class="col-4"
    :model="solicitarDocumentacionSteps"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const solicitarDocumentacionSteps = [
  {
    label: 'Documentos a Solicitar',
    to: '/ingreso/solicitar-documentacion/faltante/documentos-solicitar'
  },
  {
    label: 'Plantilla',
    to: '/ingreso/solicitar-documentacion/faltante/plantilla-documentos-solicitar'
  }
]

function handleBackStep () {
  router.push('/ingreso/solicitar-documentacion')
}

function handleNextStep (to) {
  router.push(to)
}
</script>
