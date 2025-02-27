<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre Causa: ${resumenCausa?.nombreCausa}`"
    :page-subtitle="`RUC ${ruc}`"
    page-title="Comunicar Cierre o Solicitar Audiencia de Cierre"
  />

  <div class="wrapper-routes">
    <AppFieldset legend="Seleccione Comunicar o Solicitar Audiencia de Cierre">
      <div class="col-12 grid p-fluid">
        <div class="col-5">
          <AppDropdown
            id="decision-causa"
            v-model="decision"
            label="Seleccione Decisión (*)"
            option-label="label"
            option-value="id"
            :options="decisionOptions"
            placeholder
            show-clear
          />
        </div>
        <div class="col-3">
          <Button
            class="btn-primary"
            :disabled="!decision || (decision === 'audiencia' && !accionTermino)"
            icon="pi pi-angle-double-right"
            icon-pos="right"
            label="Continuar"
            @click="continuarDecision"
          />
        </div>
        <div
          v-if="decision === 'audiencia'"
          class="col-5"
        >
          <AppDropdown
            id="decision-causa"
            v-model="accionTermino"
            label="Acción de Cierre (*)"
            option-label="label"
            option-value="id"
            :options="accionOptions"
            placeholder
            show-clear
          />
        </div>
      </div>
    </AppFieldset>
    <AppSteps
      v-if="showSteps"
      class="w-8"
      :model="stepsPrepararAcusacion"
    />
    <RouterView />
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
import { computed, onMounted, provide, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useRouter } from 'vue-router'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import { useConfirmDialog } from '@/modules/common/composables'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'

const router = useRouter()

const {
  ruc,
  idCausa,
  resumenCausa,
  dirigirInvestigacion_getResumenCausaByIdCausa
} = useDirigirInvestigacionStore()
const { launchConfirmDialog } = useConfirmDialog()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value || '20000001992-6' // por si acaso
})

const showSteps = computed(() => routesWithSteps.some((route) => route === router.currentRoute.value.name))

const routesWithSteps = ['DICCSolicitudAudienciaAcusacion', 'DICCSolicitudAudienciaNoPerseverar', 'DICCSolicitudAudienciaPrepararEscrito']

const decision = ref(null)
const accionTermino = ref(null)

provide('accionTermino', accionTermino)

function continuarDecision () {
  // to-do: mejorar esta logica utilizando tiempo de respuesta y toast
  if (decision.value === 'escrito') {
    router.push({ name: 'DICCEscrito' })
  } else if (decision.value === 'audiencia') {
    if (accionTermino.value === 'sin-definir') {
      router.push({ name: 'DICCSolicitudAudienciaSinDefinir' })
    } else {
      router.push({ name: 'DICCSolicitudAudienciaAcusacion' })
    }
  }
}

const decisionOptions = [
  {
    id: 'escrito',
    label: 'Comunicar Cierre de la Investigación por Escrito'
  },
  {
    id: 'audiencia',
    label: 'Solicitar Audiencia para Cerrar la Investigación'
  }
]

const accionOptions = [
  { id: 'acusacion', label: 'Acusación' },
  {
    id: 'sustitucion',
    label: 'Sustitución Procedimiento Simplificado'
  },
  { id: 'no-preservar', label: 'No Perseverar' },
  {
    id: 'sobreseimiento-temporal',
    label: 'Sobreseimiento Temporal'
  },
  {
    id: 'sobreseimiento-definitivo',
    label: 'Sobreseimiento Definitivo'
  },
  { id: 'sin-definir', label: 'Sin Definir' }
]

const stepsPrepararAcusacion = [
  {
    label: 'Relaciones/Testigos/Especies',
    to: { name: 'DICCSolicitudAudienciaAcusacion' }
  },
  {
    label: 'Preparar Escrito',
    to: { name: 'DICCSolicitudAudienciaPrepararEscrito' }
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

onMounted(async () => {
  router.push({ name: 'DIComunicarCierreInvestigacion' })
  requestUtil({
    action: dirigirInvestigacion_getResumenCausaByIdCausa,
    payload: { idCausa: idCausa.value }
  })
})
</script>
