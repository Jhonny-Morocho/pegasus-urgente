<template>
<AppFieldset legend="Lista de Diligencias Autónomas  o Instruidas">
  <AppDataTable
    id="diligenciasInstruidas"
    class="col-12"
    :loading="isLoading"
    :rows="paginacionActividades?.tamanoPagina"
    :total-records="paginacionActividades?.elementosTotales"
    :value="actividades"
    @page="getDataTableDiligenciasAutonomasOInstruidas"
  >
    <Column header="Fecha de Instrucción">
      <template #body="slotProps">
        {{ formatFecha(slotProps.data.fechaActividad) }}
      </template>
    </Column>
    <Column header="Tipo de Diligencia">
      <template #body="slotProps">
        {{ slotProps.data.nombreSubTipoActividad ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Subtipo Diligencia">
      <template #body="slotProps">
        {{ slotProps.data.nombreSubSubTipoActividad ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Estado">
      <template #body="slotProps">
        {{ slotProps.data.nombreEstado ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Institución Ejecutora">
      <template #body="slotProps">
        {{ slotProps.data.nombreUnidadEjecutora ?? 'N/A' }}
      </template>
    </Column>
    <Column header="Diligencias / Instrucción">
      <template #body="slotProps">
        {{ slotProps.data.origen ?? 'Diligencias' }}
      </template>
    </Column>
    <Column header="Documento">
      <template #body="slotProps">
        {{ slotProps.data?.idDocumentoSolicitud?.length ?? 'Sin Documento' }}
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <div>
          <Button
            aria-controls="overlay_menu"
            aria-haspopup="true"
            class="p-button-rounded p-button-outlined"
            icon="pi pi-ellipsis-v"
            type="button"
            @click="toggleAcciones($event, slotProps.data, slotProps.data.idActividad)"
          />
        </div>
      </template>
    </Column>
  </AppDataTable>
  <Menu
    v-if="$hasSomeRoles(fiscalTurno)|| $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`])
      || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_equipo_turnoif_TIN`])"
    ref="menuSugeridasFiscal"
    :model="optionsSugeridasFiscal"
    :popup="true"
  />
</AppFieldset>
</template>

<script setup>
// import components and functionalities
import { computed, onMounted, ref } from 'vue'
import {
  useAppToast,
  useAppGlobalProperties
} from '@/modules/common/composables'
import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'
import ModalRegistrarComunicacionConJuzgadodeGarantia from '@/modules/flagrancia/components/diligencias-e-instrucciones/modales/ModalRegistrarComunicacionConJuzgadodeGarantia'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useActividadStore, usePamStore } from '@/modules/global/composables'
import { useSessionStore } from '@/modules/session/composables'
import { useDialog } from 'primevue/usedialog'

// utilities
const { perfiles } = useSessionStore()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastError } = useAppToast()
const dialog = useDialog()
const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()

const {
  actividades,
  actividad_getActividades,
  paginacionActividades,
  actividad_deleteActividad
} = useActividadStore()

const { procesoPam } = usePamStore()

// values
const menuSugeridasFiscal = ref(null)
const idDiligenciaAInstruir = ref(null)
const isLoading = ref(false)
const fiscalTurno = computed(() => perfiles.value[6].fiscal_turno)

onMounted(() => {
  getDataTableDiligenciasAutonomasOInstruidas()
})

function getDataTableDiligenciasAutonomasOInstruidas (pagination = undefined) {
  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': procesoPam.value.idDenuncia,
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => {
      isLoading.value = l
    },
    reject: (error) => {
      console.error(error)
    }
  })
}

function formatFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontend(fecha)
  }
}

const optionsSugeridasFiscal = ref([
  {
    items: [
      {
        label: 'Registrar Comunicación JG',
        command: () => {
          abrirModalRegistrarComunicacionJuzgadoGarantia()
        }
      },
      {
        label: 'Eliminar',
        command: () => {
          eliminarDiligenciaInstruida()
        }
      }
    ]
  }
])

function abrirModalRegistrarComunicacionJuzgadoGarantia () {
  dialog.open(ModalRegistrarComunicacionConJuzgadodeGarantia, {
    props: {
      header: `Registrar Comunicación con Juzgado de Garantía`,
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

// logic
const toggleAcciones = (event, data, id) => {
  if ($hasSomeRoles(fiscalTurno.value) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) || $hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_equipo_turnoif_TIN`])) {
    menuSugeridasFiscal.value?.toggle(event)
    idDiligenciaAInstruir.value = id
  }
}

function eliminarDiligenciaInstruida () {
  console.log('id Diligencia', idDiligenciaAInstruir.value)
  const idActividad = idDiligenciaAInstruir.value
  launchConfirmDialog({
    message: `¿Estás seguro de eliminar la diligencia instruida seleccionada?`,
    accept: () => {
      requestUtil({
        action: actividad_deleteActividad,
        payload: {
          idActividad
        },
        loader: (l) => {
          isLoading.value = l
        },
        resolve: (d) => {
          console.log('getDiligencias', d)
          toastSuccess('Diligencia Instruida eliminada con éxito')
          getDataTableDiligenciasAutonomasOInstruidas()
        },
        reject: (err) => {
          console.log(err)
          toastError('Ocurrió un error inesperado')
        }
      })
    }
  })
}

</script>
