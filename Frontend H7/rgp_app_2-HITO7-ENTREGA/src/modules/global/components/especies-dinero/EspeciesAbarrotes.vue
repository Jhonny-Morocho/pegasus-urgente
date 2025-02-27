<template>
<section class="col-12 px-0">
  <AppFieldset
    legend="Abarrotes"
    no-margin-bottom
    toggleable
  >
    <AppDropdown
      id="unidad-medida"
      v-model="formData.unidadMedidaCuantitativa"
      class="col-3"
      :disabled="readOnly"
      label="Unidad de Medida"
      option-label="descripcion"
      option-value="descripcion"
      :options="unidadMedidaEspecie"
      :retrieve-data-action="mantenedor_getUnidadMedidaEspecie"
      :rules="{
        required,
      }"
      show-clear
    />
    <AppInputNumber
      id="cantidad-especie"
      v-model="formData.cantidadEspecie"
      class="col-3"
      :disabled="readOnly"
      label="Cantidad"
      :min="0"
      :rules="{ required, maxLength: maxLength(9) }"
      show-buttons
      :step="1"
      :use-grouping="false"
    />
    <AppInputNumber
      id="peso-bruto"
      v-model="formData.pesoBruto"
      class="col-3"
      :disabled="readOnly"
      label="Peso Bruto"
      :min="0"
      :rules="{ required }"
      show-buttons
      :step="1"
      :use-grouping="false"
    />

    <AppInput
      id="id-numero-serie"
      v-model="formData.perecibleIdNumeroSerie"
      class="col-3"
      :disabled="readOnly"
      label="ID o Número de Serie"
      :rules="{
        required,
      }"
    />
    <div class="col-3">
      <p class="text-center">
        ¿Es especie peligrosa? (*)
      </p>
      <AppSelectButton
        id="es-peligrosa"
        v-model="formData.especiePeligrosa"
        class="col-12"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
      />
    </div>
    <AppDropdown
      id="id-nivel-peligro"
      v-model="formData.idNivelPeligro"
      class="col-3 mb-0 mt-4"
      :disabled="readOnly || !formData.especiePeligrosa"
      label="Clase"
      option-label="descripcion"
      option-value="id"
      :options="claseEspecie"
      :retrieve-data-action="mantenedor_getClaseEspecie"
      :rules="{
        required,
      }"
      show-clear
    />
    <AppDropdown
      id="id-tipo-elemento"
      v-model="formData.tipoElemento"
      class="col-3 mb-0 mt-4"
      :disabled="readOnly || !formData.especiePeligrosa"
      label="Tipo de elemento"
      option-label="descripcion"
      option-value="descripcion"
      :options="[
        { id: 1, descripcion: 'Cortante' },
        { id: 2, descripcion: 'Punzante' },
        { id: 3, descripcion: 'Corto Contundente' },
      ]"
      :rules="{
        required,
      }"
      show-clear
    />
    <AppDropdown
      id="estado=conservacion"
      v-model="formData.estadoConservacionEnvase"
      class="col-3 mb-0 mt-4"
      :disabled="readOnly || !formData.especiePeligrosa"
      label="Estado de conservación del envase"
      option-label="descripcion"
      option-value="descripcion"
      :options="estadoConservacionEspecie"
      :retrieve-data-action="mantenedor_getEstadoConservacionEspecie"
      :rules="{
        required,
      }"
      show-clear
    />
    <div class="col-3">
      <p class="text-center">
        ¿Es Perecible? (*)
      </p>
      <AppSelectButton
        id="es-perecible"
        v-model="formData.perecible"
        class="col-12"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
      />
    </div>
    <div class="col-3">
      <p class="text-center">
        ¿Especie Digital? (*)
      </p>
      <AppSelectButton
        id="es-digital"
        v-model="formData.esDigital"
        class="col-12"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
      />
    </div>
    <AppDropdown
      id="digital-tipo-especie"
      v-model="formData.especieDigitalTipoEspecie"
      class="col-3 mt-4"
      :disabled="readOnly || !formData.esDigital"
      label="Tipo de especie digital"
      option-label="name"
      option-value="name"
      :options="[
        { name: '1', value: true },
        { name: '2', value: false },
      ]"
      :rules="{
        required,
      }"
      show-clear
    />
  </AppFieldset>
</section>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { defineProps } from 'vue'
import { useMantenedorStore } from '../../composables'

import { useEspeciesDineroInject } from '@/modules/global/composables/useEspeciesDinero'

const {
  unidadMedidaEspecie,
  claseEspecie,
  estadoConservacionEspecie,
  mantenedor_getClaseEspecie,
  mantenedor_getEstadoConservacionEspecie,
  mantenedor_getUnidadMedidaEspecie
} = useMantenedorStore()

const { especiesDineroInject } = useEspeciesDineroInject()

const formData = especiesDineroInject

const { required, maxLength } = useFormValidation()

defineProps({
  readOnly: Boolean
})
</script>
