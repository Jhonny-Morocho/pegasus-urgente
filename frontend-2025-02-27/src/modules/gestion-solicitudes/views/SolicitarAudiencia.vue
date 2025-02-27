<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`RUC: ${ruc}`"
    page-subtitle="Nombre Causa: "
    page-title="Solicitar Audiencia"
  />

  <AppSteps :model="stepsSolicitarAudiencia" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'

import { useGestionSolicitudesStore, usePageHeaderOptions } from '@/modules/gestion-solicitudes/composables'

const { itemsMenuSuperior } = usePageHeaderOptions(false)
const { ruc } = useGestionSolicitudesStore()
const route = useRoute()
const router = useRouter()

const imputadosSeleccionados = ref([])
provide('listaImputados', imputadosSeleccionados)

const stepsSolicitarAudiencia = ref([
  {
    label: 'Resumen / Relaciones / Especies',
    to: '/gestion-solicitudes/fiscal/solicitar-audiencia/resumen-relaciones-especies'
  },
  {
    label: '¿Desea agregar medidas cautelares?',
    to: '/gestion-solicitudes/fiscal/solicitar-audiencia/medidas-cautelares'
  },
  {
    label: 'Elaboración Solicitud de Audiencia',
    to: '/gestion-solicitudes/fiscal/solicitar-audiencia/elaborar-solicitud-audiencia'
  }
])

function handleBackStep () {
  const indexActualStep = stepsSolicitarAudiencia.value.findIndex(
    (s) => s.to === route.path
  )

  indexActualStep > 0
    ? router.push(stepsSolicitarAudiencia.value[indexActualStep - 1].to)
    : router.push('/gestion-solicitudes/fiscal')
}

function handleNextStep (to) {
  router.push(to)
}
</script>
