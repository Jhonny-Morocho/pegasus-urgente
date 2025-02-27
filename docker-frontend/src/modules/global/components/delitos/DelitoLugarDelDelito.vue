<template>
<AppFieldset legend="Lugar del Delito">
  <AppDropdown
    id="zonaDelito"
    v-model="form.zonaDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Zona del Delito"
    option-label="name"
    option-value="name"
    :options="[{ name: 'Rural' }, { name: 'Urbano' }, { name: 'Virtual' }]"
    show-clear
  />
  <AppDropdown
    id="tipoLugarOcurrencia"
    v-model="form.tipoLugarOcurrencia"
    class="col-12 md:col-6 lg:col-4"
    label="Tipo de Lugar de Ocurrencia"
    option-label="name"
    option-value="name"
    :options="tiposLugarOcurrencia"
    show-clear
  />
  <AppDropdown
    id="viaIngreso"
    v-model="form.viaIngreso"
    class="col-12 md:col-6 lg:col-4"
    label="Vía de Ingreso"
    option-label="name"
    option-value="name"
    :options="viasIngresoOption"
    show-clear
  />
  <AppInput
    id="lugarOcurrencia"
    v-model="form.lugarOcurrencia"
    class="col-12 md:col-6 mb-0"
    label="Lugar de Ocurrencia"
  />
  <AppInput
    id="lugarEspecificoOcurrencia"
    v-model="form.lugarEspecificoOcurrencia"
    class="col-12 md:col-6 mb-0"
    label="Lugar Específico de Ocurrencia"
  />
</AppFieldset>
</template>
<script setup>
import { tiposLugarOcurrencia, viasIngresoOption } from '@/data/delito.json'

import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { delitoInject } = useDelitoInject()

const form = delitoInject.lugarDelito
</script>
