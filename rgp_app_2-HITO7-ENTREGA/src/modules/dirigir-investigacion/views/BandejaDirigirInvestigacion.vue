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
        v-model="dirigirInvestigacion.filters"
        @filter="getDataBandeja"
      />
      <TablaEscritorioDirigirInvestigacion
        v-model:first="dirigirInvestigacion.firstRecord"
        :loading="dirigirInvestigacion.isLoading"
        :no-column-mas-info="false"
        :origen-tabla="table.origenTabla"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="causasBandeja"
        @page="getDataBandeja"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { inject, reactive, ref, nextTick, onMounted } from 'vue'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import { useSessionStore } from '@/modules/session/composables'
import { useConfirmDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useBandejaDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaEscritorioDirigirInvestigacion from '@/modules/dirigir-investigacion/components/TablaEscritorioDirigirInvestigacion.vue'

const { taskStatus } = appUtil
const { launchConfirmDialog } = useConfirmDialog()
const { $userFiscaliaActual } = useAppGlobalProperties()
const { roles } = useSessionStore()
const { causasBandeja, paginacion, bandejaDirigirInvestigacion_getDataBandeja } = useBandejaDirigirInvestigacionStore()

const {
  mantenedor_getTiposDelito,
  mantenedor_getSubtiposActividadList,
  mantenedor_getSubSubtiposActividadList
} = useMantenedorStore()

const emitter = inject('emitter')

const tab = reactive({
  active: 0,
  items: [
    { title: 'En Curso', origenTabla: 'enCurso' },
    { title: 'Solicitudes', origenTabla: 'solicitudes' },
    { title: 'Notificaciones y Respuestas', origenTabla: 'notificaciones' },
    { title: 'Alertas', origenTabla: 'alertas' },
    { title: 'SIAU', origenTabla: 'siau' },
    { title: 'SACFI', origenTabla: 'sacfi' },
    { title: 'Mis Causas', origenTabla: 'misCausa' },
    { title: 'Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Completadas', origenTabla: 'completadas' }
  ]
})

const dirigirInvestigacion = reactive({
  isLoading: false,
  filters: {
    buscador: undefined,
    prioritario: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    grupo: '',
    status: `${taskStatus.RESERVED},${taskStatus.IN_PROGRESS}`
  },
  firstRecord: 0
})

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

async function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    dirigirInvestigacion.firstRecord = 0
  }

  if (!dirigirInvestigacion.filters.grupo) {
    openNoRoleMatch()
    return
  }

  await requestUtil({
    action: bandejaDirigirInvestigacion_getDataBandeja,
    payload: {
      params: {
        ...dirigirInvestigacion.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        buscador: dirigirInvestigacion.filters.buscador?.trim().length ? dirigirInvestigacion.filters?.buscador : undefined,
        'fecha-desde': formatDate(dirigirInvestigacion.filters['fecha-desde']),
        'fecha-hasta': formatDate(dirigirInvestigacion.filters['fecha-hasta'])
      }
    },
    loader: (v) => {
      dirigirInvestigacion.isLoading = v
    }
  })
}

function formatDate (value) {
  if (value) {
    return dateTimeUtil.formatToBackend(value)
  }
  return undefined
}

function tabChange ({ index }) {
  switch (index) {
    case 0:
      dirigirInvestigacion.filters.prioritario = undefined
      dirigirInvestigacion.filters.status = `${taskStatus.RESERVED},${taskStatus.IN_PROGRESS}`
      break
    case 1:
      dirigirInvestigacion.filters.prioritario = undefined
      dirigirInvestigacion.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 8:
      dirigirInvestigacion.filters.prioritario = undefined
      dirigirInvestigacion.filters.status = `${taskStatus.COMPLETED}`
      break
  }
  handleCleanFilters()
}

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}

function handleCleanFilters () {
  dirigirInvestigacion.filters['fecha-hasta'] = undefined
  dirigirInvestigacion.filters['fecha-desde'] = undefined
  dirigirInvestigacion.filters.buscador = undefined

  getDataBandeja(dirigirInvestigacion.filters)
}

const itemsMenuSuperior = ref([
  {
    label: 'CDD',
    icon: 'pi pi-briefcase',
    disabled: () => false,
    items: [
      {
        disabled: () => true,
        label: 'Solicitud de Creación de Catálogo Documental Digital'
      },
      {
        disabled: () => true,
        label: 'Ingreso de Solicitud de Gestión de Documento o Archivo'
      }
    ]
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

function getMantenedorDelitos () {
  requestUtil({ action: mantenedor_getTiposDelito })
}

onMounted(async () => {
  const { fiscalia } = $userFiscaliaActual.value

  const grupoPreclasificador = roles.value.find((r) => r.includes(`${fiscalia}_fiscal_DIN`))
  dirigirInvestigacion.filters.grupo = grupoPreclasificador

  await getDataBandeja()
  requestUtil({
    action: mantenedor_getSubtiposActividadList
  })
  requestUtil({
    action: mantenedor_getSubSubtiposActividadList
  })
  getMantenedorDelitos()
})
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
