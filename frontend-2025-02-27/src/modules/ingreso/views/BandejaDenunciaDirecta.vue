<template>
<section>
  <PageHeader
    :hide-items-menu-superior="atendedor.isLoading"
    :items-menu-superior="itemsMenuSuperior"
    page-title="Escritorio Atendedor Jurídico"
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
        v-model="atendedor.filters"
        @filter="getDataBandeja"
      />
      <IngresoTablaTareas
        v-model:first="atendedor.firstRecord"
        :loading="atendedor.isLoading"
        :origen-tabla="item.origenTabla"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="denuncias"
        @page="getDataBandeja"
        @tasking="setLoading"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { inject, onMounted, reactive, ref, nextTick } from 'vue'

import AppFilters from '@/modules/common/components/AppFilters.vue'
import IngresoTablaTareas from '../componentes/IngresoTablaTareas.vue'
import {
  useBandejaAtendedorJuridico,
  useCrearCausaStore,
  useIdentificacionDenunciaStore
} from '@/modules/ingreso/composables'
import {
  useBuscarDuplicidadStore,
  useDelitoStore,
  useDocumentoStore,
  useEspeciesDineroStore,
  useMantenedorStore,
  usePamStore,
  useRelacionesStore,
  useRelatoStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import ModalCddIngreso from '@/modules/global/components/cdd/ModalCddIngreso.vue'

import { appUtil, dateTimeUtil, requestUtil } from '@/utils'

import { useRouter } from 'vue-router'
import { useSessionStore } from '@/modules/session/composables'
import {
  useAppGlobalProperties,
  useConfirmDialog
} from '@/modules/common/composables'
import { useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'
import { useDialog } from 'primevue/usedialog'

const router = useRouter()
const { taskStatus } = appUtil

const { pam_iniciarProceso, procesoPam } = usePamStore()
const { launchConfirmDialog } = useConfirmDialog()
const { $userFiscaliaActual } = useAppGlobalProperties()
const {
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getTiposDenuncia,
  mantenedor_getNombreFiscalia
} = useMantenedorStore()

// Composables utiles
const {
  denuncias,
  paginacion,
  bandejaAtendedorJuridico_getDenunciasByMultiple
} = useBandejaAtendedorJuridico()

const {
  crearCausa_SET_TIPO_DENUNCIA,
  tipoDenuncia,
  crearCausa_SET_DEFAULT_CAUSA
} = useCrearCausaStore()

const {
  identificacionDenuncia_SET_DEFAULT_STATE,
  identificacionDenuncia_getTipoDenuncia,
  identificacionDenuncia_getByIdDenuncia
} = useIdentificacionDenunciaStore()

const { sujetosIntervinientes_SET_DEFAULT_STATE } =
  useSujetosIntervinientesStore()

const { userFiscalias, roles } = useSessionStore()

// Reset composables
const { buscarDuplicidad_RESET } = useBuscarDuplicidadStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { relaciones_SET_DEFAULT_STATE } = useRelacionesStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()

crearCausa_SET_TIPO_DENUNCIA('directa')

const emitter = inject('emitter')

const pageHeader = reactive({
  isLoadingNew: false
})

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

const atendedor = reactive({
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

function limpiarStore () {
  identificacionDenuncia_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  relaciones_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  buscarDuplicidad_RESET()
}

function tabChange ({ index }) {
  switch (index) {
    case 0:
      atendedor.filters.prioritario = undefined
      atendedor.filters.status = 'InProgress,Ready'
      break
    case 1:
      atendedor.filters.status = 'InProgress,Ready'
      break
    case 2:
      atendedor.filters.status = 'InProgress,Ready'
      break
    case 3:
      atendedor.filters.status = 'InProgress,Ready'
      break
    case 4:
      atendedor.filters.status = 'Completed'
      break
  }
  handleCleanFilters()
}

function handleCleanFilters () {
  atendedor.filters['fecha-hasta'] = undefined
  atendedor.filters['fecha-desde'] = undefined
  atendedor.filters.buscador = undefined

  getDataBandeja(atendedor.filters)
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

/** Actualizar la Tabla **/
async function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    atendedor.firstRecord = 0
  }
  if (!atendedor.filters.grupo) {
    openNoRoleMatch()
    return
  }

  requestUtil({
    action: bandejaAtendedorJuridico_getDenunciasByMultiple,
    payload: {
      params: {
        ...atendedor.filters,
        'tipo-denuncia': '1',
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        status: atendedor.filters.status,
        buscador: atendedor.filters.buscador?.trim().length
          ? atendedor.filters.buscador
          : undefined,
        'fecha-desde': formatDate(atendedor.filters['fecha-desde']),
        'fecha-hasta': formatDate(atendedor.filters['fecha-hasta'])
      }
    },
    loader: (v) => {
      atendedor.isLoading = v
    }
  })
}

const itemsMenuSuperior = ref([
  {
    label: 'CDD',
    icon: 'pi pi-plus-circle',
    command: () => handleCDD()
  },
  {
    label: 'Nueva Atención',
    icon: 'pi pi-plus-circle',
    command: () => handleNuevaAtencion()
  },
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

function getMantenedorDelitos () {
  requestUtil({ action: mantenedor_getFamiliasDelito })
  requestUtil({ action: mantenedor_getTiposDelito })
}

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}
onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value
  atendedor.filters.grupo = roles.value.find((r) =>
    r.includes(`${fiscalia}_atendedor_juridico_IYA`)
  )

  getMantenedorDelitos()
  mantenedor_getNombreFiscalia()
  getDataBandeja()
})

// MODAL CDD
const { creacionYGestionDeCDD_buscarCatalogoByNombre } =
  useCreacionYGestionDeCDD()
const dialog = useDialog()

const tablaDocumentos = reactive({
  page: 0,
  size: 10,
  isLoading: false,
  filters: {
    search: undefined
  },
  firstRecord: 0
})
function handleCDD () {
  const nombreCatalogo = 'test capa'

  requestUtil({
    action: creacionYGestionDeCDD_buscarCatalogoByNombre,
    payload: {
      payload: {
        nombreCatalogo: nombreCatalogo
      },
      params: {
        search: tablaDocumentos?.filters?.buscador?.trim().length
          ? tablaDocumentos.filters.buscador
          : undefined,
        page: tablaDocumentos?.page || 0,
        size: tablaDocumentos?.rows || 10
      }
    },
    resolve: () => {
      dialog.open(ModalCddIngreso, {
        props: {
          header: `Ver Docuemntos contendidios en CDD`,
          style: {
            width: '80%'
          }
        },
        onClose: async ({ data }) => {
          console.log(data)
        }
      })
    }
  })
}

// FINAL MODAL CDD

function handleNuevaAtencion () {
  crearCausa_SET_DEFAULT_CAUSA()
  limpiarStore()
  mantenedor_getTiposDenuncia()

  // se setea en identificación denuncia store el objeto tipo denuncia 'DIRECTA' con el código del mantenedor
  identificacionDenuncia_getTipoDenuncia('1')
  const payload = {
    tipoDenuncia: tipoDenuncia.value,
    region: `${userFiscalias.value[0].region}`,
    fiscalia: userFiscalias.value[0]?.fiscalia
  }

  requestUtil({
    action: pam_iniciarProceso,
    payload: payload,
    resolve: () => {
      requestUtil({
        action: identificacionDenuncia_getByIdDenuncia,
        payload: {
          idDenuncia: procesoPam.value.idDenuncia
        }
      })
      router.push('/ingreso/denuncia-directa/nueva-denuncia/buscar-duplicidad')
    },
    loader: (isLoading) => {
      pageHeader.isLoadingNew = isLoading
      atendedor.isLoading = isLoading
    },
    reject: (err) => {
      console.error(err)
    }
  })
}

function setLoading (l) {
  atendedor.isLoading = l
  console.log('setLoading', atendedor.isLoading)
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
