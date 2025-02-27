<template>
<LoaderSkeleton v-if="isLoadingPage" />
<AppForm
  v-show="!isLoadingPage"
  id="diligencias-e-instrucciones"
  :form-submitted="formSubmitted"
  validation-scope="formNuevaDiligencia"
>
  <TablaDiligenciasInstruidas />

  <div
    v-if="
      $hasSomeRoles([
        `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`,
      ])
    "
    class="col-4 my-5 justify-content-center"
  >
    <p class="my-3">
      ¿Desea Registrar Comunicación con el JG?
    </p>
    <Button
      class="p-button-outlined"
      icon="pi pi-external-link"
      icon-pos="right"
      label="Registrar Comunicación Con JG"
      @click="handleRegistrarComunicacionJG"
    />
  </div>

  <TablaDiligenciasSugeridas
    :diligencias-filtradas="diligenciasFiltradas"
    :is-disabled="isFolioCerrado"
    :is-loading-sugeridas="isLoadingSugeridas"
  />

  <div class="col-3 mb-4 flex flex-column justify-content-center mb-8">
    <p class="flex justify-content-center mb-3">
      ¿Desea Instruir una Nueva Diligencia?
    </p>
    <Button
      class="p-button-outlined mt-2"
      :disabled="isFolioCerrado"
      icon="pi pi-external-link"
      icon-pos="right"
      label="Instruir Nueva Diligencia"
      style="width: auto"
      @click="handleModalInstruirNuevaDiligencia()"
    />
  </div>
  <AppBtnNextTeleported
    v-if="
      $hasSomeRoles(fiscalTurno) ||
        $hasSomeRoles([
          `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`,
        ])
    "
    class="mr-4 p-button-outlined bg-white"
    :label="
      !esbtnCerrarFolio ||
        estadoFolio === 'Cerrado' ||
        procesoPam.taskName ===
        'Decidir si el detenido pasa a ACD y registrar bloque' ||
        (procesoPam.taskName && esNuevaAtencionFiscal)
        ? 'Volver a Bandeja'
        : 'Cerrar Folio'
    "
    :loading="isCerrandoFolio"
    :no-icon="true"
    @click="abrirModalCerrarFolio()"
  />
  <!-- Lógica temporal con el taskName hasta que se tenga marca de folio cerrado o abierto -->
  <AppBtnNextTeleported
    v-if="
      procesoPam.taskName === 'Cerrar folio' ||
        procesoPam.taskName ===
        'Decidir si el detenido pasa a ACD y registrar bloque' ||
        (!procesoPam.taskName &&
          $hasSomeRoles([
            `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_equipo_turnoif_TIN`,
          ])) ||
        (!procesoPam.taskName && esNuevaAtencionFiscal && sujetoDetenido) ||
        (tieneFolio &&
          $hasSomeRoles([
            `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_equipo_turnoif_TIN`,
          ]))
    "
    :disabled="
      procesoPam.taskName !==
        'Decidir si el detenido pasa a ACD y registrar bloque' &&
        esbtnCerrarFolio &&
        $hasSomeRoles([
          `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`,
        ])
    "
    :label="
      /* policia no avanza al step ACD */
      $hasSomeRoles(fiscalTurno) ||
        $hasSomeRoles([
          `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`,
        ])
        ? 'Decidir Detenidos Pasan a ACD'
        : 'Volver a Bandeja'
    "
    :loading="isCerrandoFolio"
    :no-icon="
      !$hasSomeRoles(fiscalTurno) ||
        !$hasSomeRoles([
          `zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`,
        ])
    "
    @click="handleGuardarProcedimiento()"
  />

  <Dialog
    v-model:visible="dialogCrearProcedimiento"
    modal
    :style="{ width: '35vw' }"
  >
    <CrearProcedimiento @crear-procedimiento:cerrar-modal="closeModal" />
  </Dialog>

  <Dialog
    v-model:visible="isCerrandoFolio"
    modal
    :style="{ width: '35vw' }"
  >
    <h3 class="mb-3 text-center">
      Cerrando el Folio
    </h3>
    <ProgressBar
      v-if="isCerrandoFolio"
      class="my-4"
      mode="indeterminate"
      style="height: 0.5em"
    />
  </Dialog>
</AppForm>
</template>

<script setup>
import { computed, defineEmits, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog } from 'primevue/usedialog'

import {
  useFormValidation,
  useAppDialog,
  useAppToast,
  useAppGlobalProperties
} from '@/modules/common/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import CrearProcedimiento from '@/modules/flagrancia/components/procedimiento/CrearProcedimiento.vue'
import TablaDiligenciasInstruidas from '@/modules/flagrancia/components/diligencias-e-instrucciones/TablaDiligenciasInstruidas.vue'
import TablaDiligenciasSugeridas from '@/modules/flagrancia/components/diligencias-e-instrucciones/TablaDiligenciasSugeridas.vue'
import ModalInstruirDiligencia from '@/modules/flagrancia/components/diligencias-e-instrucciones/modales/ModalInstruirDiligencia.vue'
import ModalCerrarFolio from '@/modules/flagrancia/components/bandeja/modals/ModalCerrarFolio.vue'
import ModalRegistrarComunicacionConJuzgadodeGarantia from '@/modules/flagrancia/components/diligencias-e-instrucciones/modales/ModalRegistrarComunicacionConJuzgadodeGarantia.vue'

import {
  useProcedimientosBandejaStore,
  useStepDiligenciaStore,
  useStepRegistroContactoStore
} from '@/modules/flagrancia/composables'
import { useSessionStore } from '@/modules/session/composables'

import {
  usePamStore,
  useMantenedorStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'

import { requestUtil } from '@/utils'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { $hasSomeRoles, $userFiscaliaActual } = useAppGlobalProperties()
const { perfiles, user } = useSessionStore()
const {
  procesoPam,
  pam_completarCerrarFoliolagrancia,
  pam_reservarIniciarTarea
} = usePamStore()
const { launchDialog } = useAppDialog()
const { unidadPolicialId, stepRegistroContacto_getRegistroContacto } =
  useStepRegistroContactoStore()
const dialog = useDialog()

const fiscalTurno = computed(() => perfiles.value[6].fiscal_turno)
const {
  tieneFolio,
  nextStep,
  procedimientosBandeja_NEXT_STEP,
  esNuevaAtencionFiscal,
  folioProcedimientoData,
  estadoFolio
} = useProcedimientosBandejaStore()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()
const sujetoDetenido = computed(() =>
  sujetosIntervinientes.value.find((s) => s.estaDetenido)
)
// utilities
const router = useRouter()
const { toastError, toastSuccess } = useAppToast()

const emit = defineEmits(['next-step'])
const {
  stepDiligencia_SET_ES_BTN_CERRARFOLIO,
  esbtnCerrarFolio,
  stepDiligencia_SET_ES_BACK_DILIGENCIAS,
  esBackDiligencias
} = useStepDiligenciaStore()

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getAmbitosDiligencia,
  mantenedor_getInstituciones,
  mantenedor_getEstadosDiligencia,
  mantenedor_getJustificaciones,
  mantenedor_getPlazosDiligencia,
  mantenedor_getNombreInstitucionesDenunciaById,
  mantenedor_getSubTiposActividadByIdPadreTipoActividad,
  mantenedor_getTipoActividadByCodigoActividad,
  tipoActividad,
  mantenedor_getAllSubSubTiposActividad,
  allSubSubTiposActividad,
  mantenedor_getNombreTipoDiligencia,
  subtiposActividad,
  mantenedor_getProcesoHito
} = useMantenedorStore()

const { registroContacto, folio } = useStepRegistroContactoStore()

const dialogCrearProcedimiento = ref(false)
const isFolioCerrado = computed(() => estadoFolio.value === 'Cerrado')

const isLoadingPage = ref(true)
const isLoadingSugeridas = ref(true)

onMounted(() => {
  if (nextStep.value) {
    infoProcedimientoFolio.value[0].data = folio
    dialogCrearProcedimiento.value = true
    procedimientosBandeja_NEXT_STEP(false)
  }
  setTimeout(() => {
    isLoadingPage.value = false
  }, 500)
})

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getAmbitosDiligencia })
  requestUtil({ action: mantenedor_getJustificaciones })
  requestUtil({ action: mantenedor_getPlazosDiligencia })
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getEstadosDiligencia })
  requestUtil({
    action: mantenedor_getProcesoHito,
    payload: { codigo: 6 } // CODIGO 3: Proceso Flagrancia no sirve el endpoint--- usando el 6 mientras
  })
}

if (!tipoActividad.value.length) {
  requestUtil({
    action: mantenedor_getTipoActividadByCodigoActividad,
    payload: {
      params: { codigo: 26 }
    }, // CODIGO 26: DILIGENCIAS
    resolve: () => getMantenedorDiligencias()
  })
} else getMantenedorDiligencias()

function getMantenedorDiligencias () {
  getDataMantenedor()
  requestUtil({ action: mantenedor_getAllSubSubTiposActividad })
  if (!subtiposActividad.value.length) {
    requestUtil({
      action: mantenedor_getSubTiposActividadByIdPadreTipoActividad,
      payload: { idTipoActividad: tipoActividad.value.id },
      resolve: () =>
        setTimeout(() => {
          filterDiligencias()
        }, 1000),
      reject: () =>
        toastError('Ocurrio un error al cargar las diligencias sugeridas')
    })
  } else filterDiligencias()
}

const diligenciasFiltradas = ref([])

// diligencias sugeridas filtradas temporalmente hasta que llegue la data correctamente
function filterDiligencias () {
  diligenciasFiltradas.value = allSubSubTiposActividad.value.filter(
    (d) =>
      mantenedor_getNombreTipoDiligencia(d.idPadre) &&
      d.descripcion !== 'NO/APLICA'
  )
  isLoadingSugeridas.value = false
}

function closeModal () {
  dialogCrearProcedimiento.value = false
}

const { formSubmitted } = useFormValidation({
  formData: {},
  validationScope: 'formNuevaDiligencia'
})

// values
const isCerrandoFolio = ref(false)

const fiscaliaLocal = {
  nombre: registroContacto.value?.nombreFiscalia,
  fiscalDeTurno: registroContacto.value?.nombreFiscalTurno
}

const infoProcedimientoFolio = ref([
  {
    info: 'Folio',
    data: folio.value
  },
  {
    info: 'Fiscalía',
    data: fiscaliaLocal.nombre
  },
  {
    info: 'Fiscal de Turno',
    data: fiscaliaLocal.fiscalDeTurno
  },
  {
    info: 'Fecha y Hora',
    data: new Date().toISOString().slice(0, -1)
  }
])

function handleModalInstruirNuevaDiligencia () {
  dialog.open(ModalInstruirDiligencia, {
    props: {
      header: 'Instruir Nueva Diligencia',
      style: {
        width: '90%'
      },
      modal: true
    },
    data: {
      isFlagrancia: true
    },
    onClose: async ({ data }) => {
      console.log(data)
    }
  })
}
if (!unidadPolicialId.value) {
  requestUtil({
    action: stepRegistroContacto_getRegistroContacto,
    payload: {
      'id-procedimiento': procesoPam.value.idProcedimiento,
      'id-denuncia': procesoPam.value.idDenuncia
    }
  })
}

function abrirModalCerrarFolio () {
  if (
    ($hasSomeRoles(fiscalTurno.value) ||
      $hasSomeRoles([
        `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`
      ])) &&
    esbtnCerrarFolio.value &&
    procesoPam.value.taskName !==
      'Decidir si el detenido pasa a ACD y registrar bloque'
  ) {
    const payloadModalCerrarFolio = {
      fiscalTurno:
        user.value.preferred_username ===
        folioProcedimientoData?.value?.nombreReponsable
          ? 'Por designar'
          : user.value.preferred_username,
      folio: folio.value,
      funcionario:
        folioProcedimientoData?.value?.nombreReponsable ||
        user.value.preferred_username,
      unidadPolicial: mantenedor_getNombreInstitucionesDenunciaById(
        unidadPolicialId.value
      )
    }
    launchDialog({
      component: ModalCerrarFolio,
      header: 'Cerrar Folio',
      width: '45vw',
      confirmLabel: 'Cerrar Folio',
      props: { payloadModalCerrarFolio },
      accept: () => {
        isCerrandoFolio.value = true
        const payload = {
          processDef: 'string',
          procesoPrincipal: 'string',
          idCausa: 'string',
          idDenuncia: procesoPam.value.idDenuncia,
          idProcedimiento: procesoPam.value.idProcedimiento,
          usuario: procesoPam.value.usuario,
          processInstanceId: procesoPam.value.taskProcessInstanceId,
          taskInstanceId: procesoPam.value.taskId,
          taskName: procesoPam.value.taskName,
          correlationKey: procesoPam.value.taskCorrelationKey
        }
        requestUtil({
          action: pam_completarCerrarFoliolagrancia,
          payload: payload,
          resolve: () => {
            toastSuccess(`Folio ${folio.value} Cerrado`)
            stepDiligencia_SET_ES_BTN_CERRARFOLIO(false)
            isCerrandoFolio.value = false
          },
          reject: () => toastError('Ocurrio un error al cerrar el Folio')
        })
      }
    })
  } else {
    router.push('/flagrancia')
  }
}

function handleGuardarProcedimiento () {
  if (
    tieneFolio.value &&
    ($hasSomeRoles(fiscalTurno.value) ||
      $hasSomeRoles([
        `zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`
      ]))
  ) {
    handleNextStep()
  } else {
    router.push('/flagrancia')
  }
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

function handleNextStep () {
  const payload = {
    taskInstanceId: procesoPam.value.taskInstanceId
  }
  if (
    (procesoPam.value.taskName ===
      'Decidir si el detenido pasa a ACD y registrar bloque' ||
      !procesoPam.value.taskName ||
      procesoPam.value.taskName === 'Cerrar folio') &&
    !esbtnCerrarFolio.value &&
    !esBackDiligencias.value
  ) {
    requestUtil({
      action: pam_reservarIniciarTarea,
      payload: payload,
      resolve: (r) => {
        stepDiligencia_SET_ES_BACK_DILIGENCIAS(true)
        console.log('reserva e inicia tarea ACD')
        emit('next-step', 'FlagranciaNuevaAtencionDetenidosACDFiscal')
      }
    })
  } else emit('next-step', 'FlagranciaNuevaAtencionDetenidosACDFiscal')
}
</script>
