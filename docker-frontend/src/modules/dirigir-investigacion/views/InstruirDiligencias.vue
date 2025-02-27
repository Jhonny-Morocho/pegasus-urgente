<template>
<section>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`RUC: ${resumenCausa?.ruc}`"
    page-title="Instruir Diligencias"
  />
  <AppFieldset
    class="mt-4"
    legend="Lista de Diligencias Realizadas e Instruidas"
  >
    <TablaDiligenciasInstruidas
      id="diligencias-instruidas"
      v-model:first="diligencias.first"
      is-preclasificador
      :loading="diligencias.isLoading"
      :rows="paginacionActividades?.tamanoPagina"
      :total-records="paginacionActividades?.elementosTotales"
      :value="actividades"
      @page="getDiligenciasInstruidas"
      @ver-documento="verDocumento"
    >
      <template #acciones>
        <Column header="Acciones">
          <template #body="slotProps">
            <AppMenuOptions
              :menu-options="menuAccion"
              :slot-props="slotProps"
            />
          </template>
        </Column>
      </template>
    </TablaDiligenciasInstruidas>
  </AppFieldset>

  <div class="grid mb-7">
    <p class="col-12">
      ¿Desea Instruir una nueva Diligencia?
    </p>
    <section class="col-3">
      <Button
        icon="pi pi-external-link"
        icon-pos="right"
        label="Instruir Nueva Diligencia"
        :loading="diligencias.isLoading"
        @click="openModalInstruirDiligencia"
      />
    </section>
  </div>
  <AppBtnsSteps
    :loading="isLoadingBtnVolver"
    @back-step="handleBackStep"
  />
</section>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { onMounted, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils/request.util.js'
import { useActividadStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'
import { useAppToast, useAppDialog, useDynamicDialog, useAppGlobalProperties } from '@/modules/common/composables'
import { useMenuSuperiorSecundario, useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import ModalCargaTrabajo from '@/modules/global/components/carga-trabajo/ModalCargaTrabajo.vue'
import TablaDiligenciasInstruidas from '@/modules/global/components/diligencias/TablaDiligenciasInstruidas.vue'
import ModalInstruirDiligencia from '@/modules/global/components/diligencias/ModalInstruirDiligencia.vue'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'
import { dateTimeUtil } from '@/utils'

const { toastSuccess } = useAppToast()
const { launchDialog } = useAppDialog()
const { launchDynamicDialog } = useDynamicDialog()

const {
  tipoActividadByCodigo,
  tipoOrigen,
  procesoHito,
  mantenedor_getEstadoMedidaHito,
  mantenedor_getSubtiposActividadList,
  mantenedor_getSubSubtiposActividadList,
  mantenedor_getProcesoHito,
  mantenedor_getInstituciones,
  mantenedor_getTipoActividadByCodigoActividad,
  mantenedor_getFiscalias,
  mantenedor_getTipoOrigenActividad,
  mantenedor_getNombreInstitucion
} = useMantenedorStore()

const {
  ruc,
  causa,
  idDenuncia,
  resumenCausa,
  dirigirInvestigacion_completarDefinirInstruirDiligencia
} = useDirigirInvestigacionStore()

const {
  solicitudes_iniciarYReservar
} = useSolicitudesStore()

const {
  actividades,
  paginacionActividades,
  actividad_getActividades,
  actividad_enviarSolicitud
} = useActividadStore()

const {
  procesoPam
} = usePamStore()

const router = useRouter()

const { $userFiscaliaActual } = useAppGlobalProperties()

const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value
})

const diligencias = reactive({
  isLoading: false,
  first: 0
})

const idFiscalia = ref('')
const isLoadingBtnVolver = ref(false)

const tipoOrigenCausa = computed(() => {
  const origenCausa = tipoOrigen.value?.find((origen) => origen.codigo === '1') // CODIGO 1: ORIGEN CAUSA
  return origenCausa
})

function instruirNuevaDiligencia (data) {
  console.log('instruirNuevaDiligencia()')
  requestUtil({
    action: actividad_enviarSolicitud,
    payload: {
      solicitud: data
    },
    loader: (l) => { diligencias.isLoading = l },
    resolve: (_res) => {
      iniciarYReservarTarea({
        taskId: procesoPam.value?.taskId,
        resolve: () => {}
      })

      requestUtil({
        action: dirigirInvestigacion_completarDefinirInstruirDiligencia,
        payload: {
          idTask: procesoPam.value?.taskId,
          idActividad: _res?.idActividad,
          idTipo: _res?.idTipoActividad,
          idSubTipo: _res?.idSubtipoActividad,
          idSubSubTipo: _res?.idSubSubtipoActividad,
          idInstitucionEjecutora: _res?.idUnidadEjecutora,
          idResponsableMaterializar: _res?.idResponsableMaterializar,
          requiereApoyo: true,
          materializarSolicitud: _res?.seDerivaEquipoJuridico,
          revisarSolicitud: _res?.seRevisaEscrito,
          fechaHoraSolicitud: dateTimeUtil.formatToBackendWithTime(),
          nombreInstitucionEjecutora: nombreInstitucion(_res?.idUnidadEjecutora),
          nombreResponsableMaterializar: data?.seDerivaEquipoJuridico ? 'Equipo Juridico' : 'Fiscal',
          plazo: _res?.plazoDias,
          plazoAutomaticoDias: parseInt(_res?.plazoDias),
          plazoDias: parseInt(_res?.plazoDias),
          plazoSolicitud: fechaPlazo(_res?.fechaSolicitud, _res?.plazoDias),
          tipo: _res?.idTipoActividad
        },
        loader: (l) => { isLoadingBtnVolver.value = l }
      })
      toastSuccess('¡Diligencia Instruida con Éxito!')
      getDiligenciasInstruidas()
    }
  })
}

function openModalInstruirDiligencia () {
  const { idCausa } = causa.value?.data?.causa

  launchDynamicDialog({
    component: ModalInstruirDiligencia,
    header: 'Instruir Nueva Diligencia',
    width: '90%',
    data: {
      ruc: ruc.value,
      idCausa: idCausa,
      idDenuncia: idDenuncia.value,
      proceso: procesoHito.value[0],
      idTipoActividad: tipoActividadByCodigo.value?.id,
      idTipoOrigenActividad: tipoOrigenCausa.value?.id
    },
    onClose: ({ data }) => {
      if (data) {
        instruirNuevaDiligencia(data)
      }
    }
  })
}

function fechaPlazo (fechaSolicitud, plazoString) {
  const plazo = parseInt(plazoString) || 0
  return dateTimeUtil.addDays(fechaSolicitud, plazo)
}

function nombreInstitucion (idInstitucionEjecutora) {
  return mantenedor_getNombreInstitucion(idInstitucionEjecutora?.toUpperCase())
}

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getEstadoMedidaHito })
  requestUtil({ action: mantenedor_getSubtiposActividadList })
  requestUtil({ action: mantenedor_getSubSubtiposActividadList })
  requestUtil({ action: mantenedor_getTipoOrigenActividad })

  requestUtil({
    action: mantenedor_getProcesoHito,
    payload: { codigo: 6 } // CODIGO 6: Proceso Tramitación (Dirigir la investigación)
  })

  requestUtil({
    action: mantenedor_getTipoActividadByCodigoActividad,
    payload: {
      params: { codigo: 26 } // CODIGO 26: DILIGENCIAS
    }
  })
}

function getDiligenciasInstruidas (pagination = undefined) {
  const { idCausa } = causa.value?.data?.causa

  if (!idCausa) return

  if (!pagination) {
    diligencias.first = 0
  }

  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': idCausa,
        'cod-tipo-actividad': '26', // CODIGO 26: DILIGENCIAS
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA
        page: pagination?.page || 0,
        size: pagination?.rows || 5
      }
    },
    loader: (l) => (diligencias.isLoading = l),
    reject: (error) => {
      console.error(error)
    }
  })
}

function addMenuConsultar () {
  const menuConsultar = {
    label: 'Consultar',
    icon: 'pi pi-question',
    items: [
      {
        label: 'Carga de Trabajo FL y Unidades',
        command: () => {
          launchDialog({
            component: ModalCargaTrabajo,
            header: 'Ver Carga de Trabajo FL y Unidades',
            width: '90%',
            cancelIcon: '',
            cancelLabel: 'Cerrar'
          })
        }
      }
    ]
  }
  itemsMenuSuperior.value?.splice(1, 0, menuConsultar)
}

function handleBackStep () {
  router.push({ name: 'DIDesarrolloInvestigacion' })
}

function verDocumento (_id) {
  console.log('verDocumento', _id)
  openModalVerDocumento(_id)
}

function openModalVerDocumento (idDocumentoSolicitud) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: idDocumentoSolicitud
    }
  })
}

onMounted(() => {
  // agrega un menu extra a itemsMenuSuperior
  addMenuConsultar()
  getDataMantenedor()
  getDiligenciasInstruidas()
  getFiscalia()
})

const menuAccion = ref([
  {
    label: 'Acciones',
    items: [
      {
        icon: 'pi pi-angle-right',
        label: 'Pedir Cuenta',
        command: () => {},
        disabled: () => true
      }
    ]
  }
])

function getFiscalia () {
  requestUtil({
    action: mantenedor_getFiscalias,
    payload: {
      params: {
        codigo: $userFiscaliaActual.value?.fiscalia
      }
    },
    resolve: ([fiscalia]) => {
      idFiscalia.value = fiscalia?.id
    }
  })
}

async function iniciarYReservarTarea ({ resolve, taskId }) {
  requestUtil({
    action: solicitudes_iniciarYReservar,
    payload: {
      taskId,
      idTarea: taskId
    },
    resolve,
    reject: (err) => {
      console.error(err)
    }
  })
}
</script>
