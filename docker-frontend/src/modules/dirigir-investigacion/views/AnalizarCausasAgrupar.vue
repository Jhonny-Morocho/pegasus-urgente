<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Agrupación de Causas"
  />

  <AppSteps :model="stepsAnalizarAgrupacion" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnRightTeleported>
    <Button
      v-if="false"
      class="p-button-outlined px-5"
      icon="pi pi-arrow-left"
      icon-pos="left"
      label="Volver a Revisar Antecedentes de la Causa"
      @click="handleVolverARevisarAntecedentes"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { useConfirmDialog } from '@/modules/common/composables'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'

const route = useRoute()
const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()

const { ruc, dirigirInvestigacion_getResumenCausa } = useDirigirInvestigacionStore()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value || '20000001992-6' // por si acaso
})

function handleVolverARevisarAntecedentes () {
  launchConfirmDialog({
    header: 'Volver a Revisar Antecedentes de la Causa',
    message: `¿Está seguro de Volver a Revisar Antecedentes de la Causa?`,
    accept: () => router.push({ name: 'DIRAResumenCausa' })
  })
}

function handleBackStep () {
  const indexStepActual = stepsAnalizarAgrupacion.findIndex((s) => s.to.name === route.name)

  indexStepActual > 0 ? router.push(stepsAnalizarAgrupacion[indexStepActual - 1].to) : router.push({ name: 'BandejaDirigirInvestigacion' })
}

const handleNextStep = (to) => {
  router.push(to)
}

const stepsAnalizarAgrupacion = [
  {
    label: 'Analizar Causas a Agrupar',
    to: { name: 'DIACADefinirCausasAgrupar' }
  },
  {
    label: 'Definir Delitos y Relaciones',
    to: { name: 'DIACADefinirDelitosRelaciones' }
  },
  {
    label: 'Definir Especies',
    to: { name: 'DIACADefinirEspecies' }
  },
  {
    label: 'Resumen Agrupación',
    to: { name: 'DIACAResumenAgrupacion' }
  }
]

function addExtraMenu () {
  itemsMenuSuperior.value.splice(1, 0, {
    label: 'Consultar',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Consulta FR',
        command: () => console.log('consulta fr')
      },
      {
        label: 'Causas Relacionadas',
        command: () => console.log('Causas Relacionadas')
      },
      {
        label: 'Solicitar Antecedentes Específicos',
        command: () => console.log('Solicitar Antecedentes Específicos')
      },
      {
        label: 'Actualizar Antecedentes',
        command: () => console.log('Actualizar Antecedentes')
      },
      {
        label: 'Carga de Trabajo FL',
        command: () => console.log('Carga de Trabajo FL')
      }
    ]
  })
}

onMounted(async () => {
  addExtraMenu()
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: ruc.value }
  })
})
</script>
