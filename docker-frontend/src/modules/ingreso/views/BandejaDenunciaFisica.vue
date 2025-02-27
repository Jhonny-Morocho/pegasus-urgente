<template>
<section>
  <PageHeader
    :hide-items-menu-superior="fisicaBandeja.isLoading"
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja Digitador"
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
        v-model="fisicaBandeja.filters"
        @filter="getPartes"
      />
      <TablaFisicaElectronica
        v-model:first="fisicaBandeja.firstRecord"
        :loading="fisicaBandeja.isLoading"
        :origen-tabla="item.origenTabla"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="denuncias"
        @page="getPartes"
        @tabla-digitador:set-prioritario="setPrioritario"
        @tasking="setLoading"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { inject, onMounted, reactive, ref, nextTick } from 'vue'

import TablaFisicaElectronica from '@/modules/ingreso/componentes/bandeja/TablaFisicaElectronica.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'

import {
  useAppGlobalProperties,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import { useBandejaDenunciaFisicaStore, useCrearCausaStore } from '@/modules/ingreso/composables'
import { useMantenedorStore } from '@/modules/global/composables'

import { requestUtil, appUtil } from '@/utils'

import { useSessionStore } from '@/modules/session/composables'

const { taskStatus } = appUtil
const { toastSuccess, toastWarning } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { crearCausa_SET_DEFAULT_STATE } = useCrearCausaStore()
const emitter = inject('emitter')

const {
  denuncias,
  paginacion,
  bandejaDenunciaFisica_setPrioritario,
  bandejaDenunciaFisica_getDenunciasByMultiple
} = useBandejaDenunciaFisicaStore()

const { $userFiscaliaActual } = useAppGlobalProperties()

const { mantenedor_getTiposDelito, tiposDelito, familiasDelito, mantenedor_getFamiliasDelito } =
  useMantenedorStore()

const { roles } = useSessionStore()

const tab = reactive({
  active: 0,
  items: [
    { title: 'Tareas En Curso', origenTabla: 'enCurso' },
    { title: 'Tareas Por Vencer', origenTabla: 'porVencer' },
    { title: 'Tareas Vencidas', origenTabla: 'vencidas' },
    { title: 'Tareas Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Tareas Completadas', origenTabla: 'completadas' }
  ]
})

function tabChange ({ index }) {
  switch (index) {
    case 0:
      fisicaBandeja.filters.prioritario = undefined
      fisicaBandeja.filters.status = 'InProgress,Ready'
      break
    case 1:
      fisicaBandeja.filters.status = 'InProgress,Ready'
      break
    case 2:
      fisicaBandeja.filters.status = 'InProgress,Ready'
      break
    case 3:
      fisicaBandeja.filters.status = 'InProgress,Ready'
      break
    case 4:
      fisicaBandeja.filters.status = 'Completed'
      break
  }
  handleCleanFilters()
}

const itemsMenuSuperior = ref([
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => getPartes()
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

const fisicaBandeja = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    actualTabDenuncia: 'curso',
    grupo: '',
    status: `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
  },
  firstRecord: 0
})

function handleCleanFilters () {
  fisicaBandeja.filters['fecha-hasta'] = undefined
  fisicaBandeja.filters['fecha-desde'] = undefined
  fisicaBandeja.filters.buscador = undefined

  getPartes(fisicaBandeja.filters)
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

function getPartes (pagination = undefined) {
  if (!pagination) {
    fisicaBandeja.firstRecord = 0
  }

  if (!fisicaBandeja.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: bandejaDenunciaFisica_getDenunciasByMultiple,
    payload: {
      params: {
        ...fisicaBandeja.filters,
        'tipo-denuncia': '2',
        fiscalia: $userFiscaliaActual.value.fiscalia,
        region: undefined,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: fisicaBandeja.filters.status
      }
    },
    loader: (v) => {
      fisicaBandeja.isLoading = v
    }
  })
}

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}

function getDelitos () {
  if (!tiposDelito.value) { requestUtil({ action: mantenedor_getTiposDelito }) }
  if (!familiasDelito.value) { requestUtil({ action: mantenedor_getFamiliasDelito }) }
}

function setPrioritario (data) {
  requestUtil({
    action: bandejaDenunciaFisica_setPrioritario,
    payload: {
      denuncia: data,
      isPrioritario: !data.prioritario
    },
    resolve: (res) => {
      res.denuncia.estadoTarea === 'Prioritaria'
        ? toastSuccess('Es Prioritaria')
        : toastWarning('No es Prioritaria')
    }
  })
}
onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value
  console.log(fiscalia)
  fisicaBandeja.filters.grupo = roles.value.find((r) =>
    r.includes(`${fiscalia}_digitador_IYA_FIS`)
  )
  console.log(fisicaBandeja.filters.grupo)
  getDelitos()
  getPartes()
  crearCausa_SET_DEFAULT_STATE()
})

function setLoading (l) {
  console.log(l)
  fisicaBandeja.isLoading = l
}
</script>
