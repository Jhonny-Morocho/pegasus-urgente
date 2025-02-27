<template>
<section>
  <TabView
    class="w-full"
    @tab-change="resetcampos"
  >
    <TabPanel header="Búsqueda por RUC">
      <BusquedaPorRuc
        ref="busquedaPorRUC"
        :causa="dataCausaPorRuc"
        :data-especies="dataNuesPorRuc"
        :delitos="dataDelitosPorRuc"
        :especie-agregada="especieAgregada"
        :ruc-loader="loader"
        @agregar-especie-nue="agergarEspecieNue"
        @busqueda-por-ruc="busquedaRuc"
        @seleccionar-nue="habilitarStep2"
      />
    </TabPanel>
    <TabPanel header="Búsqueda por NUE">
      <BusquedaPorNue
        ref="busquedaPorNUE"
        :causa="causa"
        :delitos="delitos"
        :nue-loader="loader"
        @busqueda-por-nue="busquedaNue"
      />
    </TabPanel>
  </TabView>
  <AppBtnNextTeleported
    :disabled="!nueEncontrado"
    label="Listado De Especies/Dineros"
    @click="handleNextStep"
  />
</section>
</template>
<script setup>
import { defineEmits, onMounted, ref, computed } from 'vue'
import BusquedaPorRuc from '@/modules/recepcion-especies-dinero/components/identificacion-nue/BusquedaPorRuc.vue'
import BusquedaPorNue from '@/modules/recepcion-especies-dinero/components/identificacion-nue/BusquedaPorNue.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { requestUtil } from '@/utils'
import {
  useEspecieIncautadaPendienteRecepcionStore,
  useIdentificacionNueStore,
  useSubirArchivosStore
} from '@/modules/recepcion-especies-dinero/composables/'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import ModalNueNoEncontrado from '@/modules/recepcion-especies-dinero/components/identificacion-nue/modals/ModalNueRueNoEncontrado.vue'
import ModalSolicitarRucAlAdministrador from '@/modules/recepcion-especies-dinero/components/identificacion-nue/modals/ModalSolicitarRucAlAdministrador.vue'
import { useSessionStore } from '@/modules/session/composables'

const { toastSuccess, toastError } = useAppToast()
const { launchDialog } = useAppDialog()

const nueEncontrado = ref(null)

const busquedaPorRUC = ref()

const busquedaPorNUE = ref()

const emit = defineEmits(['next-step'])

function handleNextStep () {
  emit('next-step', 'especies-incautadas-pendientes-de-recepcion')
}

const loader = ref(false)

const {
  causaEncontradaAsociadaANue,
  stepIdentificacionNue_controlarDuplicadoNue,
  stepIdentificacionNue_RESET_CAUSA_ENCONTRADA,
  stepIdentificacionNue_obtenerCausaPorRUC,
  stepIdentificacionNue_SET_CAUSA_ENCONTRADA,
  stepIdentificacionNue_agregarEspecieNue,
  stepIdentificacionNue_solicitudRucAlAdministrador
} = useIdentificacionNueStore()

const causa = computed(() => causaEncontradaAsociadaANue.value.fichaCausa?.causa)
const delitos = computed(
  () => causaEncontradaAsociadaANue.value.fichaCausa?.hechoDelictuales
)

const {
  stepEspeciesIncautadasPendientesDeRecepcion_RESET
} = useEspecieIncautadaPendienteRecepcionStore()

function busquedaNue (nue) {
  loader.value = true
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_RESET
  })
  requestUtil({
    action: stepIdentificacionNue_controlarDuplicadoNue,
    payload: { nue },
    resolve: (r) => {
      toastSuccess(`Causa Asociada a NUE ${r.nue} encontrada con éxito`)
      nueEncontrado.value = true
      loader.value = false
    },
    reject: (err) => {
      let mensaje = err.response?.data.message.replaceAll('_', ' ')
      mensaje = mensaje?.charAt(0).toUpperCase() + mensaje?.slice(1)
      const errorData = err.response.data.cod
      const errorMessage = err.response.data.message
      if (errorData === 'nue_recepionada') {
        toastError(mensaje)
      } else if (errorData === 'nue_no_existe' || errorMessage === 'nue_no_existe') {
        launchDialog({
          component: ModalNueNoEncontrado,
          props: { body: mensaje }
        })
      } else if (errorData === 'causa_sin_ruc') {
        launchDialog({
          component: ModalSolicitarRucAlAdministrador,
          header: 'Solicitar RUC al Administrador',
          props: { nue: nue },
          confirmLabel: 'Solicitar',
          accept: (res) => {
            requestUtil({
              action: stepIdentificacionNue_solicitudRucAlAdministrador,
              payload: {
                nue: nue,
                folio: res.folio,
                numeroParteDenuncia: res.numeroParteDenuncia,
                idInstitucion: res.institucion,
                idUnidad: res.nombreUnidad,
                idDestacamento: res.destacamento,
                idTipoDocumento: res.tipoDocumento,
                numeroDocumento: res.numeroDocumento,
                fechaDenunciaFolio: res.fechaDenunciaFolio,
                observaciones: res.observaciones,
                idSolicitante: res.usuarioSolicitante,
                numeroDenuncia: res.numeroParteDenuncia,
                fechaSolicitud: res.fechaHoraDeSolicitud
              }
            })
          }
        })
      }
      // nueNoencontrado(err, nue, mensaje)
      loader.value = false
    }
  })
}

const dataCausaPorRuc = ref({})
const dataDelitosPorRuc = ref({})
const dataNuesPorRuc = ref({})

function busquedaRuc (ruc, bpr = false) {
  loader.value = true
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_RESET
  })
  if (ruc) {
    requestUtil({
      action: stepIdentificacionNue_obtenerCausaPorRUC,
      payload: { ruc },
      resolve: (r) => {
        dataCausaPorRuc.value = r.fichaCausa
        dataDelitosPorRuc.value = r.fichaCausa.hechoDelictuales
        dataNuesPorRuc.value = r.nue
        loader.value = false
        toastSuccess(
          bpr
            ? 'Especie Agregada!'
            : `Causa encontrada para el RUC: ${r.fichaCausa.causa.rolUnico}`
        )
      },
      reject: (e) => {
        console.log(e)
        let mensaje = e.response?.data.cod.replaceAll('_', ' ')
        mensaje = mensaje?.charAt(0).toUpperCase() + mensaje?.slice(1)
        launchDialog({
          component: ModalNueNoEncontrado,
          props: { body: mensaje }
        })
        loader.value = false
      }
    })
  }
}

function habilitarStep2 (data) {
  nueEncontrado.value = true
  stepIdentificacionNue_SET_CAUSA_ENCONTRADA({
    ...causaEncontradaAsociadaANue.value,
    nue: data.find((d) => d.nue).nue
  })
}

const { archivos, subirArchivosStore_RESET_ARCHIVOS_TABLA } = useSubirArchivosStore()

const especieAgregada = ref(false)

const { user } = useSessionStore()

function agergarEspecieNue (data) {
  const payload = {
    ...data,
    idDenuncia: dataCausaPorRuc.value.causa.idDenuncia,
    ruc: dataCausaPorRuc.value.causa.rolUnico,
    documentos: archivos.value,
    creadoPor: user.value.preferred_username,
    idFuncionario: user.value.sub
  }
  delete payload.montoCantidad
  requestUtil({
    action: stepIdentificacionNue_agregarEspecieNue,
    payload,
    resolve: (r) => {
      busquedaRuc(causaEncontradaAsociadaANue.value.fichaCausa.causa.rolUnico, true)
      busquedaPorRUC.value.reset()
      requestUtil({ action: subirArchivosStore_RESET_ARCHIVOS_TABLA })
    },
    reject: (e) => {
      let mensaje = e.response?.data.message.replaceAll('_', ' ')
      mensaje = mensaje?.charAt(0).toUpperCase() + mensaje?.slice(1)
      toastError(mensaje)
    },
    loader: (v) => {
      especieAgregada.value = v
    }
  })
}

function resetcampos () {
  busquedaPorNUE.value.limpiarCampoBusqueda()
  busquedaPorRUC.value.limpiarCampoBusqueda()
  requestUtil({ action: stepIdentificacionNue_RESET_CAUSA_ENCONTRADA })
  dataCausaPorRuc.value = {}
  dataDelitosPorRuc.value = {}
  dataNuesPorRuc.value = {}
}

onMounted(() => {
  resetcampos()
})
</script>
