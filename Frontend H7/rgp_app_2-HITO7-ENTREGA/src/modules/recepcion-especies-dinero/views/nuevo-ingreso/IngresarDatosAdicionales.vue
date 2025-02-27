<template>
<AppFieldset legend="Ingresar datos adicionales">
  <p
    class="ml-2 col-12"
    style="font-size: 1.5em"
  >
    NUE:
    <span class="link">{{ dataEspecies.nue }}</span>
  </p>
  <TablaEspeciesDinero
    :data="dataEspecies.r?.items"
    :es-dinero="esDinero"
    :loader-no-ingresadas="loaderNoIngresadas"
    @open-modal-imagen="openModalImagen"
    @seleccionar-especie="seleccionarEspecie"
    @separar-item="separarItemByNue"
  />
</AppFieldset>
<div v-if="isLoading">
  <LoaderSkeleton />
</div>
<AppFieldset
  v-else-if="rue"
  legend="RUE"
>
  <p
    class="text-center w-full mb-4 font-bold"
    style="font-size:1.5em"
  >
    {{ rue }}
  </p>
</AppFieldset>
<div v-else-if="!!especieSelecionada">
  <DenominacionDeDineros
    v-if="esDinero"
    ref="denominacionEspeciedinero"
    class="mt-3"
    :seleccionar-data="especieSelecionada"
    @actualizar-tabla="seleccionarEspecie"
  />
  <div
    v-if="esDinero"
    class="flex justify-content-center text-center w-full mt-3"
  >
    <Button
      id="ingresar-datos"
      class="btn-form px-3 mb-6"
      :disabled="rue"
      icon="pi pi-save"
      icon-pos="right"
      label="Ingresar Datos"
      style="width: auto"
      type="button"
      @click="ingresarDatos"
    />
  </div>
  <IdentificacionEspecieDinero
    v-else
    ref="identificacionEspecieDinero"
    :es-dinero="esDinero"
    :seleccionar-data="especieSelecionada"
    @ingresar-datos="ingresarDatos"
  />
</div>
<AppBtnNextTeleported
  :disabled="deshabilitar"
  :label="esTransferencia ? 'Asignar Ubicación' : 'Fijación Fotográfica'"
  @click="handleNextStep"
/>
</template>

<script setup>
import { computed, defineEmits, ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaEspeciesDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/TablaEspeciesDinero.vue'
import DenominacionDeDineros from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/DenominacionDeDineros.vue'
import IdentificacionEspecieDinero from '@/modules/recepcion-especies-dinero/components/ingresar-datos-adicionales/IdentificacionEspecieDinero.vue'
import { requestUtil, appUtil, dateTimeUtil } from '@/utils'
import {
  useEspecieIncautadaPendienteRecepcionStore,
  useGenerarCuponDeDeposito,
  useIdentificacionNueStore,
  useIngresoDinero,
  useRegistroSalida
} from '@/modules/recepcion-especies-dinero/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useConfirmDialog, useAppGlobalProperties, useAppToast, useAppDialog } from '@/modules/common/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useRouter } from 'vue-router'
import ModalImagenEvidencia from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/modals/ModalImagenEvidencia.vue'

const esDinero = ref()

const especieSelecionada = ref()

const { mantenedor_getCodigoFamiliaEspecieById } = useMantenedorStore()

function desglosar (r) {
  const dinerofiltrado = r.dinero?.filter((d) => d.tipoMoneda)
  return {
    tipoMoneda: dinerofiltrado?.find((d) => d.tipoMoneda)?.tipoMoneda ?? null,
    monto: dinerofiltrado?.find((d) => d.monto)?.monto ?? 0,
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

const {
  stepIngresoDinero_getEspeciesDinerosNoIngresados,
  stepIngresoDinero_actualizarEspeciesDineros,
  stepIngresoDinero_ingresarEspeciesDineros,
  stepIngresoDinero_enviarPronunciamiento,
  stepIngresoDinero_crearTareaCustodiaInspeccion
} = useIngresoDinero()

const {
  stepEspeciesIncautadasPendientesDeRecepcion_separarPorNue,
  dataEspeciesNoIngresadas
} = useEspecieIncautadaPendienteRecepcionStore()

const { $userName } = useAppGlobalProperties()

const dataEspecies = ref([])

const dataNoIngresada = ref([])

const loaderNoIngresadas = ref(false)

function getDataEspeciesNoIngresadas () {
  requestUtil({
    action: stepIngresoDinero_getEspeciesDinerosNoIngresados,
    payload: {
      nue: dataEspeciesNoIngresadas.value?.nue
    },
    resolve: (r) => {
      dataNoIngresada.value = r.items
      dataEspecies.value = {
        r,
        nue: r.nue
      }
      esDinero.value = !!dataNoIngresada.value.find(e => mantenedor_getCodigoFamiliaEspecieById(e.idFamilia) === '21')
      if (esDinero.value) {
        desglosar(r.items.find((e) => e.idEspecie).idEspecie)
      }
    },
    loader: (l) => {
      loaderNoIngresadas.value = l
    }
  })
}
getDataEspeciesNoIngresadas()

const {
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie
} = useEspecieIncautadaPendienteRecepcionStore()
const { generarCuponDeDeposito_getDinerosCustodia } = useGenerarCuponDeDeposito()
const { registroSalida_ingresarSolicitudSalidaperitaje, registroSalida_ingresarSolicitudSalidaTransferencia, registroSalida_ingresarSolicitudSalidaTransferenciaDinero } = useRegistroSalida()

const isLoading = ref(false)

const rue = ref(false)

function seleccionarEspecie (e) {
  esDinero.value = mantenedor_getCodigoFamiliaEspecieById(e.idFamilia ?? e.familiaEspecie) === '21'
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: e.idEspecie, ruc: e.ruc },
    resolve: (r) => {
      if (e.ingresada) {
        toastSuccess(`Especie ya Ingresada - RUE: ${e.RUE}`)
        rue.value = e.RUE
      } else {
        if (esDinero.value) {
          especieSelecionada.value = {
            ...r,
            dineroDesglosado: desglosar(r),
            idDetalleEspecie: e.idDetalleEspecie ?? dataEspecies.value.r.items.find(d => d).idDetalleEspecie
          }
        } else {
          especieSelecionada.value = {
            ...r,
            idDetalleEspecie: e.idDetalleEspecie
          }
        }
      }
    },
    loader: (l) => { isLoading.value = l }
  })
}

const identificacionEspecieDinero = ref()
const denominacionEspeciedinero = ref()
const observacionPronunciamiento = ref('')
const { toastSuccess, toastError } = useAppToast()

const router = useRouter()

const deshabilitar = ref(true)

const { includeWord } = appUtil

const esTransferencia = computed(() => includeWord(router.currentRoute.value.path, 'ingresar-transferencia-especie'))

const { launchConfirmDialog } = useConfirmDialog()

function ingresarDatos (d) {
  console.log('eeee', d)
  const dataFormulario = d
  const payloadEspecie = {
    esEspecieGenerico: true,
    idEspecie: especieSelecionada.value.idEspecie,
    idDetalleEspecie: especieSelecionada.value.idDetalleEspecie,
    familiaEspecie: esDinero.value ? especieSelecionada.value.familiaEspecie : dataFormulario.familiaEspecie,
    idTipoEspecie: esDinero.value ? especieSelecionada.value.idTipoEspecie : dataFormulario.idTipoEspecie,
    descripcion: esDinero.value ? especieSelecionada.value.descripcion : dataFormulario.descripcion,
    quienRealizaAvaluo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    ambitoEspecie: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    perecible: false,
    esDinero: !!esDinero.value,
    esDigital: esDinero.value ? !!especieSelecionada.value.esDigital : !!dataFormulario.esEspecieDigital,
    especiePeligrosa: esDinero.value ? !!especieSelecionada.value.especiePeligrosa : dataFormulario.esEspeciePeligrosa,
    avaluoEstimado: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    esDocumentoValor: false,
    rutTenedorEspecie: '12312312-3',
    indicadorMedioUsadoCometerDelito: esDinero.value ? !!especieSelecionada.value.indicadorMedioUsadoCometerDelito : dataFormulario.medioParaCometerDelito,
    indicadorEvidencia: esDinero.value ? !!especieSelecionada.value.indicadorEvidencia : dataFormulario.especieEvidencia,
    nue: dataEspecies.value.nue,
    cantidadEspecie: esDinero.value ? especieSelecionada.value.dineroDesglosado.monto : dataFormulario.cantidad,
    dinero: [],
    pronunciamientoFiscal: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    existeAnimalInvolucrado: false,
    indicadorArma: true,
    esVehiculo: false,
    nombreTenedorEspecie: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  }
  requestUtil({
    action: stepIngresoDinero_actualizarEspeciesDineros,
    payload: payloadEspecie,
    resolve: (r) => {
      actualizacionEspecie(r)
    }
  })
}
async function actualizacionEspecie (r) {
  console.log('especieSelecionada', especieSelecionada.value)
  console.log('r', r)
  await requestUtil({
    action: stepIngresoDinero_ingresarEspeciesDineros,
    payload: {
      idDetalleEspecie: especieSelecionada.value.idDetalleEspecie ?? especieSelecionada.value.idEspecie,
      cantidad: especieSelecionada.value.esDinero ? 1 : r.cantidadEspecie,
      idFamilia: r.familiaEspecie,
      idTipoEspecie: r.idTipoEspecie,
      esDinero: r.esDinero,
      esPeligrosa: r.especiePeligrosa,
      idClasePeligro: r.idNivelPeligro,
      esLeyDrogas: !!especieSelecionada.value.esLeyDrogas,
      esDigital: r.esDigital,
      esMedioUsadoDelito: r.indicadorMedioUsadoCometerDelito,
      descripcionEspecie: r.descripcionEspecie,
      observaciones: especieSelecionada.value.observaciones ?? identificacionEspecieDinero.value?.formData?.observacionPronunciamiento,
      pesoBruto: r.pesoBruto === null ? 0 : r.pesoBruto,
      unidadMedidaPeso: r.unidadMedidaCuantitativa ?? '',
      ingresada: true
    },
    resolve: (res) => {
      toastSuccess('Creación de RUE exitoso')
      getDataEspeciesNoIngresadas()
      rue.value = res.RUE
      deshabilitar.value = false

      if (esDinero.value) {
        if (!especieSelecionada.value.indicadorEvidencia) {
          launchConfirmDialog({
            header: 'Pronunciamiento del Fiscal',
            message: 'Queda a la espera del Pronunciamiento del Fiscal',
            acceptLabel: 'Aceptar',
            accept: () => {
              requestUtil({
                action: stepIngresoDinero_enviarPronunciamiento,
                payload: {
                  idEspecie: especieSelecionada.value.idEspecie,
                  esEvidencia: true
                },
                resolve: (r) => {
                  router.push('/custodia/custodio')
                }
              })
            }
          })
        }
        iniciaProcesoCustodiaRegistrarInspeccionVisual()
        salidaTransferenciaDinero()
      } else {
        requestUtil({
          action: stepIngresoDinero_crearTareaCustodiaInspeccion,
          payload: {
            idEspecie: especieSelecionada.value.idEspecie,
            opcion: 'inspeccionVisual'
          }
        })
        requestUtil({
          action: stepIngresoDinero_crearTareaCustodiaInspeccion,
          payload: {
            idEspecie: especieSelecionada.value.idEspecie,
            opcion: 'fijacionFotografica'
          },
          resolve: (res) => {
            console.log('resolve custodia especie fijacion', res)
          }
        })
        salidaPeritaje()
        salidaTransferencia()
      }
      observacionPronunciamiento.value = ''
    }
  })
}
function salidaPeritaje () {
  // Se deja idTipoSalida en duro al ser socilcitud provisoria
  requestUtil({
    action: registroSalida_ingresarSolicitudSalidaperitaje,
    payload: {
      nue: especieSelecionada.value.nue,
      idEspecie: especieSelecionada.value.idEspecie,
      idTipoSalida: '9DA86E08-2BC4-4915-83CC-E94377CADB10',
      lugarRecepcion: 'Lugar recepcion',
      runReceptor: 'run Receptor',
      nombreReceptor: 'Juan Goméz',
      fechaAgendada: '2023-01-31T20:52:56.269Z',
      plazoSalida: '2023-02-15T20:52:56.269Z',
      observaciones: 'observaciones',
      creadoPor: $userName.value
    }
  })
}
function salidaTransferencia () {
  console.log('fechaSalida', dateTimeUtil.formatToBackend(new Date()))
  // Se deja idTipoSalida en duro al ser socilcitud provisoria
  requestUtil({
    action: registroSalida_ingresarSolicitudSalidaTransferencia,
    payload: {
      nue: especieSelecionada.value.nue,
      idEspecie: especieSelecionada.value.idEspecie,
      fiscaliaOrigen: 'Fiscalía origen',
      fiscalOrigen: 'Nombre Fiscal origen',
      fiscaliaDestino: 'Fiscalía Destino',
      fiscalDestino: 'Fiscal Destino',
      fechaSolicitud: '2023-01-31T20:52:56.269Z',
      fechaSalidaAgendada: '2023-06-25T20:52:56.269Z',
      receptor: 'nombre del Receptro',
      runReceptor: '22.345.678-9',
      creadoPor: $userName.value,
      tipoSalida: 'AEF2074C-5F8D-47D3-B6B9-D3F3EB8AF214'
    }
  })
}
function salidaTransferenciaDinero () {
  // Se deja idTipoSalida en duro al ser socilcitud provisoria
  requestUtil({
    action: registroSalida_ingresarSolicitudSalidaTransferenciaDinero,
    payload: {
      nue: especieSelecionada.value.nue,
      idEspecie: especieSelecionada.value.idEspecie,
      fiscaliaOrigen: 'Fiscalía origen',
      fiscalOrigen: 'Nombre Fiscal origen',
      fiscaliaDestino: 'Fiscalía Destino',
      fiscalDestino: 'Fiscal Destino',
      fechaSolicitud: '2023-02-15T20:52:56.269Z',
      fechaSalidaAgendada: '2023-02-15T20:52:56.269Z',
      creadoPor: $userName.value,
      receptor: 'nombre del Receptro',
      runReceptor: '22.345.678-9'
    }
  })
}
function iniciaProcesoCustodiaRegistrarInspeccionVisual () {
  requestUtil({
    action: generarCuponDeDeposito_getDinerosCustodia,
    payload: {
      idEspecie: especieSelecionada.value.idEspecie,
      incautacionComun: true
    },
    resolve: (res) => {
      console.log(' custodia dinero', res)
    }
  })
}

function separarItemByNue (c) {
  const payload = {
    idEspecie: c.idEspecie,
    creadoPor: $userName.value
  }
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_separarPorNue,
    payload,
    resolve: (r) => {
      getDataEspeciesNoIngresadas()
    },
    reject: (m) => {
      toastError(m.response.data.details)
    }
  })
}
const emit = defineEmits(['next-step'])

function handleNextStep () {
  if (esTransferencia.value) {
    emit('next-step', 'asignar-ubicacion')
  } else {
    emit('next-step', 'fijacion-fotografica')
  }
}

const { launchDialog } = useAppDialog()

const { stepIdentificacionNue_obtenerDocumentosByIdEspecie } = useIdentificacionNueStore()

function openModalImagen (data) {
  requestUtil({
    action: stepIdentificacionNue_obtenerDocumentosByIdEspecie,
    payload: { idEspecie: data.idEspecie },
    resolve: (data) => {
      launchDialog({
        component: ModalImagenEvidencia,
        header: 'Imágenes',
        width: '80vw',
        heigth: '50vh',
        props: {
          dataDocumento: {
            data
          }
        },
        cancelLabel: 'Cerrar'
      })
    }
  })
}
</script>
