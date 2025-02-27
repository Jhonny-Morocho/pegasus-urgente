<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`RUC ${ruc} | Nombre Causa: ${nombreCausa}`"
    :page-title="'Solicitar Orden de Detención'"
  />
  <AppSteps :model="stepsSolicitarOrdenDetencion" />

  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnsSteps
    @back-step="handleBackStep"
  />

  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined px-5"
      icon="pi pi-arrow-left"
      icon-pos="left"
      label="Volver a Revisar Antecedentes de la Causa"
      @click="handleVolverRevisarAntecedentesCausa"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfirmDialog } from '@/modules/common/composables'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'

import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'

const route = useRoute()
const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()
const {
  ruc
} = useDirigirInvestigacionStore()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const imputadosSeleccionados = ref([])

provide('listaImputados', imputadosSeleccionados)

const nombreCausa = ref('Hurto simple 4 A 40 UTM a Gustavo')

const stepsSolicitarOrdenDetencion = [
  {
    label: 'Seleccione una Relación para Formalizar',
    to: { name: 'DISODRelacionAFormalizar' }
  },
  {
    label: '¿Desea agregar Medidas Cautelares?',
    to: { name: 'DISODAgregarMedidasCautelares' }
  },
  {
    label: 'Elaboración de Solicitud de Audiencia',
    to: { name: 'DISODElaborarSolicitudAudiencia' }
  }
]

function handleBackStep () {
  const indexActualStep =
    stepsSolicitarOrdenDetencion.findIndex((s) => s.to.name === route.name)
  indexActualStep > 0
    ? router.push(stepsSolicitarOrdenDetencion[indexActualStep - 1].to)
    : router.push('/dirigir-investigacion/desarrollo-investigacion')
}

function handleVolverRevisarAntecedentesCausa () {
  launchConfirmDialog({
    header: 'Volver a Revisar Antecedentes de la Causa',
    message: '¿Está seguro de Volver a Revisar Antecedentes de la Causa?',
    acceptLabel: 'Aceptar',
    accept: () => {
      router.push({ name: 'DIRAResumenCausa' })
    }
  })
}
</script>
