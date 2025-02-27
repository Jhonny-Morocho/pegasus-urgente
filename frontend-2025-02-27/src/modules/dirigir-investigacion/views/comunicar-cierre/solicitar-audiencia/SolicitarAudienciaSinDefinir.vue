<template>
<section class="mt-3">
  <AppFieldset
    legend="Resumen Causa"
    toggleable
  >
    <ResumenCausa :causa="resumenCausa" />
  </AppFieldset>
  <AppFieldset
    legend="Relaciones"
    toggleable
  >
    <LoaderSkeleton
      v-if="tables.relaciones.isLoading"
      height="220px"
    />
    <TablaRelaciones
      v-else
      v-model:first="tables.relaciones.firstRecord"
      class="col-12"
      :loading="tables.relaciones.isLoading"
      :rows="paginacionRelaciones?.tamanoPagina"
      :total-records="paginacionRelaciones?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    >
      <template #URAVIT>
        <Column header="Derivado a URAVIT">
          <template #body>
            No
          </template>
        </Column>
      </template>
    </TablaRelaciones>
  </AppFieldset>
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
          :plantilla-diligencias-options="plantillasDiligencia"
          @get-plantilla-instruccion="getPlantilla"
        />
        <InstruccionEquipoJuridico
          v-else
          v-model="formData"
          has-revisa-escrito
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
import { reactive, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useDocumentoStore, useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import ResumenCausa from '@/modules/dirigir-investigacion/components/ResumenCausa.vue'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import TablaDocumentos from '@/modules/dirigir-investigacion/components/TablaDocumentos.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import EscritoMaterializaFiscal from '@/modules/dirigir-investigacion/components/EscritoMaterializaFiscal.vue'
import InstruccionEquipoJuridico from '@/modules/dirigir-investigacion/components/InstruccionEquipoJuridico.vue'
import { useRouter } from 'vue-router'

const { plantillasDiligencia, mantenedor_getPlantillasDiligencia } = useMantenedorStore()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess } = useAppToast()
const router = useRouter()

const { ruc, resumenCausa, idDenuncia } = useDirigirInvestigacionStore()
const { relaciones, relaciones_getRelaciones, paginacion: paginacionRelaciones } = useRelacionesStore()
const { documentos, paginacion: paginacionDocumentos, documento_getDocumentosByIdDenuncia } = useDocumentoStore()

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

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    tables.relaciones.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => { tables.relaciones.isLoading = l }
  })
}

async function getDocumentos (pagination = undefined) {
  if (!pagination) {
    tables.documentos.firstRecord = 0
  }
  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      ruc: ruc.value,
      idDenuncia: idDenuncia.value
    },
    loader: (l) => { tables.documentos.isLoading = l }
  })
}

const derivaMaterializacionEquipoJuridicoOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]

// Temporal
const getPlantilla = (id) => {
  const plantilla = plantillasDiligencia.value.find((plantilla) => plantilla.id === id)
  formData.materializacionTextoFiscal = plantilla.valor
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
onMounted(async () => {
  getRelaciones()
  getDocumentos()
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
})
</script>
