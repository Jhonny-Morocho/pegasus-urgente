<template>
<section>
  <AppForm
    id="buscar-duplicidad"
    :form-submitted="formSubmitted"
    validation-scope="formBuscarDuplicidad"
  >
    <AppFieldset
      class=""
      legend="Buscar Duplicidad"
    >
      <DatosBusquedaSimple
        ref="refDatosBusquedaSimple"
        class="col-12"
      />
      <DatosBusquedaAvanzada
        ref="refDatosBusquedaAvanzada"
        class="col-12"
      />
    </AppFieldset>
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-4">
        <p class="mb-2 pl-2">
          Tipo de Búsqueda
        </p>
        <AppSelectButton
          id="es-vinculante"
          v-model="esVinculante"
          class=""
          option-label="name"
          option-value="opt"
          :options="[
            { name: 'No Vinculante', opt: false },
            { name: 'Combinada', opt: true }
          ]"
        />
      </div>
      <div class="col-12 md:col-6 lg:col-offset-2 grid mt-auto">
        <div class="col-12 md:col-6 lg:col-5 lg:col-offset-1 mb-2">
          <Button
            id="btn-limpiar-campos"
            class="btn-fileupload"
            icon="pi pi-filter-slash"
            icon-pos="right"
            label="Limpiar campos"
            @click="limpiarFiltros"
          />
        </div>
        <div class="col-12 md:col-6 lg:col-6 mb-2">
          <Button
            id="btn-buscar-duplicidad"
            class="btn-form"
            icon="pi pi-search"
            icon-pos="right"
            label="Buscar Duplicidad"
            @click="buscarDuplicidad({find: true})"
          />
        </div>
      </div>
    </div>
  </AppForm>
  <AppFieldset
    v-if="mostrarTabla"
    class="my-4"
    legend="Causas Candidatas a Duplicidad"
  >
    <TablaCandidatasDuplicidad
      :loading="isTableLoading"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="candidatasDuplicidad"
      @page="buscarDuplicidad"
    />
  </AppFieldset>
  <Dialog
    v-model:visible="dialogBuscandoDuplicidad"
    :closable="false"
    modal
    :style="{ width: 'fit-content' }"
  >
    <h3 class="mb-3 flex justify-content-center">
      Buscando Causas Duplicadas
    </h3>
    <AppProgressSpinner
      background-color="transparent"
      size="70px"
    />
  </Dialog>
  <AppBtnNextTeleported
    :label="!seDenegoDuplicidad && (procesoPam.taskName === 'Identificar duplicidad de Denuncia') ? 'Denegar Duplicidad' : 'Siguiente'"
    :loading="loadingDenegarDuplicidad"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import { defineEmits, reactive, ref } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import {
  useFormValidation,
  useAppToast,
  // useAppDialog,
  useConfirmDialog
} from '@/modules/common/composables'
import { useBuscarDuplicidadStore, useMantenedorStore, usePamStore } from '@/modules/global/composables'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import DatosBusquedaSimple from '@/modules/global/components/buscar-duplicidad/BuscarDuplicidadDatosBusquedaSimple.vue'
import DatosBusquedaAvanzada from '@/modules/global/components/buscar-duplicidad/BuscarDuplicidadDatosBusquedaAvanzada.vue'
import TablaCandidatasDuplicidad from '@/modules/global/components/buscar-duplicidad/TablaCandidatasDuplicidad.vue'
import AppProgressSpinner from '@/modules/common/components/AppProgressSpinner.vue'
import { useIdentificacionDenunciaStore } from '../../composables/useIdentificacionDenunciaStore.js'
const showFiltrarCampos = ref(false)
const loadingDenegarDuplicidad = ref(false)

const {
  buscarDuplicidad_RESET, buscarDuplicidad_buscarDuplicidad,
  candidatasDuplicidad, paginacion,
  buscarDuplicidad_decisionCausaDuplicada, seDenegoDuplicidad
} = useBuscarDuplicidadStore()

const { tipoDenunciaObject } = useIdentificacionDenunciaStore()
const { mantenedor_getTiposSujetos } = useMantenedorStore()
const { toastError, toastWarning, toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()

const { procesoPam, pam_SET_PROCESO } = usePamStore()

const formBuscarDuplicidad = reactive({})
const esVinculante = ref(false)

const refDatosBusquedaSimple = ref(null)
const refDatosBusquedaAvanzada = ref(null)
const isTableLoading = ref(false)
const dialogBuscandoDuplicidad = ref(false)
const mostrarTabla = ref(false)
const firstRecord = ref(0)

function limpiarFiltros () {
  showFiltrarCampos.value = false
  mostrarTabla.value = false
  refDatosBusquedaSimple.value.resetForm()
  refDatosBusquedaAvanzada.value.resetForm()
  buscarDuplicidad_RESET()
}

const { formSubmitted, isFormValid } = useFormValidation({
  formData: formBuscarDuplicidad,
  validationScope: 'formBuscarDuplicidad'
})

function tieneAlMenosUnCampo (simple, avanzada) {
  // eslint-disable-next-line eqeqeq
  return Boolean(
    Object.values(simple)
      .concat(Object.values(avanzada))
      .find((f) => f !== '')
  )
}
async function buscarDuplicidad (pagination = undefined) {
  const datosBusquedaSimple = refDatosBusquedaSimple.value.formData
  const datosBusquedaAvanzada = refDatosBusquedaAvanzada.value.formData

  if (!tieneAlMenosUnCampo(datosBusquedaSimple, datosBusquedaAvanzada) || !isFormValid()) {
    toastError('Complete al menos un campo del formulario para realizar la búsqueda', 2000)
    return
  }
  if (!pagination) {
    firstRecord.value = 0
  }
  if (pagination?.find) {
    dialogBuscandoDuplicidad.value = true
  }

  const paramsBuscarDuplicidad = {
    page: pagination?.page || 0,
    size: pagination?.rows || 10,

    idTipoDocumentoDenunciante: emptyString(datosBusquedaAvanzada.tipoDocumentoDenunciante),
    numeroDocumentoDenunciante: emptyString(datosBusquedaAvanzada.numeroDocumentoDenunciante?.replaceAll('.', '')),
    nombreDenunciante: emptyString(datosBusquedaAvanzada.nombreDenunciante.toUpperCase()),

    idTipoDocumentoVictima: emptyString(datosBusquedaAvanzada.tipoDocumentoVictima),
    numeroDocumentoVictima: emptyString(datosBusquedaAvanzada.numeroDocumentoVictima?.replaceAll('.', '')),
    nombreVictima: emptyString(datosBusquedaSimple.nombreVictima.toUpperCase()),

    idTipoDocumentoImputado: emptyString(datosBusquedaAvanzada.tipoDocumentoImputado),
    numeroDocumentoImputado: emptyString(datosBusquedaAvanzada.numeroDocumentoImputado?.replaceAll('.', '')),
    nombreImputado: emptyString(datosBusquedaSimple.nombreImputado.toUpperCase()),

    numeroDenuncia: emptyString(datosBusquedaAvanzada.numeroDenuncia),
    fechaDelito: datosBusquedaSimple.fechaDelito ? dateTimeUtil.formatToBackendWithTime(datosBusquedaSimple.fechaDelito) : null,
    idUnidadPolicial: emptyString(datosBusquedaAvanzada.unidadPolicial),

    idTipoDelito: emptyString(datosBusquedaSimple.delito),
    fechaHoraDelitoDesde: datosBusquedaAvanzada.fechaHoraDenunciaDesde ? dateTimeUtil.formatToBackendWithTime(datosBusquedaAvanzada.fechaHoraDenunciaDesde) : null,
    fechaHoraDelitoHasta: datosBusquedaAvanzada.fechaHoraDenunciaHasta ? dateTimeUtil.formatToBackendWithTime(datosBusquedaAvanzada.fechaHoraDenunciaHasta) : null,
    palabraClaveRelato: emptyString(datosBusquedaAvanzada.palabrasClave.toUpperCase()),

    direccion: emptyString(refDatosBusquedaAvanzada.value.direccionGoogle),
    esCombinada: esVinculante.value
  }
  requestUtil({
    action: buscarDuplicidad_buscarDuplicidad,
    payload: paramsBuscarDuplicidad,
    resolve: () => {
      if (candidatasDuplicidad.value.length > 0) {
        mostrarTabla.value = true
        toastSuccess('Se encontraron posibles Causas Duplicadas')
      } else if (candidatasDuplicidad.value.length === 0) {
        mostrarTabla.value = false
        toastWarning('Sin Coincidencias. No se encontraron posibles Causas Duplicadas')
      }
      dialogBuscandoDuplicidad.value = false
    },
    loader: (l) => {
      isTableLoading.value = l
    },
    reject: () => {
      toastError('Se ha producido un error al buscar la duplicidad')
      dialogBuscandoDuplicidad.value = false
    }
  })
}

function emptyString (check) {
  if (!check?.length) return null
  return check
}

const emit = defineEmits(['next-step'])

function handleNextStep () {
  const proceso = procesoPam.value
  if (!seDenegoDuplicidad.value) {
    launchConfirmDialog({
      message: '¿Estas Seguro(a) de Denegar la Duplicidad?',
      accept: () => {
        const samplePayload = {
          procesoPam: { ...proceso, usuario: 'user' },
          dataCausaDuplicada: {
            idSolicitudCausa: 'string',
            esCausaDuplicada: false,
            tipoDenuncia: tipoDenunciaObject.value.descripcion,
            codTipoDenuncia: tipoDenunciaObject.value.codigo
          }
        }
        requestUtil({
          action: buscarDuplicidad_decisionCausaDuplicada,
          payload: {
            ...samplePayload
          },
          resolve: (data) => {
            toastWarning('Se denego la duplicidad de la denuncia')
            pam_SET_PROCESO({
              ...data.procesoPam
            })
            emit('next-step', '/ingreso/denuncia-directa/nueva-denuncia/sujetos-intervinientes')
          },
          loader: (l) => (loadingDenegarDuplicidad.value = l),
          reject: (err) => {
            toastError('Ha ocurrido un error', err)
          }
        })
      }
    })
  } else {
    emit('next-step', '/ingreso/denuncia-directa/nueva-denuncia/sujetos-intervinientes')
  }
}

requestUtil({ action: mantenedor_getTiposSujetos })
</script>

<style>
.p-progressbar {
  background-color: #ffbf83 !important;
}
.p-progressbar .p-progressbar-value {
  background: #fe7800 !important;
}
</style>
