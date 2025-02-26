<template>
<section>
  <AppFieldset legend="Lista de Especies Dinero">
    <AppFilters
      v-model="especieDinero.filters"
      class="w-full mb-3"
      no-date-filters
      @filter="getEspecies"
    />
    <TablaEspecies
      v-model:first="especieDinero.firstRecord"
      :loading="especieDinero.isLoading"
      :read-only="!isCollapsed"
      :rows="paginacionEspecies?.tamanoPagina"
      see-more-option
      :total-records="paginacionEspecies?.elementosTotales"
      :value="especies"
      @page="getEspecies"
      @ver-mas="setModoLectura"
    />
  </AppFieldset>
  <div
    v-if="!isCollapsed"
    class="flex justify-content-center mt-3"
  >
    <Button
      id="agregar-especie"
      class="btn-fileupload"
      :icon="!isCollapsed ? 'pi pi-plus' : 'pi pi-minus-circle'"
      icon-pos="right"
      :label="!isCollapsed ? 'Agregar Especie' : 'Cancelar'"
      style="width: auto"
      type="button"
      @click="toggleFormularioEspecies"
    />
    <Button
      v-if="isCollapsed && !formData.isReadOnly"
      id="limpiarFormEspecie"
      class="p-button-outlined p-button-warning ml-3"
      icon="pi pi-times"
      icon-pos="right"
      label="Limpiar"
      style="width: auto"
      type="button"
      @click="resetFormData"
    />
  </div>
  <AppFieldset
    v-if="!isCollapsed"
    legend="Especies/Dinero"
    :toggleable="true"
  >
    <AppForm
      id="formulario-especies"
      :form-readonly="formData.isReadOnly"
      :form-submitted="formSubmitted"
      :validation-scope="especiesDineroValidationScope"
    >
      <EspeciesDineroFieldset />

      <EspeciesAbarrotes />

      <DineroFieldset :read-only="formData.isReadOnly" />

      <InformacionGeneralDeLaEspecie>
        <template #adjuntar-fotografia>
          <SubirArchivoIncrustado
            ref="refObservacion"
            choose-label="Seleccionar Archivo"
            :data-archivos="[]"
            :read-only="formData.isReadOnly"
            relacion-front="investigacionEspeciesDinero"
            tipo-relacion="especiesDineroObservacion"
            tipos-archivo="image/*,video/*,audio/*,application/*"
            @subir-archivo:adjuntar="null"
            @subir-archivo:eliminar="null"
          />
        </template>
      </InformacionGeneralDeLaEspecie>

      <EspecieAnimalFieldset />

      <EspecieDocumentoFieldset />

      <EspecieVehiculoFieldset>
        <template #adjuntar-geolocalizacion>
          <SubirArchivoIncrustado
            ref="refGeolocVehiculo"
            choose-label="Seleccionar Archivo"
            :data-archivos="[]"
            :read-only="formData.isReadOnly"
            relacion-front="investigacionEspeciesDinero"
            tipo-relacion="especiesDineroGeolocVehiculo"
            tipos-archivo="image/*,video/*,audio/*,application/*"
            @subir-archivo:adjuntar="null"
            @subir-archivo:eliminar="null"
          />
        </template>
      </EspecieVehiculoFieldset>
    </AppForm>
    <div class="col-12">
      <div
        v-if="formData.isReadOnly"
        class="flex justify-content-center"
      >
        <Button
          class="btn-form px-6"
          icon="pi pi-minus-circle"
          icon-pos="right"
          label="Cerrar"
          style="width: auto"
          @click="toggleFormularioEspecies"
        />
      </div>
      <div
        v-else
        class="flex justify-content-end"
      >
        <Button
          v-if="!isEditando"
          class="btn-form px-6"
          icon="pi pi-save"
          icon-pos="right"
          label="Agregar Especie"
          :loading="especieDinero.isLoading"
          style="width: auto"
          @click="handleAgregarEspecie"
        />
        <div
          v-else
          class="flex"
        >
          <Button
            class="p-button-warning p-button-outlined mr-3 px-6"
            icon="pi pi-times"
            icon-pos="left"
            label="Cancelar"
            style="width: auto"
            @click="cancelarEdicion"
          />
          <Button
            class="p-button-warning px-6"
            icon="pi pi-save"
            icon-pos="right"
            label="Modificar Especie"
            :loading="especieDinero.isLoading"
            style="width: auto"
            @click="handleAgregarEspecie"
          />
        </div>
      </div>
    </div>
  </AppFieldset>
</section>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useEspeciesDineroProvide } from '@/modules/global/composables/useEspeciesDinero'
import { requestUtil } from '@/utils'
import {
  useEspeciesDineroStore,
  useMantenedorStore
} from '@/modules/global/composables'
import TablaEspecies from '@/modules/termino-postermino/components/tablas/revisar-antecedentes-causa/TablaEspecies.vue'
import EspeciesDineroFieldset from '@/modules/global/components/especies-dinero/EspeciesDineroFieldset.vue'
import EspeciesAbarrotes from '@/modules/global/components/especies-dinero/EspeciesAbarrotes.vue'
import DineroFieldset from '@/modules/global/components/especies-dinero/DineroFieldset.vue'
import InformacionGeneralDeLaEspecie from '@/modules/global/components/especies-dinero/InformacionGeneralDeLaEspecie.vue'
import SubirArchivoIncrustado from '@/modules/global/components/documentos/SubirArchivoIncrustado.vue'
import EspecieAnimalFieldset from '@/modules/global/components/especies-dinero/EspecieAnimalFieldset.vue'
import EspecieDocumentoFieldset from '@/modules/global/components/especies-dinero/EspecieDocumentoFieldset.vue'
import EspecieVehiculoFieldset from '@/modules/global/components/especies-dinero/EspecieVehiculoFieldset.vue'
import { populateEspecie } from '@/modules/global/contracts'
import AppFilters from '@/modules/common/components/AppFilters.vue'
import { useTermino } from '../../composables'

const isCollapsed = ref(true)
const isEditando = ref(false)
const { idDenuncia } = useTermino()
const especieDinero = reactive({
  isLoading: false,
  filters: {
    buscador: null
  },
  firstRecord: 0
})

const { especiesFormData: formData, especiesDineroValidationScope } =
  useEspeciesDineroProvide()

const { formSubmitted } = useFormValidation({
  formData,
  validationScope: especiesDineroValidationScope
})

const {
  especies,
  paginacionEspecies,
  especiesDinero_getEspecieByIdDenuncia,
  especiesDinero_getEspecieEnCausaByID,
  especiesDinero_SET_DINERO
} = useEspeciesDineroStore()

const {
  mantenedor_getFamiliaEspecies,
  mantenedor_getAllTiposEspecie,
  mantenedor_getTiposDelito,
  mantenedor_getAmbitoEspecie
} = useMantenedorStore()

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposDelito })
  requestUtil({ action: mantenedor_getFamiliaEspecies })
  requestUtil({ action: mantenedor_getAllTiposEspecie })
  requestUtil({ action: mantenedor_getAmbitoEspecie })
}
getDataMantenedor()

async function getEspecies (pagination = undefined) {
  if (!pagination) {
    especieDinero.firstRecord = 0
  }

  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params: {
        buscador: especieDinero.filters.buscador?.trim().length
          ? especieDinero.filters.buscador?.trim()
          : '',
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (loading) => (especieDinero.isLoading = loading),
    resolve: () => {
      especieDinero.filters.buscador = ''
    }
  })
}

onMounted(async () => {
  getEspecies()
})

function toggleFormularioEspecies () {
  isCollapsed.value = !isCollapsed.value
}

async function setModoLectura (especie) {
  requestUtil({
    action: especiesDinero_getEspecieEnCausaByID,
    payload: {
      idEspecie: especie.idEspecie
    },
    resolve: ({ data }) => {
      especiesDinero_SET_DINERO(data.dinero || [])
      populateEspecie(data, formData)
      formData.familiaEspecie = data.idFamiliaEspecie
      formData.isReadOnly = true
      isCollapsed.value = false
    }
  })
}
</script>
