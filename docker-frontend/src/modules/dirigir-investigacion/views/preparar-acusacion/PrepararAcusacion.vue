<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre Causa: ${resumenCausa?.nombreCausa}`"
    :page-subtitle="`RUC: ${ruc}`"
    page-title="Preparar Acusación"
  />

  <AppSteps
    class="w-8"
    :model="stepsPrepararAcusacion"
  />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps @back-step="$router.push({ name: 'BandejaDirigirInvestigacion' })" />

  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined px-5"
      icon="pi pi-arrow-left"
      icon-pos="right"
      label="Volver a tomar decisión"
      @click="openConfirmationModal"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import { useConfirmDialog } from '@/modules/common/composables'

const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()

const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value || '20000001992-6' // por si acaso
})

async function handleNextStep (to) {
  router.push(to)
}

const stepsPrepararAcusacion = [
  {
    label: 'Relaciones/Testigos/Especies',
    to: { name: 'DIPAGeneral' }
  },
  {
    label: 'Preparar Escrito',
    to: { name: 'DIPAEscrito' }
  }
]

function openConfirmationModal () {
  launchConfirmDialog({
    header: 'Volver a tomar decisión',
    message: `¿Está seguro de Volver a tomar decisión?`,
    acceptLabel: 'Aceptar',
    accept: () => router.push({ name: 'DIDefinirCursoCausa' })
  })
}
</script>
