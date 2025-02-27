<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`Causa: ${ruc}`"
    :page-title="'Preclasificador'"
  />

  <AppSteps :model="stepsPreclasificador" />

  <div class="wrapper-routes">
    <RouterView />
  </div>

  <AppBtnsSteps
    :no-button-back="cantContinue"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { appUtil, requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppToast,
  useDynamicDialog
} from '@/modules/common/composables'
import {
  useAntecedentesCausaStore,
  useCausasRelacionadasStore,
  useGeorreferenciaStore,
  usePamStore
} from '@/modules/global/composables'
import {
  useCausaPreclasificadorStore,
  useLoadingStates
} from '@/modules/preclasificador/composables'
import { useFichaCausa } from '@/modules/ficha-causa/composables'
import AppSteps from '@/modules/common/components/AppSteps.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import ModalResumenCausa from '@/modules/preclasificador/components/modals/ModalResumenCausa.vue'
import ModalCompetenciaTerritorial from '@/modules/global/components/competencia-territorial/ModalCompetenciaTerritorial.vue'

const route = useRoute()
const router = useRouter()

const { toastSuccess } = useAppToast()

const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

const { loadingState } = useLoadingStates()

const { procesoPam } = usePamStore()

const {
  ruc,
  idDenuncia,
  causaActual
} = useCausaPreclasificadorStore()

const { antecedentesCausa_getAntecedentesCausa } = useAntecedentesCausaStore()

const { georreferencia_SET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()

const {
  causasRelacionadas_guardarCausasRelacionadas,
  causasRelacionadas_getCausasRelacionadas
} = useCausasRelacionadasStore()

const idCausa = computed(() => causaActual.value?.causa?.idCausa)

const loadingAntecedentes = ref(false)

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
    loader: (l) => { loadingState.guardarCausasRelacionadas = l },
    resolve: () => {
      toastSuccess('Se Guardaron las Causas Relacionadas')
      if (route.name === 'PAAgruparCausa') {
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
    loader: (l) => { loadingState.getCausasRelacionadas = l }
  })
}

function createResumenCausa (data) {
  const { antecedentes, fiscaliaLocal } = data
  return {
    ruc: antecedentes.ruc,
    esReservada: '',
    nombreFiscalAsignado: '',
    descripcionProceso: 'Preclasificación',
    nombreFiscalia: fiscaliaLocal.nombreFiscalia,
    tipoFiscalia: fiscaliaLocal.tipoFiscalia,
    fechaFormalizacion: '',
    fechaPrescripcion: '',
    fechaCreacion: antecedentes.fechaHoraDenuncia,
    nombreCausa: antecedentes.nombreCausa,
    descripcionEstado: antecedentes.estado,
    descripcionEstadoRelacion: '',
    fechaAsignacion: procesoPam.value?.taskCreatedOnDate,
    plazoInvestigacionDias: ''
  }
}

function verResumenCausa () {
  requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: {
      ruc: ruc.value
    },
    loader: (l) => (loadingAntecedentes.value = l),
    resolve: (data) => {
      launchDialog({
        component: ModalResumenCausa,
        header: 'Resumen de la Causa',
        width: '70%',
        props: { causa: createResumenCausa(data) }
      })
    }
  })
}

function openFichaCausa () {
  const { idCausa } = causaActual.value

  sendToFichaCausa({
    origenCausa: flujoOrigen.TRANSVERSAL,
    ruc: ruc.value,
    idCausa: idCausa,
    idDenuncia: idDenuncia.value,
    newTab: true
  })
}

function handleBackStep () {
  const indexActualStep = stepsPreclasificador.findIndex((s) => s.to === route.path)

  indexActualStep > 0 ? router.push(stepsPreclasificador[indexActualStep - 1].to) : router.push('/preclasificador')
}

const cantGoBackRoutes = ['PASeguirLineaInvestigativa', 'PATransferirCausa', 'PAAgruparCausa', 'PADesestimarCausa']

const cantContinue = computed(() => {
  return cantGoBackRoutes.some((name) => route.name === name)
})

const stepsPreclasificador = [
  {
    label: 'Validar Calidad de Antecedentes',
    to: '/preclasificador/causa/validar-calidad-antecedentes/antecedentes-causa'
  },
  {
    label: 'Proponer Asignación',
    to: '/preclasificador/causa/proponer-asignacion'
  }
]

const hasSolicitudMenu = computed(() => appUtil.includeWord(route.path, 'validar-calidad-antecedentes'))

const itemsMenuSuperior = ref([
  {
    label: 'Causa',
    icon: 'pi pi-file',
    command: () => verResumenCausa(),
    disabled: () => loadingAntecedentes.value
  },
  {
    label: 'Solicitar',
    icon: 'pi pi-info-circle',
    visible: () => hasSolicitudMenu.value,
    items: [
      {
        label: 'Antecedentes Específicos',
        command: () => {
          router.push('/preclasificador/causa/validar-calidad-antecedentes/documentos')
        }
      },
      {
        label: 'Instruir Diligencias',
        command: () => {
          router.push('/preclasificador/causa/validar-calidad-antecedentes/diligencias')
        }
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Causas Relacionadas',
        command: () => {
          openCausasRelacionadas()
        }
      },
      {
        label: 'Carga de Trabajo FL y Unidades',
        command: () => {
          launchDialog({
            component: ModalCargaTrabajo,
            header: 'Carga de Trabajo FL y Unidades',
            width: '90%',
            cancelLabel: 'Cerrar'
          })
        }
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
    disabled: () => true // CDD EN CONSTRUCCION
  },
  {
    label: 'Ver Ficha Causa',
    icon: 'pi pi-book',
    command: () => openFichaCausa()
  }
])
</script>
