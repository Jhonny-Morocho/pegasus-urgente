<template>
<section class="col-12 px-0">
  <AppFieldset
    class="mb-0 pb-0"
    legend="Información General de la Especie"
    :toggleable="true"
  >
    <AppInput
      id="observacion"
      v-model="formData.observacion"
      class="col-12"
      :disabled="readOnly"
      label="Ingrese acá las observaciones"
    />
    <AppDropdown
      id="a-quien-se-le-incauto-la-especie"
      v-model="formData.aQuienSeLeIncauto"
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Sujeto al que se le incauta "
      option-label="nombreCompleto"
      option-value="idPersona"
      :options="sujetosIntervinientesOptions"
      show-clear
    />
    <AppInputNumber
      id="avaluo-estimado"
      v-model="formData.avaluoEstimado"
      class="col-12 md:col-6 lg:col-4"
      currency="CLP"
      :disabled="readOnly"
      label="Avalúo Estimado"
      locale="es-CL"
      mode="currency"
      :rules="{ required, maxLength: maxLength(255) }"
    />
    <AppDropdown
      id="quien-realiza-avaluo"
      v-model="formData.quienRealizaAvaluo"
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Quien realizó el avalúo"
      option-label="descripcion"
      option-value="id"
      :options="quienRealizaAvaluo"
      :retrieve-data-action="mantenedor_getQuienRealizaAvaluo"
      :rules="{
        required,
      }"
      show-clear
    />
    <AppInput
      id="rut-tenedor-especie"
      v-model="formData.rutTenedorEspecie"
      class="col-12 md:col-6"
      :disabled="readOnly"
      label="Identificación del Dueño o Tenedor de la Especie"
      :rules="{ required }"
    />
    <AppInput
      id="nombre-tenedor-especie"
      v-model="formData.nombreTenedorEspecie"
      class="col-12 md:col-6"
      :disabled="readOnly"
      label="Nombre del Dueño o Tenedor de la Especie"
      :rules="{ required, alfabetico }"
    />
    <AppDropdown
      id="pronunciamiento-fiscal"
      v-model="formData.pronunciamientoFiscal"
      class="col-12 md:col-6"
      :disabled="readOnly"
      label="Pronunciamiento del Fiscal"
      option-label="descripcion"
      option-value="descripcion"
      :options="pronunciamientoFiscalEspecie"
      :retrieve-data-action="mantenedor_getPronunciamientoFiscalEspecie"
      :rules="{
        required,
      }"
      show-clear
    />
    <div class="col-12 grid text-center">
      <div class="col-12 md:col-4 mt-auto">
        <h4 class="mb-2">
          Indicador de Arma (*)
        </h4>
        <AppSelectButton
          id="indicadorArma"
          v-model="formData.indicadorArma"
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
      <div class="col-12 md:col-4 mt-auto">
        <h4 class="mb-2">
          Indicador de Evidencia (*)
        </h4>
        <AppSelectButton
          id="indicadorEvidencia"
          v-model="formData.indicadorEvidencia"
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
      <div class="col-12 md:col-4 mt-auto">
        <h4 class="mb-2">
          Indicador de medio usado para cometer delito (*)
        </h4>
        <AppSelectButton
          id="indicadorMedioUsadoCometerDelito"
          v-model="formData.indicadorMedioUsadoCometerDelito"
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
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { defineProps, computed } from 'vue'
import { useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables/'

import { useEspeciesDineroInject } from '@/modules/global/composables/useEspeciesDinero'

const {
  quienRealizaAvaluo,
  pronunciamientoFiscalEspecie,
  mantenedor_getQuienRealizaAvaluo,
  mantenedor_getPronunciamientoFiscalEspecie
} = useMantenedorStore()

defineProps({
  readOnly: Boolean
})

const { especiesDineroInject } = useEspeciesDineroInject()

const formData = especiesDineroInject

const { required, alfabetico, maxLength } = useFormValidation()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()

const sujetosIntervinientesOptions = computed(() => {
  return sujetosIntervinientes?.value.map((s) => {
    const nombreCompleto = s.razonSocial ?? `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
    return {
      ...s,
      nombreCompleto
    }
  })
})

</script>
