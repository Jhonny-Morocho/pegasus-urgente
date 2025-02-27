<template>
<main>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Bandeja  Fiscal Jefe"
  />
  <TabView
    v-model:activeIndex="tab.active"
    @tab-change="tabChange"
  >
    <TabPanel
      v-for="table in tab.items"
      :key="table.title"
      :header="table.title"
    >
      <AppFilters
        v-model="gestionDireccionInvestigacion.filters"
        @filter="getDataBandeja"
      />
      <TablaEscritorioGestionDireccionInvestigacion
        v-model:first="gestionDireccionInvestigacion.firstRecord"
        v-model:selection="causasAceptar"
        :loading="gestionDireccionInvestigacion.isLoading"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="causas"
        @iniciar:tarea="iniciarTarea"
        @page="getDataBandeja"
        @ver-ficha-causa="openFichaCausa"
      />
    </TabPanel>
  </TabView>
</main>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useFichaCausa } from '@/modules/ficha-causa/composables'
import { useMantenedorStore, usePamStore } from '@/modules/global/composables'
import { useBandejaFiscalJefe, useGestionDireccionInvestigacionStore } from '../composables'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import TablaEscritorioGestionDireccionInvestigacion from '@/modules/termino-postermino/components/tablas/TablaEscritorioGestionDireccionInvestigacion.vue'

const router = useRouter()

const { taskStatus, includeWord, scrollTo } = appUtil

const { launchDialog } = useAppDialog()

const { $userFiscaliaActual, $userRoles } = useAppGlobalProperties()

const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

const { pam_SET_PROCESO } = usePamStore()

const {
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getTiposDenuncia
  // mantenedor_getAllFiscales
} = useMantenedorStore()

const {
  causas,
  paginacion,
  bandejaFiscalJefe_getDataBandeja
} = useBandejaFiscalJefe()

const {
  gestionDireccionInvestigacion_SET_CAUSA_ACTUAL
} = useGestionDireccionInvestigacionStore()

const causasAceptar = ref([])

const tareasGestionDireccionInvestigacion = [
  { nombreTarea: 'Revisar Causa', routeName: 'TPTGDIRevisarTransferenciaCausa' }
]

function pushToStep (nombreTarea) {
  const tareaGestionDireccionInvestigacionFound = tareasGestionDireccionInvestigacion.find(
    tareaGestionDireccionInvestigacion =>
      includeWord(nombreTarea, tareaGestionDireccionInvestigacion.nombreTarea)
  )

  router.push({ name: tareaGestionDireccionInvestigacionFound.routeName })
}

function iniciarTarea (tareaCausa) {
  const { data, tarea } = tareaCausa

  gestionDireccionInvestigacion_SET_CAUSA_ACTUAL(data)
  pam_SET_PROCESO(tarea)

  scrollTo(0)
  pushToStep(tarea?.taskName)
}

function getGrupoUsuario () {
  const { fiscalia } = $userFiscaliaActual.value

  gestionDireccionInvestigacion.filters.grupo = $userRoles.value.find((r) =>
    r.includes(`${fiscalia}_fiscal_jefe_GDI`)
  )
}

const gestionDireccionInvestigacion = reactive({
  isLoading: false,
  filters: {
    prioritario: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    buscador: undefined,
    grupo: '',
    status: `${taskStatus.RESERVED}`
  },
  firstRecord: 0
})

function getDataBandeja (pagination = undefined) {
  if (!pagination) {
    gestionDireccionInvestigacion.firstRecord = 0
  }

  requestUtil({
    action: bandejaFiscalJefe_getDataBandeja,
    payload: {
      params: {
        ...gestionDireccionInvestigacion.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        buscador: gestionDireccionInvestigacion.filters.buscador?.trim().length
          ? gestionDireccionInvestigacion.filters.buscador
          : undefined,
        'fecha-desde': formatDate(gestionDireccionInvestigacion.filters['fecha-desde']),
        'fecha-hasta': formatDate(gestionDireccionInvestigacion.filters['fecha-hasta'])
      }
    },
    loader: (l) => {
      gestionDireccionInvestigacion.isLoading = l
    }
  })
}

function openModalCargaTrabajo () {
  launchDialog({
    component: ModalCargaTrabajo,
    header: 'Carga de Trabajo FL y Unidades',
    width: '90%'
  })
}

function openFichaCausa (tareaCausa) {
  const { tarea, data } = tareaCausa
  const { causa } = data

  pam_SET_PROCESO(tarea)

  sendToFichaCausa({
    origenCausa: flujoOrigen.TRANSVERSAL,
    ruc: causa?.ruc,
    idCausa: causa?.idCausa,
    idDenuncia: causa?.idDenuncia,
    newTab: true
  })
}

function tabChange ({ index }) {
  switch (index) {
    case 0:
      gestionDireccionInvestigacion.filters.prioritario = undefined
      gestionDireccionInvestigacion.filters.status = `${taskStatus.RESERVED}`
      break
    case 1:
      gestionDireccionInvestigacion.filters.prioritario = undefined
      gestionDireccionInvestigacion.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
      break
    // QUEDAN POR DEFINIR LOS OTROS TAB YA QUE NO EXISTEN ESOS FILTROS EN EL ENDPOINT DE BANDEJA
  }
  handleCleanFilters()
}

function handleCleanFilters () {
  // NO FUNCIONA NADA DE LOS FILTROS DE FECHA Y BUSCADOR EN EL EP DE BANDEJA
  gestionDireccionInvestigacion.filters['fecha-hasta'] = undefined
  gestionDireccionInvestigacion.filters['fecha-desde'] = undefined
  gestionDireccionInvestigacion.filters.buscador = undefined

  getDataBandeja()
}

function formatDate (value) {
  if (value) {
    return dateTimeUtil.formatToBackend(value)
  }
  return undefined
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFamiliasDelito })
  requestUtil({ action: mantenedor_getTiposDelito })
  requestUtil({ action: mantenedor_getTiposDenuncia })
  // se desactiva llmada hasta nuevo aviso cuando back mejore el endpoint
  // requestUtil({ action: mantenedor_getAllFiscales })
}

onMounted(() => {
  getGrupoUsuario()
  getDataBandeja()
  getDataMantenedor()
})

const tab = reactive({
  active: 0,
  items: [
    { title: 'Tareas en Curso', origenTabla: 'enCurso' },
    { title: 'Solicitudes', origenTabla: 'solicitudes' },
    { title: 'Notificaciones y Respuestas', origenTabla: 'notificacionesRespuestas' },
    { title: 'Alertas', origenTabla: 'alertas' },
    { title: 'SIAU', origenTabla: 'siau' },
    { title: 'SACFI', origenTabla: 'sacfi' },
    { title: 'Mis Causas', origenTabla: 'misCausas' },
    { title: 'Tareas Prioritarias', origenTabla: 'prioritarias' },
    { title: 'Tareas Completadas', origenTabla: 'completadas' }
  ]
})

const itemsMenuSuperior = ref([
  {
    label: 'Nuevo',
    icon: 'pi pi-plus-circle',
    disabled: () => false,
    items: [
      {
        disabled: () => true,
        label: 'Denuncia de Oficio'
      }
    ]
  },
  {
    label: 'Consultar',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Carga de Trabajo FL',
        command: () => openModalCargaTrabajo()
      }
    ]
  },
  {
    label: 'Aceptar Propuesta',
    icon: 'pi pi-check-circle',
    disabled: () => false
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => location.reload()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: () => console.log('Exportar')
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',
    command: () => console.log('Limpiar Filtros')
  }
])

</script>
