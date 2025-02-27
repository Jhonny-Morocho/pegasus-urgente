<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registrar Salida Definitiva Especie por Destrucción"
  />
  <div class="mt-6">
    <AppSteps :model="stepsRSDDestruccion" class="mb-4"/>
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
const itemsMenuSuperior = useItemsMenuSuperiorCadena()

const stepsRSDDestruccion = [
  {
    label: 'Lista de Especies Disponibles para Destrucción',
    to: { name: 'RSDDestruccionListaEspecies' }
  },
  {
    label: 'Registrar Salidad Definitiva Especies',
    to: { name: 'RSDDestruccionRegistrarSalida' }
  },
  {
    label: 'Solicitar Orden de Servicio',
    to: { name: 'RSDDestruccionOrdenDeServicio' }
  }
]

function handleBackStep(){
  const indexActualStep = stepsRSDDestruccion.findIndex((s) => s.to.name === route.name)

  indexActualStep > 0 ? router.push(stepsRSDDestruccion[indexActualStep - 1].to) : router.push('/custodia')
}
</script>