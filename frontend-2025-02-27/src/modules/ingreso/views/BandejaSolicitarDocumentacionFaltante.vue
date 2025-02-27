<template>
<section>
  <section>
    <PageHeader
      inbox-action-btns
      :items-menu-superior="itemsMenuSuperior"
      label-new="Nuevo ingreso de partes"
      page-title="Bandeja Oficina de Partes"
      @action:export="exportTable()"
      @action:new="handleGenerarSolicitud"
      @action:update="oficinaPartes_getBandejaSolicitudDocFaltante"
    />
    <TabView
      ref="tabview1"
      :active-index="tabs"
      @tab-change="tabChange"
    >
      <TabPanel
        v-for="item in tab.items"
        :key="item.title"
        :header="item.title"
      >
        <AppFilters
          v-model="funcionarioOfPartes.filters"
          @filter="getDataBandeja"
        />
        <TablaDocumentacionFaltanteOfDePartes
          v-model:first="funcionarioOfPartes.firstRecord"
          :loading="funcionarioOfPartes.isLoading"
          :origen-tabla="item.origenTabla"
          :rows="paginacion?.tamanoPagina"
          :total-records="paginacion?.elementosTotales"
          :value="partesBandeja"
          @page="getDataBandeja"
          @tasking="funcionarioOfPartes.isLoading = $event"
        />
      </TabPanel>
    </TabView>
  </section>
  <AppBtnsSteps @back-step="handleBackStep" />
</section>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// utils
import { appUtil, requestUtil } from '@/utils'

// components
import AppFilters from '@/modules/common/components/AppFilters.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import TablaDocumentacionFaltanteOfDePartes from '@/modules/ingreso/componentes/TablaDocumentacionFaltanteOfDePartes.vue'

// composables
import { useOficinaPartesStore } from '@/modules/global/composables/useOficinaPartesStore'
import { useSessionStore } from '@/modules/session/composables'
import { useAppGlobalProperties, useConfirmDialog } from '@/modules/common/composables'

const { taskStatus } = appUtil
const {
  paginacion,
  oficinaPartes_getBandejaSolicitudDocFaltante,
  partesBandeja
} = useOficinaPartesStore()
const { roles } = useSessionStore()
const { $userFiscaliaActual } = useAppGlobalProperties()
const { launchConfirmDialog } = useConfirmDialog()

const firstRecord = ref(0)

const tab = reactive({
  active: 0,
  items: [
    { title: 'Tareas En Curso', origenTabla: 'enCurso' },
    { title: 'Tareas Completadas', origenTabla: 'completadas' }
  ]
})

const funcionarioOfPartes = reactive({
  isLoading: false,
  filters: {
    fiscalia: undefined,
    region: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    prioritario: undefined,
    grupo: '',
    status: `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
  },
  firstRecord: 0
})

function tabChange ({ index }) {
  switch (index) {
    case 0:
      funcionarioOfPartes.filters.status = 'InProgress,Ready'
      break
    case 1:
      funcionarioOfPartes.filters.status = 'Completed'
      break
  }
  handleCleanFilters()
}

function handleCleanFilters () {
  funcionarioOfPartes.filters['fecha-hasta'] = undefined
  funcionarioOfPartes.filters['fecha-desde'] = undefined
  funcionarioOfPartes.filters.buscador = undefined

  getDataBandeja(funcionarioOfPartes.filters)
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

function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }

  if (!funcionarioOfPartes.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: oficinaPartes_getBandejaSolicitudDocFaltante,
    payload: {
      params: {
        ...funcionarioOfPartes.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: funcionarioOfPartes.filters.status,
        buscador: funcionarioOfPartes.filters.buscador?.trim().length
          ? funcionarioOfPartes.filters.buscador
          : undefined
      }
    },
    loader: (v) => {
      funcionarioOfPartes.isLoading = v
    }
  })
}

onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value

  funcionarioOfPartes.filters.grupo = roles.value.find((r) =>
    r.includes(`${fiscalia}_funcionario_IYA`)
  )

  getDataBandeja()
})

const router = useRouter()

function handleBackStep () {
  funcionarioOfPartes.isLoading = true
  router.push('/ingreso/denuncia-fisica')
}
function handleGenerarSolicitud () {
  funcionarioOfPartes.isLoading = true
  router.push('/ingreso/registrar-parte/registro')
}

const tabs = ref(0)

const itemsMenuSuperior = [
  {
    label: 'Nuevo ingreso de partes',
    icon: 'pi pi-plus-circle',
    command: () => handleGenerarSolicitud()
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',
    command: ({ item }) => console.log(`Click ${item.label}`)
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-refresh',
    command: () => {
      getDataBandeja()
    }
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: ({ item }) => console.log(`Click ${item.label}`)
  }
]
</script>
