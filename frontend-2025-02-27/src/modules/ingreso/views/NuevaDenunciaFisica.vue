<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-subtitle="Parte/Denuncia"
    page-title="Digitador"
  />

  <AppSteps :model="denunciaFisicaFormulatioStep" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :button-back-disabled="$route.path === '/ingreso/denuncia-fisica/nueva-denuncia/registro-parte-denuncia'"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

const route = useRoute()
const router = useRouter()

const denunciaFisicaFormulatioStep = [
  {
    label: 'Identificacion Denuncia',
    to: '/ingreso/denuncia-fisica/nueva-denuncia/identificacion-denuncia'
  },
  {
    label: 'Sujetos Intervinientes',
    to: '/ingreso/denuncia-fisica/nueva-denuncia/sujetos-intervinientes'
  },
  {
    label: 'Delitos',
    to: '/ingreso/denuncia-fisica/nueva-denuncia/delitos'
  },
  {
    label: 'Relaciones',
    to: '/ingreso/denuncia-fisica/nueva-denuncia/relaciones'
  },
  {
    label: 'Especies y Dinero',
    to: '/ingreso/denuncia-fisica/nueva-denuncia/especies-dinero'
  },
  {
    label: 'Relato',
    to: '/ingreso/denuncia-fisica/nueva-denuncia/relato'
  },
  {
    label: 'Documentos',
    to: '/ingreso/denuncia-fisica/nueva-denuncia/documentos'
  }
]

function handleBackStep () {
  const denunciaFisicaFormulatioStepIndexToBack = denunciaFisicaFormulatioStep.findIndex((s) => s.to === route.path)

  !denunciaFisicaFormulatioStepIndexToBack ? router.push('/ingreso/denuncia-fisica') : router.push(denunciaFisicaFormulatioStep[denunciaFisicaFormulatioStepIndexToBack - 1].to)
}

function handleNextStep (to) {
  router.push(to)
}

function salirABandeja () {
  router.push('/ingreso/denuncia-fisica')
}

const itemsMenuSuperior = [
  {
    label: 'Salir',

    icon: 'pi pi-sign-out',
    command: () => salirABandeja()
  }
]
</script>
