<template>
<section>
  <TablaEspeciesIncautadasPendientesDeRecepcion
    :es-dinero="esDinero"
    :loader-denominacion="loaderDenominacion"
    :nue="dataEspecies"
    :origen-tabla="dataEspecies.r"
    :resultado-regla-negocio="resultadoReglaNegocio"
    @action:marcar-como-peligrosa="handleMarcarComoPeligrosa"
    @action:mostrar-denominacion-dineros="handleMostrarDenominacionDineros"
    @action:numeros-de-serie="handleMostrarNumerosDeSerie"
    @action:ver-imagenes="handleVerImagenes"
  />
  <p
    class="mb-4 ml-2"
    style="font-size: 1.2em"
  >
    Resultado de la regla de negocio para NUE:
    <span class="font-bold">
      {{ resultadoReglaNegocio ? "Rechazar" : "Aceptar" }}
    </span>
  </p>
  <AppFieldset
    v-if="false"
    :collapsed="!dataEspecieDinero?.run"
    legend="Entregado por"
  >
    <div class="grid col-12">
      <h3 class="col-4 my-3">
        RUN: {{ dataEspecieDinero?.run }}
      </h3>
      <h3 class="col-4 my-3">
        Grado:
        {{ dataEspecieDinero?.grado }}
      </h3>
      <h3 class="col-4 my-3">
        Unidad:
        {{ dataEspecieDinero?.unidad }}
      </h3>
      <h3 class="col-4 my-3">
        Nombre:
        {{ dataEspecieDinero?.nombre }}
      </h3>
      <h3 class="col-4 my-3">
        Institución:
        {{ dataEspecieDinero?.institucion }}
      </h3>
      <h3 class="col-4 my-3">
        Destacamento:
        {{ dataEspecieDinero?.destacamento }}
      </h3>
    </div>
  </AppFieldset>
  <DecisionRecepcionRechazo
    :array-especies-dinero="dataEspecies.r"
    :decisiones="decisiones"
    :es-dinero="esDinero"
    :loader-rectificar="loaderRectificar"
    :motivos-rechazo="motivoDeRechazoOptions"
    :show-monto-rectificado="showMontoRectificado"
    :tipos-observacion="tipoObservacionOptions"
    @back-step="handleBackStep"
    @next-step="handleNextStep"
    @rectificar-monto="handleModalRectificarMonto"
  />
</section>
</template>

<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { computed, defineEmits, onMounted, ref } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useConfirmDialog } from '@/modules/common/composables'
import ModalRecepcionarEspecie from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/modals/ModalRecepcionarEspecie.vue'
import ModalMarcarComoPeligrosa from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/modals/ModalMarcarComoPeligrosa.vue'
import TablaEspeciesIncautadasPendientesDeRecepcion from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/TablaEspeciesIncautadasPendientesDeRecepcion.vue'
import DecisionRecepcionRechazo from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/DecisionRecepcionRechazo.vue'
import ModalDenominacionDeDineros from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/modals/ModalDenominacionDeDineros.vue'
import ModalVerImagenes from '@/modules/recepcion-especies-dinero/components/especie-incautada-pendiente-recepcion/modals/ModalVerImagenes.vue'
import { useMantenedorStore } from '@/modules/global/composables'
import {
  useComprobanteDeRecepcionRechazoStore,
  useEspecieIncautadaPendienteRecepcionStore,
  useIdentificacionNueStore
} from '@/modules/recepcion-especies-dinero/composables'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/modules/session/composables'

const emit = defineEmits(['next-step'])

const { toastSuccess, toastError } = useAppToast()

const { launchDialog } = useAppDialog()

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getTiposEspecies,
  mantenedor_getTipoDinero,
  mantenedor_geTipoMoneda,
  mantenedor_getDenominacionDinero,
  mantenedor_getClaseEspecie,
  mantenedor_getNombreDenominacionDinero,
  mantenedor_getCodigoFamiliaEspecieById
} = useMantenedorStore()

const { causaEncontradaAsociadaANue } = useIdentificacionNueStore()

const {
  stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazar,
  stepEspeciesIncautadasPendientesDeRecepcion_setEspeciePeligrosa,
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdDenunciaNue,
  stepEspeciesIncautadasPendientesDeRecepcion_rectifcarMonto,
  especiesIncautadas
} = useEspecieIncautadaPendienteRecepcionStore()

const decisiones = ref([
  { descripcion: 'Aceptar', id: 1 },
  { descripcion: 'Aceptar con Observación', id: 2 },
  { descripcion: 'Rechazar', id: 3 }
])
const router = useRouter()
const { launchConfirmDialog } = useConfirmDialog()

const dataEspecies = ref([])
const esDinero = ref(false)

const loaderDenominacion = ref(false)

function getDataEspeciesNoIngresadas () {
  requestUtil({
    action:
        stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdDenunciaNue,
    payload: {
      idDenuncia: causaEncontradaAsociadaANue.value.fichaCausa?.causa?.idDenuncia,
      nue: causaEncontradaAsociadaANue.value?.nue
    },
    resolve: (r) => {
      toastSuccess('Data actualizada')
      dataEspecies.value = {
        r,
        nue: causaEncontradaAsociadaANue.value.nue
      }
      esDinero.value = !!r.find((e) => mantenedor_getCodigoFamiliaEspecieById(e.familiaEspecie) === '21')
    },
    reject: (err) => {
      console.log('reject', err)
    },
    loader: (l) => {
      loaderDenominacion.value = l
    }
  })
}
getDataEspeciesNoIngresadas()
// VALUES

onMounted(() => {
  getDataMantenedor()
})

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getTiposEspecies })
  requestUtil({ action: mantenedor_getDenominacionDinero })
  requestUtil({ action: mantenedor_getTipoDinero })
  requestUtil({ action: mantenedor_geTipoMoneda })
  requestUtil({ action: mantenedor_getClaseEspecie })
}

const showMontoRectificado = ref()

function denominacionNombre (idDenominacion) {
  if (idDenominacion) {
    return mantenedor_getNombreDenominacionDinero(idDenominacion)
  }
  return 'Sin Denominación'
}

const montoRectificado = computed(() => {
  let total = 0
  especiesIncautadas.value?.dineroDesglosado?.desglose?.forEach(a => {
    total += (a.cantidadDinero * +denominacionNombre(a.denominacion))
  })
  return total
})

const resultadoReglaNegocio = computed(() => {
  if (especiesIncautadas.value.dinero) {
    return montoRectificado.value !== especiesIncautadas.value?.dinero.find(d => d.monto)?.monto
  } else {
    return dataEspecies.value?.r ? !!dataEspecies.value?.r?.find((r) => r.especiePeligrosa === true) : false
  }
})

function handleMarcarComoPeligrosa (data) {
  launchDialog({
    component: ModalMarcarComoPeligrosa,
    header: `Marcar como peligrosa`,
    cancelLabel: 'Cancelar',
    confirmLabel: 'Guardar',
    accept: (res) => {
      const p = {
        idEspecie: data.idEspecie ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        esPeligrosa:
              res.esPeligrosa ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        clasePeligro:
              typeof res.idClasePeligro === 'number'
                ? '3fa85f64-5717-4562-b3fc-2c963f66afa6'
                : res.idClasePeligro,
        fechaHoraEsPeligrosa: dateTimeUtil.formatToBackendWithTime(new Date())
      }
      requestUtil({
        action: stepEspeciesIncautadasPendientesDeRecepcion_setEspeciePeligrosa,
        payload: p,
        resolve: (res) => {
          getDataEspeciesNoIngresadas()
          toastSuccess(`Especie registrada como peligrosa`)
        },
        reject: (err) => {
          console.log(err)
        }
      })
    }
  })
}

function handleVerImagenes (imagenes) {
  launchDialog({
    component: ModalVerImagenes,
    header: `Imágenes`,
    props: { imagenes },
    cancelLabel: 'Cerrar'
  })
}

function handleMostrarDenominacionDineros (data) {
  loaderDenominacion.value = true
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: data.idEspecie },
    resolve: (r) => {
      loaderDenominacion.value = false
      launchDialog({
        component: ModalDenominacionDeDineros,
        header: `Denominación de Dineros`,
        width: '70%',
        cancelLabel: 'Cerrar',
        props: { especie: r, dataDinero: desglosar(r), idEspecie: r.idEspecie }
      })
    },
    reject: (e) => {
      loaderDenominacion.value = false
      console.log(e)
      toastError('Error en el servidor')
    }
  })
}

// MODAL RECTIFICAR MONTOS
const loaderRectificar = ref(false)

function desglosar (r) {
  const dinerofiltrado = r.dinero?.filter((d) => d.tipoMoneda)
  const montoOriginal = r.dinero?.find((d) => d.monto).monto ?? 0
  return {
    tipoMoneda: dinerofiltrado?.find((d) => d.tipoMoneda)?.tipoMoneda ?? null,
    monto: montoOriginal,
    desglose: dinerofiltrado?.map((d) => {
      return {
        denominacion: d.denominacion,
        tipo: d.tipo,
        cantidadDinero: d.cantidadDinero,
        idDetalleEspecieDinero: d.idDetalleEspecieDinero,
        divisor: d.total / d.cantidadDinero
      }
    })
  }
}

function handleModalRectificarMonto (data) {
  loaderRectificar.value = true
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: data.idEspecie },
    resolve: (r) => {
      loaderRectificar.value = false
      launchDialog({
        component: ModalDenominacionDeDineros,
        header: `Rectificar Monto`,
        width: '70%',
        cancelLabel: 'Cerrar',
        confirmLabel: 'Guardar',
        props: { especie: r, esRectificar: true, dataDinero: desglosar(r), idEspecie: r.idEspecie },
        accept: (dataDinero) => {
          const dineroDesglosado = dataDinero.desglose
          const payload = {
            monto: dineroDesglosado.reduce(function (accumulator, curValue) {
              return accumulator + (curValue.cantidadDinero * curValue.divisor)
            }, 0),
            desglose: dineroDesglosado.map((d) => {
              return {
                idDetalleEspecie: d.idDetalleEspecieDinero,
                cantidadDinero: d.cantidadDinero,
                total: d.cantidadDinero * d.divisor
              }
            }),
            modificadoPor: user.value.sub
          }
          if (payload.monto > 0) {
            requestUtil({
              action: stepEspeciesIncautadasPendientesDeRecepcion_rectifcarMonto,
              payload,
              resolve: (d) => {
                toastSuccess(d.message)
                getDataEspeciesNoIngresadas()
              }
            })
          } else {
            toastError('Nada que rectificar')
          }
        }
      })
    }
  })
}

function handleMostrarNumerosDeSerie () {
  console.log('muestra los numeros de serie')
}

const { user } = useSessionStore()

const { stepComprobanteDeRecepcionRechazo_getDataComprobante } =
    useComprobanteDeRecepcionRechazoStore()

function getDataComprobante (d) {
  requestUtil({
    action: stepComprobanteDeRecepcionRechazo_getDataComprobante,
    payload: {
      nombreFuncionario: user.value.preferred_username,
      cargoFuncionario: user.value?.groups?.find((g) => g.includes('EYD')),
      fiscaliaFuncionario: user.value.fiscalias.find((f) => f).idFiscalia,
      nue: causaEncontradaAsociadaANue.value.nue,
      decision: d.decisionSeleccionada
    },
    resolve: (r) => {
      emit('next-step', 'comprobante-de-recepcion-rechazo')
    },
    reject: (err) => {
      console.log(err)
      const m = err?.response?.data?.message
      toastError(m !== 'Internal server error' ? m : 'Error en el servidor')
    }
  })
}

function handleNextStep (d) {
  launchDialog({
    component: ModalRecepcionarEspecie,
    header: `Recepcionar Especies`,
    props: {
      decision: decisiones.value.find(
        (decision) => decision.id === d.decisionSeleccionada
      ).descripcion
    },
    confirmLabel: 'Aceptar',
    accept: () => {
      const dataDecision = {
        nue: causaEncontradaAsociadaANue.value.nue,
        decisionRecepcion: d.decisionSeleccionada
      }
      if (d.decisionSeleccionada === 3) {
        dataDecision.idMotivoRechazoRecepcion = d.motivoDeRechazo
        dataDecision.observaciones = d.observaciones
      } else if (d.decisionSeleccionada === 2) {
        dataDecision.idTipoObservacionRecepcion = d.tipoObservacion
        dataDecision.observaciones = d.observaciones
      }
      requestUtil({
        action: stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazar,
        payload: {
          ...dataDecision,
          decisionRecepcion:
              dataDecision.decisionRecepcion === 3
                ? 0
                : dataDecision.decisionRecepcion
        },
        resolve: (r) => {
          getDataComprobante(d)
        },
        reject: (err) => {
          const m = err?.response?.data?.message
          toastError(
            m !== 'Internal server error' ? m : 'Error en el servidor'
          )
        }
      })
    }
  })
}

function handleBackStep () {
  launchConfirmDialog({
    header: 'En Proceso de Recepción',
    message: 'Se encuentra por salir con una recepción inconclusa',
    acceptLabel: 'Salir',
    accept: () => {
      router.push({ name: 'BandejaCustodio' })
    }
  })
}

const tipoObservacionOptions = [
  {
    descripcion: 'Rectificación del Monto',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Color no corresponde',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  { descripcion: 'Con daño', id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  {
    descripcion: 'Con Billetes falsos',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Descripción no corresponde',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Suma de Dinero mayor o menor a la descrita',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'La cantidad de Especies es mayor o menor',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  { descripcion: 'Otro', id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }
]
const motivoDeRechazoOptions = [
  {
    descripcion: 'Especies Perecibles',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Descripción física no coincide',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Eslabón de Cadena Interrumpido',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Falta Oficio de Atraso',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Falta Oficio Aclaratorio',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Falta Adición al Parte Policial',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Deben Separar Especies',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Especies mal embaladas',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Especies sin embalar',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Fiscal no Instruye Incautación',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Especie Peligrosa',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Especie Peligrosa sin Etiquetar',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Monto no coincide',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Dineros son de distinta Nacionalidad',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  { descripcion: 'Medicamentos', id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  { descripcion: 'RUC Inválido', id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  {
    descripcion: 'Alcoholes Relacionados a LET N° 19.925',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  {
    descripcion: 'Especies Robadas con Dueño Conocido',
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  },
  { descripcion: 'Otro Motivo', id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }
]
</script>
<style scoped>
.btn-continuar {
  height: 2.5em;
  border-radius: 0;
}
</style>
