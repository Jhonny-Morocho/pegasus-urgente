<template>
<section>
  <AppForm
    id="preparar-acusacion-escrito-form"
    :form-submitted="formSubmitted"
    validation-scope="preparar-acusacion-escrito-form"
  >
    <div class="col-12 mt-4">
      <h4>¿Desea derivar la Materialización al Equipo Jurídico?</h4>
      <div class="col-12 md:col-4 grid mt-2">
        <AppSelectButton
          id="adjuntar-carpeta-radio"
          v-model="formData.derivaMaterializacionEquipoJuridico"
          class="w-full p-fluid"
          option-label="descripcion"
          option-value="value"
          :options="derivaMaterializacionEquipoJuridicoOptions"
          :rules="{
            required
          }"
        />
      </div>
    </div>
    <AppFieldset
      class="w-full"
      :collapsed="formData.derivaMaterializacionEquipoJuridico === null"
      legend="Materializa Fiscal"
    >
      <p class="col-12 md:col-4">
        <span style="font-weight: bold">Fiscalía:</span>
        {{ resumenCausa?.nombreFiscaliaLocal }}
      </p>
      <p class="col-12 md:col-4">
        <span style="font-weight: bold">Fiscal Asignado:</span>
        {{ resumenCausa?.nombreFiscalAsignado }}
      </p>
      <div class="col-12 p-0 my-2">
        <AppDropdown
          id="medida-cautelar"
          v-model="formData.nombreTribunal"
          class="col-12 md:col-4"
          label="Tribunales"
          :options="['Tribunal-1', 'Tribunal-2', 'Tribunal-3']"
          :rules="{
            required
          }"
          show-clear
        />
        <EscritoMaterializaFiscal
          v-if="!formData.derivaMaterializacionEquipoJuridico"
          v-model="formData"
          :plantilla-diligencias-options="plantillasDiligencia"
          @get-plantilla-instruccion="getPlantilla"
        />
        <InstruccionEquipoJuridico
          v-else
          v-model="formData"
          has-revisa-escrito
          :unidad-policial-options="[]"
          @vista-previa-instruccion="vistaPrevia"
        />
      </div>
    </AppFieldset>
    <AppFieldset
      collapsed
      legend="¿Desea agregar un documento a la solicitud?"
      toggleable
    >
      <LoaderSkeleton
        v-if="tables.documentos.isLoading"
        height="220px"
      />
      <TablaDocumentos
        v-else
        v-model:first="tables.documentos.firstRecord"
        v-model:selection="formData.documentosSeleccionados"
        class="col-12"
        consultar-cierre
        :loading="tables.documentos.isLoading"
        :rows="paginacionDocumentos?.tamanoPagina"
        selectable
        :total-records="paginacionDocumentos?.elementosTotales"
        :value="documentos"
        @page="getDocumentos"
      />
      <div class="col-12 mt-4">
        <h4>¿Desea Adjuntar Carpeta Investigativa?</h4>
        <div class="col-12 md:col-4 grid mt-2">
          <AppSelectButton
            id="adjuntar-carpeta-radio"
            v-model="formData.adjuntaCarpeta"
            class="w-full"
            option-label="label"
            option-value="value"
            :options="[
              { label: 'Si', value: true },
              { label: 'No', value: false }
            ]"
          />
        </div>
      </div>
    </AppFieldset>
  </AppForm>
  <AppBtnNextTeleported
    :disabled="formData.derivaMaterializacionEquipoJuridico === null"
    label="Enviar Escrito"
    @click="openModalConfirmacion"
  />
</section>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { defineEmits, reactive, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useAppDialog, useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useDiligenciaStore, useDocumentoStore, useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import EscritoMaterializaFiscal from '@/modules/dirigir-investigacion/components/EscritoMaterializaFiscal.vue'
import TablaDocumentos from '@/modules/dirigir-investigacion/components/TablaDocumentos.vue'
import InstruccionEquipoJuridico from '@/modules/dirigir-investigacion/components/InstruccionEquipoJuridico.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { launchDialog } = useAppDialog()
const { toastError, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { plantillasDiligencia, mantenedor_getPlantillasDiligencia } = useMantenedorStore()
const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { relaciones, relaciones_getRelacionesEnCausa, paginacion: paginacionRelaciones } = useRelacionesStore()
const { documentos, documento_getDocumentosEnCausa, paginacion: paginacionDocumentos } = useDocumentoStore()
const { diligencia_getEscritoMaterializacionDiligencia } = useDiligenciaStore()

const emit = defineEmits(['next-step'])

const formData = reactive({
  derivaMaterializacionEquipoJuridico: null,
  nombreTribunal: '',
  idPlantilla: null,
  materializacionTextoFiscal: null,
  revisarEscrito: null,
  documentosSeleccionados: [],
  adjuntaCarpeta: false
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'preparar-acusacion-escrito-form'
})

const tables = reactive({
  relaciones: {
    firstRecord: 0,
    isLoading: false
  },
  documentos: {
    firstRecord: 0,
    isLoading: false
  }
})

const getRelaciones = async (pagination = undefined) => {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
  requestUtil({
    action: relaciones_getRelacionesEnCausa,
    payload: { ruc: ruc.value, params },
    loader: (l) => (tables.relaciones.isLoading = l)
  })
}

const getDocumentos = async (pagination = undefined) => {
  if (!pagination) {
    tables.documentos.firstRecord = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: documento_getDocumentosEnCausa,
    payload: { ruc: ruc.value, params }
  })
}

const getPlantilla = async (idPlantilla) => {
  requestUtil({
    action: diligencia_getEscritoMaterializacionDiligencia,
    payload: {
      ruc: ruc.value,
      idPlantilla
    },
    resolve: ({ data }) => {
      formData.materializacionTextoFiscal = data.texto
    }
  })
}

function openModalConfirmacion () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  launchConfirmDialog({
    header: 'Enviar Escrito',
    message: `¿Está seguro de Enviar el Escrito?`,
    acceptLabel: 'Enviar Escrito',
    accept: () => console.log('Relación Cerrada')
  })
}

const derivaMaterializacionEquipoJuridicoOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]

onMounted(async () => {
  getRelaciones()
  getDocumentos()
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
})
</script>
