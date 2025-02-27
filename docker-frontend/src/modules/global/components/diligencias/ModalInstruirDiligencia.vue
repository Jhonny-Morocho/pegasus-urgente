<template>
<hr>
<section
  v-if="props.isSugerida"
  class="px-4 py-3 w-full"
>
  <ul class="list-none flex flex-column px-0 gap-3">
    <li>
      <strong>Tipo Diligencia: </strong>
      {{ props.descripcionSubtipoActividad }}
    </li>
    <li v-if="props.descripcionSubSubtipoActividad">
      <strong>Subtipo Diligencia: </strong>
      {{ props.descripcionSubSubtipoActividad }}
    </li>
  </ul>
</section>
<section class="px-4">
  <StepsByIndex
    class="mb-3"
    :current-step="currentStep"
    :model="steps"
  />
  <AppForm
    id="instruir-diligencia"
    :form-submitted="formSubmitted"
    validation-scope="form-diligencia"
  >
    <section
      v-if="currentStep === 1"
      id="datos-institucion"
    >
      <AppFieldset legend="Información Diligencia">
        <InformacionDiligencia
          class="col-12"
          :id-proceso="props.proceso.id"
          :is-sugerida="props.isSugerida"
          @get-data-tabla-ambito="getDataTablaAmbito"
        />
        <AppFieldset
          v-if="showFieldsetAmbito"
          class="col-12"
          :legend="`Lista de ${nombreAmbito}`"
        >
          <TablaSujetosDiligencia
            v-if="isTabla('Sujeto')"
            v-model:selection="dataTablaAmbito.selected"
            class="col-12"
            :loading="dataTablaAmbito.isLoading"
            :value="dataTablaAmbito.data"
          />
          <TablaRelacionesDiligencia
            v-if="isTabla('Relación')"
            v-model:selection="dataTablaAmbito.selected"
            class="col-12"
            :loading="dataTablaAmbito.isLoading"
            :value="dataTablaAmbito.data"
          />
        </AppFieldset>
        <section class="w-full grid">
          <div
            v-if="atributos.hasReservada"
            class="col-4 mb-4 flex flex-column gap-2"
          >
            <h4 class="ml-2 w-full">
              ¿Es Reservada?
            </h4>
            <AppSelectButton
              id="es-reservada"
              v-model="formData.esReservada"
              class="w-full"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
            />
          </div>
          <div
            v-if="atributos.hasUrgente"
            class="col-4 mb-4 flex flex-column gap-2"
          >
            <h4 class="ml-2 w-full">
              ¿Es Urgente?
            </h4>
            <AppSelectButton
              id="es-urgente"
              v-model="formData.esUrgente"
              class="w-full"
              option-label="name"
              option-value="value"
              :options="[
                { name: 'Si', value: true },
                { name: 'No', value: false }
              ]"
            />
          </div>
        </section>
      </AppFieldset>
      <AppFieldset legend="Información de la Institución Ejecutora">
        <InformacionInstitucion
          @ver-carga-institucion="openModalCargaInstitucion"
          @ver-direccion="openModalVerDireccion"
        />
      </AppFieldset>
    </section>
    <section
      v-if="currentStep === 2"
      id="material-apoyo"
    >
      <AppFieldset legend="Lista Documentos y Archivos">
        <TablaDocumentosDiligencia
          v-model:selection="dataTablaDocumentosSeleccionados"
          class="col-12"
          :value="dataTablaDocumentos"
          @documento:ver="verDocumento"
        />
      </AppFieldset>
    </section>
    <section
      v-if="currentStep === 3"
      id="quien-solicita"
    >
      <h4 class="ml-2">
        ¿Desea derivar la Materialización al Equipo Jurídico?
      </h4>
      <AppSelectButton
        id="deriva-materializacion"
        v-model="formData.seDerivaEquipoJuridico"
        class="col-12 md:col-4 lg:col-3 mb-5"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
        :rules="{ required }"
        @change="clearMaterializacion"
      />
      <AppFieldset
        v-if="formData.seDerivaEquipoJuridico !== null"
        :legend="`Materializa ${formData.seDerivaEquipoJuridico ? 'Equipo Jurídico' : 'Fiscal'}`"
      >
        <MaterializaEquipoJuridico v-if="formData.seDerivaEquipoJuridico" />
        <MaterializaFiscal v-else />
      </AppFieldset>
    </section>
    <footer class="grid">
      <div class="col-6 flex">
        <Button
          v-if="currentStep > 1"
          class="w-3 p-button-outlined"
          icon="pi pi-arrow-left"
          icon-pos="left"
          label="Volver"
          @click="previousStep"
        />
      </div>
      <div class="col-6 flex justify-content-end">
        <Button
          class="w-2 mr-4 p-button-text"
          icon="pi pi-times"
          icon-pos="right"
          label="Cancelar"
          @click="cerrarDialog"
        />
        <Button
          v-if="currentStep < steps.length"
          class="w-4 ml-2"
          icon="pi pi-arrow-right"
          icon-pos="right"
          label="Continuar"
          @click="nextStep"
        />
        <Button
          v-if="currentStep === steps.length"
          class="w-4 ml-2"
          icon="pi pi-send"
          icon-pos="right"
          label="Instruir Diligencia"
          @click="instruirDiligencia"
        />
      </div>
    </footer>
  </AppForm>
</section>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { reactive, ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useFormValidation, useAppGlobalProperties, useDynamicDialog } from '@/modules/common/composables'
import {
  useDiligenciaStore,
  useInstruirDiligencia,
  useMantenedorStore,
  useRelacionesStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import StepsByIndex from '@/modules/global/components/utilities/StepsByIndex.vue'
import InformacionDiligencia from '@/modules/global/components/diligencias/InformacionDiligencia.vue'
import TablaSujetosDiligencia from '@/modules/global/components/diligencias/TablaSujetosDiligencia.vue'
import TablaRelacionesDiligencia from '@/modules/global/components/diligencias/TablaRelacionesDiligencia.vue'
import TablaDocumentosDiligencia from '@/modules/global/components/diligencias/TablaDocumentosDiligencia.vue'
import InformacionInstitucion from '@/modules/global/components/diligencias/InformacionInstitucion.vue'
import MaterializaEquipoJuridico from '@/modules/global/components/diligencias/MaterializaEquipoJuridico.vue'
import MaterializaFiscal from '@/modules/global/components/diligencias/MaterializaFiscal.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import ModalVerDireccionInstitucion from './ModalVerDireccionInstitucion.vue'
import ModalCargaInstitucionEjecutora from './ModalCargaInstitucionEjecutora.vue'

const dialogRef = inject('dialogRef')

const { launchDynamicDialog } = useDynamicDialog()

const props = reactive({
  // VERBOSO PERO SE ENTIENDE MEJOR CUALES PROPS RECIBE (LA CULPA ES DE DYNAMICDIALOG)
  isSugerida: dialogRef.value?.data?.isSugerida,
  ruc: dialogRef.value?.data?.ruc,
  idDenuncia: dialogRef.value?.data?.idDenuncia,
  idCausa: dialogRef.value?.data?.idCausa,
  proceso: dialogRef.value?.data?.proceso,
  idTipoActividad: dialogRef.value?.data?.idTipoActividad,
  idTipoOrigenActividad: dialogRef.value?.data?.idTipoOrigenActividad,
  descripcionSubtipoActividad: dialogRef.value?.data?.descripcionSubtipoActividad,
  descripcionSubSubtipoActividad: dialogRef.value?.data?.descripcionSubSubtipoActividad
})

const { toastError, TOAST_MESSAGES } = useAppToast()
const { $userFiscaliaActual } = useAppGlobalProperties()

const {
  mantenedor_getAmbitosDiligencia,
  mantenedor_getJustificaciones,
  mantenedor_getInstituciones,
  mantenedor_getPrefecturas,
  mantenedor_getPlazosDiligencia,
  mantenedor_getPlantillasDiligencia,
  mantenedor_RESET_SUB_SUBTIPOS_ACTIVIDAD,
  mantenedor_getNombreTipoDiligencia,
  mantenedor_getNombreSubtipoDiligencia,
  mantenedor_getEstadosDiligencia,
  mantenedor_getFiscalias
} = useMantenedorStore()

const { diligencia_getEscritoMaterializacionDiligencia } = useDiligenciaStore()
const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()
const { relaciones_getRelaciones } = useRelacionesStore()

const { formData, atributos, resetAtributosList } = useInstruirDiligencia()

const { formSubmitted, isFormValid, resetFormData, required } = useFormValidation({
  formData,
  validationScope: 'form-diligencia'
})

const dataTablaAmbito = reactive({
  data: [],
  first: 0,
  paginacion: null,
  isLoading: false,
  selected: []
})

const dataTablaDocumentos = ref([])
const dataTablaDocumentosSeleccionados = ref([])

const currentStep = ref(1)

const steps = ref([
  {
    label: 'Datos de la Institución Ejecutora',
    key: 1
  },
  {
    label: 'Material de Apoyo',
    key: 2
  },
  {
    label: 'Quien Materializa la Solicitud',
    key: 3
  }
])

const nombreAmbito = computed(() => {
  switch (formData.codigoAtributo) {
    case '5':
      return 'Relación'
    case '14':
      return 'Sujeto'
    case '15':
      return 'Causa'
    default:
      return null
  }
})

function isTabla (nombreTabla) {
  return nombreAmbito.value === nombreTabla
}

const showFieldsetAmbito = computed(() => {
  return isTabla('Sujeto') || isTabla('Relación')
})

const idCausa = computed(() => props?.idCausa)
const idTipoActividad = computed(() => props?.idTipoActividad)
const idTipoOrigenActividad = computed(() => props?.idTipoOrigenActividad)
const idFiscalia = ref('')

async function getDataTablaAmbito () {
  dataTablaAmbito.data = []
  dataTablaAmbito.selected = []
  dataTablaAmbito.paginacion = null
  dataTablaAmbito.first = 0

  if (isTabla('Sujeto')) {
    getSujetos()
  }
  if (isTabla('Relación')) {
    getRelaciones()
  }
}

async function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: props?.idDenuncia },
    loader: (loadingState) => { dataTablaAmbito.isLoading = loadingState },
    resolve: ({ data, paginacion }) => {
      dataTablaAmbito.data = data
      dataTablaAmbito.paginacion = paginacion
    }
  })
}

async function getRelaciones () {
  requestUtil({
    action: relaciones_getRelaciones,
    payload: { idDenuncia: props?.idDenuncia },
    loader: (loadingState) => { dataTablaAmbito.isLoading = loadingState },
    resolve: ({ data }) => {
      dataTablaAmbito.data = data
    }
  })
}

async function getPlantillaInstruccion (idPlantilla) {
  requestUtil({
    action: diligencia_getEscritoMaterializacionDiligencia,
    payload: {
      ruc: props?.ruc,
      idPlantilla
    },
    resolve: ({ data }) => {
      formData.materializacionTextoFiscal = data.texto
    }
  })
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

function verDocumento () {
  // POR HACER CUANDO HAYA DATA
}

function generateContract (data) {
  const dataTabla = dataTablaAmbito.selected

  const idInterviniente = isTabla('Sujeto') ? dataTabla?.idPersona : null
  const idsRelaciones = isTabla('Relación') ? dataTabla.map((r) => r?.idRelacionDelito) : []
  const idsDocumentos = dataTablaDocumentosSeleccionados.value.map((d) => d?.idDocumento)

  const contract = {
    ...data,
    idOrigenActividad: idCausa.value, // envio del idCausa
    idTipoOrigenActividad: idTipoOrigenActividad.value, // llamar al mantenedor /actividad/tipo-origen/1, envio del id del tipo origen CAUSA
    idTipoActividad: idTipoActividad.value, // el id al dato del mantenedor /actividad/tipo?codigo=26
    idSubtipoActividad: data.tipoDiligencia?.id, // el idSubtipo seleccionado
    idSubSubtipoActividad: data.subtipoDiligencia?.id, //  el idSubSubtipo seleccionado
    idUnidadOrigen: idFiscalia.value, // valor idFiscalia
    idUnidadDestino: data?.idDestacamento || data?.idInstitucionEjecutora, // id del ultimo nivel de la institucion seleccionado, ejemplo: para carabinero, enviar el idDestacamento
    idUnidadEjecutora: data?.idInstitucionEjecutora, // id del ultimo nivel de la institucion seleccionado, ejemplo: para carabinero, enviar el idDestacamento
    idFiscalia: idFiscalia.value, // valor idFiscalia
    idsDocumento: idsDocumentos, // documentos seleccionados o sino enviar null
    idsRelacionDelito: idsRelaciones, // en caso de ser ambito relacion, envio de idsRelacionDelito seleccioandos, codigo 5
    idRelacionSujeto: idInterviniente, // en caso de ser ambito sujeto, envio de idRelacionSujeto del sujeto seleccioando, codigo 14
    idsRelacionSujeto: [idInterviniente], // en caso de ser ambito sujeto, envio de idRelacionSujeto del sujeto seleccioando, codigo 14
    idAmbitoCausa: atributos.isAmbitoCausa ? idCausa.value : null, // en caso de ser ambito causa, envio de idCausa de la causa, codigo 15
    tipoDiligencia: undefined, // dato de paso en v-model no va en contrato
    subtipoDiligencia: undefined, // dato de paso en v-model no va en contrato
    idInstitucionEjecutora: undefined, // dato de paso en v-model no va en contrato
    idPrefectura: undefined, // dato de paso en v-model no va en contrato
    idComisaria: undefined, // dato de paso en v-model no va en contrato
    idDestacamento: undefined, // dato de paso en v-model no va en contrato
    codigoAtributo: undefined // dato de paso en v-model no va en contrato
  }

  return contract
}

function instruirDiligencia () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const payload = generateContract(formData)

  dialogRef.value.close(payload)
}

function openModalVerDireccion (idDestacamento) {
  launchDynamicDialog({
    component: ModalVerDireccionInstitucion,
    header: 'Dirección Institución',
    width: '70%',
    data: {
      idOrganismoColaborador: idDestacamento
    }
  })
}

function openModalCargaInstitucion (idInstitucionEjecutora) {
  launchDynamicDialog({
    component: ModalCargaInstitucionEjecutora,
    header: 'Ver Carga Institución Ejecutora',
    width: '80%',
    data: {
      idInstitucionEjecutora: idInstitucionEjecutora
    }
  })
}

function clearMaterializacion () {
  formData.instruccionFiscal = null
  formData.textoHito = null
  formData.idPlantilla = null
}

function cerrarDialog () {
  mantenedor_RESET_SUB_SUBTIPOS_ACTIVIDAD()
  dialogRef.value.close()
}

function nombreTipoDiligencia (idTipoDiligencia) {
  return mantenedor_getNombreTipoDiligencia(idTipoDiligencia)
}
function nombreSubTipoDiligencia (idSubTipoDiligencia) {
  return mantenedor_getNombreSubtipoDiligencia(idSubTipoDiligencia)
}

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getAmbitosDiligencia })
  requestUtil({ action: mantenedor_getJustificaciones })
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getPrefecturas })
  requestUtil({ action: mantenedor_getPlazosDiligencia })
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
  requestUtil({ action: mantenedor_getEstadosDiligencia })
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

onMounted(async () => {
  getDataMantenedor()
  getFiscalia()
})

onBeforeUnmount(() => {
  resetFormData()
  resetAtributosList()
})

</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

li {
  font-size: 1.2rem;
}
</style>
