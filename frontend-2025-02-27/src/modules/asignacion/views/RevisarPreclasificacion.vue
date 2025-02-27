<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`Causa: ${ruc}`"
    page-title="Fiscal Jefe"
  />

  <AppSteps :model="hasPropuestaAsignacion ? stepsAsignacionConPropuesta : stepsAsignacionSinPropuesta" />

  <div class="wrapper-routes">
    <RouterView @next-step="handleNextStep" />
  </div>

  <AppBtnsSteps
    :no-button-back="cantContinue"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useDynamicDialog } from '@/modules/common/composables'
import { useCausasRelacionadasStore, useGeorreferenciaStore, usePamStore } from '@/modules/global/composables'
import { useCausaAsignacionStore, useLoadingStates } from '@/modules/asignacion/composables'
import { useFichaCausa } from '@/modules/ficha-causa/composables'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import ModalCompetenciaTerritorial from '@/modules/global/components/competencia-territorial/ModalCompetenciaTerritorial.vue'

const { includeWord } = appUtil

const router = useRouter()
const route = useRoute()

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { toastSuccess } = useAppToast()

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

const { loadingStates } = useLoadingStates()

const { procesoPam } = usePamStore()

const {
  ruc,
  idDenuncia,
  causaActual,
  hasPropuestaAsignacion,
  causaAsignacion_SET_ANALIZA_ASIGNACION
} = useCausaAsignacionStore()

const {
  causasRelacionadas_guardarCausasRelacionadas,
  causasRelacionadas_getCausasRelacionadas
} = useCausasRelacionadasStore()

const { georreferencia_SET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()

const idCausa = computed(() => causaActual.value?.causa?.idCausa)

const cantGoBackRoutes = ['DASeguirLineaInvestigativa', 'DATransferirCausa', 'DAAgruparCausa', 'DADesestimarCausa']

const cantContinue = computed(() => {
  return cantGoBackRoutes.some((name) => route.name === name)
})

function handleNextStep (to) {
  router.push(to)
}

function handleBackStep () {
  const stepsAsignacion = hasPropuestaAsignacion.value ? stepsAsignacionConPropuesta.value : stepsAsignacionSinPropuesta.value

  const indexActualStep = stepsAsignacion.findIndex((s) => s.to === route.path)

  indexActualStep > 0 ? router.push(stepsAsignacion[indexActualStep - 1].to) : router.push('/asignacion')
}

function openCausasRelacionadas () {
  launchDynamicDialog({
    component: ModalConsultarCausasRelacionadas,
    header: 'Consultar Causas Relacionadas',
    width: '80%',
    onClose: ({ data }) => {
      if (data?.length) {
        const causas = data.map(c => {
          return {
            idCausa: idCausa.value,
            idCausaRelacionada: c?.idCausa
          }
        })
        guardarCausasRelacionadas(causas)
      }
    }
  })
}

function guardarCausasRelacionadas (causas) {
  requestUtil({
    action: causasRelacionadas_guardarCausasRelacionadas,
    payload: {
      causasRelacionadas: causas
    },
    loader: (l) => { loadingStates.guardarCausasRelacionadas = l },
    resolve: () => {
      toastSuccess('Se Guardaron las Causas Relacionadas')
      if (route.name === 'DAAgruparCausa') {
        getCausasRelacionadas()
      }
    }
  })
}

function getCausasRelacionadas () {
  requestUtil({
    action: causasRelacionadas_getCausasRelacionadas,
    payload: {
      idCausa: idCausa.value,
      params: {
        page: 0,
        size: 5
      }
    },
    loader: (l) => { loadingStates.getCausasRelacionadas = l }
  })
}

function handleModalCargaTrabajo () {
  causaAsignacion_SET_ANALIZA_ASIGNACION(true)
  launchDialog({
    component: ModalCargaTrabajo,
    header: 'Carga de Trabajo FL y Unidades',
    width: '90%'
  })
}

function openFichaCausa () {
  sendToFichaCausa({
    origenCausa: flujoOrigen.TRANSVERSAL,
    ruc: ruc.value,
    idCausa: idCausa.value,
    idDenuncia: idDenuncia.value,
    newTab: true
  })
}

function handleCompetenciaTerritorial () {
  launchDialog({
    component: ModalCompetenciaTerritorial,
    header: 'Competencia Territorial',
    width: '90%',
    confirmLabel: 'Guardar Georreferenciación',
    props: {
      idDenuncia: idDenuncia.value
    },
    accept: (data) => {
      if (data.length) {
        georreferencia_SET_FISCALIAS_COMPETENTES(data)
        toastSuccess('Se guardó la competencia territorial')
      }
    }
  })
}

const hasSolicitudes = computed(() => {
  return [
    'RAAntecedentesCausa',
    'RASujetosIntervinientes',
    'RADelitos',
    'RARelaciones',
    'RAEspeciesDinero',
    'RARelato',
    'RADocumentos',
    'RADiligencias',
    'RAHistorialCausa'
  ].some((s) => s === route.name)
})

const itemsMenuSuperior = ref([
  {
    label: 'Solicitar',
    icon: 'pi pi-info-circle',
    visible: () => hasSolicitudes.value,
    items: [
      {
        label: 'Antecedentes Especificos',
        command: () => router.push({ name: 'RADocumentos' }),
        visible: () => route.name !== 'RADocumentos'
      },
      {
        label: 'Diligencias',
        command: () => router.push({ name: 'RADiligencias' }),
        visible: () => route.name !== 'RADiligencias'
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Causas Relacionadas',
        command: () => openCausasRelacionadas()
      },
      {
        label: 'Consulta al Fiscal Regional',
        disabled: () => true
      },
      {
        label: 'Respuesta del Fiscal Regional',
        disabled: () => true
      },
      {
        label: 'Carga de Trabajo FL y Unidades',
        command: () => handleModalCargaTrabajo()
        // disabled: () => true
      },
      {
        label: 'Competencia Territorial',
        command: () => handleCompetenciaTerritorial()
      }
    ]
  },
  {
    label: 'CDD',
    icon: 'pi pi-folder-open',
    command: () => console.log('cdd'),
    disabled: () => true
  },
  {
    label: 'Ver Ficha Causa',
    icon: 'pi pi-book',
    command: () => openFichaCausa()
  }
])

const canContinue = computed(() => {
  return !includeWord(procesoPam.value?.taskName, 'Sugerir FR')
})

const stepsAsignacionConPropuesta = ref([
  {
    label: 'Revisar Propuesta de Asignación',
    to: '/asignacion/revisar-preclasificacion/propuesta-asignacion'
  },
  {
    label: 'Revisar Antecedentes',
    to: '/asignacion/revisar-preclasificacion/antecedentes/antecedentes-causa',
    visible: canContinue.value
  },
  {
    label: 'Decidir Asignación',
    to: '/asignacion/revisar-preclasificacion/decision',
    visible: canContinue.value
  }
])

const stepsAsignacionSinPropuesta = ref([
  {
    label: 'Revisar Antecedentes',
    to: '/asignacion/revisar-preclasificacion/antecedentes/antecedentes-causa',
    visible: canContinue.value
  },
  {
    label: 'Decidir Asignación',
    to: '/asignacion/revisar-preclasificacion/decision',
    visible: canContinue.value
  }
])
</script>
