<template>
<AppFieldset
  class="w-full"
  legend="Escrito de Solicitud de Audiencia de Formalización"
  :toggleable="true"
>
  <div class="w-full">
    <AppDropdown
      id="plantilla"
      v-model="formData.idPlantilla"
      class="col-4"
      label="Plantilla"
      option-label="descripcion"
      option-value="id"
      :options="plantillaDiligenciasOptions"
      @change="getPlantillaInstruccion(formData.idPlantilla)"
    />
    <Editor
      id="editor-instrucciones-especificas"
      v-model="formData.materializacionTextoFiscal"
      class="col-12 w-full"
      editor-style="height: 369px"
      :rules="{ required }"
    />
  </div>
</AppFieldset>
<div
  v-if="unidadPolicialOptions"
  class="col-12 grid"
>
  <div class="col-12 md:col-4">
    <p class="text-center">
      ¿Desea agregar Unidad Policial?
    </p>
    <AppSelectButton
      id="desea-agregar-unidad-policial"
      v-model="formData.agregaUnidadPolicial"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
  </div>
  <AppDropdown
    v-if="formData.agregaUnidadPolicial"
    id="institucion"
    v-model="formData.institucion"
    class="col-12 md:col-6 lg:col-4 my-auto"
    label="Institución"
    :options="institucionOptions"
    :rules="{ required }"
    show-clear
  />
  <AppDropdown
    v-if="formData.agregaUnidadPolicial"
    id="unidad-policial"
    v-model="formData.unidadPolicial"
    class="col-12 md:col-6 lg:col-4 my-auto"
    label="Unidad Policial"
    :options="unidadPolicialOptions"
    :rules="{ required }"
    show-clear
  />
</div>
<div
  v-if="unidadPolicialOptions"
  class="col-12 md:col-4 w-full"
>
  <div
    v-if="hasRevisaEscrito"
    class="col-12 md:col-4"
  >
    <p class="text-center">
      ¿Desea Revisar Escrito?
    </p>
    <AppSelectButton
      id="revisar-escrito"
      v-model="formData.revisarEscrito"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
  </div>
  <div
    v-if="!hasRevisaEscrito && hasArchivoProvisionalConsulta"
    class="col-12 md:col-4"
  >
    <p class="text-center">
      Archivo Provisional con Consulta
    </p>
    <AppSelectButton
      id="archivo-provisional-consulta"
      v-model="formData.archivoProvisionalConConsulta"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
  </div>
</div>
<div class="col-12 flex justify-content-start mt-4">
  <Button
    class="p-button-outlined"
    icon="pi pi-external-link"
    icon-pos="right"
    label="Vista Previa"
    style="width: 256px"
    @click="vistaPreviaInstruccion"
  />
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useAppDialog, useFormValidation } from '@/modules/common/composables'
import ModalVerEscritoVue from './modals/ModalVerEscrito.vue'

const { launchDialog } = useAppDialog()
const { required } = useFormValidation()

const props = defineProps({
  modelValue: propTypes.object,
  plantillaDiligenciasOptions: propTypes.array,
  institucionOptions: propTypes.array,
  unidadPolicialOptions: { type: Array, default: () => null },
  hasRevisaEscrito: Boolean,
  hasArchivoProvisionalConsulta: Boolean
})

const emit = defineEmits(['update:modelValue', 'get-plantilla-instruccion'])

const formData = ref(props.modelValue)

watch(formData.value, (newValues) => {
  emit('update:modelValue', newValues)
})

function getPlantillaInstruccion (idPlantilla) {
  emit('get-plantilla-instruccion', idPlantilla)
}

function vistaPreviaInstruccion () {
  launchDialog({
    component: ModalVerEscritoVue,
    header: 'Ver Escrito',
    props: { data: formData },
    width: '67%'
  })
}
</script>
