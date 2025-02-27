<template>
<PageHeader
  :items-menu-superior="itemsMenuSuperiorSecundario"
  page-title="Revisar Transferencia de Causa"
/>
<main class="mt-5">
  <AppFieldset legend="Resumen Causa">
    <DetalleResumenCausa
      :loading="loadingStates.getResumenCausa"
      :resumen-causa="resumenCausa"
    />
  </AppFieldset>
  <AppFieldset legend="Antecedentes de la Transferencia">
    <DetalleAntecedentesTransferencia
      :antecedentes-transferencia="transferencia.antecedentes"
      :loading="loadingStates.getDecisionCausa"
    />
  </AppFieldset>
  <section class="flex flex-row-reverse mb-3">
    <Button
      class="p-button-outlined px-5"
      icon="pi pi-external-link"
      icon-pos="right"
      label="Ver Historial de Asignación"
      @click="openModalHistorial"
    />
  </section>
  <AppFieldset legend="Notificación de Transferencia">
    <main
      v-if="loadingStates.getNotificacionTransferencia"
      class="px-4 py-0 mt-2 mx-0 w-full"
    >
      <LoaderSkeleton height="38vh" />
    </main>
    <main
      v-else
      class="px-4 py-0 mt-2 mx-0 w-full"
    >
      <AppEditor
        id="notificacion-transferencia"
        v-model="transferencia.notificacion"
        class="w-full"
        readonly
      />
    </main>
  </AppFieldset>
  <section class="col-12 mb-6 grid">
    <h4 class="ml-2 col-12">
      ¿Enviar Consulta a FR?
    </h4>
    <AppSelectButton
      id="consulta-FR"
      v-model="enviaConsultaFR"
      class="col-4 p-fluid"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
    <AppFieldset
      v-if="enviaConsultaFR"
      class="w-full mt-4"
      disabled
      legend="Ingresar datos para la consulta"
    >
      <FormularioConsultaFiscalRegional @enviar-consulta="enviarConsultaFiscalRegional" />
    </AppFieldset>
  </section>
  <AppBtnsSteps @back-step="handleBackStep" />
  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined p-button-danger mr-5 px-5"
      icon="pi pi-times-circle"
      icon-pos="right"
      label="Rechazar Propuesta"
      :loading="isLoading"
      @click="handleRechazarPropuesta"
    />
    <Button
      class="btn-primary px-5"
      icon="pi pi-check-circle"
      icon-pos="right"
      label="Aprobar Propuesta"
      :loading="isLoading"
      @click="handleAprobarPropuesta"
    />
  </AppBtnRightTeleported>
</main>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDynamicDialog } from '@/modules/common/composables'
import { useGestionDireccionInvestigacionStore, useMenuSuperior } from '@/modules/termino-postermino/composables'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import ModalHistorialAsignaciones from '@/modules/termino-postermino/components/modals/ModalHistorialAsignaciones.vue'
import { requestUtil } from '@/utils'
import DetalleResumenCausa from '@/modules/termino-postermino/components/DetalleResumenCausa.vue'
import DetalleAntecedentesTransferencia from '@/modules/termino-postermino/components/DetalleAntecedentesTransferencia.vue'
import FormularioConsultaFiscalRegional from '@/modules/termino-postermino/components/FormularioConsultaFiscalRegional.vue'
import ModalRespuestaPropuestaGDI from '@/modules/termino-postermino/components/modals/ModalRespuestaPropuestaGDI.vue'
import { usePamStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { launchDynamicDialog } = useDynamicDialog()

const router = useRouter()

const {
  ruc,
  idCausa,
  resumenCausa,
  gestionDireccionInvestigacion_getResumenCausa,
  gestionDireccionInvestigacion_getDecisionCausa,
  gestionDireccionInvestigacion_completarRevisarCausa,
  gestionDireccionInvestigacion_completarDefinirAccionMotivoCambio,
  gestionDireccionInvestigacion_getNotificacionTransferencia
} = useGestionDireccionInvestigacionStore()

const { procesoPam } = usePamStore()

const { itemsMenuSuperiorSecundario } = useMenuSuperior({ ruc: ruc.value })

const enviaConsultaFR = ref(null)

const transferencia = reactive({
  notificacion: '',
  antecedentes: null
})

const loadingStates = reactive({
  getResumenCausa: false,
  getDecisionCausa: false,
  completarRevisarCausa: false,
  completarDefinirAccionMotivoCambio: false,
  getNotificacionTransferencia: false
})

const isLoading = computed(() => {
  const loadingValues = Object.values(loadingStates)

  return loadingValues.some(loading => loading)
})

function handleAprobarPropuesta () {
  launchDynamicDialog({
    component: ModalRespuestaPropuestaGDI,
    header: 'Aprobar Propuesta',
    width: '50%',
    closable: false,
    data: {
      isTransferencia: true,
      rechazaPropuesta: false,
      rucCausaTransferida: ruc.value
    },
    onClose: ({ data }) => {
      if (!data) return

      completarRevisarCausa({
        apruebaDecisionFiscal: true,
        decisionFiscal: 'aprueba'
      })
    }
  })
}

function handleRechazarPropuesta () {
  launchDynamicDialog({
    component: ModalRespuestaPropuestaGDI,
    header: 'Rechazar Propuesta',
    width: '50%',
    closable: false,
    data: {
      rechazaPropuesta: true
    },
    onClose: ({ data }) => {
      if (!data) return

      completarRevisarCausa({
        apruebaDecisionFiscal: false
      })
    }
  })
}

function completarRevisarCausa ({ apruebaDecisionFiscal, decisionFiscal }) {
  requestUtil({
    action: gestionDireccionInvestigacion_completarRevisarCausa,
    payload: {
      apruebaDecisionFiscal,
      idInstanciaTarea: procesoPam.value?.taskId
    },
    loader: (l) => { loadingStates.completarRevisarCausa = l },
    resolve: () => {
      if (apruebaDecisionFiscal) {
        completarDefinirAccionMotivoCambio(decisionFiscal)
      }
    }
  })
}

function completarDefinirAccionMotivoCambio (decisionFiscal) {
  requestUtil({
    action: gestionDireccionInvestigacion_completarDefinirAccionMotivoCambio,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId,
      decisionFiscal: decisionFiscal
    },
    loader: (l) => { loadingStates.completarDefinirAccionMotivoCambio = l },
    resolve: () => {
      router.push({ name: 'BandejaGestionDireccionInvestigacion' })
    }
  })
}

function enviarConsultaFiscalRegional (formConsulta) {
  console.log('🚀 ~ file: RevisarTransferenciaCausa.vue:146 ~ enviarConsultaFiscalRegional ~ enviarConsultaFiscalRegional', formConsulta)
}

function openModalHistorial () {
  launchDynamicDialog({
    component: ModalHistorialAsignaciones,
    header: 'Historial de Asignaciones',
    width: '90%',
    data: {
      ruc: ruc.value
    }
  })
}

const handleBackStep = () => {
  router.push({ name: 'BandejaGestionDireccionInvestigacion' })
}

function getResumenCausa () {
  requestUtil({
    action: gestionDireccionInvestigacion_getResumenCausa,
    payload: {
      ruc: ruc.value
    },
    loader: (l) => { loadingStates.getResumenCausa = l }
  })
}

function getNotificacionTransferencia () {
  requestUtil({
    action: gestionDireccionInvestigacion_getNotificacionTransferencia,
    payload: {
      params: {
        idCausa: idCausa.value
      }
    },
    loader: (l) => { loadingStates.getNotificacionTransferencia = l },
    resolve: (response) => {
      console.log('🚀 ~ file: RevisarTransferenciaCausa.vue:255 ~ getNotificacionTransferencia ~ response', response)

      transferencia.notificacion = response?.textoEscrito
    }
  })
}

function getDecisionCausa () {
  requestUtil({
    action: gestionDireccionInvestigacion_getDecisionCausa,
    payload: {
      idCausa: idCausa.value
    },
    loader: (l) => { loadingStates.getDecisionCausa = l },
    resolve: (response) => {
      transferencia.antecedentes = response
    }
  })
}

onMounted(() => {
  getResumenCausa()
  getNotificacionTransferencia()
  getDecisionCausa()
})
</script>
