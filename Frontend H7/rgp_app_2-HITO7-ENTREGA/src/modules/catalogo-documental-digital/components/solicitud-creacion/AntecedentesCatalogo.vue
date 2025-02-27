<template>
<AppForm
  id="creacionCatalogo"
  class="col-12"
  :form-submitted="formSubmitted"
  validation-scope="formCreacionCatalogo"
>
  <div class="field grid">
    <div class="col-4 grid">
      <div class="col-10">
        <AppInput
          id="nombre-catalogo"
          v-model="formData.nombreCatalogo"
          label="Nombre Catálogo"
          max-length="50"
          :rules="{ required, minLength: minLength(3) }"
        />
      </div>
      <div class="col-2">
        <Button
          v-tooltip="'Consiste, en una palabra, frase o grupo de caracteres que se utiliza para denominar al catálogo.'"
          class="question"
          icon="pi pi-question-circle"
          type="button"
        />
      </div>
    </div>
    <div class="col-4 grid">
      <div class="col-10">
        <AppDropdown
          id="archivador"
          v-model="formData.tipoCatalogo"
          label="Tipo Catálogo"
          option-label="nombre"
          option-value="id"
          :options="tipoCatalogo"
          :rules="{ required }"
          show-clear
        />
      </div>
      <div class="col-2">
        <Button
          v-tooltip="'Corresponde a los diferentes tipos de catálogo.'"
          class="question"
          icon="pi pi-question-circle"
          type="button"
        />
      </div>
    </div>
    <div class="col-4 grid">
      <div class="col-10">
        <AppDropdown
          id="nivel-acceso"
          v-model="formData.nivelAcceso"
          label="Nivel de Acceso"
          option-label="nombre"
          option-value="id"
          :options="nivelAcceso"
          :rules="{ required }"
          show-clear
        />
      </div>
      <div class="col-2">
        <Button
          v-tooltip="'Indicación relativa al acceso y disposición para consulta de los documentos'"
          class="question"
          icon="pi pi-question-circle"
          type="button"
        />
      </div>
    </div>
  </div>

  <div class="field grid">
    <div class="col-4 grid">
      <div class="col-10">
        <AppDropdown
          id="disponibilidad"
          v-model="formData.disponibilidad"
          label="Disponibilidad"
          option-label="descripcion"
          option-value="id"
          :options="disponibilidad"
          :rules="{ required }"
          show-clear
        />
      </div>
      <div class="col-2">
        <Button
          v-tooltip="'Indicación relativa a la disponibilidad para ser consultado '"
          class="question"
          icon="pi pi-question-circle"
          type="button"
        />
      </div>
    </div>

    <div class="col-7">
      <AppInput
        id="descripcion"
        v-model="formData.descripcion"
        label="Descripción"
        max-length="200"
        :rules="{ required, minLength: minLength(10) }"
      />
    </div>
  </div>
</AppForm>
</template>

<script setup>
import { defineExpose, reactive, ref } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'
const { tipoCatalogo, nivelAcceso, disponibilidad } = useMantenedorCDD()

const tipoCatalogoStore = ref(tipoCatalogo)

const formData = reactive({
  nombreCatalogo: '',
  tipoCatalogo: getIdTipoCatalogoByCodigo(1),
  nivelAcceso: '',
  disponibilidad: 0,
  descripcion: ''
})

function getIdTipoCatalogoByCodigo (codigoCatalogo) {
  console.log(codigoCatalogo)
  return tipoCatalogoStore.value?.find((tipoCatalogo) => tipoCatalogo.codigo === codigoCatalogo)?.id
}

const { formSubmitted, required, minLength, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: 'formCreacionCatalogo'
})

defineExpose({ formData, isFormValid, resetFormData })
</script>
<style scoped>
.end {
  text-align: end;
}

.question {
  color: black;
  background-color: transparent;
  padding: 16px 16px 0px 0px;
}

.question:hover {
  color: black;
  background-color: transparent;
}
</style>
