<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-subtitle="Nueva Atencion"
    page-title="Fiscal"
    steps-denuncia-de-oficio
    @action:exit="salirABandeja"
  />

  <AppSteps :model="denunciaOficioSteps" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

const route = useRoute()
const router = useRouter()

const denunciaOficioSteps = [
  {
    label: 'Identificacion Denuncia',
    to: '/ingreso/denuncia-oficio/nueva-denuncia/identificacion-denuncia'
  },
  {
    label: 'Sujetos Intervinientes',
    to: '/ingreso/denuncia-oficio/nueva-denuncia/sujetos-intervinientes'
  },
  {
    label: 'Delitos',
    to: '/ingreso/denuncia-oficio/nueva-denuncia/delitos'
  },
  {
    label: 'Relaciones',
    to: '/ingreso/denuncia-oficio/nueva-denuncia/relaciones'
  },
  {
    label: 'Especies y Dinero',
    to: '/ingreso/denuncia-oficio/nueva-denuncia/especies-dinero'
  },
  {
    label: 'Relato',
    to: '/ingreso/denuncia-oficio/nueva-denuncia/relato'
  },
  {
    label: 'Documentos',
    to: '/ingreso/denuncia-oficio/nueva-denuncia/documentos'
  }
]

function handleBackStep () {
  const denunciaOficioStepIndexToBack = denunciaOficioSteps.findIndex((s) => s.to === route.path)

  !denunciaOficioStepIndexToBack ? router.push('/ingreso/denuncia-oficio') : router.push(denunciaOficioSteps[denunciaOficioStepIndexToBack - 1].to)
}

function handleNextStep (to) {
  router.push(to)
}

function salirABandeja () {
  router.push('/ingreso/denuncia-oficio')
}

const itemsMenuSuperior = [
  {
    label: 'Actualizar',
    icon: 'pi pi-refresh',
    command: () => location.reload()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: ({ item }) => console.log(`Click ${item.label}`)
  },
  {
    label: 'Guardar',
    icon: 'pi pi-save',
    command: ({ item }) => console.log(`Click ${item.label}`)
  },
  {
    label: 'Salir',
    icon: 'pi pi-sign-out',
    command: () => salirABandeja()
  }
]
</script>
