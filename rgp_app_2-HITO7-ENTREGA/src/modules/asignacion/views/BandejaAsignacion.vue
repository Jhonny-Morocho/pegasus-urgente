<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Fiscal Jefe"
  />
  <TabView
    v-model:activeIndex="tab.active"
    class="tabview"
    @tab-change="tabChange"
  >
    <TabPanel
      v-for="item in tab.items"
      :key="item.title"
      :header="item.title"
    >
      <AppFilters
        v-model="asignacion.filters"
        @filter="getDataBandeja"
      />
      <div v-if="asignacion.isLoading">
        <LoaderSkeleton />
      </div>
      <TablaEscritorioAsignacion
        v-else
        v-model:causa="causasSeleccionadas"
        v-model:first="asignacion.firstRecord"
        :loading="asignacion.isLoading"
        :origen-tabla="item.origenTabla"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="causasBandeja"
        @aprobar-propuesta="confirmAceptarPropuestas"
        @iniciar:tarea="iniciarTarea"
        @page="getDataBandeja"
        @ver-ficha-causa="openFichaCausa"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { inject, reactive, onMounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import {
  useAppDialog,
  useAppGlobalProperties,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import {
  useActividadStore,
  useBuscarDuplicidadStore,
  useDelitoStore,
  useDocumentoStore,
  useEspeciesDineroStore,
  useGeorreferenciaStore,
  useMantenedorStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import {
  useCrearCausaStore,
  useIdentificacionDenunciaStore
} from '@/modules/ingreso/composables'
import {
  useBandejaAsignacionStore,
  useCausaAsignacionStore,
  useFlujoPamAsignacion
} from '@/modules/asignacion/composables'
import { useFichaCausa } from '@/modules/ficha-causa/composables'
import { useAntecedentesCausaData } from '@/modules/preclasificador/composables'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import TablaEscritorioAsignacion from '@/modules/asignacion/components/bandeja/TablaEscritorioAsignacion.vue'

const router = useRouter()

const emitter = inject('emitter')

const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()

const { taskStatus, includeWord, scrollTo } = appUtil

const { $userFiscaliaActual, $userRoles } = useAppGlobalProperties()

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

const { causasBandeja, paginacion, bandejaAsignacion_getDataBandeja } =
  useBandejaAsignacionStore()

const {
  causaAsignacion_SET_RUC,
  causaAsignacion_SET_ID_DENUNCIA,
  causaAsignacion_SET_HAS_PROPUESTA_ASIGNACION,
  causaAsignacion_SET_CAUSA_ACTUAL,
  causaAsignacion_SET_DEFAULT_STATE,
  causaAsignacion_aprobarMultiplesPropuestasAsignacion
} = useCausaAsignacionStore()

const { pam_SET_PROCESO, pam_iniciarProceso } = usePamStore()

const {
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getTiposDenuncia
  // mantenedor_getAllFiscales
} = useMantenedorStore()

const {
  tipoDenuncia,
  crearCausa_SET_TIPO_DENUNCIA,
  crearCausa_RESET_RUC
} = useCrearCausaStore()

const {
  identificacionDenuncia_getTipoDenuncia,
  identificacionDenuncia_SET_DEFAULT_STATE
} = useIdentificacionDenunciaStore()

const {
  buscarDuplicidad_RESET
} = useBuscarDuplicidadStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const { sujetosIntervinientes_SET_DEFAULT_STATE } = useSujetosIntervinientesStore()
const { georreferencia_RESET_FISCALIAS_COMPETENTES } = useGeorreferenciaStore()
const { actividad_RESET_ACTIVIDADES } = useActividadStore()
const { resetAntecedentesCausaData } = useAntecedentesCausaData()
const { resetFlujoPamAsignacion } = useFlujoPamAsignacion()

const tab = reactive({
  active: 0,
  items: [
    { title: 'En Curso', origenTabla: 'enCurso' },
    { title: 'Por Vencer', origenTabla: 'porVencer' },
    { title: 'Vencidas', origenTabla: 'vencidas' },
    { title: 'Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Completadas', origenTabla: 'completadas' }
  ]
})

const causasSeleccionadas = ref([])

const asignacion = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    // status: `${taskStatus.READY},${taskStatus.IN_PROGRESS},${taskStatus.RESERVED}`,
    status: `${taskStatus.RESERVED}`
  },
  firstRecord: 0
})

onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value

  asignacion.filters.grupo = $userRoles.value.find((r) =>
    r.includes(`${fiscalia}_fiscal_jefe_ASI`)
  )

  getDataMantenedor()
  getDataBandeja()
})

function tabChange ({ index }) {
  switch (index) {
    case 0:
      asignacion.filters.prioritario = undefined
      // asignacion.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS},${taskStatus.RESERVED}`
      asignacion.filters.status = `${taskStatus.RESERVED}`
      break
    case 1:
      asignacion.filters.prioritario = undefined
      asignacion.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 2:
      asignacion.filters.prioritario = undefined
      asignacion.filters.status = taskStatus.OBSOLETE
      break
    case 3:
      asignacion.filters.prioritario = true
      asignacion.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 4:
      asignacion.filters.prioritario = undefined
      asignacion.filters.status = taskStatus.COMPLETED
      break
  }
  handleCleanFilters()
}

async function handleCleanFilters () {
  asignacion.filters['fecha-hasta'] = undefined
  asignacion.filters['fecha-desde'] = undefined
  asignacion.filters.buscador = undefined

  getDataBandeja(asignacion.filters)
}

function formatDate (value) {
  if (value) {
    return dateTimeUtil.formatToBackend(value)
  }
  return undefined
}

async function openNoRoleMatch () {
  nextTick(() => {
    launchConfirmDialog({
      header: 'Advertencia',
      message: 'Usted no posee el rol necesario para ejecutar esta tarea',
      acceptLabel: 'OK',
      rejectClass: 'hidden'
    })
  })
}

/** Actualizar la Tabla **/
function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    asignacion.firstRecord = 0
  }

  if (!asignacion.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: bandejaAsignacion_getDataBandeja,
    payload: {
      params: {
        ...asignacion.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        buscador: asignacion.filters.buscador?.trim().length
          ? asignacion.filters.buscador
          : undefined,
        'fecha-desde': formatDate(asignacion.filters['fecha-desde']),
        'fecha-hasta': formatDate(asignacion.filters['fecha-hasta'])
      }
    },
    loader: (v) => {
      asignacion.isLoading = v
    }
  })
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFamiliasDelito })
  requestUtil({ action: mantenedor_getTiposDelito })
  requestUtil({ action: mantenedor_getTiposDenuncia })
  // se desactiva llmada hasta nuevo aviso cuando back mejore el endpoint
  // requestUtil({ action: mantenedor_getAllFiscales })
}

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}

function iniciarTarea (tareaCausa) {
  const { data, tarea } = tareaCausa

  resetFUD()

  causaAsignacion_SET_RUC(data?.causa?.ruc)
  causaAsignacion_SET_ID_DENUNCIA(data?.causa?.idDenuncia)
  causaAsignacion_SET_HAS_PROPUESTA_ASIGNACION(data?.causa?.existePropuestaAsignacion)
  causaAsignacion_SET_CAUSA_ACTUAL(data)
  pam_SET_PROCESO(tarea)

  scrollTo(0)
  pushToStep(tarea?.taskName)
}

function openFichaCausa (tareaCausa) {
  const { tarea, data } = tareaCausa
  const { causa } = data

  resetFUD()

  pam_SET_PROCESO(tarea)

  sendToFichaCausa({
    origenCausa: flujoOrigen.TRANSVERSAL,
    ruc: causa?.ruc,
    idCausa: causa?.idCausa,
    idDenuncia: causa?.idDenuncia,
    newTab: true
  })
}

const tareasAsignacion = [
  { nombreTarea: 'Sugerir FR', routeName: 'ARevisarPropuestaAsignacion' },
  { nombreTarea: 'Decidir Propuesta', routeName: 'ARevisarPropuestaAsignacion' },
  { nombreTarea: 'Calidad', routeName: 'RAAntecedentesCausa' },
  { nombreTarea: 'Decidir Asignación', routeName: 'DAAnalizarDecision' },
  { nombreTarea: 'Clasificar por Complejidad', routeName: 'DASeguirLineaInvestigativa' },
  { nombreTarea: 'Separar Causas', routeName: 'DATransferirCausa' },
  { nombreTarea: 'Agrupar Causas', routeName: 'DAAgruparCausa' },
  { nombreTarea: 'Indicar Motivo', routeName: 'DADesestimarCausa' }
]

function pushToStep (nombreTarea) {
  const tareaAsignacionFound = tareasAsignacion.find(
    tareaAsignacion => includeWord(nombreTarea, tareaAsignacion.nombreTarea)
  )

  router.push({ name: tareaAsignacionFound.routeName })
}

function aceptarPropuestasPreclasificador (payload) {
  requestUtil({
    action: causaAsignacion_aprobarMultiplesPropuestasAsignacion,
    payload: {
      causas: payload
    },
    resolve: () => {
      const masDeUna = payload?.length > 1
      const mensaje = `${
        masDeUna ? 'Propuestas aceptadas' : 'Propuesta aceptada'
      } exitosamente`
      toastSuccess(mensaje)
      causasSeleccionadas.value = []
      getDataBandeja()
    }
  })
}

function confirmAceptarPropuestas (causa = undefined) {
  if (causa) {
    causasSeleccionadas.value = [causa]
  }

  const masDeUna = causasSeleccionadas.value.length > 1

  launchConfirmDialog({
    message: `¿Estás seguro(a) de querer aceptar ${
      masDeUna ? 'las propuestas seleccionadas' : 'la propuesta seleccionada'
    }?`,
    accept: () => {
      const causasAceptadas = causasSeleccionadas.value?.map(({ tarea }) => `${tarea?.taskId}`)
      aceptarPropuestasPreclasificador(causasAceptadas)
    }
  })
}

function handleModalCargaTrabajo () {
  launchDialog({
    component: ModalCargaTrabajo,
    header: 'Carga de Trabajo FL y Unidades',
    width: '90%'
  })
}

function resetFUD () {
  identificacionDenuncia_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  buscarDuplicidad_RESET()
  crearCausa_RESET_RUC()
  causaAsignacion_SET_DEFAULT_STATE()
  georreferencia_RESET_FISCALIAS_COMPETENTES()
  actividad_RESET_ACTIVIDADES()
  resetAntecedentesCausaData()
  resetFlujoPamAsignacion()
}

function nuevaDenunciaOficio () {
  resetFUD()
  crearCausa_SET_TIPO_DENUNCIA('oficio')
  const payload = {
    tipoDenuncia: tipoDenuncia.value,
    region: `${$userFiscaliaActual.value.region}`,
    fiscalia: `${$userFiscaliaActual.value.fiscalia}`
  }
  mantenedor_getTiposDenuncia()

  // se setea en identificación denuncia store el objeto tipo denuncia 'DE OFICIO' con el código del mantenedor
  identificacionDenuncia_getTipoDenuncia('3')

  requestUtil({
    action: pam_iniciarProceso,
    payload: payload,
    resolve: () => {
      router.push('/ingreso/denuncia-oficio/nueva-denuncia/identificacion-denuncia')
    },
    reject: (err) => {
      console.log(err)
    }
  })
}

const itemsMenuSuperior = ref([
  {
    label: 'Nuevo',
    icon: 'pi pi-plus-circle',

    items: [
      {
        label: 'Denuncia Oficio',
        command: async () => {
          nuevaDenunciaOficio()
        }
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',

    items: [
      {
        label: 'Carga de Trabajo FL',
        command: () => handleModalCargaTrabajo()
      }
    ]
  },
  {
    label: 'Aceptar Propuesta',
    icon: 'pi pi-check-circle',

    command: () => confirmAceptarPropuestas(),
    disabled: () => !causasSeleccionadas.value.length
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',

    command: () => getDataBandeja()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',

    command: () => exportTable()
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',

    command: () => handleCleanFilters()
  }
])
</script>

<style lang="scss" scoped>
.tabview {
  i,
  span {
    vertical-align: middle;
  }

  span {
    margin: 0 0.5rem;
  }
}

.p-tabview p {
  line-height: 1.5;
  margin: 0;
  padding: 0;
}
</style>
