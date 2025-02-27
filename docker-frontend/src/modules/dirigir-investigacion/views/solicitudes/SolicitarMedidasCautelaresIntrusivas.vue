<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`RUC ${ruc} | Nombre Causa: ${nombreCausa}`"
    page-title="Solicitar Medidas Cautelares o Intrusivas por Escrito"
  />
  <AppSteps :model="stepsSolicitarMedidas" />

  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnsSteps @back-step="handleBackStep" />

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
import { provide, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// composables
import {
  useDirigirInvestigacionStore,
  useMenuSuperiorSecundario
} from '@/modules/dirigir-investigacion/composables'
import { useConfirmDialog } from '@/modules/common/composables'

// components
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'

const route = useRoute()
const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()

const { ruc } = useDirigirInvestigacionStore()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const imputadosSeleccionados = ref([])
provide('listaImputados', imputadosSeleccionados)

const nombreCausa = 'Hurto simple 4 A 40 UTM a Gustavo'

function handleBackStep () {
  const indexStepActual = stepsSolicitarMedidas.findIndex(
    (s) => s.to.name === route.name
  )

  indexStepActual > 0
    ? router.push(stepsSolicitarMedidas[indexStepActual - 1].to)
    : router.push({ name: 'DIDesarrolloInvestigacion' })
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

const stepsSolicitarMedidas = [
  {
    label: 'Seleccione una Relación para Solicitar Medidas',
    to: { name: 'DISMCIRelacionAFormalizar' }
  },
  {
    label: 'Agregar Medidas Cautelares o Intrusivas',
    to: { name: 'DISMCIAgregarMedidasCautelares' }
  },
  {
    label: 'Escrito de Solicitud de Medidas Cautelares o Intrusivas',
    to: { name: 'DISMCIElaborarSolicitudMedidasCautelares' }
  }
]
</script>
