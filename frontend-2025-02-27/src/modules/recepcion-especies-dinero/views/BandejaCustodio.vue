<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Custodio"
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
        v-model="custodio.filters"
        @filter="getDataBandeja"
      />
      <div v-if="custodio.isLoading">
        <LoaderSkeleton />
      </div>
      <EspeciesDineroTablaTareas
        v-else
        v-model:first="custodio.firstRecord"
        :loading="custodio.isLoading"
        :origen-tabla="item.origenTabla"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="especiesDinero.data"
        @actualizar-prioridad="actualizarPrioridad"
        @get-data="getDataBandeja"
        @page="getDataBandeja"
      />
    </TabPanel>
  </TabView>
</section>
</template>
<script setup>
import { inject, onMounted, reactive, nextTick } from 'vue'

import EspeciesDineroTablaTareas from '@/modules/recepcion-especies-dinero/components/bandeja/EspeciesDineroTablaTareas.vue'
import { useBandejaCustodioStore, useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { appUtil, requestUtil } from '@/utils'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useSessionStore } from '@/modules/session/composables'
import { useAppGlobalProperties, useAppToast, useConfirmDialog } from '@/modules/common/composables'

const { bandejaCustodio_getDataBandeja, bandejaCustodio_actualizarPrioridad, especiesDinero, paginacion } = useBandejaCustodioStore()

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportTable)

const { toastSuccess, toastWarning } = useAppToast()

const emitter = inject('emitter')

const { taskStatus } = appUtil

const custodio = reactive({
  isLoading: false,
  filters: {
    fiscalia: undefined,
    region: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    prioritario: undefined,
    status: `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
  },
  firstRecord: 0
})

function actualizar () {
  console.log('actualizar')
}

const { $userFiscaliaActual } = useAppGlobalProperties()

const { roles } = useSessionStore()

const { mantenedor_getTiposDelito, mantenedor_getFamiliasDelito } = useMantenedorStore()

function getMantenedorDelitos () {
  requestUtil({ action: mantenedor_getFamiliasDelito })
  requestUtil({ action: mantenedor_getTiposDelito })
}

async function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    custodio.firstRecord = 0
  }
  if (custodio.filters.grupo) {
    openNoRoleMatch()
    return
  }
  requestUtil({
    action: bandejaCustodio_getDataBandeja,
    payload: {
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: custodio.filters.status,
        ...appUtil.sanitizeFilters(custodio.filters)
      }
    },
    loader: (v) => {
      custodio.isLoading = v
    }
  })
}

onMounted(async () => {
  const { fiscalia } = $userFiscaliaActual.value

  custodio.filters.grupo = roles.value.find((r) => r.includes(`${fiscalia}_fiscal_jefe_ASI` || `${fiscalia}_custodio_EYD`))

  getMantenedorDelitos()
  getDataBandeja()
})

const { launchConfirmDialog } = useConfirmDialog()

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

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}

const tab = reactive({
  active: 0,
  items: [
    { title: 'Tareas En Curso', origenTabla: 'enCurso' },
    { title: 'Tareas Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Tareas Completadas', origenTabla: 'completadas' }
  ]
})

async function handleCleanFilters () {
  custodio.filters['fecha-hasta'] = undefined
  custodio.filters['fecha-desde'] = undefined
  custodio.filters.buscador = undefined

  getDataBandeja(custodio.filters)
}

function tabChange ({ index }) {
  switch (index) {
    case 0:
      // custodio.filters.prioritario = undefined
      custodio.filters.status = 'InProgress'
      break
    case 1:
      custodio.filters.prioritario = true
      custodio.filters.status = ''
      break
    case 2:
      // custodio.filters.prioritario = undefined
      custodio.filters.status = 'Completed'
      break
  }
  handleCleanFilters()
}

// Actualizar Prioridad
function actualizarPrioridad (dataTarea) {
  requestUtil({
    action: bandejaCustodio_actualizarPrioridad,
    payload: dataTarea,
    resolve: (res) => {
      getDataBandeja()
      res ? toastSuccess('Se ha marcado la tarea como Prioritaria') : toastWarning('Se ha marcado la tarea como NO Prioritaria')
    }
  })
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
