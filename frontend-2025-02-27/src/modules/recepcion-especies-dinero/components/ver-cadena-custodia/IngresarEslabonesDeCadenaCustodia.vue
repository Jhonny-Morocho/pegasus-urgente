<template>
<AppFieldset
  legend="Ingresar Nuevo Eslabón"
  v-bind="$attrs"
>
  <h3 class="col-12">
    Entregado por:
  </h3>
  <div class="col-12 md:col-4">
    <p class="ml-0 mt-2">
      <span class="font-bold">Nombre:</span> {{ entregadoPor.nombre }}
    </p>
    <p class="w-full mt-2">
      <span class="font-bold">RUT:</span> {{ entregadoPor.rut }}
    </p>
    <p class="w-full mt-2">
      <span class="font-bold">Cargo:</span> {{ entregadoPor.cargo }}
    </p>
  </div>
  <div class="col-12 md:col-4">
    <p class="w-full mt-2">
      <span class="font-bold">Institución:</span>
      {{ entregadoPor.institucion }}
    </p>
    <p class="w-full mt-2">
      <span class="font-bold">Unidad:</span> {{ entregadoPor.unidad }}
    </p>
  </div>
  <h3 class="col-12">
    Recibido por:
  </h3>
  <AppForm
    id="nuevoEslabon"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="formIngresoNuevoEslabon"
  >
    <div class="grid col-12 p-fluid">
      <AppInput
        id="nombre"
        v-model="formData.nombre"
        class="col-12 md:col-3 lg:col-4"
        :disabled="readOnly"
        label="Nombre"
        :rules="{ required }"
      />
      <RutInput
        id="rut-sujeto"
        v-model="formData.rutQuienRecibe"
        class="col-12 lg:col-4"
        label="Rut"
        :rules="{ required }"
      />
      <AppInput
        id="gradoQuienRecibe"
        v-model="formData.gradoQuienRecibe"
        class="col-12 md:col-3 lg:col-4"
        :disabled="readOnly"
        label="Grado/Cargo"
        :rules="{ required }"
      />
      <AppInput
        id="institucionQuienRecibe"
        v-model="formData.institucionQuienRecibe"
        class="col-12 md:col-3 lg:col-4"
        :disabled="readOnly"
        label="Institución"
        :rules="{ required }"
      />
      <AppInput
        id="unidadQuienRecibe"
        v-model="formData.unidadQuienRecibe"
        class="col-12 md:col-3 lg:col-4"
        :disabled="readOnly"
        label="Unidad"
        :rules="{ required }"
      />
    </div>

    <h3 class="col-12">
      Entregada para:
    </h3>

    <div class="col-12 p-fluid">
      <AppDropdown
        id="motivoEntrega"
        v-model="formData.motivoEntrega"
        class="col-12 lg:col-4 pl-0"
        label="Motivo de Entrega"
        option-label="name"
        option-value="id"
        :options="motivoEntregaOptions"
        :rules="{ required }"
        show-clear
      />
    </div>
  </AppForm>
  <p class="my-3 ml-3">
    Ingresar Imágenes:
  </p>
  <div class="col-12 grid">
    <div class="col-4">
      <div class="col-12">
        <FileUpload
          accept="image/*"
          choose-label="Seleccionar Imagen"
          class="btn-fileupload lg:col-12 w-full"
          :max-file-size="16000000"
          mode="basic"
          name="demo[]"
          @select="onSelect"
        />
      </div>
      <div class="col-12 mt-3 mb-5">
        <Button
          class="btn-form w-full"
          icon="pi pi-paperclip"
          icon-pos="right"
          label="Adjuntar Imagen"
          :loading="isLoadingAdjuntar"
          style="min-width: 256px"
          @click="addArchivoNuevoEslabon"
        />
      </div>
    </div>

    <div class="col-8">
      <TablaImagenes />
    </div>
  </div>
  <AppTextarea
    id="observacionesDelEslabon"
    v-model="formData.observacionesDelEslabon"
    :auto-resize="true"
    class="col-12 p-fluid"
    cols="100"
    label="Observaciones del eslabón"
    rows="3"
  />
</AppFieldset>
<div class="mt-3 mb-5 lg:col-offset-8">
  <Button
    class="btn-form w-auto"
    icon="pi pi-save"
    icon-pos="right"
    label="Firma con Clave Única"
    :loading="isLoadingAdjuntar"
    style="min-width: 256px"
    @click="openFirmaConClaveUnica"
  />
</div>
</template>

<script setup>
import { defineExpose, reactive } from 'vue'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import TablaImagenes from '@/modules/recepcion-especies-dinero/components/levantar-cadena-custodia/TablaImagenes.vue'
import { useFormValidation } from '@/modules/common/composables'

const formData = reactive({
  nombre: '',
  rutQuienRecibe: '',
  gradoQuienRecibe: '',
  institucionQuienRecibe: '',
  unidadQuienRecibe: '',
  motivoentrega: '',
  observacionesDelEslabon: ''
})

const { formSubmitted, required } = useFormValidation({
  formData,
  validationScope: 'formIngresoNuevoEslabon'
})
const motivoEntregaOptions = [
  { name: 'Traslado', id: 1 },
  { name: 'Custodia', id: 1 },
  { name: 'Peritaje', id: 1 },
  { name: 'Inspección Presencial', id: 1 }
]
defineExpose({ formData })
const entregadoPor = {
  nombre: 'Pablo Astorga',
  rut: '10.324.776-9',
  cargo: 'Detective',
  institucion: 'PDI',
  unidad: 'Robos y Focos Criminales'
}
</script>
