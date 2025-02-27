<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Ejecutor"
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
        v-model="gestionSolicitud.filters"
        @filter="getDataBandeja"
      />
      <TablaEjecutor
        v-model:first="gestionSolicitud.firstRecord"
        :loading="gestionSolicitud.isLoading"
        :no-column-mas-info="false"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="denuncias"
        @page="getDataBandeja"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { inject, reactive, ref, nextTick, onMounted } from 'vue'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import { useConfirmDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useBandejaGestionSolicitudesStore } from '../composables'

import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaEjecutor from '@/modules/gestion-solicitudes/components/bandejas/TablaEjecutor.vue'

const { denuncias, paginacion, bandejaGestor_getDenunciasByMultiple } = useBandejaGestionSolicitudesStore()

const emitter = inject('emitter')

const { launchConfirmDialog } = useConfirmDialog()

const { $userFiscaliaActual, $userRoles } = useAppGlobalProperties()

const { taskStatus } = appUtil

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

const gestionSolicitud = reactive({
  isLoading: false,
  filters: {
    buscador: undefined,
    prioritario: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    grupo: '',
    status: `${taskStatus.RESERVED}`
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

function tabChange ({ index }) {
  switch (index) {
    case 0:
      gestionSolicitud.filters.prioritario = undefined
      gestionSolicitud.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 1:
      gestionSolicitud.filters.prioritario = true
      gestionSolicitud.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 2:
      gestionSolicitud.filters.prioritario = false
      gestionSolicitud.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 4:
      gestionSolicitud.filters.prioritario = true
      gestionSolicitud.filters.status = `${taskStatus.COMPLETED},${taskStatus.IN_PROGRESS}`
      break
    case 5:
      gestionSolicitud.filters.prioritario = undefined
      gestionSolicitud.filters.status = `${taskStatus.COMPLETED},${taskStatus.IN_PROGRESS}`
      break
    case 6:
      gestionSolicitud.filters.prioritario = false
      gestionSolicitud.filters.status = `${taskStatus.COMPLETED},${taskStatus.IN_PROGRESS}`
      break
    case 7:
      gestionSolicitud.filters.prioritario = false
      gestionSolicitud.filters.status = `${taskStatus.RESERVED},${taskStatus.IN_PROGRESS}`
      break
    case 8:
      gestionSolicitud.filters.prioritario = undefined
      gestionSolicitud.filters.status = `${taskStatus.COMPLETED}`
      break
  }
  handleCleanFilters()
}

async function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    gestionSolicitud.firstRecord = 0
  }

  if (!gestionSolicitud.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: bandejaGestor_getDenunciasByMultiple,
    payload: {
      params: {
        ...gestionSolicitud.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        buscador: gestionSolicitud.filters.buscador?.trim().length ? gestionSolicitud.filters?.buscador : undefined,
        'fecha-desde': formatDate(gestionSolicitud.filters['fecha-desde']),
        'fecha-hasta': formatDate(gestionSolicitud.filters['fecha-hasta'])
      }
    },
    loader: (v) => {
      gestionSolicitud.isLoading = v
    }
  })
}

function formatDate (value) {
  if (value) {
    return dateTimeUtil.formatToBackend(value)
  }
  return undefined
}

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}

function handleCleanFilters () {
  gestionSolicitud.filters['fecha-hasta'] = undefined
  gestionSolicitud.filters['fecha-desde'] = undefined
  gestionSolicitud.filters.buscador = undefined

  getDataBandeja(gestionSolicitud.filters)
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

onMounted(async () => {
  const { fiscalia } = $userFiscaliaActual.value

  gestionSolicitud.filters.grupo = $userRoles.value.find((r) =>
    r.includes(`${fiscalia}_apaf_GDS`)
  )

  await getDataBandeja()
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
