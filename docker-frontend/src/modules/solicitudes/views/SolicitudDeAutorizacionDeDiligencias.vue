<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-description="RUC: 22123456789"
    :page-subtitle="`Nombre Causa: el delito...`"
    page-title="Solicitud de Detención judicial"
  />

  <AppSteps :model="stepsSolicitarAudiencia" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    no-button-back
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePageHeaderOptions } from '@/modules/gestion-solicitudes/composables'
import { propTypes } from '@/modules/common/types'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

const { itemsMenuSuperior } = usePageHeaderOptions(false)

const router = useRouter()

defineProps({
  dataSolicitud: propTypes.object
})

const stepsSolicitarAudiencia = ref([
  {
    label: 'Resumen/Relación',
    to: { name: 'solicitudAutorizacionDiligenciaResumenRelacion' }
  },
  {
    label: '¿Desea agregar medidas intrusivas?',
    to: { name: 'solicitudAutorizacionDiligenciasMedidasIntrusivas' }
  },
  {
    label: 'Elaboración del Escrito',
    to: { name: 'solicitudAutorizacionDiligenciasElaborarEscrito' }
  }
])

function handleNextStep (to) {
  console.log('to', to)
  router.push(to)
}
</script>
