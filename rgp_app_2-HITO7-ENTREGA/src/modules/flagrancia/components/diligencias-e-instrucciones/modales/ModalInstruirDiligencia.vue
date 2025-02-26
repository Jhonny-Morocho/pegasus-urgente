<template>
<!-- DILIGENCIA SUGERIDA -->
<section
  v-if="props.isSugerida"
  class="grid col-12 md:col-6 mb-4"
>
  <h3 class="col-12">
    Tipo Diligencia:
    {{ mantenedor_getNombreTipoDiligencia(props.diligenciaSugerida.idPadre) }}
  </h3>
  <h3 class="col-12">
    Subtipo Diligencia:
    {{ mantenedor_getNombreSubtipoDiligencia(props.diligenciaSugerida.id) }}
  </h3>
</section>
<StepsByIndex
  class="mb-3"
  :current-step="currentStep"
  :model="stepsModalInstruirDiligenciaSugerida"
/>
<section
  v-if="currentStep === 1"
  id="datos-institucion"
>
  <AppForm
    id="informacion-diligencia"
    class="mb-2"
    :form-submitted="formSubmitted"
    validation-scope="form-diligencia"
  >
    <!-- DILIGENCIA SUGERIDA -->
    <AppFieldset
      v-if="props.isSugerida"
      class="mt-4"
      legend="Información Diligencia"
    >
      <div class="col-6">
        <AppDropdown
          id="justificacionDiligencia"
          v-model="formData.idJustificacion"
          class="col-12"
          label="Justificacion Diligencia"
          option-label="descripcion"
          option-value="id"
          :options="justificaciones"
          :rules="{ required }"
          show-clear
        />
        <AppDropdown
          id="ambito"
          v-model="formData.idAmbito"
          class="col-12"
          :disabled="codigosAtributos.length !== 0"
          label="Ámbito"
          :loading="loadingTabla"
          option-label="descripcion"
          option-value="codigo"
          :options="ambitoOptions"
          :payload="payloadTipoDiligencia"
          :rules="{ required }"
          show-clear
          @change="setAmbito(formData.idAmbito)"
        />
      </div>
      <div class="col-6">
        <AppTextarea
          id="observacionDiligencia"
          v-model="formData.observacion"
          :auto-resize="true"
          cols="100"
          label="Observación de la Diligencia"
          rows="6"
        />
      </div>
      <AppInput
        v-if="isOtro"
        id="observacion-otro"
        v-model="formData.otro"
        class="col-12"
        label="Otro"
      />
    </AppFieldset>

    <!-- NUEVA DILIGENCIA -->
    <AppFieldset
      v-else
      class="mt-4"
      legend="Información Diligencia"
    >
      <section class="grid col-12">
        <AppDropdown
          id="tipo-diligencia"
          v-model="formData.idTipoDiligencia"
          class="col-4"
          label="Tipo Diligencia"
          option-label="descripcion"
          :options="actividadesSubtipo"
          :payload="payloadTipoDiligencia"
          :retrieve-data-action="mantenedor_getActividadHijo"
          :rules="{ required }"
          show-clear
          @change="getSubtipoOptions"
        />
        <AppDropdown
          v-if="formData.idTipoDiligencia?.isParent"
          id="subtipo-diligencia"
          v-model="formData.idSubtipoDiligencia"
          class="col-4"
          :disabled="!formData.idTipoDiligencia"
          label="Subtipo Diligencia"
          :loading="loadingSubtipoOptions"
          option-label="descripcion"
          option-value="id"
          :options="actividadesSubSubtipo"
          :rules="{ required }"
          show-clear
          @change="checkAtributos(formData.idSubtipoDiligencia)"
        />
        <AppDropdown
          id="justificacion-diligencia"
          v-model="formData.idJustificacion"
          class="col-4"
          label="Justificacion de la Diligencia"
          option-label="descripcion"
          option-value="id"
          :options="justificaciones"
          :retrieve-data-action="mantenedor_getJustificaciones"
          :rules="{ required }"
        />
        <AppInput
          id="observacion-diligencia"
          v-model="formData.observacion"
          class="col-12"
          label="Observación de la Diligencia"
        />
        <AppDropdown
          id="ambito-diligencia"
          v-model="formData.idAmbito"
          class="col-4"
          disabled
          label="Ámbito"
          :loading="loadingTabla"
          option-label="descripcion"
          option-value="codigo"
          :options="ambitoOptions"
          :rules="{ required }"
        />
        <AppInput
          v-if="isOtro"
          id="observacion-otro"
          v-model="formData.otro"
          class="col-8"
          label="Otro"
        />
      </section>
    </AppFieldset>
  </AppForm>
  <AppFieldset
    v-if="idAmbito === 'Sujetos' || idAmbito === 'Relación'"
    class="w-full"
    :legend="`Lista de ${idAmbito}`"
  >
    <TablaRelacionesDiligencia
      v-if="idAmbito === 'Relación'"
      id="tabla-relaciones-diligencia"
      v-model:selection="dataTablaAmbitoSeleccionados"
      class="w-full"
      :loading="loadingTabla"
      :value="dataRelaciones"
    />
    <TablaSujetosDiligencia
      v-if="idAmbito === 'Sujetos'"
      v-model:selection="dataTablaAmbitoSeleccionados"
      class="w-full"
      :loading="loadingTabla"
      :value="dataSujetosintervinientes"
    />
  </AppFieldset>

  <AppForm
    id="informacion-institucion-ejecutura"
    class="mb-2"
    :form-submitted="formSubmitted"
    validation-scope="form-diligencia"
  >
    <!-- DILIGENCIA SUGERIDA -->
    <AppFieldset
      v-if="props.isSugerida"
      class="mt-4"
      legend="Información de la Institución Ejecutura"
    >
      <div class="col-12 grid">
        <AppDropdown
          id="institucionEjecutora"
          v-model="formData.idInstitucionEjecutora"
          class="col-12 md:col-5"
          label="Institucion Ejecutora"
          option-label="descripcion"
          option-value="id"
          :options="instituciones"
          :rules="{ required }"
          show-clear
        />
        <AppDropdown
          id="plazoEntrega"
          v-model="formData.plazo"
          class="col-12 md:col-5"
          label="Plazo de Entrega de Resultado"
          option-label="descripcion"
          option-value="valor"
          :options="plazosDiligencia"
          :rules="{ required }"
          show-clear
        />
        <div class="grid">
          <Button
            class="p-button-text text-right"
            icon="pi pi-map-marker"
            icon-pos="right"
            label="Ver Dirección"
            @click="verDireccion"
          />
        </div>
      </div>
    </AppFieldset>

    <!-- NUEVA DILIGENCIA -->
    <AppFieldset
      v-else
      class="mt-4"
      legend="Información de la Institución Ejecutura"
    >
      <div class="col-12 grid">
        <AppDropdown
          id="institucionEjecutora"
          v-model="formData.idInstitucionEjecutora"
          class="md:col-4"
          label="Institucion Ejecutora"
          option-label="descripcion"
          option-value="id"
          :options="instituciones"
          :rules="{ required }"
          show-clear
          @change="checkInstitucion(formData.idInstitucionEjecutora)"
        />
        <AppDropdown
          v-if="!isIML"
          id="prefectura"
          v-model="formData.idPrefectura"
          class="md:col-4"
          label="Prefectura"
          option-label="descripcion"
          option-value="id"
          :options="prefecturas"
          :retrieve-data-action="mantenedor_getPrefecturas"
          :rules="{ required }"
          show-clear
          @change="getComisariaOptions"
        />
        <AppDropdown
          v-if="!isIML"
          id="unidad-policial"
          v-model="formData.idComisaria"
          class="md:col-4"
          :disabled="!formData.idPrefectura"
          label="Unidad Policial / Comisaría"
          :loading="loadingComisariaOptions"
          option-label="descripcion"
          option-value="id"
          :options="comisarias"
          :rules="{ required }"
          show-clear
          @change="getDestacamentoOptions"
        />
        <AppDropdown
          v-if="!isIML"
          id="destacamento"
          v-model="formData.idDestacamento"
          class="md:col-4"
          :disabled="!formData.idComisaria"
          label="Destacamento"
          :loading="loadingDestacamentoOptions"
          option-label="descripcion"
          option-value="id"
          :options="destacamentos"
          :rules="{ required }"
          show-clear
        />
        <AppDropdown
          id="plazoEntrega"
          v-model="formData.plazo"
          class="md:col-4"
          label="Plazo de Entrega de Resultado"
          option-label="descripcion"
          option-value="valor"
          :options="plazosDiligencia"
          :rules="{ required }"
          show-clear
        />
        <div class="col-4">
          <Button
            class="p-button-text text-right"
            icon="pi pi-map-marker"
            icon-pos="right"
            label="Ver Dirección"
            @click="verDireccion"
          />
        </div>
        <div
          v-if="props.isSugerida"
          class="col-12 grid justify-content-between mt-3"
        >
          <div class="col-4">
            <Button
              class="p-button-text text-right"
              icon="pi pi-map-marker"
              icon-pos="right"
              label="Ver Dirección"
              @click="verDireccion"
            />
          </div>
        </div>
      </div>
    </AppFieldset>
  </AppForm>
</section>
<section
  v-if="currentStep === 2"
  id="material-apoyo"
>
  <AppFieldset legend="Lista Documentos y Archivos">
    <TablaDocumentosDiligencia
      v-model:selection="dataTablaDocumentosSeleccionados"
      class="col-12"
      :value="documentos"
    />
  </AppFieldset>
  <div class="col-8">
    <Button
      class="w-3 btn-form"
      icon="pi pi-paperclip"
      icon-pos="left"
      label="Seleccionar Archivo"
      @click="handleSeleccionarArchivo"
    />
  </div>
</section>
<footer class="grid mt-4">
  <div class="col-6 flex mt-4">
    <Button
      v-if="currentStep > 1"
      class="w-3 p-button-outlined bg-white"
      icon="pi pi-arrow-left"
      icon-pos="left"
      label="Volver"
      @click="previousStep"
    />
  </div>
  <div class="col-6 flex justify-content-end mt-4">
    <Button
      class="mr-4 p-button-outlined bg-white"
      icon="pi pi-times"
      icon-pos="right"
      label="Cancelar"
      @click="cerrarDialog"
    />
    <Button
      v-if="currentStep < stepsModalInstruirDiligenciaSugerida.length"
      class="w-4 ml-2"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Continuar"
      @click="nextStep"
    />
    <Button
      v-if="currentStep === stepsModalInstruirDiligenciaSugerida.length"
      class="w-4 ml-2"
      icon="pi pi-send"
      icon-pos="right"
      label="Instruir Diligencia"
      @click="handleInstruirDiligenciaSugerida"
    />
  </div>
</footer>
</template>
<script setup>
import { reactive, inject, ref, onMounted, computed, watchEffect, watch } from 'vue'
import { requestUtil } from '@/utils'
import {
  useFormValidation,
  useAppToast,
  useAppDialog,
  useAppGlobalProperties
} from '@/modules/common/composables'
import StepsByIndex from '@/modules/global/components/utilities/StepsByIndex.vue'

import {
  useMantenedorStore,
  usePamStore,
  useRelacionesStore,
  useEspeciesDineroStore,
  useSujetosIntervinientesStore,
  useDocumentoStore,
  useActividadStore
} from '@/modules/global/composables'

import TablaRelacionesDiligencia from '@/modules/global/components/diligencias/TablaRelacionesDiligencia.vue'
// import FieldsetListaEspeciesDinero from '@/modules/global/components/ficha-causa/FieldsetListaEspeciesDinero.vue'
import TablaSujetosDiligencia from '@/modules/global/components/diligencias/TablaSujetosDiligencia.vue'
import TablaDocumentosDiligencia from '@/modules/global/components/diligencias/TablaDocumentosDiligencia.vue'
import ModalAgregarDocumento from '@/modules/flagrancia/components/diligencias-e-instrucciones/modales/ModalAgregarDocumento.vue'
import ModalDireccionUnidadPolicial from '@/modules/global/components/direcciones/ModalDireccionUnidadPolicial.vue'
const { procesoPam } = usePamStore()
const { $userFiscaliaActual } = useAppGlobalProperties()

const { toastError, toastSuccess, TOAST_MESSAGES } = useAppToast()
const { launchDialog } = useAppDialog()

const { actividad_enviarSolicitud, actividad_getActividades } = useActividadStore()

const {
  procesoHito,
  tipoActividad,
  plazosDiligencia,
  actividadesSubtipo,
  actividadesSubSubtipo,
  mantenedor_getFiscalias,
  mantenedor_getActividadHijo,
  mantenedor_getAtributos,
  mantenedor_getNombreTipoDiligencia,
  mantenedor_getNombreSubtipoDiligencia,
  mantenedor_getTiposSujetos,
  tiposSujeto,
  mantenedor_getTiposDocumento,
  tiposDocumento,
  mantenedor_getPrefecturas,
  prefecturas,
  mantenedor_getCodigoInstitucionDiligencia,
  instituciones,
  mantenedor_getDestacamentosByIdComisaria,
  destacamentos,
  mantenedor_getComisariasByIdPrefectura,
  comisarias,
  mantenedor_getJustificaciones,
  justificaciones,
  mantenedor_getTipoOrigenActividad,
  tipoOrigen,
  mantenedor_getIdTipoOrigenActividadByCodigo
} = useMantenedorStore()

const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()
const { relaciones_getRelaciones } = useRelacionesStore()
const { especiesDinero_getEspecieByIdDenuncia, especies } = useEspeciesDineroStore()
const {
  documento_addDocumento,
  documento_getDocumentosByIdDenuncia,
  documentos
} = useDocumentoStore()

const idFiscalia = ref('')
const dataEspeciesDinero = ref([])
const dataRelaciones = ref([])
const dataSujetosintervinientes = ref([])
const codigosAtributos = ref([])
const idAmbito = ref(null)
const currentStep = ref(1)
const dialogRef = inject('dialogRef')
const dataTablaAmbitoSeleccionados = ref([])
const dataTablaDocumentosSeleccionados = ref([])
const loadingTabla = ref(true)
const loadingSubtipoOptions = ref(false)
const loadingDestacamentoOptions = ref(false)
const loadingComisariaOptions = ref(false)

const props = reactive({
  ...dialogRef.value?.data
})

const formData = reactive({
  // INFORMACIÓN
  idTipoDiligencia: null,
  idSubtipoDiligencia: '',
  idJustificacion: '',
  idAmbito: '',
  observacion: '',
  otro: '',
  // INSTITUCIÓN
  idInstitucionEjecutora: '',
  plazo: '',
  idPrefectura: '',
  idComisaria: '',
  idDestacamento: ''
})

const ambitoOptions = [
  { codigo: '5', descripcion: 'Relación' },
  { codigo: '14', descripcion: 'Sujetos' },
  { codigo: '15', descripcion: 'Causa' }
]

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-diligencia'
})

const stepsModalInstruirDiligenciaSugerida = [
  {
    label: 'Datos de la Institución Ejecutora',
    key: 1
  },
  {
    label: 'Material de Apoyo',
    key: 2
  }
]

const payloadTipoDiligencia = computed(() => {
  return {
    idCausaProceso: procesoHito.value[0]?.id,
    idActividad: tipoActividad.value.id
  }
})

onMounted(() => {
  getDocumentos()
})

if (!tipoOrigen.value.length) {
  requestUtil({
    action: mantenedor_getTipoOrigenActividad
  })
}

function getSubtipoOptions (idTipoDiligencia) {
  formData.idSubtipoDiligencia = null
  if (!idTipoDiligencia.value) return
  if (!idTipoDiligencia?.value.isParent) {
    checkAtributos(idTipoDiligencia?.value.id)
    return
  }

  requestUtil({
    action: mantenedor_getActividadHijo,
    payload: {
      idCausaProceso: procesoHito.value[0]?.id,
      idActividad: formData.idTipoDiligencia?.id,
      subsubtipo: true
    },
    loader: (l) => {
      loadingSubtipoOptions.value = l
    }
  })
}
function checkAtributos (idActividad) {
  if (!idActividad) return
  loadingTabla.value = true
  requestUtil({
    action: mantenedor_getAtributos,
    payload: {
      idActividad: idActividad
    },
    resolve: (r) => {
      codigosAtributos.value = r.map(({ codigoAtributo }) => codigoAtributo)
      setAmbito(codigosAtributos.value)
    }
  })
}
watchEffect(() => codigosAtributos.value)

if (props.isSugerida) {
  checkAtributos(props.diligenciaSugerida.id)
}

watch(
  () => formData.idTipoDiligencia,
  () => {
    if (!formData.idTipoDiligencia) setAmbito()
  }
)
watch(
  () => formData.idSubtipoDiligencia,
  () => {
    if (!formData.idSubtipoDiligencia && formData.idTipoDiligencia) setAmbito()
  }
)

function setAmbito (responseURL) {
  if (responseURL?.includes('15')) {
    formData.idAmbito = '15'
  } else if (responseURL?.includes('14')) {
    formData.idAmbito = '14'
  } else if (responseURL?.includes('5')) {
    formData.idAmbito = '5'
  } else {
    formData.idAmbito = null
  }
  setTable(formData.idAmbito)
}

watchEffect(() => formData.idAmbito)

const isOtro = ref(false)

const bypassIdAmbito = {
  5: 'Relación',
  14: 'Sujetos',
  15: 'Causa'
}

function setTable (codigo) {
  dataTablaAmbitoSeleccionados.value = []
  isOtro.value = false
  idAmbito.value = bypassIdAmbito[codigo]

  if (idAmbito.value === 'Sujetos') {
    getDataSujetos()
  } else if (idAmbito.value === 'Relación') {
    setRelaciones()
  } else if (idAmbito.value === 'Especie-Dinero') {
    setEspecies()
  } else if (idAmbito.value === 'Otro') {
    isOtro.value = true
  } else loadingTabla.value = false
}

function getComisariaOptions (idPrefectura) {
  resetPrefecturadependent()
  if (!idPrefectura.value) return
  requestUtil({
    action: mantenedor_getComisariasByIdPrefectura,
    payload: {
      idPrefectura: idPrefectura.value
    },
    loader: (l) => {
      loadingComisariaOptions.value = l
    }
  })
}

function getDestacamentoOptions (idComisaria) {
  resetDestacamento()
  if (!idComisaria.value) return
  requestUtil({
    action: mantenedor_getDestacamentosByIdComisaria,
    payload: {
      idComisaria: idComisaria.value
    },
    loader: (l) => {
      loadingDestacamentoOptions.value = l
    }
  })
}
const isIML = ref(false)
function checkInstitucion (idInstitucion) {
  const codigoInstitucion = mantenedor_getCodigoInstitucionDiligencia(idInstitucion)
  isIML.value = codigoInstitucion === '4' // 4: Instituto Médico Legal
  clearAfterCheckInstitucion()
}

function clearAfterCheckInstitucion () {
  formData.idPrefectura = null
  formData.idComisaria = null
  formData.idDestacamento = null
}

function resetPrefecturadependent () {
  formData.idComisaria = null
  formData.idDestacamento = null
}
function resetDestacamento () {
  formData.idDestacamento = null
}

function setRelaciones () {
  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: procesoPam.value.idDenuncia },
    resolve: (r) => {
      dataRelaciones.value = r.data
    },
    loader: (l) => {
      loadingTabla.value = l
    }
  })
}

function getDataSujetos () {
  if (!tiposSujeto.value.length) {
    requestUtil({ action: mantenedor_getTiposSujetos })
  }
  if (!tiposDocumento.value.length) {
    requestUtil({
      action: mantenedor_getTiposDocumento,
      resolve: (r) => {
        setSujetos()
      }
    })
  } else setSujetos()
}

function setSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: procesoPam.value.idDenuncia },
    resolve: ({ data }) => {
      dataSujetosintervinientes.value = data
    },
    loader: (l) => {
      loadingTabla.value = l
    }
  })
}

function setEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: procesoPam.value.idDenuncia },
    resolve: () => {
      dataEspeciesDinero.value = especies.value
    },
    loader: (l) => {
      loadingTabla.value = l
    }
  })
}

function verDireccion () {
  if (!formData.idDestacamento) return
  launchDialog({
    component: ModalDireccionUnidadPolicial,
    header: 'Dirección Unidad Policial',
    width: '45vw',
    confirmLabel: 'Cerrar',
    confirmIcon: 'false',
    cancelLabel: 'hideCancelLabel',
    props: { idOrganismoColaborador: formData.idDestacamento }
  })
}

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
getFiscalia()

function handleInstruirDiligenciaSugerida () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const idsIntervinientes =
    idAmbito.value === 'Sujetos' ? dataTablaAmbitoSeleccionados.value.idRelacionSujeto : null
  const idsRelaciones =
    idAmbito.value === 'Relación'
      ? dataTablaAmbitoSeleccionados.value.map((r) => r.idRelacionDelito)
      : null
  // const especiesDinero = idAmbito.value === 'Especie-Dinero' ? dataTablaAmbitoSeleccionados.value : []
  // const idsEspeciesDinero = especiesDinero.map((e) => e.idEspecie)
  const idsDocumentos = dataTablaDocumentosSeleccionados.value.map((d) => d.idDocumento)

  const data = {
    idOrigenActividad: procesoPam.value.idDenuncia,
    idTipoOrigenActividad: mantenedor_getIdTipoOrigenActividadByCodigo('2'),
    idTipoActividad: tipoActividad.value.id,
    idSubtipoActividad: props.isSugerida
      ? props.diligenciaSugerida.idPadre
      : formData.idTipoDiligencia.id, // el idSubtipo seleccionado
    idSubSubtipoActividad: props.isSugerida
      ? props.diligenciaSugerida.id
      : formData.idSubtipoDiligencia, //  el idSubSubtipo seleccionado
    idJustificacion: formData?.idJustificacion,
    idFiscalia: idFiscalia.value, // valor idFiscalia
    idUnidadOrigen: idFiscalia.value, // valor idFiscalia

    idUnidadDestino: formData?.idDestacamento || formData?.idInstitucionEjecutora, // id del ultimo nivel de la institucion seleccionado, ejemplo: para carabinero, enviar el idDestacamento
    idUnidadEjecutora: formData?.idInstitucionEjecutora, // id del ultimo nivel de la institucion seleccionado, ejemplo: para carabinero, enviar el idDestacamento

    idsDocumento: idsDocumentos ?? null, // documentos seleccionados o sino enviar null
    idsRelacionDelito: idsRelaciones, // en caso de ser ambito relacion, envio de idsRelacionDelito seleccioandos, codigo 5
    idsRelacionSujeto: idsIntervinientes ? [idsIntervinientes] : idsIntervinientes, // en caso de ser ambito sujeto, envio de idRelacionSujeto del sujeto seleccioando, codigo 14
    idAmbitoCausa: null, // en caso de ser ambito causa, envio de idCausa de la causa, codigo 15
    plazoDias: formData?.plazo
  }
  requestUtil({
    action: actividad_enviarSolicitud,
    payload: {
      solicitud: data
    },
    reject: (r) => {
      console.log('reject: ', r)
      if (r.mensaje.includes('El folio esta cerrado')) {
        toastError('El folio esta cerrado, no se pueden emitir instrucciones.')
      } else toastError('Ocurrió un error inesperado')
    },
    resolve: (r) => {
      toastSuccess('Diligencia Sugerida Agregada con Éxito')
      dialogRef.value.close(r)
      window.scrollTo(0, 0)
      setTimeout(() => {
        getDataTableDiligenciasAutonomasOInstruidas()
      }, 2000)
    }
  })
}

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
    reject: () => {
      toastError('Ocurrió un error inesperado')
    }
  })
}

function handleSeleccionarArchivo () {
  launchDialog({
    component: ModalAgregarDocumento,
    header: 'Agregar documento o archivo',
    width: '70%',
    confirmLabel: 'Guardar Documento',
    confirmIcon: 'pi pi-save',
    accept: (data) => {
      guardarDocumento(data)
    }
  })
}

function guardarDocumento (data) {
  data.idDenuncia = procesoPam.value.idDenuncia
  data.version = ''
  requestUtil({
    action: documento_addDocumento,
    payload: data,
    resolve: () => {
      toastSuccess('Documento Adjuntado')
      getDocumentos()
    }
  })
}

function getDocumentos () {
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: { idDenuncia: procesoPam.value.idDenuncia },
    resolve: () => {}
  })
}

function cerrarDialog () {
  dialogRef.value.close()
}

function previousStep () {
  currentStep.value--
}

function nextStep () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  currentStep.value++
}
</script>
