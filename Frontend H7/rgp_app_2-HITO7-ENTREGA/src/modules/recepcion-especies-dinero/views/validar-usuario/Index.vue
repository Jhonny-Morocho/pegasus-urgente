<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Validar Usuarios"
  />
  <div class="mt-6">
    <AppSteps :model="stepsValidarUsuarios" class="mb-4"/>
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

const stepsValidarUsuarios = [
  {
    label: 'Validar Usuario',
    to: { name: 'SolicitarValidacionUsuario' }
  },
  {
    label: 'Generar Comprobante de Entrega',
    to: { name: 'ValidacionUsuarioComprobanteEntrega' }
  }
]

function handleBackStep(){
  const indexActualStep = stepsValidarUsuarios.findIndex((s) => s.to.name === route.name)

  indexActualStep > 0 ? router.push(stepsValidarUsuarios[indexActualStep - 1].to) : router.push('/custodia')
}
</script>