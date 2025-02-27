<template>
<section>
  <PageHeader
    :hide-items-menu-superior="route.path === '/ingreso/denuncia-directa/nueva-denuncia/identificacion-denuncia' ? true : false"
    :items-menu-superior="itemsMenuSuperior"
    page-subtitle="Nueva Atención"
    page-title="Atendedor Jurídico"
    @action:exit="salirABandeja"
  />

  <AppSteps :model="DenunciaDirectaFormularioSteps" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :button-back-disabled="$route.path === '/ingreso/denuncia-directa/nueva-denuncia/identificacion-denuncia'"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { ref } from 'vue' // wtf

const route = useRoute()
const router = useRouter()

const DenunciaDirectaFormularioSteps = [
  {
    label: 'Identificación de Denuncia',
    to: '/ingreso/denuncia-directa/nueva-denuncia/identificacion-denuncia'
  },
  {
    label: 'Buscar Duplicidad',
    to: '/ingreso/denuncia-directa/nueva-denuncia/buscar-duplicidad'
  },
  {
    label: 'Sujetos Intervinientes',
    to: '/ingreso/denuncia-directa/nueva-denuncia/sujetos-intervinientes'
  },
  {
    label: 'Delitos',
    to: '/ingreso/denuncia-directa/nueva-denuncia/delitos'
  },
  {
    label: 'Relaciones',
    to: '/ingreso/denuncia-directa/nueva-denuncia/relaciones'
  },
  {
    label: 'Especies y Dinero',
    to: '/ingreso/denuncia-directa/nueva-denuncia/especies-dinero'
  },
  {
    label: 'Relatos',
    to: '/ingreso/denuncia-directa/nueva-denuncia/relatos'
  },
  {
    label: 'Documentos',
    to: '/ingreso/denuncia-directa/nueva-denuncia/documentos'
  }
]

const itemsMenuSuperior = ref([
  {
    label: 'Plantilla',
    icon: 'pi pi-file'
    // command: () => handleNuevaAtencion(),
  },
  {
    label: 'Generar Acta Resumen Declaración',
    icon: 'pi pi-file'
    // command: () => getDenunciasOficio(),
  },
  {
    label: 'Guardar',
    icon: 'pi pi-save'
    // command: () => handleCleanFilters(),
  },
  {
    label: 'Salir',
    icon: 'pi pi-download'
    // command: () => exportTable(),
  }
])

function handleBackStep () {
  const flagranciaFormulatioStepIndexToBack = DenunciaDirectaFormularioSteps.findIndex((s) => s.to === route.path)

  router.push(DenunciaDirectaFormularioSteps[flagranciaFormulatioStepIndexToBack - 1].to)
}

function handleNextStep (to) {
  router.push(to)
}

function salirABandeja () {
  router.push('/ingreso/denuncia-directa')
}
</script>
