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
      v-for="table in tab.items"
      :key="table.title"
      :header="table.title"
    >
      <AppFilters
        v-model="fiscal.filters"
        @filter="getDataBandeja"
      />
      <TablaEscritorioFiscal
        v-model:first="fiscal.firstRecord"
        :loading="fiscal.isLoading"
        :no-column-mas-info="false"
        :rows="paginacion?.tamanoPagina"
        :total-records="paginacion?.elementosTotales"
        :value="causas"
        @iniciar:tarea="iniciarTarea"
        @page="getDataBandeja"
      />
    </TabPanel>
  </TabView>
</section>
</template>

<script setup>
/* eslint-disable */
import PageHeader from '@/modules/common/components/PageHeader.vue';
import AppFilters from '@/modules/common/components/AppFilters.vue';
import TablaEscritorioFiscal from '@/modules/termino-postermino/components/tablas/TablaEscritorioFiscal.vue';
import { onMounted, reactive, nextTick } from 'vue';
import {
  useAppGlobalProperties,
  useConfirmDialog
} from '@/modules/common/composables';
import { useSessionStore } from '@/modules/session/composables';
import { appUtil, dateTimeUtil, requestUtil } from '@/utils';
import {
  useBandejaFiscal,
  useTermino
} from '@/modules/termino-postermino/composables';
import { useRouter } from 'vue-router';
import { usePamStore } from '@/modules/global/composables';

const router = useRouter();

const { launchConfirmDialog } = useConfirmDialog();
const { taskStatus } = appUtil;

const { $userFiscaliaActual } = useAppGlobalProperties();

const { roles } = useSessionStore();

const { bandejaFiscal_getDataBandeja, causas, paginacion } = useBandejaFiscal();

const { termino_SET_ID_DENUNCIA, termino_SET_RUC, termino_SET_CAUSA } =
  useTermino();

// VALUES
const fiscal = reactive({
  isLoading: false,
  filters: {
    buscador: undefined,
    prioritario: undefined,
    'fecha-desde': undefined,
    'fecha-hasta': undefined,
    grupo: '',
    status: `${taskStatus.READY},${taskStatus.IN_PROGRESS}`
  },
  firstRecord: 0
});

// LOGIC
onMounted(() => {
  const { fiscalia } = $userFiscaliaActual.value;
  const grupoFiscal = roles.value.find((r) =>
    r.includes(`${fiscalia}_fiscal_TPT`)
  );
  fiscal.filters.grupo = grupoFiscal;
  getDataBandeja(paginacion);
});

async function getDataBandeja(pagination = undefined) {
  if (!pagination) {
    fiscal.firstRecord = 0;
  }

  if (!fiscal.filters.grupo) {
    openNoRoleMatch();
    return;
  }
  requestUtil({
    action: bandejaFiscal_getDataBandeja,
    payload: {
      params: {
        ...fiscal.filters,
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        buscador: fiscal.filters.buscador?.trim().length
          ? fiscal.filters.buscador
          : undefined,
        // 'fecha-desde': formatDate(fiscal.filters['fecha-desde']),
        'fecha-hasta': formatDate(fiscal.filters['fecha-hasta'])
      }
    },
    loader: (l) => {
      fiscal.isLoading = l;
    }
  });
}

const { procesoPam, pam_SET_PROCESO } = usePamStore();

const iniciarTarea = ({ data: { causa }, tarea }) => {
  termino_SET_RUC(causa.ruc);
  termino_SET_ID_DENUNCIA(causa.idDenuncia || '');
  termino_SET_CAUSA(causa);
  pam_SET_PROCESO(tarea);
  console.log(`Id denuncia: ${causa.idDenuncia}`);
  const taskName =
    tarea?.taskName && tarea.taskName.replace(/\s/g, '').toUpperCase();

  if (taskName === 'Elaborar Consulta'.replace(/\s/g, '').toUpperCase()) {
    router.push({ name: 'TPTFJRevisarConsultaTermino' });
  } else if (
    taskName ===
    'Revisar y resolver las  observaciones'.replace(/\s/g, '').toUpperCase()
  ) {
    router.push({ name: 'TPTFJRevisarCorregirObservaciones' });
  } else if (
    taskName ===
    'Gestionar audiencia de suspensión o término'
      .replace(/\s/g, '')
      .toUpperCase()
  ) {
    router.push({ name: 'TPTFJSolicitarAudienciaTermino' });
  } else if (
    taskName ===
    'Gestionar término en tribunales'.replace(/\s/g, '').toUpperCase()
  ) {
    router.push({ name: 'TPTFPrepararEscritoDeTermino' });
  } else if (
    taskName === 'Terminar Causa / Relacion'.replace(/\s/g, '').toUpperCase()
  ) {
    router.push({ name: 'TPTFInformarTerminoDeCausa' });
  } else if (taskName === 'Revisar Causa'.replace(/\s/g, '').toUpperCase()) {
    router.push({ name: 'RevisarCausaConSCPoAR' });
  } else if (
    taskName === 'Evaluar informe psiquiátrico'.replace(/\s/g, '').toUpperCase()
  ) {
    router.push({ name: 'EvaluarInformePsiquiatrico' });
  } else if (
    taskName ===
    'Solicitar Sobreseimiento Definitivo'.replace(/\s/g, '').toUpperCase()
  ) {
    router.push({ name: 'TPTFSolicitudSobreseimientoDefinitivo' });
  } else if (
    taskName === 'Evaluar solicitud reapertura'.replace(/\s/g, '').toUpperCase()
  ) {
    router.push({ name: 'TPTFSolicitudReaperturaCausa' });
  } else if (
    taskName === 'Reactivar Causa Penal'.replace(/\s/g, '').toUpperCase()
  ) {
    router.push({ name: 'TPTFReactivarCausaPenal' });
  }
};
function formatDate(value) {
  if (value) {
    return dateTimeUtil.formatToBackend(value);
  }
  return undefined;
}

async function openNoRoleMatch() {
  nextTick(() => {
    launchConfirmDialog({
      header: 'Advertencia',
      message: 'Usted no posee el rol necesario para ejecutar esta tarea',
      acceptLabel: 'OK',
      rejectClass: 'hidden'
    });
  });
}

const tab = reactive({
  active: 0,
  items: [
    { title: 'En Curso', origenTabla: 'enCurso' },
    { title: 'Solicitudes', origenTabla: 'solicitudes' },
    {
      title: 'Notificaciones y Respuestas',
      origenTabla: 'notificacionesyRespuestas'
    },
    { title: 'Alertas', origenTabla: 'alertas' },
    { title: 'SIAU', origenTabla: 'SIAU' },
    { title: 'SACFI', origenTabla: 'SACFI' },
    { title: 'SACFI', origenTabla: 'SACFI' },
    { title: 'Mis Causas', origenTabla: 'misCausas' },
    { title: 'Completadas', origenTabla: 'completed' }
  ]
});

function tabChange({ index }) {
  switch (index) {
    case 0:
      fiscal.filters.status = `${taskStatus.READY},${taskStatus.IN_PROGRESS}`;
      break;
    case 1:
      fiscal.filters.status = 'InProgress,Ready';
      break;
    case 2:
      fiscal.filters.status = 'InProgress,Ready';
      break;
    case 3:
      fiscal.filters.status = 'InProgress,Ready';
      break;
    case 8:
      fiscal.filters.status = taskStatus.COMPLETED;
      break;
  }
  handleCleanFilters();
}

function handleCleanFilters() {
  fiscal.filters['fecha-hasta'] = undefined;
  fiscal.filters['fecha-desde'] = undefined;
  fiscal.filters.buscador = undefined;

  getDataBandeja(fiscal.filters);
}

// const emitter = inject('emitter')

const itemsMenuSuperior = [
  {
    label: 'CDD',
    icon: 'pi pi-briefcase',
    items: [
      {
        label: 'Solicitud de Creación de Catálogo Documental Digital'
      },
      {
        label: 'Ingreso de Solicitud de Gestión de Documento o Archivo'
      }
    ]
  },
  {
    label: 'Actualizar',
    icon: 'pi pi-replay',
    command: () => location.reload()
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download',
    command: () => exportTable()
  },
  {
    label: 'Limpiar Filtros',
    icon: 'pi pi-filter-slash',
    command: () => console.log('Limpiar Filtros')
  }
];

function exportTable() {
  emitter.emit('table:export', tab.items[tab.active].origenTabla);
}
</script>
