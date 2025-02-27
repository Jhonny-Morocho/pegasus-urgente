<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-description="RUC: 22123456789"
    :page-subtitle="`Nombre Causa: el delito...`"
    page-title="Comunicación"
  />
  <AppSteps :model="stepsSolicitudComunicacion" />
  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :button-back-disabled="$route.path === '/solicitudes/comunicacion/resumen-relacion'"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { defineProps, ref } from 'vue'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import { usePageHeaderOptions } from '@/modules/gestion-solicitudes/composables'
import { propTypes } from '@/modules/common/types'

const { itemsMenuSuperior } = usePageHeaderOptions()
defineProps({
  dataSolicitud: propTypes.object
})

const stepsSolicitudComunicacion = ref([
  {
    label: 'Resumen/Relaciones',
    to: { name: 'solicitudDeComunicacionResumenRelacion' }
  },
  {
    label: 'Elaboración del Escrito',
    to: { name: 'solicitudDeComunicacionEleborarEscrito' }
  }
])
</script>
