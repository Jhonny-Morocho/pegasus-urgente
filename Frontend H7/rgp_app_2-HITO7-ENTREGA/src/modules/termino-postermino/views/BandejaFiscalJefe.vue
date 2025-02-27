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
      v-for="table in tab.items"
      :key="table.title"
      :header="table.title"
    >
      <AppFilters
        v-model="fiscalJefe.filters"
        @filter="getDataBandeja"
      />

      <TablaEscritorioFiscal
        v-model:first="fiscalJefe.firstRecord"
        v-model:selection="propuestasSeleccionadas"
        :loading="fiscalJefe.isLoading"
        :no-column-mas-info="false"
        :rows="paginacion?.tamanoPagina"
        selectable
        :total-records="paginacion?.elementosTotales"
        :value="causas"
        @aceptar-propuesta="aceptarPropuesta"
        @iniciar:tarea="iniciarTarea"
        @page="getDataBandeja"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaEscritorioFiscal from '@/modules/termino-postermino/components/tablas/TablaEscritorioFiscal.vue'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { requestUtil, dateTimeUtil, appUtil } from '@/utils'
import {
  useBandejaFiscalJefe,
  useTermino
} from '@/modules/termino-postermino/composables/'
import {
  useAppGlobalProperties,
  useConfirmDialog
} from '@/modules/common/composables'
import { useSessionStore } from '@/modules/session/composables'
import { useRouter } from 'vue-router'
import {
  useBuscarDuplicidadStore,
  useDelitoStore,
  useDocumentoStore,
  useEspeciesDineroStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import {
  useCrearCausaStore,
  useIdentificacionDenunciaStore
} from '@/modules/ingreso/composables'

const router = useRouter()

const { taskStatus } = appUtil
const { launchConfirmDialog } = useConfirmDialog()

const { $userFiscaliaActual } = useAppGlobalProperties()

const { roles } = useSessionStore()
const { pam_iniciarProceso } = usePamStore()

const { bandejaFiscalJefe_getDataBandeja, causas, paginacion } =
  useBandejaFiscalJefe()

const { termino_SET_ID_DENUNCIA, termino_SET_RUC, termino_SET_CAUSA } =
  useTermino()

/* ============= Composables Nueva Denuncia de Oficio ============== */

const {
  identificacionDenuncia_SET_DEFAULT_STATE,
  identificacionDenuncia_getTipoDenuncia
} = useIdentificacionDenunciaStore()
const { buscarDuplicidad_RESET } = useBuscarDuplicidadStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { sujetosIntervinientes_SET_DEFAULT_STATE } =
  useSujetosIntervinientesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const { tipoDenuncia, crearCausa_RESET_RUC } = useCrearCausaStore()
/* =========================== */

// VALUES

const fiscalJefe = reactive({
  isLoading: false,
  filters: {
    prioritario: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    status: `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
  },
  firstRecord: 0
})

const propuestasSeleccionadas = ref([])

onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value
  console.log({ roles })
  const grupoFiscalJefe = roles.value.find((r) =>
    r.includes(`${fiscalia}_fiscal_jefe_TPT`)
  )
  fiscalJefe.filters.grupo = grupoFiscalJefe
  getDataBandeja(paginacion)
})

async function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    fiscalJefe.firstRecord = 0
  }

  if (!fiscalJefe.filters.grupo) {
    openNoRoleMatch()
    return
  }
  requestUtil({
    action: bandejaFiscalJefe_getDataBandeja,
    payload: {
      params: {
        ...fiscalJefe.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        buscador: fiscalJefe.filters.buscador?.trim().length
          ? fiscalJefe.filters.buscador
          : undefined,
        'fecha-desde': formatDate(fiscalJefe.filters['fecha-desde']),
        'fecha-hasta': formatDate(fiscalJefe.filters['fecha-hasta'])
      }
    },
    loader: (l) => {
      fiscalJefe.isLoading = l
    }
  })
}

const { pam_SET_PROCESO } = usePamStore()

const iniciarTarea = ({ data: { causa }, tarea }) => {
  termino_SET_RUC(causa.ruc)
  termino_SET_ID_DENUNCIA(causa.idDenuncia || '')
  termino_SET_CAUSA(causa)
  pam_SET_PROCESO(tarea)
  console.log(`Id denuncia: ${causa.idDenuncia}`)

  if (tarea?.taskName === 'Revisar Consulta') {
    router.push({ name: 'TPTFJRevisarConsultaTermino' })
  } else if (
    causa?.procesoPam?.taskName === 'Revisar Transferencia de causas'
  ) {
    router.push({ name: 'TPTFJRevisarTransferenciaCausas' })
  } else if (causa?.procesoPam?.taskName === 'Revisar Agrupación de causas') {
    router.push({ name: 'RevisarAgrupacionCausas' })
  }
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

const tab = reactive({
  active: 0,
  items: [
    { title: 'Tareas en Curso', origenTabla: 'enCurso' },
    { title: 'Tareas por Vencer', origenTabla: 'porVencer' },
    { title: 'Tareas Vencidas', origenTabla: 'vencidas' },
    { title: 'Tareas Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Tareas Completadas', origenTabla: 'completadas' }
  ]
})

function tabChange ({ index }) {
  switch (index) {
    case 0:
      fiscalJefe.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 1:
      fiscalJefe.filters.status = 'InProgress,Ready'
      break
    case 2:
      fiscalJefe.filters.status = 'InProgress,Ready'
      break
    case 3:
      fiscalJefe.filters.status = 'InProgress,Ready'
      break
    case 8:
      fiscalJefe.filters.status = taskStatus.COMPLETED
      break
  }
  handleCleanFilters()
}

function handleCleanFilters () {
  fiscalJefe.filters['fecha-hasta'] = undefined
  fiscalJefe.filters['fecha-desde'] = undefined
  fiscalJefe.filters.buscador = undefined

  getDataBandeja(fiscalJefe.filters)
}

function gestionarNecesidadServicio () {
  router.push('/termino-postermino/fiscal-jefe/ver-carga-trabajo/carga-fiscal')
}

/* ============= Handle Nueva Denuncia de Oficio ============== */

function handleNuevaAtencion () {
  fiscalJefe.isLoading = true
  limpiarStore()
  const payload = {
    tipoDenuncia: tipoDenuncia.value,
    region: `${$userFiscaliaActual.value.region}`,
    fiscalia: `${$userFiscaliaActual.value.fiscalia}`
  }

  // se setea en identificación denuncia store el objeto tipo denuncia 'DE OFICIO' con el código del mantenedor
  identificacionDenuncia_getTipoDenuncia('3')

  requestUtil({
    action: pam_iniciarProceso,
    payload: payload,
    resolve: () => {
      fiscalJefe.isLoading = false
      router.push(
        '/ingreso/denuncia-oficio/nueva-denuncia/identificacion-denuncia'
      )
    },
    reject: (err) => {
      console.log(err)
    }
  })
}

function limpiarStore () {
  identificacionDenuncia_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  buscarDuplicidad_RESET()
  crearCausa_RESET_RUC()
}

/* ====================================== */

const aceptarMultiplesPropuestas = (propuestas) => {
  propuestas.forEach((propuesta) => aceptarPropuesta(propuesta))
}

const aceptarPropuesta = ({
  data: {
    causa: { ruc }
  }
}) => {
  console.log('Propuesta para aceptar (En Desarrollo 👷): ', ruc)
}

const itemsMenuSuperior = ref([
  {
    label: 'Nuevo',
    icon: 'pi pi-plus-circle',
    items: [
      {
        label: 'Denuncia de Oficio',
        command: () => handleNuevaAtencion()
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Gestionar Necesidad de Servicio',
        command: () => gestionarNecesidadServicio()
      }
    ]
  },
  {
    label: 'Aceptar Propuesta',
    icon: 'pi pi-check-circle',
    disabled: () => !propuestasSeleccionadas.value.length,
    command: () => aceptarMultiplesPropuestas(propuestasSeleccionadas.value)
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => location.reload()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: () => console.log('Exportar')
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',
    command: () => console.log('Limpiar Filtros')
  }
])
</script>
