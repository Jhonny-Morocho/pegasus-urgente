<template>
<AppFieldset
  class="mt-3"
  legend="Sujetos"
  no-margin-bottom
>
  <AppDropdown
    id="cantidadSujetosCometieronHechoDelictual"
    v-model="form.cantidadSujetosCometieronHechoDelictual"
    class="col-12"
    label="Cantidad de Sujetos que Cometieron el Hecho Delictual"
    option-label="name"
    option-value="name"
    :options="cantidadesSujetosOptions"
    show-clear
  />
  <AppDropdown
    id="modalidadGrupo"
    v-model="form.modalidadGrupo"
    class="col-12 mb-0"
    label="Modalidad de Grupo"
    option-label="name"
    option-value="name"
    :options="[
      { name: 'Dos o mas sujetos' },
      { name: 'Dos o mas hombres' },
      { name: 'Mujer sola' },
    ]"
    show-clear
  />
</AppFieldset>
</template>
<script setup>
import { cantidadesSujetosOptions } from '@/data/delito.json'
import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { delitoInject } = useDelitoInject()

const form = delitoInject.delitoSujeto
</script>
