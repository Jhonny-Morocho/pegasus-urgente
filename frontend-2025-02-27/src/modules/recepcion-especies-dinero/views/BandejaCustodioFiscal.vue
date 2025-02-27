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
      <EspeciesDineroTablaTareasFiscal
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
import { useRouter } from 'vue-router'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import {
  useBandejaAsignacionStore,
  useCausaAsignacionStore
} from '@/modules/asignacion/composables'
import { useMantenedorStore, usePamStore } from '@/modules/global/composables'
import {
  useCrearCausaStore,
  useIdentificacionDenunciaStore
} from '@/modules/ingreso/composables'
import {
  useAppDialog,
  useAppGlobalProperties,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import EspeciesDineroTablaTareasFiscal from '@/modules/recepcion-especies-dinero/components/bandeja/EspeciesDineroTablaTareasFiscal.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useSessionStore } from '@/modules/session/composables'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'

const router = useRouter()

const emitter = inject('emitter')

const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()

const { taskStatus } = appUtil

const { $userFiscaliaActual } = useAppGlobalProperties()

const { causasBandeja, paginacion, bandejaAsignacion_getDataBandeja } =
  useBandejaAsignacionStore()

const { causaAsignacion_aceptarPropuestasPreclasificador } =
  useCausaAsignacionStore()

const { mantenedor_getTiposDelito, mantenedor_getFamiliasDelito } =
  useMantenedorStore()

const { tipoDenuncia, crearCausa_SET_TIPO_DENUNCIA } = useCrearCausaStore()

const { pam_iniciarProceso } = usePamStore()

const { identificacionDenuncia_getIdentificacionDenuncia } =
  useIdentificacionDenunciaStore()

const tab = reactive({
  active: 0,
  items: [
    { title: 'En Curso', origenTabla: 'enCurso' },
    { title: 'Solicitudes', origenTabla: 'solicitudes' },
    { title: 'Notificaciones y Respuestas', origenTabla: 'notificacionesRespuestas' },
    { title: 'Alertas', origenTabla: 'alertas' },
    { title: 'SIAU', origenTabla: 'siau' },
    { title: 'SACFI', origenTabla: 'sacfi' },
    { title: 'Mis Causas', origenTabla: 'misCausas' },
    { title: 'Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Completadas', origenTabla: 'completadas' }
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
    r.includes(`${fiscalia}_fiscal_EYD`)
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

async function aceptarPropuestasPreclasificador (payload) {
  requestUtil({
    action: causaAsignacion_aceptarPropuestasPreclasificador,
    payload: {
      propuestaCausas: payload
    },
    resolve: () => {
      const masDeUna = payload?.causas?.length > 1
      const mensaje = `${
        masDeUna ? 'Propuestas aceptadas' : 'Propuesta aceptada'
      } exitosamente`
      toastSuccess(mensaje)
    }
  })
}

function confirmAceptarPropuesta () {
  const masDeUna = causasSeleccionadas.value.length > 1

  launchConfirmDialog({
    message: `¿Estás seguro(a) de querer aceptar ${
      masDeUna ? 'las propuestas seleccionadas' : 'la propuesta seleccionada'
    }?`,
    accept: async () => {
      const causasAceptadas = causasSeleccionadas.value?.map((causa) => {
        return {
          ruc: causa?.ruc || '2200000029-2',
          complejidad: causa?.complejidad || 'Menos compleja'
        }
      })

      const payload = {
        accion: 'aceptar',
        causas: causasAceptadas
      }

      aceptarPropuestasPreclasificador(payload)
      causasSeleccionadas.value = []
    }
  })
}

function handleModalCargaTrabajo () {
  launchDialog({
    component: ModalCargaTrabajo,
    header: 'Carga de Trabajo FL y Unidades',
    width: '90%'
  })
}

async function getIdentificacionDenuncia (identificacionDenuncia) {
  requestUtil({
    action: identificacionDenuncia_getIdentificacionDenuncia,
    payload: identificacionDenuncia
  })
}

async function nuevaDenunciaOficio () {
  crearCausa_SET_TIPO_DENUNCIA('oficio')

  const payload = {
    tipoDenuncia: tipoDenuncia.value,
    region: `${$userFiscaliaActual.value.region}`,
    fiscalia: `${$userFiscaliaActual.value.fiscalia}`
  }

  const identificacionDenuncia = {
    sigla: 'M',
    idUnicoDenuncia: '',
    medioDeRecepcion: 'Oficio',
    tipoDenuncia: 'De Oficio',
    fechaDeDenuncia: dateTimeUtil.formatToBackendWithTime(new Date()),
    formaEnvio: 'MANUAL',
    idFiscalia: ''
  }

  requestUtil({
    action: pam_iniciarProceso,
    payload: payload,
    resolve: async () => {
      getIdentificacionDenuncia(identificacionDenuncia)
      router.push(
        '/ingreso/denuncia-oficio/nueva-denuncia/identificacion-denuncia'
      )
    }
  })
}

const itemsMenuSuperior = ref([
  {
    label: 'Nuevo',
    icon: 'pi pi-plus-circle',

    items: [
      {
        label: 'Denuncia Oficio',
        command: async () => {
          nuevaDenunciaOficio()
        }
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',

    items: [
      {
        label: 'Carga de Trabajo FL',
        command: () => handleModalCargaTrabajo()
      }
    ]
  },
  {
    label: 'Aceptar Propuesta',
    icon: 'pi pi-check-circle',

    command: () => confirmAceptarPropuesta(),
    disabled: () => !causasSeleccionadas.value.length
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
