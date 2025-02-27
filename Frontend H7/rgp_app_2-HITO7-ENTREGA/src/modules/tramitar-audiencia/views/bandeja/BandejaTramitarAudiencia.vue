<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Fiscal"
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
        v-model="fiscal.filters"
        @filter="getDataBandeja"
      />
      <div v-if="fiscal.isLoading">
        <LoaderSkeleton />
      </div>
      <TablaEscritorioFiscal
        v-else
        v-model:first="fiscal.firstRecord"
        :loading="fiscal.isLoading"
        :no-column-mas-info="false"
        :total-records="paginacion?.elementosTotales"
        :value="tareasBandeja?.data?.data"
        @iniciar:tarea="iniciarTarea"
        @page="getDataBandeja"
        @send-to="sendTo"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
/* eslint-disable */
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaEscritorioFiscal from '@/modules/tramitar-audiencia/components/TablaEscritorioFiscal.vue'
import { onMounted, reactive, nextTick } from 'vue'
import { useAppGlobalProperties, useConfirmDialog, useAppToast } from '@/modules/common/composables';
import { useSessionStore } from '@/modules/session/composables'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import { useBandejaTramitarAudiencia, useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { useRouter } from 'vue-router'
import { useTermino } from '@/modules/termino-postermino/composables'
import { useRelacionesStore } from '@/modules/global/composables'

const router = useRouter()

const { launchConfirmDialog } = useConfirmDialog()
const { toastError } = useAppToast()
const { taskStatus } = appUtil

const { $userFiscaliaActual } = useAppGlobalProperties()

const { roles } = useSessionStore()

const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()

const { bandejaTramitarAudiencia_getDataBandeja, tareasBandeja, paginacion } = useBandejaTramitarAudiencia()

const {
  tramitarAudiencia_SET_CAUSA,
  tramitarAudiencia_SET_ID_DENUNCIA,
  tramitarAudiencia_SET_RUC,
  tramitarAudiencia_getMinuta
} = useTramitarAudiencia()

// VALUES
const fiscal = reactive({
  isLoading: false,
  filters: {
    buscador: undefined,
    prioritario: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined
  },
  firstRecord: 0
})

// LOGIC
onMounted(() => {
  // Se busca si coincide el rol del usuario con el permitido para la bandeja
  const { fiscalia } = $userFiscaliaActual.value
  const grupoFiscal = roles.value.find((r) => r.includes(`${fiscalia}_equipo_juridico_TAU`))
  fiscal.filters.grupo = grupoFiscal

  getDataBandeja()
})

/* === Rutas hacia tareas === */

const { termino_SET_ID_DENUNCIA } = useTermino();

const iniciarTarea = (causa) => {
  setDefaultState()

  tramitarAudiencia_SET_RUC(causa.ruc ?? causa['task-input-data'].causa.ruc)
  tramitarAudiencia_SET_ID_DENUNCIA(causa.idDenuncia ?? causa['task-input-data'].causa.idDenuncia)
  termino_SET_ID_DENUNCIA(causa.idDenuncia ?? causa['task-input-data'].causa.idDenuncia)
  tramitarAudiencia_SET_CAUSA(causa)
  console.log(`Id denuncia: ${causa.idDenuncia ?? causa['task-input-data'].causa.idDenuncia}`)
  console.log(`task name: ${causa['task-name']}`)
}

async function sendTo(to, data) {
  if (data?.procesoPam?.taskName === 'Solicitar Audiencia') {
    // ...
  } else if (data?.procesoPam?.taskName === 'Evaluar Resolucion del Tribunal') {
    // ...
  } else if (data?.procesoPam?.taskName === 'Actualizar Minuta' || data['task-name'] === 'Actualiza Minuta') {
    await requestUtil({
      action: tramitarAudiencia_getMinuta,
      payload: { 
        idSolicitud: data['task-input-data'].solicitud.id,
        idTarea: data['task-id']
      },
      reject: () => { toastError('Algo salió mal, vuelva a intentarlo más tarde') }
    })
  } else if (data?.procesoPam?.taskName === 'Gestionar Previo Resolver') {
    // ...
  } else if (data?.procesoPam?.taskName === 'Nómina de Detenidos a ACD') {
    // ...
  } else if (data?.procesoPam?.taskName === 'Revisar Minuta y agendamiento de audiencia') {
    // ...
  } else if (data?.procesoPam?.taskName === 'Vista de Audiencia') {
    // ...
  } else if (data?.procesoPam?.taskName === 'Consolidar Resultado de Audiencia') {
    // ...
  }

  router.push(to)
}

function setDefaultState() {
  relaciones_SET_DEFAULT_STATE()
}

/*===========================*/

async function getDataBandeja(pagination = undefined) {
  if (!pagination) {
    fiscal.firstRecord = 0
  }

  if (!fiscal.filters.grupo) {
    openNoRoleMatch()
    return
  }
  const params = {
    ...fiscal.filters,
    page: pagination?.page || 0,
    size: pagination?.rows || 10,
    buscador: fiscal.filters.buscador?.trim().length ? fiscal.filters.buscador : undefined,
    'fecha-desde': formatDate(fiscal.filters['fecha-desde']),
    'fecha-hasta': formatDate(fiscal.filters['fecha-hasta'])
  }
  requestUtil({
    action: bandejaTramitarAudiencia_getDataBandeja,
    payload: {
      params
    }
  })
}

function formatDate(value) {
  if (value) {
    return dateTimeUtil.formatToBackend(value)
  }
  return undefined
}

async function openNoRoleMatch() {
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
    { title: 'En Curso', origenTabla: 'enCurso' },
    { title: 'Por Vencer', origenTabla: 'solicitudes' },
    { title: 'Vencidas', origenTabla: 'vencidas' },
    { title: 'Prioritarias', origenTabla: 'prioritario' },
    { title: 'Completadas', origenTabla: 'completed' }
  ]
})

function tabChange({ index }) {
  switch (index) {
    case 0:
      fiscal.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 1:
      fiscal.filters.status = 'InProgress,Ready'
      break
    case 2:
      fiscal.filters.status = 'InProgress,Ready'
      break
    case 3:
      fiscal.filters.status = 'InProgress,Ready'
      break
    case 8:
      fiscal.filters.status = taskStatus.COMPLETED
      break
  }
  handleCleanFilters()
}

function handleCleanFilters() {
  fiscal.filters['fecha-hasta'] = undefined
  fiscal.filters['fecha-desde'] = undefined
  fiscal.filters.buscador = undefined

  getDataBandeja(fiscal.filters)
}

// const emitter = inject('emitter')

const itemsMenuSuperior = [
  {
    label: 'CDD',
    icon: 'pi pi-briefcase',
    items: [
      {
        label: 'Solicitud de Creación de Catálogo Documental Digital'
      },
      {
        label: 'Ingreso de Solicitud de Gestión de Documento o Archivo'
      }
    ]
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => location.reload()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: () => exportTable()
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',
    command: () => console.log('Limpiar Filtros')
  }
]

function exportTable() {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}
</script>
