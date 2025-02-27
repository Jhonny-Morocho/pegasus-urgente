<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Oficina Partes"
  />
  <TabView
    v-model:activeIndex="tab.active"
    class="tabview"
  >
    <TabPanel
      v-for="item in tab.items"
      :key="item.title"
      :header="item.title"
    >
      <AppFilters v-model="bandejaPartes.filters" />
      <div v-if="bandejaOfPartes.isLoading">
        <LoaderSkeleton />
      </div>

      <TablaBandejaCDD
        v-else
        :loading="loading"
        :rows="paginacionBandeja?.tamanoPagina"
        style="width: 100%"
        :total-records="paginacionBandeja?.elementosTotales"
        :value="tareasBandeja"
        @send-to="sendTo"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { useRouter } from 'vue-router'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import TablaBandejaCDD from '@/modules/catalogo-documental-digital/components/bandeja/TablaBandejaCDD.vue'
import { useSolicitudesOfDePartesCdd } from '../composables'
import { useAppToast } from '@/modules/common/composables'

const { taskStatus } = appUtil
const router = useRouter()

const {
  solicitudesOfPartesCdd_getDataSolicitudIngresoDocumento,
  solicitudesOfPartesCdd_getDataBandeja,
  solicitudesOfPartesCdd_SET_TASK_ID,
  tareasBandeja,
  paginacionBandeja
} = useSolicitudesOfDePartesCdd()

const { toastError } = useAppToast()

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

const bandejaPartes = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    status: `${taskStatus.READY},${taskStatus.IN_PROGRESS},${taskStatus.RESERVED}`
  },
  firstRecord: 0
})

onMounted(() => {
  getDataBandeja()
})

const bandejaOfPartes = reactive({
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

function getDataBandeja () {
  bandejaOfPartes.isLoading = true
  requestUtil({
    action: solicitudesOfPartesCdd_getDataBandeja,
    payload: {
      params: {
        search: bandejaOfPartes?.filters?.buscador?.trim().length
          ? bandejaOfPartes.filters.buscador
          : undefined,
        page: bandejaOfPartes?.page || 0,
        size: bandejaOfPartes?.rows || 10,
        orderAsc: false
      }
    },
    resolve: (data) => {
      bandejaOfPartes.isLoading = false
    },
    reject: () => {
      bandejaOfPartes.isLoading = false
      toastError('Ha ocurrido un problema con la obteción de datos.')
    }
  })
}

function sendTo (to, data) {
  console.log(data)
  solicitudesOfPartesCdd_SET_TASK_ID(data.tarea.taskId)
  requestUtil({
    action: solicitudesOfPartesCdd_getDataSolicitudIngresoDocumento,
    payload: {
      id: data.data.objetoGCD.id_solicitud
    },
    resolve: () => {
      bandejaOfPartes.isLoading = false
      router.push(to)
    },
    reject: () => {
      bandejaOfPartes.isLoading = false
      toastError('Ha ocurrido un problema. Intente nuevamente.')
    }
  })
}

const itemsMenuSuperior = ref([
  {
    label: 'Nuevo',
    icon: 'pi pi-plus-circle',
    items: [
      {
        label: 'Ingreso de documento oficina de partes',
        command: () => router.push({ name: 'CddNuevoDocumentoPartes' })
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
    icon: 'pi pi-download'
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash'
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
