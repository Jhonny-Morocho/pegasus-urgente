<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-description="RUC: 22123456789"
    :page-subtitle="`Nombre Causa: el delito...`"
    page-title="Citación"
  />

  <ResumenCausa
    :causa="resumenCausa"
    title="Resumen Causa"
  />
  <FieldsetSeleccionarSujeto v-model:selection="sujetoSeleccionado" />

  <AppBtnsSteps
    no-button-back
    @back-step="handleBackStep"
  />

  <AppBtnNextTeleported
    label="Enviar Solicitud"
    :loading="loadingStepRelaciones"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { defineProps, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FieldsetSeleccionarSujeto from '@/modules/solicitudes/components/citacion-comunicacion/FieldsetSeleccionarSujeto.vue'
import ResumenCausa from '@/modules/global/components/solicitudes/ResumenCausa.vue'
import { usePageHeaderOptions } from '@/modules/gestion-solicitudes/composables'
import { propTypes } from '@/modules/common/types'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'

const { launchConfirmDialog } = useConfirmDialog()
const { toastError, toastSuccess } = useAppToast()
const { itemsMenuSuperior } = usePageHeaderOptions(false)
const sujetoSeleccionado = ref()
defineProps({
  dataSolicitud: propTypes.object
})

const router = useRouter()
const resumenCausa = reactive({
  ruc: 'ruc',
  nombre: 'nombre',
  reservada: 'reservada',
  fecha: 'fecha',
  fiscalAsignado: 'fiscalAsignado',
  fiscaliaLocal: 'fiscaliaLocal',
  estadoRelacion: 'estadoRelacion',
  etapaRelacion: 'etapaRelacion',
  estadoCausa: 'estadoCausa',
  tipoDenuncia: 'tipoDenuncia',
  fechaAsignacion: 'fechaAsignacion',
  fechaFormalizacion: 'fechaFormalizacion',
  plazoInvestigacion: 'plazoInvestigacion',
  fechaPreinscripcion: 'fechaPreinscripcion',
  procesoCausa: 'procesoCausa',
  audienciasProgramadas: 'audienciasProgramadas'
})
function handleNextStep () {
  console.log('sujetoSeleccionado.value', sujetoSeleccionado.value)
  if (!sujetoSeleccionado.value) {
    toastError('Debe seleccionar un sujeto')
    return
  }
  launchConfirmDialog({
    header: 'Enviar Solicitud',
    message: '¿Está seguro de Enviar Solicitud?',
    acceptLabel: 'Enviar Solicitud',
    accept: () => {
      toastSuccess('Solicitud enviada con éxito')
      router.push()
    }
  })
}
</script>
