<template>
<section class="col-12">
  <div class="col-4 mt-4">
    <h4>¿Desea derivar la Materialización al Equipo Jurídico?</h4>
    <div class="col-12 mt-2 p-fluid">
      <AppSelectButton
        id="adjuntar-carpeta-radio"
        v-model="formData.seDerivaEquipoJuridico"
        class="w-full"
        option-label="descripcion"
        option-value="value"
        :options="derivaMaterializacionEquipoJuridicoOptions"
        :rules="{ required }"
      />
    </div>
  </div>
  <AppFieldset
    class="col-12 p-fluid"
    :collapsed="formData.seDerivaEquipoJuridico === null"
    legend="Materializa Fiscal"
  >
    <p class="col-12 md:col-4">
      <span style="font-weight: bold">Fiscalía:</span>
      {{ fiscalia?.nombreFiscalia || 'No especificado' }}
    </p>
    <p class="col-12 md:col-4">
      <span style="font-weight: bold">Fiscal Asignado:</span>
      {{ fiscalia?.nombreAtendedor || 'No especificado' }}
    </p>
    <div class="col-12 p-0 my-2 grid">
      <AppDropdown
        id="medida-cautelar"
        v-model="formData.idTribunal"
        class="col-6 md:col-4"
        label="Tribunales"
        option-label="descripcion"
        option-value="id"
        :options="juzgados"
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        v-if="isSobreseimiento"
        id="motivos-sobreseimiento"
        v-model="formData.idMotivoSobreseimiento"
        class="col-6 md:col-4"
        label="Motivo de Sobreseimiento"
        option-label="value"
        option-value="value"
        :options="motivoSobreseimientoOpciones"
        placeholder
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        v-if="isReactivarCausa"
        id="reactivar-causa"
        v-model="formData.idMotivoReapertura"
        class="col-6 md:col-4"
        label="Motivo de Reapertura"
        option-label="value"
        option-value="id"
        :options="motivoReaperturaOpciones"
        placeholder
        show-clear
      />
      <EscritoMaterializaFiscal
        v-if="!formData.seDerivaEquipoJuridico"
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
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
      <InputText
        id="filter-text"
        v-model="inputFiltro"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
      />
    </div>
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
      :rows="paginacion?.tamanoPagina"
      selectable
      :total-records="paginacion?.elementosTotales"
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
</section>
</template>

<script setup>
import EscritoMaterializaFiscal from '@/modules/termino-postermino/components/comunicar-cierre-options/EscritoMaterializaFiscal.vue'
import TablaDocumentos from '@/modules/dirigir-investigacion/components/TablaDocumentos.vue'
import InstruccionEquipoJuridico from '@/modules/termino-postermino/components/comunicar-cierre-options/InstruccionEquipoJuridico.vue'
import AppSelectButton from '@/modules/common/components/AppSelectButton.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import { useDocumentoStore, useMantenedorStore } from '@/modules/global/composables'
import { reactive, onMounted, ref, defineProps, watch } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { requestUtil } from '@/utils'
import { useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'
import { useTermino } from '../composables'

const {
  ruc
} = useTermino()

const props = defineProps({
  modelValue: propTypes.object,
  fiscalia: propTypes.object,
  isSobreseimiento: {
    type: Boolean,
    default: false
  },
  isReactivarCausa: {
    type: Boolean,
    default: false
  }
})

const formData = ref(props.modelValue)

const { required } = useFormValidation()

const { tramitarAudiencia_SET_DOCS } = useTramitarAudiencia()

watch(() => formData.value.documentosSeleccionados,
  () => {
    requestUtil({
      action: tramitarAudiencia_SET_DOCS,
      payload: formData.value.documentosSeleccionados
    })
  })

const { plantillasDiligencia, mantenedor_getPlantillasDiligencia, mantenedor_getjuzgados, juzgados } = useMantenedorStore()

const derivaMaterializacionEquipoJuridicoOptions = [
  { value: true, descripcion: 'Si' },
  { value: false, descripcion: 'No' }
]

const tables = reactive({
  documentos: {
    firstRecord: 0,
    isLoading: false
  }
})

const inputFiltro = ref('')

const {
  documentos,
  paginacion,
  documento_getDocumentosByCatalogoCDD
} = useDocumentoStore()

function getDocumentos (pagination = undefined) {
  console.log(ruc.value)
  requestUtil({
    action: documento_getDocumentosByCatalogoCDD,
    payload: {
      payload: { nombreCatalogo: ruc.value },
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10
      }
    }
  })
}

const getPlantilla = (id) => {
  const plantilla = plantillasDiligencia.value.find((plantilla) => plantilla.id === id)
  console.log({ plantilla })
  formData.value.textoFiscal = plantilla.valor
}

// === Tribunales === //

// === Sobreseimiento === //

const motivoSobreseimientoOpciones = ref([
  {
    id: 1,
    value: 'Sobreseimiento Temporal por Enajenación Art. 465'
  },
  {
    id: 2,
    value: 'Suspensión Art. 458'
  }
])

async function getMotivosSobreseimiento () {
  if (!props.isSobreseimiento) {
    return
  }
  console.log('getMotivosSobreseimiento')
  // requestUtil({
  //   action: 'getTribunales',
  //   payload: {
  //     // idTermino ?
  //   },
  //   resolve: (response) => {
  //     // generatePlantillaDeclaracionTermino(response)
  //   }
  // })
}

// === Reapertura Causa === //

const motivoReaperturaOpciones = ref([
  {
    id: 1,
    value: 'Sobreseimiento Temporal por Enajenación Art. 465'
  },
  {
    id: 2,
    value: 'Suspensión Art. 458'
  },
  {
    id: 3,
    value: 'Sobreseimiento Temporal por  Causa Prejudicial Civil'
  }
])

async function getMotivosReapertura () {
  if (!formData.value.idMotivoReapertura) {
    return
  }
  console.log('getMotivosReapertura')
  // requestUtil({
  //   action: 'getMotivoReaperturaCausa',
  //   payload: {
  //     // idTermino ?
  //   },
  //   resolve: (response) => {
  //     // generatePlantillaDeclaracionTermino(response)
  //   }
  // })
}

/********************************/

onMounted(async () => {
  await requestUtil({ action: mantenedor_getPlantillasDiligencia })
  await requestUtil({ action: mantenedor_getjuzgados })
  getMotivosSobreseimiento()
  getMotivosReapertura()
  getDocumentos()
})
</script>
