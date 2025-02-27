<template>
<AppFieldset legend="Clasificación del Delito">
  <AppDropdown
    id="gradoEjecucionDelito"
    v-model="form.gradoEjecucionDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Grado de Ejecución del Delito"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Tentado' },
      { name: 'Frustrado' },
      { name: 'Consumado' },
    ]"
    show-clear
  />
  <AppDropdown
    id="patronCriminal"
    v-model="form.patronCriminal"
    class="col-12 md:col-6 lg:col-4"
    label="Patrón Criminal"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'PATRÓN - 1' },
      { name: 'PATRÓN - 2' },
      { name: 'PATRÓN - 3' },
    ]"
    show-clear
  />
  <AppDropdown
    id="modusOperandi"
    v-model="form.modusOperandi"
    class="col-12 md:col-6 lg:col-4"
    label="Modus Operandi"
    option-label="name"
    option-value="name"
    :options="modusOperandiOption"
    show-clear
  />
  <AppDropdown
    id="subModusOperandi"
    v-model="form.subModusOperandi"
    class="col-12 md:col-6 lg:col-4"
    label="Submodus Operandi"
    option-label="name"
    option-value="name"
    :options="subModusOperandiOption"
    show-clear
  />
  <AppInput
    id="problemaDelictualFenomenoCriminal"
    v-model="form.problemaDelictualFenomenoCriminal"
    class="col-12 md:col-6 lg:col-8 mb-0"
    label="Problema Delictual o Fenómeno Criminal"
  />
</AppFieldset>
</template>
<script setup>
import {
  modusOperandiOption,
  subModusOperandiOption
} from '@/data/delito.json'
import { useDelitoInject } from '@/modules/global/composables/useDelito'

// ready
const { delitoInject } = useDelitoInject()

const form = delitoInject.clasificacion
</script>
