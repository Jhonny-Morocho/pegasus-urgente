<template>
<AppFieldset
  legend="Vigilancia"
  no-margin-bottom
>
  <AppDropdown
    id="tipoVigilancia"
    v-model="form.tipoVigilancia"
    class="col-12"
    label="Tipo Vigilancia"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Ninguna' },
      { name: 'Vigilancia privada' },
      { name: 'Guardia de seguridad' },
    ]"
    show-clear
  />
  <AppDropdown
    id="medidasSeguridad"
    v-model="form.medidasSeguridad"
    class="col-12 mb-0"
    label="Medidas de Seguridad"
    option-label="name"
    option-value="name"
    :options="medidasSeguridadOptions"
    show-clear
  />
</AppFieldset>
</template>
<script setup>
import { medidasSeguridadOptions } from '@/data/delito.json'

import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { delitoInject } = useDelitoInject()

const form = delitoInject.vigilancia
</script>
