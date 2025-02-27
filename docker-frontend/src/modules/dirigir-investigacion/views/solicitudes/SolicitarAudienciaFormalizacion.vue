<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre Causa: ${nombreCausa}`"
    :page-subtitle="`RUC: ${ruc}`"
    :page-title="'Solicitar Audiencia de Formalización'"
  />

  <AppSteps :model="stepsSolicitarAudienciaFormalizacion" />

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
import { ref, provide, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfirmDialog } from '@/modules/common/composables'
import {
  useDirigirInvestigacionStore,
  useMenuSuperiorSecundario
} from '@/modules/dirigir-investigacion/composables'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'

const route = useRoute()
const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()
const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { itemsMenuSuperior } = useMenuSuperiorSecundario({ ruc: ruc.value })

const imputadosSeleccionados = ref([])
provide('listaImputados', imputadosSeleccionados)

const nombreCausa = ref('--')

onMounted(() => {
  if (resumenCausa) {
    nombreCausa.value = resumenCausa.value?.nombreCausa
  }
})

const stepsSolicitarAudienciaFormalizacion = [
  {
    label: 'Seleccione una Relación para Formalizar',
    to: '/dirigir-investigacion/desarrollo-investigacion/solicitar-audiencia-formalizacion/relacion-a-formalizar'
  },
  {
    label: '¿Desea agregar Medidas Cautelares?',
    to: '/dirigir-investigacion/desarrollo-investigacion/solicitar-audiencia-formalizacion/agregar-medidas-cautelares'
  },
  {
    label: 'Elaboración de Solicitud de Audiencia',
    to: '/dirigir-investigacion/desarrollo-investigacion/solicitar-audiencia-formalizacion/elaborar-solicitud-audiencia'
  }
]

function handleBackStep () {
  const indexActualStep = stepsSolicitarAudienciaFormalizacion.findIndex(
    (s) => s.to === route.path
  )
  indexActualStep > 0
    ? router.push(stepsSolicitarAudienciaFormalizacion[indexActualStep - 1].to)
    : router.push('/dirigir-investigacion/desarrollo-investigacion')
}

function handleVolverRevisarAntecedentesCausa () {
  launchConfirmDialog({
    header: 'Volver a Revisar Antecedentes de la Causa',
    message: '¿Está seguro de Volver a Revisar Antecedentes de la Causa?',
    acceptLabel: 'Aceptar',
    accept: () => {
      router.push('/dirigir-investigacion/revisar-antecedentes/resumen-causa')
    }
  })
}
</script>
