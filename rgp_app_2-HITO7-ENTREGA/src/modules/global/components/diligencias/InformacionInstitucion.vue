<template>
<section class="grid col-12">
  <section class="grid col-12 p-0 m-0">
    <AppDropdown
      id="institucion-ejecutora"
      v-model="formData.idInstitucionEjecutora"
      class="col-4"
      label="Institución Ejecutora"
      option-label="descripcion"
      option-value="id"
      :options="instituciones"
      :retrieve-data-action="mantenedor_getInstituciones"
      :rules="{ required }"
      show-clear
      @change="resetInstituciones"
    />
    <AppDropdown
      v-if="isInstitucionCarabineros(formData.idInstitucionEjecutora)"
      id="prefectura"
      v-model="formData.idPrefectura"
      class="col-4"
      label="Prefectura"
      option-label="descripcion"
      option-value="id"
      :options="prefecturas"
      :retrieve-data-action="mantenedor_getPrefecturas"
      :rules="{ required }"
      show-clear
      @change="resetComisariaDestacamento"
    />
    <AppDropdown
      v-if="formData.idPrefectura"
      id="unidad-policial"
      v-model="formData.idComisaria"
      class="col-4"
      label="Unidad Policial / Comisaría"
      option-label="descripcion"
      option-value="id"
      :options="comisarias"
      :payload="payloadComisarias"
      :retrieve-data-action="mantenedor_getComisariasByIdPrefectura"
      :rules="{ required }"
      show-clear
      @change="resetDestacamento"
    />
    <AppDropdown
      v-if="formData.idComisaria"
      id="destacamento"
      v-model="formData.idDestacamento"
      class="col-4"
      label="Destacamento"
      option-label="descripcion"
      option-value="id"
      :options="destacamentos"
      :payload="payloadDestacamentos"
      :retrieve-data-action="mantenedor_getDestacamentosByIdComisaria"
      :rules="{ required }"
      show-clear
    />
    <AppDropdown
      id="plazo-entrega"
      v-model="formData.plazoDias"
      class="col-4"
      label="Plazo de Entrega del Resultado"
      option-label="descripcion"
      option-value="valor"
      :options="plazosDiligencia"
      :retrieve-data-action="mantenedor_getPlazosDiligencia"
      :rules="{ required }"
      show-clear
    />
    <section class="col-12 flex justify-content-between">
      <div class="col-12 md:col-4">
        <Button
          class="p-button-outlined"
          :disabled="!formData.idInstitucionEjecutora"
          icon="pi pi-external-link"
          icon-pos="right"
          label="Carga Institución Ejecutora"
          @click="verCargaInstitucion"
        />
      </div>
      <div class="col-12 md:col-3">
        <Button
          class="p-button-text text-right"
          :disabled="!formData.idDestacamento"
          icon="pi pi-map-marker"
          icon-pos="right"
          label="Ver Dirección"
          @click="verDireccion"
        />
      </div>
    </section>
  </section>
</section>
</template>
<script setup>
import { defineEmits, computed } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useInstruirDiligencia, useMantenedorStore } from '@/modules/global/composables'

const {
  comisarias,
  destacamentos,
  instituciones,
  plazosDiligencia,
  prefecturas,
  mantenedor_getComisariasByIdPrefectura,
  mantenedor_getDestacamentosByIdComisaria,
  mantenedor_getInstituciones,
  mantenedor_getPlazosDiligencia,
  mantenedor_getPrefecturas,
  mantenedor_getCodigoInstitucionDiligencia
} = useMantenedorStore()

const { formData } = useInstruirDiligencia()

const { required } = useFormValidation()

const emit = defineEmits([
  'ver-direccion',
  'ver-carga-institucion'
])

function verDireccion () {
  emit('ver-direccion', formData.idDestacamento)
}

function verCargaInstitucion () {
  emit('ver-carga-institucion', formData.idInstitucionEjecutora)
}

function resetInstituciones () {
  formData.idPrefectura = null
  formData.idComisaria = null
  formData.idDestacamento = null
}

function resetComisariaDestacamento () {
  formData.idComisaria = null
  formData.idDestacamento = null
}

function resetDestacamento () {
  formData.idDestacamento = null
}

const payloadComisarias = computed(() => {
  return {
    idPrefectura: formData.idPrefectura
  }
})

const payloadDestacamentos = computed(() => {
  return {
    idComisaria: formData.idComisaria
  }
})

function isInstitucionCarabineros (institucion) {
  const codigoInstitucion = mantenedor_getCodigoInstitucionDiligencia(institucion)
  // CODIGO 2: Carabineros de Chile
  return codigoInstitucion === '2'
}
</script>
