<template>
<section>
  <PageHeader
    class="mb-8"
    :items-menu-superior="itemsMenuSuperior"
    :page-description="`Nombre Causa: ${resumenCausa?.nombreCausa}`"
    :page-subtitle="`RUC: ${ruc}`"
    :page-title="pageTitle"
  />

  <AppForm
    id="revisar-respuesta-form"
    :form-submitted="formSubmitted"
    validation-scope="revisar-respuesta-form"
  >
    <AppFieldset
      legend="Relaciones"
      toggleable
    >
      <TablaRelaciones
        v-model:first="tables.relaciones.firstRecord"
        class="col-12"
        :loading="tables.relaciones.isLoading"
        :rows="paginacionRelaciones?.tamanoPagina"
        :total-records="paginacionRelaciones?.elementosTotales"
        :value="relaciones"
        @page="getRelaciones"
      />
    </AppFieldset>
    <AppFieldset
      class="w-full"
      legend="Resolución del Tribunal"
    >
      <div class="mb-2 col-12 grid">
        <div class="col-12 md:col-6">
          <p class="col-12 mb-4 p-0">
            <span style="font-weight: bold">Tribunal:</span>
            {{ mockEvaluarResultado?.Tribunal }}
          </p>
          <p class="col-12 p-0">
            <span style="font-weight: bold">Fecha de Respuesta:</span>
            {{ mockEvaluarResultado?.FechaRespuesta }}
          </p>
        </div>
      </div>
      <h3 class="col-12 font-medium">
        Texto de Resolución del PJUD
      </h3>
      <Editor
        id="editor-evaluar-resultado-cierre"
        v-model="mockEvaluarResultado.TextoResolucion"
        class="col-12 w-full"
        editor-style="height: 256px"
        readonly
      >
        <template #toolbar>
          <span class="p-0" />
        </template>
      </Editor>
    </AppFieldset>
    <div class="col-12 mt-4">
      <h4>¿Desea derivar la Materialización al Equipo Jurídico?</h4>
      <div class="col-12 md:col-4 grid mt-2">
        <AppSelectButton
          id="revisar-respuesta-select"
          v-model="formData.derivaMaterializacionEquipoJuridico"
          class="w-full p-fluid"
          option-label="descripcion"
          option-value="value"
          :options="derivaMaterializacionEquipoJuridicoOptions"
          :rules="{ required }"
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

  <AppBtnsSteps @back-step="$router.push({ name: 'BandejaDirigirInvestigacion' })" />

  <AppBtnRightTeleported>
    <Button
      class="p-button-outlined px-5"
      icon="pi pi-arrow-left"
      icon-pos="right"
      label="Volver a tomar decisión"
      @click="$router.push({ name: 'DIDefinirCursoCausa' })"
    />
  </AppBtnRightTeleported>
  <AppBtnNextTeleported
    class="mr-2"
    :disabled="formData.derivaMaterializacionEquipoJuridico === null"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Escrito"
    @click="handleBtnEnviarEscrito"
  />
</section>
</template>

<script setup>
/* eslint-disable */
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil } from '@/utils'
import { useAppDialog, useFormValidation, useAppToast } from '@/modules/common/composables'
import { useDirigirInvestigacionStore, useMenuSuperiorSecundario } from '@/modules/dirigir-investigacion/composables'
import PageHeader from '@/modules/common/components/PageHeader.vue'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import EscritoMaterializaFiscal from '@/modules/dirigir-investigacion/components/EscritoMaterializaFiscal.vue'
import TablaDocumentos from '@/modules/dirigir-investigacion/components/TablaDocumentos.vue'
import InstruccionEquipoJuridico from '@/modules/dirigir-investigacion/components/InstruccionEquipoJuridico.vue'

import { useDiligenciaStore, useDocumentoStore, useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'

const { launchDialog } = useAppDialog()
const router = useRouter()
const { toastSuccess } = useAppToast()
const { plantillasDiligencia, mantenedor_getPlantillasDiligencia } = useMantenedorStore()

const { ruc, resumenCausa } = useDirigirInvestigacionStore()
const { itemsMenuSuperior } = useMenuSuperiorSecundario({
  ruc: ruc.value || '20000001992-6' // por si acaso
})
const { relaciones, relaciones_getRelacionesEnCausa, paginacion: paginacionRelaciones } = useRelacionesStore()
const { documentos, documento_getDocumentosEnCausa, paginacion: paginacionDocumentos } = useDocumentoStore()
const { diligencia_getEscritoMaterializacionDiligencia } = useDiligenciaStore()

const pageTitle = computed(() => 'Revisar Respuesta PJUD por Solicitud Medidas Intrusivas y/o Cautelares')

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
  validationScope: 'revisar-respuesta-form'
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

const derivaMaterializacionEquipoJuridicoOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]

onMounted(async () => {
  getRelaciones()
  getDocumentos()
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
})

const mockEvaluarResultado = {
  Tribunal: '	Juzgado de Garantía de Casablanca',
  FechaRespuesta: '15-07-2022',
  TextoResolucion: `Santiago, 31 de marzo de 2020.
A lo principal y otro sí :

Como se pide, se fija Audiencia de Cierre de la Investigación para el día 15 de febrero de 2020, a las 10:50 horas, en este Tribunal      
ubicado en Juan Leiva Amor 147, Casablanca.

Cítese a todos los intervinientes a la referida audiencia. Notifíquese personalmente, facultándose realizar dicha notificación por el 
artículo 44, inciso 2° del Código de Procedimiento Penal, al imputado AUGUSTO FIORETTI JARA.
                
 Notifíquese a los intervinientes por correo electrónico.

 RUC: 2000001992-6

 RIT: 12345-6
                            
 Resolvió don GERMÁN GÓNZALEZ SILVA,
 Juez Titular del Juzgado de Garantía de Casablanca.`
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

function handleBtnEnviarEscrito() {
  if (isFormValid()) {
    toastSuccess('¡La consulta ha sido enviada con éxito!')
    setTimeout(() => {
      router.push({ name: 'BandejaDirigirInvestigacion' })
    }, 136)
  } else {
    console.log('No valido')
  }
}
</script>
