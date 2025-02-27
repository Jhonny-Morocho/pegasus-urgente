<template>
<section>
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
      v-if="currentStep===1"
      id="datos-institucion"
    >
      <AppFieldset legend="Información Diligencia">
        <InformacionDiligencia
          v-model="formData"
          :ambito-diligencia-options="ambitosDiligencia"
          :justificacion-diligencia-options="justificaciones"
          :subtipo-diligencia-options="subsubTiposActividad"
          :tipo-diligencia-options="subtiposActividad"
          @get-subtipo-options="getSubtipoOptions"
          @get-tabla-ambito="getTablaAmbito"
        />
        <AppFieldset
          v-if="showFieldsetAmbito"
          class="col-12"
          :legend="`Lista de ${nombreAmbito}`"
        >
          <TablaSujetosDiligencia
            v-if="isTabla('Sujeto')"
            v-model:selection="dataTablaAmbitoSeleccionados"
            class="col-12"
            :value="dataTablaAmbito"
          />
          <TablaEspeciesDiligencia
            v-if="isTabla('Especie-Dinero')"
            v-model:selection="dataTablaAmbitoSeleccionados"
            class="col-12"
            :value="dataTablaAmbito"
          />
          <TablaRelacionesDiligencia
            v-if="isTabla('Relación')"
            v-model:selection="dataTablaAmbitoSeleccionados"
            class="col-12"
            :value="dataTablaAmbito"
          />
        </AppFieldset>
      </AppFieldset>
      <AppFieldset legend="Información de la Institución Ejecutora">
        <InformacionInstitucion
          v-model="formData"
          :comisaria-options="comisarias"
          :destacamento-options="destacamentos"
          has-btn-carga-institucion
          :institucion-options="instituciones"
          :plazos-options="plazosDiligencia"
          :prefectura-options="prefecturas"
          @get-comisaria-options="getComisariaOptions"
          @get-destacamento-options="getDestacamentoOptions"
          @ver-carga-institucion="verCargaInstitucion"
          @ver-direccion="verDireccion"
        />
      </AppFieldset>
    </section>
    <section
      v-if="currentStep===2"
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
      v-if="currentStep===3"
      id="quien-solicita"
    >
      <h4 class="ml-2">
        ¿Desea derivar la Materialización al Equipo Jurídico?
      </h4>
      <AppSelectButton
        id="deriva-materializacion"
        v-model="formData.derivarEquipoJuridico"
        class="col-12 md:col-4 lg:col-3 mb-5"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
        @change="clearMaterializacion"
      />
      <AppFieldset
        v-if="formData.derivarEquipoJuridico !== null"
        :legend="formData.derivarEquipoJuridico ?
          'Materializa Equipo Jurídico' : 'Materializa Fiscal'"
      >
        <section
          v-if="formData.derivarEquipoJuridico"
          class="grid col-12"
        >
          <AppTextarea
            id="instrucciones-especificas"
            v-model="formData.instruccionesEquipoJuridico"
            :auto-resize="true"
            class="col-12"
            label="Instrucciones Específicas"
            rows="6"
            :rules="{required}"
          />
          <h4 class="col-12">
            ¿Desea Revisar Escrito?
          </h4>
          <AppSelectButton
            id="revisa-escrito"
            v-model="formData.revisarEscrito"
            class="col-12 md:col-4 lg:col-3"
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false }
            ]"
          />
        </section>
        <section
          v-else
          class="grid col-12"
        >
          <AppDropdown
            id="plantilla"
            v-model="formData.idPlantilla"
            class="col-4"
            label="Plantilla"
            option-label="descripcion"
            option-value="id"
            :options="plantillasDiligencia"
            @change="getPlantillaInstruccion"
          />
          <Editor
            id="editor-instrucciones-especificas"
            v-model="formData.materializacionTextoFiscal"
            class="col-12"
            editor-style="height: 256px"
          />
        </section>
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
          v-if="currentStep===steps.length"
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
import { reactive, ref, computed, inject, onMounted } from 'vue'
import { useAppDialog, useAppToast, useFormValidation } from '@/modules/common/composables'
import StepsByIndex from '@/modules/global/components/utilities/StepsByIndex.vue'
import InformacionDiligencia from '@/modules/global/components/diligencias/InformacionDiligencia.vue'
import TablaSujetosDiligencia from '@/modules/global/components/diligencias/TablaSujetosDiligencia.vue'
import TablaEspeciesDiligencia from '@/modules/global/components/diligencias/TablaEspeciesDiligencia.vue'
import TablaRelacionesDiligencia from '@/modules/global/components/diligencias/TablaRelacionesDiligencia.vue'
import TablaDocumentosDiligencia from '@/modules/global/components/diligencias/TablaDocumentosDiligencia.vue'
import InformacionInstitucion from '@/modules/global/components/diligencias/InformacionInstitucion.vue'
import { requestUtil } from '@/utils/request.util.js'
import { useMantenedorStore } from '@/modules/global/composables/useMantenedorStore.js'
import { useDiligenciaStore } from '@/modules/global/composables/useDiligenciaStore.js'
import { useSujetosIntervinientesStore } from '@/modules/global/composables/useSujetosIntervinientesStore.js'
import { useEspeciesDineroStore } from '@/modules/global/composables/useEspeciesDineroStore.js'
import { useRelacionesStore } from '@/modules/global/composables/useRelacionesStore.js'
import ModalCargaInstitucionEjecutora from '@/modules/dirigir-investigacion/components/modals/ModalCargaInstitucionEjecutora.vue'

const dialogRef = inject('dialogRef')

const props = reactive({
  ...dialogRef.value?.data
})

const { toastError, TOAST_MESSAGES } = useAppToast()
const { launchDialog } = useAppDialog()

const {
  ambitosDiligencia,
  subtiposActividad,
  subsubTiposActividad,
  justificaciones,
  instituciones,
  prefecturas,
  comisarias,
  destacamentos,
  plazosDiligencia,
  plantillasDiligencia,
  mantenedor_getAmbitosDiligencia,
  mantenedor_getTiposDiligencias,
  mantenedor_getSubTiposDiligenciasByIdTipo,
  mantenedor_getNombreAmbitoDiligencia,
  mantenedor_getJustificaciones,
  mantenedor_getInstituciones,
  mantenedor_getPrefecturas,
  mantenedor_getComisariasByIdPrefectura,
  mantenedor_getDestacamentosByIdComisaria,
  mantenedor_getPlazosDiligencia,
  mantenedor_getPlantillasDiligencia,
  mantenedor_RESET_SUB_SUBTIPOS_ACTIVIDAD
} = useMantenedorStore()

const { diligencia_getEscritoMaterializacionDiligencia } = useDiligenciaStore()
const { sujetosIntervinientes_getSujetosEnCausa } = useSujetosIntervinientesStore()
const { especiesDinero_getEspeciesEnCausa } = useEspeciesDineroStore()
const { relaciones_getRelacionesEnCausa } = useRelacionesStore()

const formData = reactive({
  // info diligencia
//   idDiligencia: appUtil.cadenaAleatoria(32),
  idTipoDiligencia: null,
  idSubtipoDiligencia: null,
  idJustificacionDiligencia: null,
  idAmbito: null,
  observacionDiligencia: null,
  otro: null,
  // info institucion ejecutora
  institucionEjecutoraPrimaria: null,
  institucionEjecutoraSecundaria: null,
  idPrefectura: null,
  idComisaria: null,
  idDestacamentoUnidadPolicia: null,
  plazoEntrega: null,
  // quien materializa solicitud
  derivarEquipoJuridico: null,
  materializacionTextoFiscal: '',
  instruccionesEquipoJuridico: '',
  revisarEscrito: null,
  idPlantilla: null
})

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'form-diligencia'
})

async function getDataMantenedor () {
  requestUtil({ action: mantenedor_getAmbitosDiligencia })
  requestUtil({ action: mantenedor_getTiposDiligencias })
  requestUtil({ action: mantenedor_getJustificaciones })
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getPrefecturas })
  requestUtil({ action: mantenedor_getPlazosDiligencia })
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
}

onMounted(async () => {
  getDataMantenedor()
})

const dataTablaAmbito = ref([])
const dataTablaAmbitoSeleccionados = ref([])

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
  return mantenedor_getNombreAmbitoDiligencia(formData.idAmbito)
})

function isTabla (nombreTabla) {
  return nombreAmbito.value === nombreTabla
}

const showFieldsetAmbito = computed(() => {
  return isTabla('Sujeto') ||
         isTabla('Especie-Dinero') ||
         isTabla('Relación')
})

async function getSubtipoOptions (idTipoDiligencia) {
  requestUtil({
    action: mantenedor_getSubTiposDiligenciasByIdTipo,
    payload: {
      idTipoDiligencia: idTipoDiligencia
    }
  })
}

async function getTablaAmbito () {
  dataTablaAmbito.value = []
  dataTablaAmbitoSeleccionados.value = []
  if (isTabla('Sujeto')) {
    getSujetos()
  }
  if (isTabla('Especie-Dinero')) {
    getEspecies()
  }
  if (isTabla('Relación')) {
    getRelaciones()
  }
}

async function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosEnCausa,
    payload: {
      idGlobal: props.ruc
    },
    resolve: ({ data }) => {
      dataTablaAmbito.value = data
    }
  })
}
async function getEspecies () {
  requestUtil({
    action: especiesDinero_getEspeciesEnCausa,
    payload: {
      ruc: props.ruc
    },
    resolve: ({ data }) => {
      dataTablaAmbito.value = data
    }
  })
}
async function getRelaciones () {
  requestUtil({
    action: relaciones_getRelacionesEnCausa,
    payload: {
      ruc: props.ruc
    },
    resolve: ({ data }) => {
      dataTablaAmbito.value = data
    }
  })
}

async function getComisariaOptions (idPrefectura) {
  requestUtil({
    action: mantenedor_getComisariasByIdPrefectura,
    payload: {
      idPrefectura: idPrefectura
    }
  })
}

async function getDestacamentoOptions (idComisaria) {
  requestUtil({
    action: mantenedor_getDestacamentosByIdComisaria,
    payload: {
      idComisaria: idComisaria
    }
  })
}

async function getPlantillaInstruccion () {
  requestUtil({
    action: diligencia_getEscritoMaterializacionDiligencia,
    payload: {
      ruc: props.ruc,
      idPlantilla: formData.idPlantilla
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

function verCargaInstitucion () {
  launchDialog({
    component: ModalCargaInstitucionEjecutora,
    header: 'Ver Carga Institución Ejecutora',
    cancelLabel: 'Cerrar',
    cancelIcon: '',
    width: '70%'
  })
}

function verDocumento () {
// POR HACER CUANDO HAYA DATA
}

function verDireccion () {
// POR HACER CUANDO HAYA DATA
}

function generateContract (data) {
  const intervinientes = isTabla('Sujeto') ? dataTablaAmbitoSeleccionados.value : []
  const relaciones = isTabla('Relación') ? dataTablaAmbitoSeleccionados.value : []
  const especiesDinero = isTabla('Especie-Dinero') ? dataTablaAmbitoSeleccionados.value : []
  const documentos = dataTablaDocumentosSeleccionados.value

  const idsIntervinientes = intervinientes.map((i) => i.idPersona)
  const idsRelaciones = relaciones.map((r) => r.idCodigoRelacion)
  const idsEspeciesDinero = especiesDinero.map((e) => e.idEspecie)

  if (data.institucionEjecutoraSecundaria) {
    return {
      ...data,
      intervinientes: idsIntervinientes,
      relaciones: idsRelaciones,
      especiesDinero: idsEspeciesDinero,
      documentos,
      institucionesEjecutoras: [
        {
          id: data.institucionEjecutoraPrimaria,
          plazoEntrega: parseInt(data.plazoEntrega)
        },
        {
          id: data.institucionEjecutoraSecundaria,
          plazoEntrega: parseInt(data.plazoEntrega),
          idPrefectura: data.idPrefectura,
          idComisaria: data.idComisaria,
          idDestacamentoUnidadPolicia: data.idDestacamentoUnidadPolicia
        }
      ]
    }
  } else {
    return {
      ...data,
      intervinientes: idsIntervinientes,
      relaciones: idsRelaciones,
      especiesDinero: idsEspeciesDinero,
      documentos,
      institucionesEjecutoras: [
        {
          id: data.institucionEjecutoraPrimaria,
          plazoEntrega: parseInt(data.plazoEntrega),
          idPrefectura: data.idPrefectura,
          idComisaria: data.idComisaria,
          idDestacamentoUnidadPolicia: data.idDestacamentoUnidadPolicia
        }
      ]
    }
  }
}

function instruirDiligencia () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const payload = generateContract(formData)
  dialogRef.value.close(payload)
}

function clearMaterializacion () {
  formData.instruccionesEspecificas = null
  formData.idPlantilla = null
}

function cerrarDialog () {
  mantenedor_RESET_SUB_SUBTIPOS_ACTIVIDAD()
  dialogRef.value.close()
}
</script>
