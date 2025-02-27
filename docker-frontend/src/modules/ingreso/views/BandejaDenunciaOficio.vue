<template>
<section>
  <PageHeader
    :hide-items-menu-superior="oficioBandeja.isLoading"
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
      <AppFilters
        v-model="oficioBandeja.filters"
        @filter="getDenunciasOficio"
      />
      <DenunciaDeOficioTablaTareas
        v-model:first="oficioBandeja.firstRecord"
        :loading="oficioBandeja.isLoading"
        :origen-tabla="item.origenTabla"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="denuncias"
        @page="getDenunciasOficio"
        @tasking="oficioBandeja.isLoading = $event"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { inject, reactive, ref, nextTick, onMounted } from 'vue'

import AppFilters from '@/modules/common/components/AppFilters.vue'
import DenunciaDeOficioTablaTareas from '@/modules/ingreso/componentes/DenunciaDeOficioTablaTareas.vue'

import { useBandejaDenunciaOficioStore, useCrearCausaStore, useIdentificacionDenunciaStore } from '../composables'
import { useBuscarDuplicidadStore, useDelitoStore, useDocumentoStore, useEspeciesDineroStore, useMantenedorStore, usePamStore, useRelacionesStore, useRelatoStore, useSujetosIntervinientesStore } from '@/modules/global/composables'

import { requestUtil, appUtil } from '@/utils'
import { useAppGlobalProperties, useConfirmDialog } from '@/modules/common/composables'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/modules/session/composables'

const router = useRouter()
const { taskStatus } = appUtil

// Mix composables
const { pam_iniciarProceso } = usePamStore()
const { mantenedor_getTiposDelito, mantenedor_getFamiliasDelito } = useMantenedorStore()
const { launchConfirmDialog } = useConfirmDialog()
const { $userFiscaliaActual } = useAppGlobalProperties()

// Composables utiles
const { denuncias, paginacion, bandejaDenunciaOficio_getDenunciasByMultiple } = useBandejaDenunciaOficioStore()

const { crearCausa_SET_TIPO_DENUNCIA, tipoDenuncia, crearCausa_RESET_RUC } = useCrearCausaStore()

const { identificacionDenuncia_SET_DEFAULT_STATE, identificacionDenuncia_getTipoDenuncia } = useIdentificacionDenunciaStore()

const { sujetosIntervinientes_SET_DEFAULT_STATE } = useSujetosIntervinientesStore()

const { roles } = useSessionStore()
// Reset composables

const { buscarDuplicidad_RESET } = useBuscarDuplicidadStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const { crearCausa_SET_DEFAULT_STATE } = useCrearCausaStore()
crearCausa_SET_TIPO_DENUNCIA('oficio')

const emitter = inject('emitter')

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

const oficioBandeja = reactive({
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

function limpiarStore () {
  identificacionDenuncia_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  buscarDuplicidad_RESET()
  crearCausa_RESET_RUC()
}

function tabChange ({ index }) {
  switch (index) {
    case 0:
      oficioBandeja.filters.prioritario = undefined
      oficioBandeja.filters.status = 'InProgress,Ready'
      break
    case 1:
      oficioBandeja.filters.status = 'InProgress,Ready'
      break
    case 2:
      oficioBandeja.filters.status = 'InProgress,Ready'
      break
    case 3:
      oficioBandeja.filters.status = 'InProgress,Ready'
      break
    case 4:
      oficioBandeja.filters.status = 'Completed'
      break
  }
  handleCleanFilters()
}

const itemsMenuSuperior = ref([
  {
    label: 'Nueva Denuncia de Oficio',
    icon: 'pi pi-plus-circle',
    command: () => handleNuevaAtencion()
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => getDenunciasOficio()
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

function handleCleanFilters () {
  oficioBandeja.filters['fecha-hasta'] = undefined
  oficioBandeja.filters['fecha-desde'] = undefined
  oficioBandeja.filters.buscador = undefined

  getDenunciasOficio(oficioBandeja.filters)
}

/** Actualizar la Tabla **/
function getDenunciasOficio (pagination = undefined) {
  if (!pagination) {
    oficioBandeja.firstRecord = 0
  }

  if (!oficioBandeja.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: bandejaDenunciaOficio_getDenunciasByMultiple,
    payload: {
      params: {
        ...oficioBandeja.filters,
        'tipo-denuncia': '3',
        fiscalia: $userFiscaliaActual.value.fiscalia,
        region: undefined,
        // 'user-sub': $userSub.value,
        page: pagination?.page || 0,
        status: oficioBandeja.filters.status,
        size: pagination?.rows || 10
      }
    },
    loader: (v) => {
      oficioBandeja.isLoading = v
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

  oficioBandeja.filters.grupo = roles.value.find((r) => r.includes(`${fiscalia}_digitador_IYA_OFI`))

  getMantenedorDelitos()
  getDenunciasOficio()
  crearCausa_SET_DEFAULT_STATE()
})

function handleNuevaAtencion () {
  oficioBandeja.isLoading = true
  limpiarStore()
  const payload = {
    tipoDenuncia: tipoDenuncia.value,
    region: `${$userFiscaliaActual.value.region}`,
    fiscalia: `${$userFiscaliaActual.value.fiscalia}`
  }

  // se setea en identificación denuncia store el objeto tipo denuncia 'DE OFICIO' con el código del mantenedor
  identificacionDenuncia_getTipoDenuncia('3')

  requestUtil({
    action: pam_iniciarProceso,
    payload: payload,
    resolve: () => {
      oficioBandeja.isLoading = false
      router.push('/ingreso/denuncia-oficio/nueva-denuncia/identificacion-denuncia')
    },
    reject: (err) => {
      console.log(err)
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
