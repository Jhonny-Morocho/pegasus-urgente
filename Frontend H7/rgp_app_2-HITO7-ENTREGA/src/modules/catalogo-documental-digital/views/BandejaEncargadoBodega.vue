<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Encargado Bodega"
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
      <AppFilters v-model="bandejaBodega.filters" />
      <div v-if="isLoading">
        <LoaderSkeleton />
      </div>
      <TablaBandejaCDD
        v-else
        :loading="loading"
        :rows="paginacionBandejaBodega?.tamanoPagina"
        style="width: 100%"
        :total-records="paginacionBandejaBodega?.elementosTotales"
        :value="tareasEncargadoBodega"
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

// UTILS
import { onMounted, reactive, ref } from 'vue'
import { appUtil, requestUtil } from '@/utils'
import router from '@/router'

// COMPONSABLES
import { useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'
const { taskStatus } = appUtil
const {
  solicitudesEncargadoBodega_getDataBandeja,
  tareasEncargadoBodega,
  paginacionBandejaBodega,
  solicitudesEncargadoBodega_getSolicitudRecuperacionDocuFisico,
  solicitudesEncargadoBodega__SET_DEFAULT_STATE,
  solicitudesEncargadoBodega_getSolicitudRegistroIngresoDocuFisico,
  solicitudesEncargadoBodega_getSolicitudAgendamiento
} = useSolicitudesEncargadoBodega()

// VALUES
const isLoading = ref(false)

// LOGIC
onMounted(() => {
  getDataBandeja()
})

function getDataBandeja () {
  requestUtil({ action: solicitudesEncargadoBodega__SET_DEFAULT_STATE })

  requestUtil({
    action: solicitudesEncargadoBodega_getDataBandeja,
    payload: {
      params: {
        search: bandejaBodega?.filters?.buscador?.trim().length
          ? bandejaBodega.filters.buscador
          : undefined,
        page: bandejaBodega?.page || 0,
        size: bandejaBodega?.rows || 10,
        status: bandejaBodega?.filters?.status,
        orderAsc: false
      }
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
}

async function sendTo (to, data) {
  console.log(data.tarea.taskId)
  if (data.tarea.taskName === 'Revisión solicitud de recuperación de documento físico' || data.tarea.taskName === 'Registrar salida documento') {
    await requestUtil({
      action: solicitudesEncargadoBodega_getSolicitudRecuperacionDocuFisico,
      payload: {
        id: data.data.objetoGCD.id_solicitud,
        taskId: data.tarea.taskId
      }
    })
  } else if (data.tarea.taskName.includes('Registro de ingreso de documento físico a bodega')) {
    await requestUtil({
      action: solicitudesEncargadoBodega_getSolicitudRegistroIngresoDocuFisico,
      payload: {
        id: data.data.objetoGCD.id_solicitud,
        taskId: data.tarea.taskId
      }
    })
  } else if (
    data.tarea.taskName.includes('Agendamiento') ||
    data.tarea.taskName.includes('Destrucción') ||
    data.tarea.taskName.includes('Devolución')) {
    await requestUtil({
      action: solicitudesEncargadoBodega_getSolicitudAgendamiento,
      payload: {
        idFilenet: data.tarea.taskInputData.documento.object_id,
        taskId: data.tarea.taskId,
        idSolicitud: data.tarea.taskInputData.documento.object_id
      }
    })
  }
  router.push(to)
}

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

const bandejaBodega = reactive({
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

const itemsMenuSuperior = ref([
  {
    label: 'Registros',
    icon: 'pi pi-plus-circle',
    items: [
      {
        label: 'Registro de Reingreso de documento físico',
        command: () =>
          router.push({ name: 'CddRegistroReingresoDocumentoFisico' })
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

function setLoading (l) {
  console.log(l)
  bandejaBodega.isLoading = l
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
