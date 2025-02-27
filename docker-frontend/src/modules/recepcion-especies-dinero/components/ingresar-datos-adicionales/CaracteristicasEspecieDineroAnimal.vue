<template>
<AppFieldset
  class="col-12 p-fluid"
  legend="Características Especie/Dinero"
>
  <AppDropdown
    id="tipo-animal"
    v-model="formData.tipoAnimal"
    class="col-12 md:col-3 mb-0 mt-2"
    :disabled="readOnly"
    label="Tipo de Animal"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Tipo 1', value: 1 },
      { name: 'Tipo 2', value: 2 },
    ]"
    show-clear
  />
  <AppInput
    id="raza-animal"
    v-model="formData.razaAnimal"
    class="col-12 md:col-3 mb-0 mt-2"
    :disabled="readOnly"
    label="Raza del Animal"
  />
  <AppInputNumber
    id="edad-animal"
    v-model="formData.edad"
    class="col-12 md:col-3 mb-0 mt-2"
    :disabled="readOnly"
    label="Edad"
    :min="0"
    mode="decimal"
    show-buttons
    :use-grouping="false"
  />
  <AppInputNumber
    id="peso-animal"
    v-model="formData.peso"
    class="col-12 md:col-3 mb-0 mt-2"
    :disabled="readOnly"
    label="Peso"
    :min="0"
    mode="decimal"
    show-buttons
    :use-grouping="false"
  />
  <AppInput
    id="numero-chip"
    v-model="formData.chipNumeroIdentificatorio"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Chip o Número Identificatorio"
  />
  <AppInput
    id="numero-arete"
    v-model="formData.numeroArete"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Número de Arete o DIIO (SAG)"
  />
  <AppInput
    id="banco-adn-bovino"
    v-model="formData.bancoADNBobino"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Banco de ADN Bobino"
  />
  <AppDropdown
    id="marca-oreja"
    v-model="formData.marcaOreja"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Marca de Oreja"
    option-label="descripcion"
    option-value="id"
    :options="marcaOreja"
    :retrieve-data-action="mantenedor_getMarcaOreja"
    show-clear
  />
  <AppInput
    id="color-animal"
    v-model="formData.colorAnimal"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Color"
  />
  <AppInput
    id="color-frente-animal"
    v-model="formData.colorDeFrenteAnimal"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Color de Frente del Animal"
  />
  <AppDropdown
    id="tipo-tusa"
    v-model="formData.tipoTusa"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Tipo Tusa"
    option-label="descripcion"
    option-value="id"
    :options="tipoTusa"
    :retrieve-data-action="mantenedor_getTipoTusa"
    show-clear
  />
  <AppInput
    id="color-tusa"
    v-model="formData.colorTusa"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Color Tusa"
  />
  <AppInput
    id="tipo-cicatriz"
    v-model="formData.tipoCicatriz"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Tipo de Cicatríz"
  />
  <AppInput
    id="forma-cicatriz"
    v-model="formData.formaCicatriz"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Forma de Cicatríz"
  />
  <AppInput
    id="color-patas"
    v-model="formData.colorPatas"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Color de las Patas"
  />
  <AppInput
    id="tipo-herradura"
    v-model="formData.tipoHerradura"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Tipo de Herradura"
  />
  <AppDropdown
    id="tipo-cola"
    v-model="formData.tipoCola"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Tipo de Cola"
    option-label="descripcion"
    option-value="id"
    :options="tipoCola"
    :retrieve-data-action="mantenedor_getTipoCola"
    show-clear
  />
  <AppInput
    id="color-cola"
    v-model="formData.colorCola"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Color de Cola"
  />
  <AppDropdown
    id="tipo-senal"
    v-model="formData.tipoSenal"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Tipo de Señal"
    option-label="descripcion"
    option-value="id"
    :options="tipoSenal"
    :retrieve-data-action="mantenedor_getTipoSenal"
    show-clear
  />
  <AppInput
    id="forma-senal"
    v-model="formData.formaSenal"
    class="col-12 md:col-3 mb-0"
    :disabled="readOnly"
    label="Forma de Señal"
  />
  <AppDropdown
    id="origen-animal"
    v-model="formData.origenAnimal"
    class="col-12 md:col-3 mb-0 mt-4"
    :disabled="readOnly"
    label="Origen Animal"
    option-label="descripcion"
    option-value="id"
    :options="origenAnimal"
    :retrieve-data-action="mantenedor_getOrigenAnimal"
    show-clear
  />
  <div class="col-12 md:col-3 mt-3 text-center my-0">
    <div class="p-fieldset-legend-text">
      <h4 class="mb-2">
        Inscripción
      </h4>
    </div>
    <AppSelectButton
      id="inscripcion"
      v-model="formData.inscripcion"
      :disabled="readOnly"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
    />
  </div>
  <AppDropdown
    id="tipo-documentacion"
    v-model="formData.tipoDocumentacionAnimal"
    class="col-12 md:col-3 mb-0 mt-4"
    :disabled="readOnly"
    label="Tipo de Documentación Animal"
    option-label="descripcion"
    option-value="id"
    :options="tipoDocumentacionAnimal"
    :retrieve-data-action="mantenedor_getTipoDocumentacionAnimal"
    show-clear
  />
  <AppDropdown
    id="causa-muerte"
    v-model="formData.causaMuerteAnimal"
    class="col-12 md:col-3 mb-0 mt-4"
    :disabled="readOnly"
    label="Causa de Muerte del Animal"
    option-label="descripcion"
    option-value="id"
    :options="causaMuerteAnimal"
    :retrieve-data-action="mantenedor_getCausaMuerteAnimal"
    show-clear
  />
</AppFieldset>
</template>

<script setup>
import { useMantenedorStore } from '@/modules/global/composables'
import { defineProps, reactive } from 'vue'

const {
  mantenedor_getMarcaOreja,
  mantenedor_getTipoSenal,
  mantenedor_getTipoCola,
  mantenedor_getTipoTusa,
  mantenedor_getOrigenAnimal,
  mantenedor_getTipoDocumentacionAnimal,
  mantenedor_getCausaMuerteAnimal
} = useMantenedorStore()

// VALUES
const formData = reactive(getFormDataInitial())
defineProps({
  readOnly: Boolean
})
function getFormDataInitial () {
  return {
    tipoAnimal: '',
    razaAnimal: '',
    edad: null,
    peso: null,
    chipNumeroIdentificatorio: '',
    numeroArete: '',
    bancoADNBobino: '',
    marcaOreja: '',
    colorAnimal: '',
    colorDeFrenteAnimal: '',
    tipoTusa: '',
    tipoCicatriz: '',
    formaCicatriz: '',
    colorPatas: '',
    colorCola: '',
    tipoSenal: '',
    formaSenal: '',
    origenAnimal: '',
    inscripcion: '',
    tipoDocumentacionAnimal: '',
    causaMuerteAnimal: ''
  }
}
</script>
