<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar Datos de DICREP"
  />
  <div class="mt-6">
    <AppSteps :model="stepsRegistrarDatosDICREP" class="mb-4"/>
    <div class="wrapper-routes">
      <RouterView />
    </div>
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
// components
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
// composables
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables';
import { useRoute, useRouter } from 'vue-router';

// logic 
const route = useRoute()
const router = useRouter()
const {itemsMenuSuperior} = useItemsMenuSuperiorCadena()

const stepsRegistrarDatosDICREP = [
  {
    label: 'Lista de Especies Para Subastar',
    to: { name: 'DICREPListaEspecies' }
  },
  {
    label: 'Solicitud Orden de Servicios',
    to: { name: 'DICREPOrdenServicio' }
  },
  {
    label: 'Generar Oficio de Entrega',
    to: { name: 'DICREPOficioEntrega' }
  }
]

function handleBackStep(){
  const indexActualStep = stepsRegistrarDatosDICREP.findIndex((s) => s.to.name === route.name)

  indexActualStep > 0 ? router.push(stepsRegistrarDatosDICREP[indexActualStep - 1].to) : router.push('/custodia')
}
</script>