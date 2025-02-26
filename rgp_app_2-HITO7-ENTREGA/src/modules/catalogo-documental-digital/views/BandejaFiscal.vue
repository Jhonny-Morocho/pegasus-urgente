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
      v-for="item in tab.items"
      :key="item.title"
      :header="item.title"
    >
      <AppFilters v-model="tablaTareasFiscal.filters" />
      <div v-if="isLoadig">
        <LoaderSkeleton />
      </div>
      <TablaBandejaCDD
        v-else
        :loading="loading"
        :rows="paginacionBandejaFiscal?.tamanoPagina"
        style="width: 100%"
        :total-records="paginacionBandejaFiscal?.elementosTotales"
        :value="tareasFiscal"
        @page="getDataBandeja"
        @send-to="sendTo"
        @tasking="setLoading"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
// COMPONENTS
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaBandejaCDD from '@/modules/catalogo-documental-digital/components/bandeja/TablaBandejaCDD.vue'
import { useAppToast } from '@/modules/common/composables'

// UTILS
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

// COMPOSABLES
import { appUtil, requestUtil } from '@/utils'
import { useCreacionYGestionDeCDD, useMantenedorCDD, useSolicitudesFiscalCDD } from '../composables'

const router = useRouter()
const { taskStatus } = appUtil
const { toastError } = useAppToast()
const { creacionYGestionDeCDD_SET_DEFAULT_STATE } = useCreacionYGestionDeCDD()
const { mantenedorCDD_getTipoCatalogo } = useMantenedorCDD()
const {
  solicitudesFiscalCDD_getDataBandejaFiscal,
  paginacionBandejaFiscal,
  tareasFiscal,
  solicitudesFiscalCDD_SET_TASK_ID,
  solicitudesFiscalCDD_getSolicitudActualizacionById,
  solicitudesFiscalCDD_getSolicitudAnalisisRecuperacionDocuFisicoById,
  solicitudesFiscalCDD_getSolicitudRevisionAlmacenamientoFisico,
  solicitudesFiscalCDD_getSolicitudEliminacionArchivo
} = useSolicitudesFiscalCDD()

// VALUES
const isLoadig = ref(false)
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

const tablaTareasFiscal = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    status: `${taskStatus.READY}`
  },
  firstRecord: 0
})

// LOGIC
onMounted(() => {
  getDataBandeja()
})

const itemsMenuSuperior = ref([
  {
    label: 'CDD',
    icon: 'pi pi-plus-circle',
    items: [
      {
        label: 'Solicitud de creación de catálogo documental digital',
        command: () => {
          requestUtil({
            action: mantenedorCDD_getTipoCatalogo,
            resolve: () => {
              router.push({ name: 'CDDSCreacionCatalogo' })
            }
          })
        }
      },
      {
        label: 'Ingreso de Solicitud de Gestión de Documento o Archivo',
        command: () => router.push({ name: 'CddSolicitudGestionDocumento' })
      },
      {
        label: 'Solicitud de Eliminación de Documento',
        command: () => router.push({ name: 'CddSolicitudEliminacionDocumento' })
      }
    ]
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-refresh',
    command: () => getDataBandeja()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: () => {}
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',
    command: () => {}
  }
])

function getDataBandeja () {
  creacionYGestionDeCDD_SET_DEFAULT_STATE()
  requestUtil({
    action: solicitudesFiscalCDD_getDataBandejaFiscal,
    payload: {
      params: {
        search: tablaTareasFiscal?.filters?.buscador?.trim().length
          ? tablaTareasFiscal.filters.buscador
          : undefined,
        page: tablaTareasFiscal?.page || 0,
        size: tablaTareasFiscal?.rows || 10,
        status: tablaTareasFiscal?.filters?.status,
        orderAsc: false
      }
    },
    resolve: (data) => {},
    reject: () => {
      toastError('Ha ocurrido un problema con la obteción de datos.')
    },
    loader: (l) => {
      isLoadig.value = l
    }
  })
}

function tabChange ({ index }) {
  switch (index) {
    case 0:
      tablaTareasFiscal.filters.prioritario = undefined
      tablaTareasFiscal.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 1:
      tablaTareasFiscal.filters.prioritario = undefined
      tablaTareasFiscal.filters.status = taskStatus.COMPLETED
      break
  }
}

async function sendTo (to, data) {
  console.log(data)
  requestUtil({ action: creacionYGestionDeCDD_SET_DEFAULT_STATE })
  const idSolicitud = data.tarea.taskInputData.objetoGCD?.id_solicitud

  if (data.tarea.taskName === 'Analizar Actualización Documento') {
    await requestUtil({
      action: solicitudesFiscalCDD_getSolicitudActualizacionById,
      payload: {
        idSolicitud: idSolicitud,
        taskId: data.tarea.taskId
      },
      resolve: () => {},
      reject: (err) => {
        console.error(err)
      }
    })
  } else if (data.tarea.taskName === 'Analizar solicitud de recuperación de documento físico') {
    await requestUtil({
      action:
        solicitudesFiscalCDD_getSolicitudAnalisisRecuperacionDocuFisicoById,
      payload: {
        idSolicitud: idSolicitud,
        taskId: data.tarea.taskId
      },
      resolve: () => {},
      reject: (err) => {
        console.error(err)
      }
    })
  } else if (data.tarea.taskName === 'Revisión de Solicitud de Almacenamiento Físico') {
    console.log(data.tarea.taskId)
    solicitudesFiscalCDD_SET_TASK_ID(data.tarea.taskId)

    await requestUtil({
      action: solicitudesFiscalCDD_getSolicitudRevisionAlmacenamientoFisico,
      payload: {
        idSolicitud: data.data.objetoGCD.id_solicitud,
        taskId: data.tarea.taskId
      },
      resolve: () => {},
      reject: (err) => {
        console.error(err)
      }
    })
  } else if (data.tarea.taskName === 'Revision de Solicitud de Eliminación de Documento Físico') {
    await requestUtil({
      action: solicitudesFiscalCDD_getSolicitudEliminacionArchivo,
      payload: {
        idSolicitud: data.data.objetoECD.id_solicitud,
        taskId: data.tarea.taskId
      },
      resolve: () => {},
      reject: (err) => {
        console.error(err)
      }
    })
  }
  router.push(to)
}

function setLoading (l) {
  tablaTareasFiscal.isLoading = l
}
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
