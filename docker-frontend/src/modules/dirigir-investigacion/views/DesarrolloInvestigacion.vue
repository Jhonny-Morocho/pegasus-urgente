<template>
<section>
  <PageHeader
    class="mb-7"
    :items-menu-superior="itemsMenuSuperior"
    :page-subtitle="`RUC: ${ruc}`"
    page-title="Desarrollo de la Investigación"
  />
  <div class="grid mb-6">
    <!-- Panel Acciones sobre la Causa -->
    <div class="col-12 md:col-6 mb-0">
      <AppFieldset legend="Acciones sobre la Causa">
        <TablaAccionesSobreCausa
          @actualizar:directriz="irTareaActualizarDirectriz"
          @solicitar:detencion="solicitar"
          @solicitar:diligencias="irTareaInstruirDiligencias"
          @solicitar:formalizacion="solicitar"
          @solicitar:medidas-cautelares="solicitar"
          @solicitar:otras-solicitudes="openModalOtrasSolicitudes"
        />
      </AppFieldset>
    </div>
    <div class="col-12 md:col-6 grid mb-0">
      <!-- Resumen de la Causa -->
      <div class="col-12 md:col-6">
        <AppFieldset
          legend="Resumen de la Causa"
          :loading="isLoadingResumenCausa"
        >
          <div
            v-if="resumenCausa"
            class="w-full"
          >
            <InformacionFieldset
              :is-loading="isLoadingResumenCausa"
              is-resumen-causa
              :resumen-causa="resumenCausa"
              @ver-todo="openModalResumenCausa"
            />
          </div>
          <div v-else>
            <p>No existen registros</p>
          </div>
        </AppFieldset>
      </div>
      <!-- Directriz de Investigacion -->
      <div class="col-12 md:col-6">
        <AppFieldset legend="Directriz de Investigación">
          <div
            class="w-full"
          >
            <InformacionFieldset
              :directriz-causa="directrizCausa"
              :directriz-relacion="directrizRelacion"
              is-directriz
              :is-loading="isLoadingDirectrices"
              @ver-todo="openModalDirectrices"
            />
          </div>
        </AppFieldset>
      </div>
      <!-- Diligencias o solicitudes pendientes -->
      <div class="col-12 md:col-6 pb-0">
        <AppFieldset legend="Diligencias o Solicitudes Pendientes">
          <InformacionFieldset
            :data="diligenciasPendientes.data"
            is-diligencia-pendiente
            :is-loading="diligenciasPendientes.isLoading"
            @ver-todo="openModalDiligenciasPendientes"
          />
        </AppFieldset>
      </div>
      <!-- Diligencias o solicitudes ejecutadas -->
      <div class="col-12 md:col-6 pb-0">
        <AppFieldset legend="Diligencias o Solicitudes Ejecutadas">
          <InformacionFieldset
            :data="diligenciasEjecutadas.data"
            is-diligencia-ejecutada
            :is-loading="diligenciasEjecutadas.isLoading"
            @ver-documento="openModalVerDocumento"
            @ver-todo="openModalDiligenciasEjecutadas"
          />
        </AppFieldset>
      </div>
    </div>
    <!-- Alertas y Notificaciones -->
    <div class="col-12 md:col-6 mb-0">
      <AppFieldset legend="Alertas y Notificaciones">
        <div
          v-if="alertasNotificaciones.length > 0"
          class="w-full"
        >
          <Message
            v-for="alerta in alertasNotificaciones"
            :key="alerta"
            class="mb-1 w-full"
            :closable="false"
            icon="pi pi-fw pi-exclamation-triangle"
            severity="error"
          >
            {{ alerta.detalle }}
          </Message>
          <div class="col-12 flex justify-content-end mt-4 mb-0 pb-0">
            <Button
              class="p-button-text btn-primary-outline mb-o pb-0"
              label="Ver todas "
              @click="openModalAlertas"
            />
          </div>
        </div>
        <div v-else>
          <p>No existen registros</p>
        </div>
      </AppFieldset>
    </div>
    <!-- Anotaciones -->
    <div class="col-12 md:col-6 mb-0">
      <AppFieldset legend="Anotaciones">
        <InformacionFieldset
          :data="anotaciones?.slice(0, 2)"
          is-anotacion
          :is-loading="isLoadingAnotaciones"
          @ver-todo="openModalAnotaciones"
        />
      </AppFieldset>
    </div>
    <!-- Solicitudes al PJUD -->
    <div class="col-12 md:col-6 mb-0">
      <AppFieldset legend="Solicitudes al PJUD">
        <div
          class="w-full"
        >
          <InformacionFieldset
            :data="solicitudesPJUD.data"
            :is-loading="solicitudesPJUD.isLoading"
            is-solicitud-pjud
            @ver-todo="openModalSolicitudesPjud"
          />
        </div>
      </AppFieldset>
    </div>
    <!-- Historial de la Causa -->
    <div class="col-12 md:col-6 mb-0">
      <AppFieldset legend="Historial de la Causa">
        <div
          v-if="false"
          class="w-full"
        >
          <InformacionFieldset
            :data="historialCausa"
            is-historial
            @ver-todo="openModalHistorialCausa"
          />
        </div>
        <div v-else>
          <p>No existen registros</p>
        </div>
      </AppFieldset>
    </div>
  </div>
  <AppBtnsSteps no-button-back />

  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined px-5"
      icon="pi pi-arrow-left"
      icon-pos="left"
      label="Volver a Revisar Antecedentes de la Causa"
      @click="handleVolverARevisarAntecedentes"
    />
  </AppBtnRightTeleported>

  <AppBtnNextTeleported
    class="ml-4 px-5"
    icon="pi pi-angle-double-right"
    icon-pos="right"
    label="Tomar Decisión de la Causa-Relación"
    :loading="isLoadingBtnFooter"
    @click="handleNextStep"
  />
</section>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { h, nextTick, onMounted, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog } from 'primevue/usedialog'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useAppDialog, useConfirmDialog, useAppToast, useDynamicDialog } from '@/modules/common/composables'
import { useAnotacionCausaStore, usePamStore, useMantenedorStore, useActividadStore, useMantenedorHelper, useCausasRelacionadasStore } from '@/modules/global/composables'
import Button from 'primevue/button'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import InformacionFieldset from '@/modules/dirigir-investigacion/components/desarrollo-de-la-investigacion/InformacionFieldset.vue'
import TablaAccionesSobreCausa from '@/modules/dirigir-investigacion/components/desarrollo-de-la-investigacion/TablaAccionesSobreCausa.vue'
import ModalResumenCausa from '@/modules/dirigir-investigacion/components/modals/ModalResumenCausa.vue'
import ModalSujetosIntervinientes from '@/modules/dirigir-investigacion/components/modals/ModalSujetosIntervinientes.vue'
import ModalDelitos from '@/modules/dirigir-investigacion/components/modals/ModalDelitos.vue'
import ModalRelatos from '@/modules/dirigir-investigacion/components/modals/ModalRelatos.vue'
import ModalRelaciones from '@/modules/dirigir-investigacion/components/modals/ModalRelaciones.vue'
import ModalEspeciesDinero from '@/modules/dirigir-investigacion/components/modals/ModalEspeciesDinero.vue'
import ModalDocumentos from '@/modules/dirigir-investigacion/components/modals/ModalDocumentos.vue'
import ModalHistorialCausa from '@/modules/dirigir-investigacion/components/modals/ModalHistorialCausa.vue'
import ModalDiligencias from '@/modules/dirigir-investigacion/components/modals/ModalDiligencias.vue'
import ModalAnotaciones from '@/modules/dirigir-investigacion/components/modals/ModalAnotaciones.vue'
import ModalPautas from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalPautas.vue'
import ModalMedidasProteccion from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalMedidasProteccion.vue'
import ModalMedidasCautelares from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalMedidasCautelares.vue'
import ModalMedidasIntrusivas from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalMedidasIntrusivas.vue'
import ModalConsultarCausasRelacionadas from '@/modules/global/components/causas-relacionadas/ModalConsultarCausasRelacionadas.vue'
import ModalGeorreferenciacionGuardada from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalGeorreferenciacionGuardada.vue'
import ModalConsultaRF from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalConsultaRF.vue'
import ModalSolicitarAntecedentesEspecificos from '@/modules/dirigir-investigacion/components/modals/ModalSolicitarAntecedentesEspecificos.vue'
import ModalActualizarAntecedentes from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalActualizarAntecedentes.vue'
import ModalNotificaciones from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalNotificaciones.vue'
import ModalDerivacionesUravit from '@/modules/dirigir-investigacion/components/modals/ModalDerivacionesUravit.vue'
import ModalDiligenciasSolicitudes from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalDiligenciasSolicitudes.vue'
import ModalDirectricesCausa from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalDirectricesCausa.vue'
import ModalVerDocumento from '@/modules/global/components/modals/ModalVerDocumento.vue'
import ModalSolicitudesPjud from '@/modules/dirigir-investigacion/components/modals/desarrollo-de-la-investigacion/ModalSolicitudesPjud.vue'
import ModalSelectorSolicitudes from '../components/modals/ModalSelectorSolicitudes.vue'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'
import ModalCausasRelacionadas from '../components/modals/desarrollo-de-la-investigacion/ModalCausasRelacionadas.vue'

const router = useRouter()
const dialog = useDialog()
const { launchDynamicDialog } = useDynamicDialog()

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()
const { procesoPam, pam_SET_PROCESO } = usePamStore()

const {
  causasRelacionadas_guardarCausasRelacionadas
} = useCausasRelacionadasStore()

const { anotaciones, anotacionCausa_getAnotacionesByIdDenuncia } =
  useAnotacionCausaStore()

const {
  ruc,
  causa,
  idDenuncia,
  resumenCausa,
  dirigirInvestigacion_getResumenCausa,
  dirigirInvestigacion_getObtenerDirectrizInvestigacion,
  dirigirInvestigacion_getObtenerHistorialDirectrizRelacion,
  dirigirInvestigacion_getAlertasNotificacionesCausa,
  dirigirInvestigacion_completarDesarrolloInvestigacion
} = useDirigirInvestigacionStore()

const { solicitudes_SET_ID_DENUNCIA, solicitudes_SET_DATA_SELECTOR_SOLICITUD, solicitudes_SET_IS_CITACION, solicitudes_SET_IS_TELEFONICA } = useSolicitudesStore()

const {
  subtipoActividadList,
  subSubtipoActividadList,
  procesoHito,
  tiposActividad,
  mantenedor_getFamiliasDelito,
  mantenedor_getSubtiposActividadList,
  mantenedor_getSubSubtiposActividadList,
  mantenedor_getTipoActividadByCodigoActividad,
  mantenedor_getProcesoHito,
  mantenedor_getCodigoActividadHijo
} = useMantenedorStore()

const { getCodigoMantenedorById } = useMantenedorHelper()

const { solicitudes_iniciarYReservar } = useSolicitudesStore()
const { actividad_getActividades } = useActividadStore()

const isLoadingBtnFooter = ref(false)
const isLoadingDirectrices = ref(false)
const historialCausa = ref([])
const directrizRelacion = ref()
const directrizCausa = ref()
const alertasNotificaciones = ref([])
const diligenciasEjecutadas = reactive({
  data: [],
  isLoading: false
})
const diligenciasPendientes = reactive({
  data: [],
  isLoading: false
})
const solicitudesPJUD = reactive({
  data: [],
  isLoading: false
})
const isLoadingResumenCausa = ref(false)
const isLoadingAnotaciones = ref(false)

const idCausa = computed(() => causa.value?.data?.causa?.idCausa)

const idProcesoHito = computed(() => procesoHito.value[0]?.id)

function getResumenCausa () {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: ruc.value },
    loader: (l) => { isLoadingResumenCausa.value = l }
  })
}

function getAnotaciones () {
  requestUtil({
    action: anotacionCausa_getAnotacionesByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: { page: 0, size: 2 },
      loader: (l) => { isLoadingAnotaciones.value = l }
    }
  })
}

async function getDirectrices () {
  isLoadingDirectrices.value = true
  await requestUtil({
    action: dirigirInvestigacion_getObtenerDirectrizInvestigacion,
    payload: {
      idCausa: causa.value?.data?.causa?.idCausa
    },
    resolve: (_data) => {
      directrizCausa.value = _data
    },
    reject: (err) => {
      console.log(err)
    }
  })
  await requestUtil({
    action: dirigirInvestigacion_getObtenerHistorialDirectrizRelacion,
    payload: {
      idCausa: causa.value?.data?.causa?.idCausa
    },
    resolve: (_data) => {
      directrizRelacion.value = _data?.data
    }
  })
  isLoadingDirectrices.value = false
}

// eslint-disable-next-line no-unused-vars
function getAlertasNotificaciones () {
  requestUtil({
    action: dirigirInvestigacion_getAlertasNotificacionesCausa,
    payload: {
      ruc: ruc.value,
      params: { page: 0, size: 2 }
    },
    resolve: (data) => {
      alertasNotificaciones.value = data?.slice(0, 2)
    }
  })
}

function getActividades ({ diligencias, isEjecutadas }) {
  requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': causa.value?.data?.causa?.idCausa,
        page: 0,
        size: 3,
        'cod-estados': isEjecutadas ? '3,8' : '1,7,3,8' // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA (Dejar el que corresponda cuando el endpoint funcione como corresponde, hint: isEjecutadas)
      }
    },
    loader: (l) => { diligencias.isLoading = l },
    resolve: ({ data }) => {
      diligencias.data = data
    }
  })
}

// eslint-disable-next-line no-unused-vars
function getDiligenciasPendientes () {
  getActividades({
    diligencias: diligenciasPendientes,
    isEjecutadas: false
  })
}

function getDiligenciasEjecutadas () {
  getActividades({
    diligencias: diligenciasEjecutadas,
    isEjecutadas: true
  })
}

async function getSolicitudesPJUD () {
  await requestUtil({
    action: actividad_getActividades,
    payload: {
      params: {
        'id-origen-actividad': idCausa.value,
        page: 0,
        size: 3,
        'cod-estados': '1,7,3,8', // 1: EN_PREPARACION, 7: INGRESADA, 3: APROBADA, 8: CUMPLIDA (Dejar el que corresponda cuando el endpoint funcione como corresponde, hint: isEjecutadas)
        'cod-tipo-actividad': '24'
      }
    },
    loader: (l) => { solicitudesPJUD.isLoading = l },
    resolve: ({ data }) => {
      solicitudesPJUD.data = data
    }
  })
}

onMounted(async () => {
  getResumenCausa()
  getAnotaciones()
  getDirectrices()
  getDiligenciasPendientes()
  getDiligenciasEjecutadas()
  getSolicitudesPJUD()

  requestUtil({
    action: mantenedor_getProcesoHito,
    payload: { codigo: 6 } // CODIGO 6: Tramitación (Dirigir Investigación)
  })

  await requestUtil({
    action: mantenedor_getSubtiposActividadList
  })

  await requestUtil({
    action: mantenedor_getSubSubtiposActividadList
  })

  await requestUtil({
    action: mantenedor_getFamiliasDelito
  })

  await requestUtil({
    action: mantenedor_getTipoActividadByCodigoActividad,
    payload: {
      params: { codigo: 24 }
    } // CODIGO 26: DILIGENCIAS, 24: SOLICITUDES
  })
})

function openModalResumenCausa () {
  launchDialog({
    component: ModalResumenCausa,
    header: 'Resumen de la Causa',
    width: '67%',
    props: {
      ruc: ruc.value
    }
  })
}

function openModalDirectrices () {
  const idCausa = causa.value?.data?.causa?.idCausa
  launchDialog({
    component: ModalDirectricesCausa,
    header: 'Directriz de Investigación',
    props: {
      idCausa: idCausa
    },
    width: '80%',
    cancelIcon: '',
    cancelLabel: 'Cerrar'
  })
}

function openModalDiligenciasPendientes () {
  const modal = launchDynamicDialog({
    component: ModalDiligenciasSolicitudes,
    header: 'Ver Todas las Diligencias o Solicitudes Pendientes',
    width: '80%',
    data: {
      idCausa: causa.value?.data?.causa?.idCausa
    },
    templates: {
      footer: () => renderBotonCerrar(modal)
    }
  })
}

function openModalDiligenciasEjecutadas () {
  const modal = launchDynamicDialog({
    component: ModalDiligenciasSolicitudes,
    header: 'Ver Todas las Diligencias o Solicitudes Ejecutadas',
    width: '80%',
    data: {
      idCausa: causa.value?.data?.causa?.idCausa,
      isEjecutadas: true
    },
    templates: {
      footer: () => renderBotonCerrar(modal)
    }
  })
}

function openModalAnotaciones () {
  launchDialog({
    component: ModalAnotaciones,
    header: 'Ver Todas las Anotaciones',
    width: '80%'
  })
}

function openModalHistorialCausa () {
  const modal = dialog.open(ModalHistorialCausa, {
    data: {
      ruc: ruc.value
    },
    props: {
      header: 'Historial de la Causa',
      style: {
        width: '80%'
      },
      modal: true
    },
    templates: {
      footer: () => renderBotonCerrar(modal)
    }
  })
}

function openModalSolicitudesPjud () {
  launchDialog({
    component: ModalSolicitudesPjud,
    header: 'Ver Todas las Solicitudes al PJUD',
    width: '65%',
    props: {
      ruc: ruc.value,
      idCausa: idCausa.value
    }
  })
}

function openModalNotificacionesPjud () {
  // to-do
}

function openModalAlertas () {
  launchDialog({
    component: ModalNotificaciones,
    header: 'Causas Relacionadas Guardadas',
    width: '65%',
    props: {
      ruc: ruc.value
    }
  })
}

function openModalGeorreferenciaGuardada () {
  const modal = dialog.open(ModalGeorreferenciacionGuardada, {
    data: {
      ruc: ruc.value
    },
    props: {
      header: 'Georreferenciación Guardada',
      style: {
        width: '80%'
      },
      modal: true
    },
    templates: {
      footer: () => renderBotonCerrar(modal)
    }
  })
}

function openModalVerDocumento (url) {
  launchDialog({
    component: ModalVerDocumento,
    header: 'Ver Respuesta',
    width: '65%',
    props: {
      docUrl: url
    }
  })
}

function openModalOtrasSolicitudes () {
  launchDynamicDialog({
    component: ModalSelectorSolicitudes,
    header: 'Solicitudes',
    width: '70%',
    data: {
      idProceso: idProcesoHito.value,
      isCitacionComunicacion: false
    },
    onClose: ({ data }) => {
      // para que no se ejecute si presionó el boton cancelar
      if (!data) return
      solicitudes_SET_ID_DENUNCIA(idDenuncia.value)
      solicitudes_SET_DATA_SELECTOR_SOLICITUD(data)
      router.push({ name: 'solicitudResumenRelacionesEspecies' })
    }
  })
}

function openModalCitacionesComunicaciones () {
  launchDynamicDialog({
    component: ModalSelectorSolicitudes,
    header: 'Citaciones y Comunicaciones',
    width: '70%',
    data: {
      idProceso: idProcesoHito.value,
      isCitacionComunicacion: true
    },
    onClose: ({ data }) => {
      if (!data) return

      const codigoActividad = getCodigoMantenedorById(tiposActividad.value, data?.idTipoActividad)
      solicitudes_SET_IS_CITACION(codigoActividad === '7') // CODIGO 7: Citación

      const codigoSubActividad = mantenedor_getCodigoActividadHijo(data?.subtipoActividad?.id)
      solicitudes_SET_IS_TELEFONICA(codigoSubActividad === '1' || codigoSubActividad === '4') // CODIGO 1: Telefónica isParent true, CODIGO 4: Telefónica isParent false

      solicitudes_SET_DATA_SELECTOR_SOLICITUD(data)

      // CODIGO 7: Citación
      if (codigoActividad === '7') {
        router.push({ name: 'DISCitacionResumen' })
      } else {
        router.push({ name: 'DISComunicacionResumen' })
      }
    }
  })
}

function handleVolverARevisarAntecedentes () {
  launchConfirmDialog({
    header: 'Volver a Revisar Antecedentes de la Causa',
    message: `¿Está seguro de Volver a Revisar Antecedentes de la Causa?`,
    accept: () => router.push({ name: 'DIRAResumenCausa' })
  })
}

function guardarCausasRelacionadas (_causas) {
  // payload { idCausa: id de la causa actual, idCausaRelacionada: id de causa seleccionada}
  let causasRelacionadasAGuardar = []

  // generar payload con las causas seleccionadas y sus valores correspondientes
  causasRelacionadasAGuardar = _causas.map((el) => {
    return {
      idCausa: idCausa.value,
      idCausaRelacionada: el.idCausa
    }
  })

  requestUtil({
    action: causasRelacionadas_guardarCausasRelacionadas,
    payload: {
      causasRelacionadas: causasRelacionadasAGuardar
    }
  })
}

const itemsMenuSuperior = ref([
  // CDD
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
    ],
    disabled: () => true
  },

  // CAUSA
  {
    label: 'Causa',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Resumen de la Causa',
        command: () => openModalResumenCausa()
      },
      {
        label: 'Sujetos Intervinientes',
        command: () => {
          launchDialog({
            component: ModalSujetosIntervinientes,
            header: 'Sujetos Intervinientes',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        }
      },
      {
        label: 'Delitos',
        command: () => {
          launchDialog({
            component: ModalDelitos,
            header: 'Delitos',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        }
      },
      {
        label: 'Relato del Hecho',
        command: () => {
          launchDialog({
            component: ModalRelatos,
            header: 'Relato',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        }
      },
      {
        label: 'Relaciones',
        command: () => {
          launchDialog({
            component: ModalRelaciones,
            header: 'Relaciones',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        }
      },
      {
        label: 'Especies y Dinero',
        command: () => {
          launchDialog({
            component: ModalEspeciesDinero,
            header: 'Especies y Dinero',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        }
      },
      {
        label: 'Documentos',
        command: () => {
          launchDialog({
            component: ModalDocumentos,
            header: 'Documentos',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        }
      },
      {
        label: 'Historial',
        command: () => openModalHistorialCausa(),
        disabled: () => true
      },
      {
        label: 'Diligencias',
        command: () => {
          launchDialog({
            component: ModalDiligencias,
            header: 'Diligencias',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        }
      },
      {
        label: 'Anotaciones',
        command: () => openModalAnotaciones()
      },
      {
        label: 'Medidas de Protección',
        command: () => {
          launchDialog({
            component: ModalMedidasProteccion,
            header: 'Medidas de Protección',
            width: '65%'
          })
        },
        disabled: () => true
      },
      {
        label: 'Pautas',
        command: () => {
          launchDialog({
            component: ModalPautas,
            header: 'Pautas',
            width: '50%'
          })
        },
        disabled: () => true
      },
      {
        label: 'Medidas Cautelares',
        command: () => {
          launchDialog({
            component: ModalMedidasCautelares,
            header: 'Medidas Cautelares',
            width: '60%'
          })
        },
        disabled: () => true
      },
      {
        label: 'Medidas Intrusivas',
        command: () => {
          launchDialog({
            component: ModalMedidasIntrusivas,
            header: 'Medidas Intrusivas',
            width: '60%'
          })
        },
        disabled: () => true
      },
      {
        label: 'Derivaciones a URAVIT',
        command: () => {
          launchDialog({
            component: ModalDerivacionesUravit,
            header: 'Ver derivaciones a URAVIT',
            width: '80%',
            props: {
              ruc: ruc.value
            }
          })
        },
        disabled: () => true
      },
      {
        label: 'Causas Relacionadas Guardadas',
        command: () => {
          launchDialog({
            component: ModalCausasRelacionadas,
            header: 'Causas Relacionadas Guardadas',
            width: '80%',
            props: {
              ruc: ruc.value,
              idCausa: idCausa.value
            }
          })
        }
      },
      {
        label: 'Georreferenciación Guardada',
        command: () => openModalGeorreferenciaGuardada(),
        disabled: () => true
      },
      {
        label: 'Notificaciones del PJUD',
        command: () => openModalNotificacionesPjud(),
        disabled: () => true
      }
    ]
  },

  // SOLICITUDES
  {
    label: 'Solicitudes',
    icon: 'pi pi-file',
    command: () => openModalOtrasSolicitudes()
  },

  // INSTRUIR DILIGENCIAS
  {
    label: 'Diligencias',
    icon: 'pi pi-file',
    command: () => router.push({ name: 'DIInstruirDiligencias' })
  },

  {
    label: 'Citaciones y Comunicaciones',
    icon: 'pi pi-file',
    command: () => openModalCitacionesComunicaciones()
  },

  // INVESTIGACION
  {
    label: 'Investigación',
    icon: 'pi pi-question-circle',
    items: [
      {
        label: 'Actualizar Directriz',
        command: () => {
          irTareaActualizarDirectriz()
        }
      },
      {
        label: 'Causas Relacionadas',
        command: () => {
          launchDynamicDialog({
            component: ModalConsultarCausasRelacionadas,
            header: 'Consultar Causas Relacionadas',
            width: '80%',
            onClose: ({ data }) => {
              if (data?.length) {
                guardarCausasRelacionadas(data)
              }
            }
          })
        }
      },
      {
        label: 'Solicitar Antecedentes Específicos',
        command: () => {
          launchDialog({
            component: ModalSolicitarAntecedentesEspecificos,
            header: 'Solicitar Antecedentes Específicos',
            width: '85%'
          })
        },
        disabled: () => true
      },
      {
        label: 'Actualizar Antecedentes',
        command: () => {
          launchDialog({
            component: ModalActualizarAntecedentes,
            header: 'Actualizar Antecedentes',
            width: '65%',
            confirmLabel: 'Actualizar Antecedentes',
            confirmIcon: 'pi pi-refresh',
            confirmIconPos: 'right'
          })
        },
        disabled: () => true
      },
      {
        label: 'Consulta FR',
        command: () => {
          dialog.open(ModalConsultaRF, {
            props: {
              header: 'Consultar al Fiscal Regional',
              style: {
                width: '40vw'
              },
              modal: true
            },
            onClose: (options) => {
              const data = options.data
              if (data) {
                toastSuccess('Consulta Enviada!')
              }
            }
          })
        },
        disabled: () => true
      }
    ]
  }
])

function solicitar ({ subActividad, subSubActividad }) {
  // TO-DO: Refactorizar - DR
  const dataSelector = {
    selectorSubTipo: '',
    selectorSubSubTipo: '',
    esReservada: null,
    fromSelector: false,
    esUrgente: null
  }

  dataSelector.selectorSubTipo = subtipoActividadList.value.find(
    (activ) => activ.codigo === subActividad
  )?.id

  dataSelector.selectorSubSubTipo =
    subSubtipoActividadList.value.find(
      (subActiv) => subActiv.codigo === subSubActividad
    )?.id || null

  // control de flujo pam desde fronted, pedir cambios a back para control desde back
  // dejar por ahora, si la tarea esta pegada en una de las tareas en la validación,
  // pasar directo sin completar

  if (
    procesoPam.value?.taskName === 'Solicitar Audiencia de Formalización' ||
    procesoPam.value?.taskName === 'Solicitar Medidas Cautelares o Intrusivas' ||
    procesoPam.value?.taskName === 'Solicitar Orden de Detención'
  ) {
    iniciarYReservarTarea({
      idTarea: procesoPam.value?.taskId,
      resolve: () => {
        solicitudes_SET_ID_DENUNCIA(idDenuncia.value)
        solicitudes_SET_DATA_SELECTOR_SOLICITUD(dataSelector)
        router.push({ name: 'solicitudResumenRelacionesEspecies' })
      }
    })
  } else {
    const requestBody = {
      alertaSinDecision: false,
      segundaAlerta: false,
      actualizaDirectriz: false,
      ordenDetencion: subActividad === '5029',
      solicitarAutorizacion: subActividad === '2412',
      solicitarAudiencia: subActividad === '241' && subSubActividad === '15',
      tomarDecision: false,
      consultarFR: false,
      definirDiligencias: false
    }

    completarDesarrolloInvestigacion({
      requestBody,
      resolve: (taskIdProceso) => {
        nextTick(
          iniciarYReservarTarea({
            taskId: taskIdProceso.taskId,
            resolve: () => {
              solicitudes_SET_ID_DENUNCIA(idDenuncia.value)
              solicitudes_SET_DATA_SELECTOR_SOLICITUD(dataSelector)
              router.push({ name: 'solicitudResumenRelacionesEspecies' })
            }
          })
        )
      }
    })
  }
}

function handleNextStep () {
  const requestBody = {
    actualizaDirectriz: false,
    alertaSinDecision: false,
    ordenDetencion: false,
    solicitarAudiencia: false,
    tomarDecision: true,
    solicitarAutorizacion: false,
    consultarFR: false,
    definirDiligencias: false,
    segundaAlerta: false
  }

  completarDesarrolloInvestigacion({
    requestBody,
    resolve: (taskIdProceso) => {
      nextTick(
        iniciarYReservarTarea({
          taskId: taskIdProceso.taskId,
          resolve: () => router.push({ name: 'DIDefinirCursoCausa' })
        })
      )
    }
  })
}

function irTareaInstruirDiligencias () {
  router.push({ name: 'DIInstruirDiligencias' })
}

function irTareaActualizarDirectriz () {
  const requestBody = {
    actualizaDirectriz: true,
    alertaSinDecision: false,
    ordenDetencion: false,
    solicitarAudiencia: false,
    tomarDecision: false,
    solicitarAutorizacion: false,
    consultarFR: false,
    definirDiligencias: false,
    segundaAlerta: false
  }

  completarDesarrolloInvestigacion({
    requestBody,
    resolve: (taskIdProceso) => {
      nextTick(
        iniciarYReservarTarea({
          taskId: taskIdProceso.taskId,
          resolve: () =>
            router.push({ name: 'DIActualizarDirectrizInvestigacion' })
        })
      )
    }
  })
}

async function completarDesarrolloInvestigacion ({ requestBody, resolve }) {
  requestUtil({
    action: dirigirInvestigacion_completarDesarrolloInvestigacion,
    payload: {
      taskId: procesoPam.value?.taskId,
      requestBody
    },
    resolve,
    loader: (l) => { isLoadingBtnFooter.value = l }
  })
}

async function iniciarYReservarTarea ({ resolve, taskId }) {
  requestUtil({
    action: solicitudes_iniciarYReservar,
    payload: {
      idTarea: taskId,
      tareaPam: procesoPam.value
    },
    resolve,
    reject: (err) => {
      console.error(err)
    }
  })
}

function renderBotonCerrar (modal) {
  return [
    h(Button, {
      label: 'Cerrar',
      onClick: () => modal.close(),
      class: 'p-button-text'
    })
  ]
}
</script>
