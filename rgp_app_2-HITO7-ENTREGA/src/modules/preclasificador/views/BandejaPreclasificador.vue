<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Escritorio Preclasificador"
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
        v-model="preclasificador.filters"
        @filter="getDataBandeja"
      />
      <div v-if="preclasificador.isLoading">
        <LoaderSkeleton />
      </div>
      <TablaEscritorioPreclasificador
        v-else
        v-model:first="preclasificador.firstRecord"
        :loading="preclasificador.isLoading"
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
import { inject, nextTick, onMounted, reactive, ref } from 'vue'

import AppFilters from '@/modules/common/components/AppFilters.vue'
import TablaEscritorioPreclasificador from '../components/bandeja/TablaEscritorioPreclasificador.vue'
import { useBandejaPreclasificadorStore } from '../composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { dateTimeUtil, requestUtil, appUtil } from '@/utils'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useSessionStore } from '@/modules/session/composables'
import { useAppGlobalProperties, useConfirmDialog } from '@/modules/common/composables'

const { launchConfirmDialog } = useConfirmDialog()

const { causasBandeja, paginacion, bandejaPreclasificador_getDataBandeja } = useBandejaPreclasificadorStore()

const { mantenedor_getTiposDelito, mantenedor_getFamiliasDelito } = useMantenedorStore()

const { $userFiscaliaActual } = useAppGlobalProperties()

const { roles } = useSessionStore()

const emitter = inject('emitter')

const { taskStatus } = appUtil

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

const preclasificador = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    // status: `${taskStatus.READY},${taskStatus.IN_PROGRESS},${taskStatus.RESERVED}`,
    status: `${taskStatus.RESERVED}`
  },
  firstRecord: 0
})

function tabChange ({ index }) {
  switch (index) {
    case 0:
      // preclasificador.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS},${taskStatus.RESERVED}`
      preclasificador.filters.status = `${taskStatus.RESERVED}`
      break
    case 1:
      preclasificador.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 2:
      preclasificador.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 3:
      preclasificador.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    case 4:
      preclasificador.filters.status = taskStatus.COMPLETED
      break
  }
  handleCleanFilters()
}

function handleCleanFilters () {
  preclasificador.filters['fecha-hasta'] = undefined
  preclasificador.filters['fecha-desde'] = undefined
  preclasificador.filters.buscador = undefined

  getDataBandeja(preclasificador.filters)
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

async function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    preclasificador.firstRecord = 0
  }

  if (!preclasificador.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: bandejaPreclasificador_getDataBandeja,
    payload: {
      params: {
        ...preclasificador.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        buscador: preclasificador.filters.buscador?.trim().length ? preclasificador.filters.buscador : undefined,
        'fecha-desde': formatDate(preclasificador.filters['fecha-desde']),
        'fecha-hasta': formatDate(preclasificador.filters['fecha-hasta'])
      }
    },
    loader: (v) => {
      preclasificador.isLoading = v
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

onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value

  const grupoPreclasificador = roles.value.find((r) => r.includes(`${fiscalia}_preclasificador_IYA`))
  preclasificador.filters.grupo = grupoPreclasificador

  getMantenedorDelitos()
  getDataBandeja()
})

const itemsMenuSuperior = ref([
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => getDataBandeja()
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',
    command: () => handleCleanFilters()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: () => exportTable()
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
