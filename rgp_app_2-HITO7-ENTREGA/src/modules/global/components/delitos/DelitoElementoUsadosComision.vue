<template>
<AppFieldset legend="Tipo de Elementos Usados">
  <AppDropdown
    id="tipoElementoUsado"
    v-model="form.tipoElementoUsado"
    class="col-12 md:col-6 lg:col-12"
    label="Tipo de Elementos Usados"
    option-label="name"
    option-value="name"
    :options="tiposElementosOption"
    show-clear
  />
  <AppDropdown
    v-if="form.tipoElementoUsado !== 'Otro'"
    id="elementoUsado"
    v-model="form.elementoUsado"
    class="col-12 md:col-6 lg:col-12 mb-0"
    label="Elementos Usados"
    option-label="name"
    option-value="name"
    :options="elementosFiltrados"
    show-clear
  />
  <AppInput
    v-else
    id="otroElementoUsado"
    v-model="form.otroElementoUsado"
    class="col-12 md:col-6 lg:col-12 mb-0"
    label="Otro Elemento Usado"
  />
</AppFieldset>
</template>
<script setup>
import { ref, watch } from 'vue'
import { tiposElementosOption, elementos } from '@/data/delito.json'

import { useDelitoInject } from '@/modules/global/composables/useDelito'

const { delitoInject } = useDelitoInject()

const form = delitoInject.elementosUsados

const elementosFiltrados = ref([])

watch(
  () => form.tipoElementoUsado,
  () => {
    if (form.tipoElementoUsado === 'Armas de Fuego') {
      elementosFiltrados.value = elementos.filter(
        (elemento) => elemento.idTipoElemento === 1
      )
    } else if (form.tipoElementoUsado === 'Arma Blanca') {
      elementosFiltrados.value = elementos.filter(
        (elemento) => elemento.idTipoElemento === 2
      )
    } else {
      elementosFiltrados.value = []
    }
  }
)
</script>
