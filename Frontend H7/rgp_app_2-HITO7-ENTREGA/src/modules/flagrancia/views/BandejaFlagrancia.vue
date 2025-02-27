<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-title="usuario"
  />

  <TabView
    v-model:activeIndex="tab.active"
    class="tabview"
    @tab-change="tabChange"
  >
    <TabPanel
      v-for="item in tab.items"
      :key="item.title"
      :disabled="
        !$hasSomeRoles(fiscalTurno) ||
          !$hasSomeRoles([
            `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`
          ])
          ? item?.hide
          : false
      "
      :header="item.title"
    >
      <AppFilters
        v-model="flagrancia.filters"
        @filter="getDataBandeja"
      />
      <FlagranciaTablaProcedimientos
        v-model:first="flagrancia.firstRecord"
        v-model:isLoadingTable="flagrancia.isLoading"
        :loading="flagrancia.isLoading"
        :origen-tabla="item.origenTabla"
        :rows="paginacion?.tamanoPagina"
        :tipo-panel-procedimientos="item.origenTabla"
        :total-records="paginacion?.elementosTotales"
        :value="procedimientos"
        @get-data="getDataBandeja"
        @page="getDataBandeja"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
import { reactive, ref, inject, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import FlagranciaTablaProcedimientos from '@/modules/flagrancia/components/bandeja/FlagranciaTablaProcedimientos.vue'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import ModalRegistrarComunicacionConJuzgadodeGarantia from '@/modules/flagrancia/components/diligencias-e-instrucciones/modales/ModalRegistrarComunicacionConJuzgadodeGarantia.vue'
import { useDialog } from 'primevue/usedialog'

import { requestUtil, appUtil } from '@/utils'

// global composables
import {
  useDelitoStore,
  useFuncionarios,
  useMantenedorStore,
  useDocumentoStore,
  useEspeciesDineroStore,
  useRelatoStore,
  useSujetosIntervinientesStore,
  usePamStore,
  useActividadStore
} from '@/modules/global/composables'

// composables
import {
  useStepDetenidosACDStore,
  useStepDiligenciaStore,
  useStepRegistroContactoStore
} from '@/modules/flagrancia/composables'

import { useProcedimientosBandejaStore } from '@/modules/flagrancia/composables/useProcedimientosBandejaStore'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useSessionStore } from '@/modules/session/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { mantenedor_getTiposDelito } = useMantenedorStore()

const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()
const { userFiscalias, perfiles, roles } = useSessionStore()
const router = useRouter()
const dialog = useDialog()

const fiscalTurno = computed(() => perfiles.value[6].fiscal_turno)
const usuario = ref('')
const usuarioLogin = ref('')
const emitter = inject('emitter')

const tab = reactive({
  active: 0,
  items: [
    { title: 'Procedimientos abiertos', origenTabla: 'abiertas' },
    { title: 'Procedimientos cerrados', origenTabla: 'cerradas', hide: 'true' }
  ]
})

const flagrancia = reactive({
  isLoading: false,
  filters: {
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    actualTabFlagrancia: 'abiertas',
    status: 'InProgress,Ready'
  },
  firstRecord: 0
})

const pageHeader = reactive({
  isLoadingNew: false,
  title: ''
})

onMounted(() => {
  mantenedor_getTiposDelito()
  if (
    $hasSomeRoles(fiscalTurno.value) ||
    $hasSomeRoles([
      `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`
    ])
  ) {
    usuario.value = 'Bandeja Fiscal Turno'
    usuarioLogin.value = true
  } else {
    usuario.value = 'Bandeja Equipo Turno'
    usuarioLogin.value = false
  }
})
const { pam_iniciarProcesoFlagrancia, procesoPam, pam_reservarIniciarTarea } =
  usePamStore()
const {
  procedimientosBandeja_ESFLAGRANTE_SET_DEFAULT_STATE,
  procedimientosBandeja_RESET_FOLIO_PROCEDIMIENTO_DATA,
  procedimientosBandeja_SET_TIENE_FOLIO,
  procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL,
  procedimientos,
  paginacion,
  procedimientosBandeja_getProcedimientos
} = useProcedimientosBandejaStore()

const { identificacionDenuncia_SET_ID_CATALOGO } =
  useIdentificacionDenunciaStore()

function exportTable () {
  emitter.emit('table:export', tab.items[tab.active].origenTabla)
}

const nuevoProcedimiento = () => {
  if (
    $hasSomeRoles(fiscalTurno.value) ||
    $hasSomeRoles([
      `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`
    ])
  ) {
    procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL(true)
  } else procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL(false)
  // Reset para limpiar tablas de steps
  limpiarStoreParaNuevoProcedimiento()
  // llamada a backend con PAM inicio flujo
  const params = {
    'es-turno': true,
    'codigo-fiscalia': userFiscalias.value[0]?.fiscalia,
    'codigo-region': userFiscalias.value[0].region
  }

  requestUtil({
    action: pam_iniciarProcesoFlagrancia,
    payload: params,
    loader: (isLoading) => {
      pageHeader.isLoadingNew = isLoading
    },
    resolve: (res) => {
      console.log(res)
      identificacionDenuncia_SET_ID_CATALOGO(res)
      reservarIniciarTarea()
      procedimientosBandeja_SET_TIENE_FOLIO(false)
    }
  })
}

function reservarIniciarTarea () {
  const payload = {
    taskInstanceId: procesoPam.value.taskInstanceId
  }
  requestUtil({
    action: pam_reservarIniciarTarea,
    payload: payload,
    resolve: (r) => {
      router.push({ name: 'FlagranciaNuevaAtencionRegistroContacto' })
    }
  })
}
// Funcion para setear los datos de la store a su estado inicial
const { stepRegistroContacto_SET_DEFAULT_STATE } =
  useStepRegistroContactoStore()
const { sujetosIntervinientes_SET_DEFAULT_STATE } =
  useSujetosIntervinientesStore()
const { delito_SET_DEFAULT_STATE } = useDelitoStore()
const { especiesDinero_SET_DEFAULT_STATE } = useEspeciesDineroStore()
const { relato_SET_DEFAULT_STATE } = useRelatoStore()
const { documento_SET_DEFAULT_STATE } = useDocumentoStore()
const { actividad_RESET_ACTIVIDADES } = useActividadStore()
const { stepDiligencia_SET_DEFAULT_STATE } = useStepDiligenciaStore()
const {
  stepDetenidosACD_SET_DEFAULT_STATE,
  nominaDetenidos_SET_DEFAULT_STATE,
  procedimientoDetenidos_SET_DEFAULT_STATE
} = useStepDetenidosACDStore()
const { funcionarios_SET_DEFAULT_STATE } = useFuncionarios()

function limpiarStoreParaNuevoProcedimiento () {
  procedimientosBandeja_RESET_FOLIO_PROCEDIMIENTO_DATA()
  stepRegistroContacto_SET_DEFAULT_STATE()
  sujetosIntervinientes_SET_DEFAULT_STATE()
  delito_SET_DEFAULT_STATE()
  especiesDinero_SET_DEFAULT_STATE()
  relato_SET_DEFAULT_STATE()
  documento_SET_DEFAULT_STATE()
  actividad_RESET_ACTIVIDADES()
  stepDiligencia_SET_DEFAULT_STATE()
  stepDetenidosACD_SET_DEFAULT_STATE()
  funcionarios_SET_DEFAULT_STATE()
  procedimientosBandeja_ESFLAGRANTE_SET_DEFAULT_STATE()
}

function limpiarNomina () {
  nominaDetenidos_SET_DEFAULT_STATE()
  procedimientoDetenidos_SET_DEFAULT_STATE()
}

const itemsMenuSuperior = ref([
  {
    label: 'Nuevo procedimiento',
    icon: 'pi pi-plus-circle',
    command: () => nuevoProcedimiento()
  },
  {
    label: 'Nómina Detenidos',
    icon: 'pi pi-plus-circle',
    command: () => {
      limpiarNomina()
      router.push({ name: 'NominaDetenidosACD' })
    },
    visible: () =>
      $hasSomeRoles(fiscalTurno.value) ||
      $hasSomeRoles([
        `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`
      ])
  },
  {
    label: 'Comunicaciones JG',
    icon: 'pi pi-comment',
    command: () => handleRegistrarComunicacionJG(),
    visible: () =>
      $hasSomeRoles(fiscalTurno.value) ||
      $hasSomeRoles([
        `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`
      ])
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

function handleCleanFilters () {
  flagrancia.filters['fecha-hasta'] = undefined
  flagrancia.filters['fecha-desde'] = undefined
  flagrancia.filters.buscador = undefined

  getDataBandeja(flagrancia.filters)
}

function handleRegistrarComunicacionJG () {
  dialog.open(ModalRegistrarComunicacionConJuzgadodeGarantia, {
    props: {
      header: `Registrar Comunicación Con Juzgado de Garantía`,
      style: {
        width: '60%'
      },
      modal: true
    },
    onClose: async ({ data }) => {
      console.log(data)
    }
  })
}
// request de procedimientos
function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    flagrancia.firstRecord = 0
  }
  // const rol = roles.value.find((r) => r.includes('_TIN'))
  // Lógica temporal para filtrar llamadas a bandeja con user, se privilegia fiscal de turno por sobre equipo_turno linea 252
  const rolesFiscalJefe = roles.value.filter((r) =>
    r.includes('fiscal_turno_TIN')
  )
  const fiscalJefeActual = rolesFiscalJefe.find((f) =>
    f.includes($userFiscaliaActual.value.idFiscalia)
  )

  const rolesEquipoTurno = roles.value.filter((r) =>
    r.includes('equipo_turnoif_TIN')
  )
  const equipoTurnoActual = rolesEquipoTurno.find((f) =>
    f.includes($userFiscaliaActual.value.idFiscalia)
  )

  // procedimientosBandeja_getProcedimientos
  requestUtil({
    action: procedimientosBandeja_getProcedimientos,
    payload: {
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        grupo: fiscalJefeActual ?? equipoTurnoActual,
        status: flagrancia.filters.status,
        ...appUtil.sanitizeFilters(flagrancia.filters)
      }
    },
    loader: (v) => {
      flagrancia.isLoading = v
    }
  })
}
function tabChange ({ index }) {
  switch (index) {
    case 0:
      flagrancia.filters.prioritario = undefined
      flagrancia.filters.status = 'InProgress,Ready'
      break
    case 1:
      flagrancia.filters.status = 'Completed'
      break
  }
  handleCleanFilters()
}

getDataBandeja()
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
}
</style>
