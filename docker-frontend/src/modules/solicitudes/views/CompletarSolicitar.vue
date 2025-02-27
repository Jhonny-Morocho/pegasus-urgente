<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`RUC: ${ruc}`"
    :page-subtitle="`Nombre Causa: ${pageSubtitle}`"
    :page-title="pageTitle"
  />

  <AppSteps :model="stepsSolicitarAudiencia" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { usePageHeaderOptions } from '@/modules/gestion-solicitudes/composables'

import { useSolicitudesStore } from '../composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

const { itemsMenuSuperior } = usePageHeaderOptions(false)
const { ruc, resumenCausa, dataSelector } = useSolicitudesStore()

const {
  mantenedor_getSubtiposActividadList,
  mantenedor_getSubSubtiposActividadList,
  mantenedor_getNombreSubtipoActividadById,
  mantenedor_getNombreSubSubtipoActividadById
} = useMantenedorStore()

const route = useRoute()
const router = useRouter()

const pageSubtitle = computed(() =>
  resumenCausa.value?.nombre ? resumenCausa.value?.nombre : 'Cargando...'
)

const pageTitle = computed(() => {
  const subTipo = mantenedor_getNombreSubtipoActividadById(
    dataSelector.value?.selectorSubTipo
  )

  const subSubTipo = mantenedor_getNombreSubSubtipoActividadById(
    dataSelector.value?.selectorSubSubTipo
  )

  const title = `Solicitar ${subTipo?.toLowerCase()} ${
    subSubTipo?.toLowerCase() || ''
  }`

  return (subTipo && subSubTipo) || subTipo ? title : 'Cargando...'
})

onMounted(() => {
  requestUtil({
    action: mantenedor_getSubtiposActividadList
  })
  requestUtil({
    action: mantenedor_getSubSubtiposActividadList
  })
})

const stepsSolicitarAudiencia = ref([
  {
    label: 'Resumen / Relaciones / Especies',
    to: { name: 'solicitudResumenRelacionesEspecies' }
  },
  {
    label: '¿Desea agregar medidas cautelares?',
    to: { name: 'solicitudMedidasCautelares' }
  },
  {
    label: 'Elaboración del Escrito',
    to: { name: 'solicitudElaborarEscrito' }
  }
])
/* eslint-disable */
function handleBackStep() {
  const indexActualStep = stepsSolicitarAudiencia.value.findIndex(
    (s) => s.to.name == route.name
  );

  indexActualStep > 0
    ? router.push(stepsSolicitarAudiencia.value[indexActualStep - 1].to)
    : router.push({ name: "BandejaDirigirInvestigacion" });
}

function handleNextStep(to) {
  router.push(to);
}
</script>
