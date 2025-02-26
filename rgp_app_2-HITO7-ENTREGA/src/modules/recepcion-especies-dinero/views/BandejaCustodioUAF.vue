<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Profesional UAF"
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
        v-model="custodioFiscal.filters"
        @filter="getDataBandeja"
      />
      <div v-if="custodioFiscal.isLoading">
        <LoaderSkeleton />
      </div>
      <EspeciesDineroTablaTareasUAF
        v-else
        v-model:causa="causasSeleccionadas"
        v-model:first="custodioFiscal.firstRecord"
        :loading="custodioFiscal.isLoading"
        :origen-tabla="item.origenTabla"
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
import { inject, reactive, onMounted, ref, nextTick } from 'vue'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import {
  useBandejaAsignacionStore
} from '@/modules/asignacion/composables'
import { useMantenedorStore } from '@/modules/global/composables'

import {
  useAppGlobalProperties,
  useConfirmDialog
} from '@/modules/common/composables'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import EspeciesDineroTablaTareasUAF from '@/modules/recepcion-especies-dinero/components/bandeja/EspeciesDineroTablaTareasUAF.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useSessionStore } from '@/modules/session/composables'

const emitter = inject('emitter')

const { launchConfirmDialog } = useConfirmDialog()

const { taskStatus } = appUtil

const { $userFiscaliaActual } = useAppGlobalProperties()

const { causasBandeja, paginacion, bandejaAsignacion_getDataBandeja } =
  useBandejaAsignacionStore()

const { mantenedor_getTiposDelito, mantenedor_getFamiliasDelito } =
  useMantenedorStore()

const tab = reactive({
  active: 0,
  items: [
    { title: 'Tareas En Curso', origenTabla: 'enCurso' },
    { title: 'Tareas Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Tareas Completadas', origenTabla: 'completadas' }
  ]
})

const causasSeleccionadas = ref([])

const custodioFiscal = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    status: `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
  },
  firstRecord: 0
})

onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value

  custodioFiscal.filters.grupo = roles.value.find((r) =>
    r.includes(`${fiscalia}_profesional_UAF_EYD`)
  )

  getMantenedorDelitos()
  getDataBandeja()
})

function tabChange ({ index }) {
  switch (index) {
    case 0:
      custodioFiscal.filters.prioritario = undefined
      custodioFiscal.filters.status = 'InProgress,Ready'
      break
    case 1:
      custodioFiscal.filters.prioritario = undefined
      custodioFiscal.filters.status = 'InProgress'
      break
    case 2:
      custodioFiscal.filters.prioritario = undefined
      custodioFiscal.filters.status = 'Obsolete'
      break
    case 3:
      custodioFiscal.filters.prioritario = true
      custodioFiscal.filters.status = ''
      break
    case 4:
      custodioFiscal.filters.prioritario = undefined
      custodioFiscal.filters.status = 'Completed'
      break
  }
  handleCleanFilters()
}

async function handleCleanFilters () {
  custodioFiscal.filters['fecha-hasta'] = undefined
  custodioFiscal.filters['fecha-desde'] = undefined
  custodioFiscal.filters.buscador = undefined

  getDataBandeja(custodioFiscal.filters)
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

// eslint-disable-next-line no-unused-vars
const { roles } = useSessionStore()

/** Actualizar la Tabla **/
function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    custodioFiscal.firstRecord = 0
  }

  if (!custodioFiscal.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: bandejaAsignacion_getDataBandeja,
    payload: {
      params: {
        ...custodioFiscal.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: custodioFiscal.filters.status,
        buscador: custodioFiscal.filters.buscador?.trim().length
          ? custodioFiscal.filters.buscador
          : undefined,
        'fecha-desde': formatDate(custodioFiscal.filters['fecha-desde']),
        'fecha-hasta': formatDate(custodioFiscal.filters['fecha-hasta'])
      }
    },
    loader: (v) => {
      custodioFiscal.isLoading = v
    }
  })
}

function getMantenedorDelitos () {
  requestUtil({ action: mantenedor_getFamiliasDelito })
  requestUtil({ action: mantenedor_getTiposDelito })
}

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportTable)
function actualizar () {
  console.log('actualizar')
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
