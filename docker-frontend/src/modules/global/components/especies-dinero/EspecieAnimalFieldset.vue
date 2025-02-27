<template>
<section class="col-12">
  <AppFieldset
    legend="Animal"
  >
    <AppInput
      id="raza-animal"
      v-model="formData.razaAnimal"
      class="col-12 md:col-6 lg:col-3 mb-0 mt-2"
      :disabled="readOnly"
      label="Raza del Animal"
    />
    <AppInputNumber
      id="edad-animal"
      v-model="formData.edad"
      class="col-12 md:col-6 lg:col-3 mb-0 mt-2"
      :disabled="readOnly"
      label="Edad"
      :max="999"
      :min="0"
      mode="decimal"
      show-buttons
      :use-grouping="false"
    />
    <AppInputNumber
      id="peso-animal"
      v-model="formData.peso"
      class="col-12 md:col-6 lg:col-3 mb-0 mt-2"
      :disabled="readOnly"
      label="Peso"
      :max="9999"
      :min="0"
      mode="decimal"
      show-buttons
      :use-grouping="false"
    />
    <AppInput
      id="numero-chip"
      v-model="formData.chipNumeroIdentificatorio"
      class="col-12 md:col-6 lg:col-3 mb-0 mt-2"
      :disabled="readOnly"
      label="Chip o Número Identificatorio"
    />
    <AppInput
      id="numero-arete"
      v-model="formData.numeroArete"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Número de Arete o DIIO (SAG)"
    />
    <AppInput
      id="banco-adn-bovino"
      v-model="formData.bancoADNBobino"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Banco de ADN Bobino"
    />
    <AppDropdown
      id="marca-oreja"
      v-model="formData.marcaOreja"
      class="col-12 md:col-6 lg:col-3 mb-0"
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
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Color"
    />
    <AppInput
      id="color-frente-animal"
      v-model="formData.colorDeFrenteAnimal"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Color de Frente del Animal"
    />
    <AppDropdown
      id="tipo-tusa"
      v-model="formData.tipoTusa"
      class="col-12 md:col-6 lg:col-3 mb-0"
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
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Color Tusa"
    />
    <AppInput
      id="tipo-cicatriz"
      v-model="formData.tipoCicatriz"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Tipo de Cicatríz"
    />
    <AppInput
      id="forma-cicatriz"
      v-model="formData.formaCicatriz"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Forma de Cicatríz"
    />
    <AppInput
      id="color-patas"
      v-model="formData.colorPatas"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Color de las Patas"
    />
    <AppInput
      id="tipo-herradura"
      v-model="formData.tipoHerradura"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Tipo de Herradura"
    />
    <AppDropdown
      id="tipo-cola"
      v-model="formData.tipoCola"
      class="col-12 md:col-6 lg:col-3 mb-0"
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
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Color de Cola"
    />
    <AppDropdown
      id="tipo-senal"
      v-model="formData.tipoSenal"
      class="col-12 md:col-6 lg:col-3 mb-0"
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
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Forma de Señal"
    />
    <AppDropdown
      id="origen-animal"
      v-model="formData.origenAnimal"
      class="col-12 md:col-6 lg:col-3 mb-0"
      :disabled="readOnly"
      label="Origen Animal"
      option-label="descripcion"
      option-value="id"
      :options="origenAnimal"
      :retrieve-data-action="mantenedor_getOrigenAnimal"
      show-clear
    />
    <div class="col-12 md:col-6 lg:col-3 mt-3 text-center my-0">
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
      class="col-12 md:col-6 lg:col-3 mb-0 mt-4"
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
      class="col-12 md:col-6 lg:col-3 mb-0 mt-4"
      :disabled="readOnly"
      label="Causa de Muerte del Animal"
      option-label="descripcion"
      option-value="id"
      :options="causaMuerteAnimal"
      :retrieve-data-action="mantenedor_getCausaMuerteAnimal"
      show-clear
    />
    <AppInput
      id="lugar-custodia"
      v-model="formData.lugarCustodia"
      class="col-12 md:col-6 lg:col-3 mb-0 mt-4"
      :disabled="readOnly"
      label="Lugar de Custodia"
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { useEspeciesDineroInject } from '@/modules/global/composables/useEspeciesDinero'

const {
  marcaOreja,
  tipoTusa,
  tipoCola,
  tipoSenal,
  origenAnimal,
  tipoDocumentacionAnimal,
  causaMuerteAnimal,
  mantenedor_getMarcaOreja,
  mantenedor_getTipoTusa,
  mantenedor_getTipoSenal,
  mantenedor_getOrigenAnimal,
  mantenedor_getTipoCola,
  mantenedor_getTipoDocumentacionAnimal,
  mantenedor_getCausaMuerteAnimal
} = useMantenedorStore()

defineProps({
  readOnly: Boolean
})

const { especiesDineroInject } = useEspeciesDineroInject()

const formData = especiesDineroInject

</script>
