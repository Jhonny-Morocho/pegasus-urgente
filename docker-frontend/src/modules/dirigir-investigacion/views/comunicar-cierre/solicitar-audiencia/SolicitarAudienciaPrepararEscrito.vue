<template>
<section>
  <AppForm
    id="comunicar-cierre-escrito-form"
    :form-submitted="formSubmitted"
    validation-scope="comunicar-cierre-escrito-form"
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
          :plantilla-diligencias-options="plantillasOptions"
          @get-plantilla-instruccion="getPlantilla"
        />
        <InstruccionEquipoJuridico
          v-else
          v-model="formData"
          has-revisa-escrito
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
    @click="enviarEscrito"
  />
</section>
</template>
<script setup>
import { reactive, onMounted, inject, computed } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import EscritoMaterializaFiscal from '@/modules/dirigir-investigacion/components/EscritoMaterializaFiscal.vue'
import TablaDocumentos from '@/modules/dirigir-investigacion/components/TablaDocumentos.vue'
import InstruccionEquipoJuridico from '@/modules/dirigir-investigacion/components/InstruccionEquipoJuridico.vue'

import { useDocumentoStore, useMantenedorStore } from '@/modules/global/composables'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useRouter } from 'vue-router'

const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()
const router = useRouter()

const { plantillasDiligencia, mantenedor_getPlantillasDiligencia } = useMantenedorStore()

const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { documentos, documento_getDocumentosEnCausa, paginacion: paginacionDocumentos } = useDocumentoStore()

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
  validationScope: 'comunicar-cierre-escrito-form'
})

// Temporal
const accionTermino = inject('accionTermino')
const escritoEjemplo = computed(() => plantillasDiligencia.value[0].valor || '')
const plantillasOptions = computed(() => {
  return accionTermino.value === 'acusacion' || accionTermino.value === 'sustitucion' ? plantillas[0] : plantillas[1]
})
const getPlantilla = (id) => {
  const { descripcion } = plantillasOptions.value.find((plantilla) => plantilla.id === id)
  formData.materializacionTextoFiscal = `<h4>${descripcion}</h4>${escritoEjemplo.value}`
}

const enviarEscrito = () => {
  if (isFormValid()) {
    launchConfirmDialog({
      header: 'Enviar Escrito',
      message: '¿Está seguro de Enviar el Escrito?',
      acceptLabel: 'Enviar Escrito',
      accept: () => {
        setTimeout(() => {
          toastSuccess('¡La consulta ha sido enviada con éxito!')
          router.push({ name: 'BandejaDirigirInvestigacion' })
        }, 369)
      }
    })
  }
}

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

const derivaMaterializacionEquipoJuridicoOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]

onMounted(async () => {
  getDocumentos()
  requestUtil({
    action: mantenedor_getPlantillasDiligencia
  })
})

// Temporal
const plantillas = [
  [
    {
      descripcion: 'Acusar y solicitar audiencia de preparación de juicio oral (APJO)',
      id: '1'
    },
    {
      descripcion: 'Acusar y solicitar sustitución a procedimiento simplificado',
      id: '2'
    },
    {
      descripcion: 'Sustitución de un procedimiento simplificado',
      id: '3'
    },
    {
      descripcion: 'Solicitar juicio abreviado',
      id: '4'
    }
  ],
  [
    {
      descripcion: 'Solicitar audiencia No Perseverar',
      id: '5'
    },
    {
      descripcion: 'Solicitar audiencia Sobreseimiento Temporal',
      id: '6'
    },
    {
      descripcion: 'Solicitar audiencia Sobreseimiento Definitivo',
      id: '7'
    }
  ]
]
</script>
