<template>
<section class="flex flex-column">
  <AppFieldset
    class="w-full"
    legend="Antecedentes de la Causa"
  >
    <section class="flex flex-row w-full justify-content-between p-4">
      <p>
        <strong>Nombre Causa:</strong>
        {{ causa?.nombre }}
      </p>
      <p v-if="causa.delitos?.length">
        <section v-if="causa.delitos?.length > 1">
          <strong>Delitos: </strong>
          <a
            v-tooltip.top="tooltipMultiplesDelitos(causa.delitos)"
            class="font-italic underline cursor-pointer"
          >
            Multiples delitos
          </a>
        </section>
        <section v-else>
          <strong>Delito:</strong> {{ tipoDelito(causa.delitos[0].tipoDelito) }}
        </section>
      </p>
      <p v-if="!causa.delitos?.length">
        <strong>Delito:</strong> Sin Delitos
      </p>
      <p>
        <strong>Fecha/Hora Creación:</strong>
        {{ causa?.fechaHoraCreacion }}
      </p>
    </section>
  </AppFieldset>

  <AppFieldset
    v-if="!isSugerirFRTransferencia"
    class="w-full"
    legend="Propuesta del Preclasificador"
  >
    <PropuestaPreclasificador :propuesta="preclasificacion" />
  </AppFieldset>

  <AppFieldset
    v-if="isAltaComplejidad"
    class="w-full"
    legend="Consulta al Fiscal Regional"
  >
    <ConsultaFiscalRegional
      v-model:consulta="consultaFR"
      :options-tipo-impacto="tiposImpacto"
      @change:impacto="changeImpacto"
    />
  </AppFieldset>

  <h3 class="mt-2 ml-2 mb-6">
    Causa Prioritaria:
    {{ causa?.esPrioritaria ? "Si" : "No" }}
  </h3>
  <AppBtnRightTeleported>
    <Button
      class="btn-aprobar px-4"
      :icon="isAltaComplejidad ? 'pi pi-send' : 'pi pi-check-circle'"
      icon-pos="right"
      :label="lblIsAltaComplejidad"
      :loading="isLoading"
      @click="handleAprobarAsignacion"
    />
  </AppBtnRightTeleported>
  <AppBtnNextTeleported
    v-if="canContinue"
    class="ml-8"
    label="Revisar Antecedentes"
    :loading="isLoading"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { ref, reactive, onMounted, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appUtil, dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useMantenedorStore, usePamStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useCausaAsignacionStore } from '@/modules/asignacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import PropuestaPreclasificador from '@/modules/asignacion/components/propuesta-asignacion/PropuestaPreclasificador.vue'
import ConsultaFiscalRegional from '@/modules/asignacion/components/propuesta-asignacion/ConsultaFiscalRegional.vue'
import AprobarRechazarAsignacionModal from '@/modules/asignacion/components/modals/AprobarRechazarAsignacionModal.vue'

const { includeWord } = appUtil

const router = useRouter()

const emit = defineEmits(['next-step'])

const { launchDialog } = useAppDialog()
const { toastSuccess } = useAppToast()

const { procesoPam } = usePamStore()

const {
  ruc,
  idDenuncia,
  causaActual,
  preclasificacion,
  causaAsignacion_completarRevisarDecidirPropuesta,
  causaAsignacion_completarSugerirFRTransferencia,
  causaAsignacion_SET_ESCRITO_CONSULTA_FR,
  isBotonBackFromRa, causaAsignacion_SET_BOTON_BACK_FROM_RA
} = useCausaAsignacionStore()

const {
  tiposImpacto,
  mantenedor_getNombreTipoDelito,
  mantenedor_getTiposImpacto,
  mantenedor_getTiposDelito
} = useMantenedorStore()

const { paginacion, sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()

const consultaFR = ref('')
const isLoading = ref(false)

const canContinue = computed(() => {
  return !includeWord(procesoPam.value?.taskName, 'Sugerir FR')
})

function completarRevisarDecidirPropuesta (
  {
    requiereRevisarDetallePropuesta,
    aceptaPropuesta,
    resolve
  }
) {
  requestUtil({
    action: causaAsignacion_completarRevisarDecidirPropuesta,
    payload: {
      requiereRevisarDetallePropuesta, // VA EN FALSE CUANDO ACEPTA Y MANDA A LA BANDEJA
      idInstanciaTarea: procesoPam.value?.taskId,
      aceptaPropuesta // VA EN TRUE CUANDO ACEPTA Y MANDA A LA BANDEJA
    },
    loader: (value) => {
      isLoading.value = value
    },
    resolve: () => {
      resolve()
    }
  })
}

function completarSugerirTransferenciaFR () {
  requestUtil({
    action: causaAsignacion_completarSugerirFRTransferencia,
    payload: {
      idInstanciaTarea: procesoPam.value?.taskId
    },
    loader: (value) => {
      isLoading.value = value
    },
    resolve: () => {
      router.push({ name: 'BandejaAsignacion' })
      toastSuccess('Exitoso! Consulta a FR Enviada')
    }
  })
}

function handleNextStep () {
  if (isBotonBackFromRa.value) {
    emit(
      'next-step',
      '/asignacion/revisar-preclasificacion/antecedentes/antecedentes-causa'
    )
  } else {
    completarRevisarDecidirPropuesta({
      requiereRevisarDetallePropuesta: true,
      aceptaPropuesta: false,
      resolve: () => {
        causaAsignacion_SET_BOTON_BACK_FROM_RA(true)
        emit(
          'next-step',
          '/asignacion/revisar-preclasificacion/antecedentes/antecedentes-causa'
        )
      }
    })
  }
}

const isAltaComplejidad = computed(() => {
  return appUtil.includeWord(causaActual.value?.causa?.complejidad, 'alta')
})

const isSugerirFRTransferencia = computed(() => {
  return appUtil.includeWord(procesoPam.value?.taskName, 'Sugerir FR')
})

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function tipoDelito (value) {
  return mantenedor_getNombreTipoDelito(value) || 'Sin tipo delito'
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposImpacto })
  requestUtil({ action: mantenedor_getTiposDelito })
}

const lblIsAltaComplejidad = computed(() => {
  return isAltaComplejidad.value ? 'Enviar Consulta a FR' : 'Confirmar Asignación'
})

const nroIntervinientes = computed(() => paginacion.value?.elementosTotales)

function handleAprobarAsignacion () {
  launchDialog({
    component: AprobarRechazarAsignacionModal,
    header: lblIsAltaComplejidad.value,
    confirmLabel: lblIsAltaComplejidad.value,
    confirmIcon: 'pi pi-send',
    confirmIconPos: 'right',
    width: '70%',
    props: {
      isAprobado: true,
      isAltaComplejidad: isAltaComplejidad.value,
      data: {
        ruc: ruc.value,
        numeroIntervinientes: nroIntervinientes.value,
        complejidad: causaActual.value?.causa?.complejidad,
        consultaFiscal: consultaFR.value
        /** Imposible mostrar estos datos ya que no vienen de un endpoint y
         * la lógica es compleja dada la procedencia de los mismos */
        // fiscalPropuesto: propuestaPreclasificador.value?.especialidadFiscales
        // impacto: consultaFiscalRegional.value?.impacto,
      }
    },
    accept: async () => {
      if (!isAltaComplejidad.value) {
        completarRevisarDecidirPropuesta({
          requiereRevisarDetallePropuesta: false,
          aceptaPropuesta: true,
          resolve: () => {
            router.push({ name: 'BandejaAsignacion' })
            toastSuccess('Exitoso! Propuesta Aprobada')
          }
        })
        return
      }

      if (isAltaComplejidad.value && !isSugerirFRTransferencia.value) {
        router.push({ name: 'BandejaAsignacion' })
        toastSuccess('Exitoso! Consulta a FR Enviada')
        return
      }

      if (isAltaComplejidad.value && isSugerirFRTransferencia.value) {
        completarSugerirTransferenciaFR()
      }
    }
  })
}

const causa = reactive({
  nombre: '',
  delitos: null,
  fechaHoraCreacion: '',
  esPrioritaria: false
})

function getEscritoConsultaFR () {
  consultaFR.value = appUtil.getEscritoConsultaFR({
    ruc: ruc.value,
    causa: causa,
    propuestaPreclasificador: propuestaPreclasificador(preclasificacion.value?.decisionAsignacion),
    tipoDelito: tipoDelito
  })
}

function changeImpacto (value) {
  getEscritoConsultaFR()
  if (value) {
    consultaFR.value += `<p><strong>Impacto: </strong>${value}</p>`
  }
}

function tooltipMultiplesDelitos (delitos) {
  return delitos.map(
    (d, i) => `${i + 1}.- ${tipoDelito(d.tipoDelito)}` // => ej: 1.- Robo con violencia
  ).join('\n')
}

function setPropuestaCausa () {
  const { causa: dataCausa } = causaActual.value

  causa.nombre = dataCausa?.nombre || 'Sin Definir'
  causa.delitos = dataCausa?.delitos
  causa.fechaHoraCreacion = formatFecha(procesoPam.value?.taskCreatedOnDate)
  causa.esPrioritaria = dataCausa?.alerta === 'VIF'

  if (isAltaComplejidad.value) {
    getEscritoConsultaFR()
    causaAsignacion_SET_ESCRITO_CONSULTA_FR(consultaFR.value)
  }
}

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value
    }
  })
}

function propuestaPreclasificador (value) {
  switch (value) {
    case 'clasificacion':
      return 'Seguir Linea Investigativa'
    case 'desestimacion':
      return 'Desestimar Causa'
    case 'transferencia':
      return 'Transferir Causa'
    case 'agrupacion':
      return 'Agrupar Causas'
    default:
      return 'Sin Definir'
  }
}

onMounted(() => {
  getDataMantenedor()
  setPropuestaCausa()
  getSujetos()
})
</script>
<style lang="scss" scoped>
.btn-aprobar {
  background-color: $primary-color;
  transition: all 0.5s ease;
  &:hover {
    background-color: $primary-color-hover !important;
  }
}
</style>
