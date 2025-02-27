<template>
<hr>
<main class="p-3">
  <ul class="flex flex-column gap-3 list-none px-0 text-lg">
    <li>
      <strong>Estado: </strong> {{ causa?.estado }}
    </li>
    <li>
      <strong>Imputado(s): </strong> {{ numeroImputados }}
    </li>
    <li>
      <strong>Víctima(s): </strong> {{ numeroVictimas }}
    </li>
    <li>
      <strong>Nombre Causa: </strong> {{ causa?.nombreCausa }}
    </li>
    <li v-if="causa?.etapa">
      <strong>Etapa: </strong> {{ causa?.etapa }}
    </li>
  </ul>
</main>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '../../composables'

const { mantenedor_getCodigoTipoSujeto } = useMantenedorStore()

const props = defineProps({
  causa: propTypes.object
})

const causa = computed(() => props?.causa)

function esVictima (idTipoInterviniente) {
  return mantenedor_getCodigoTipoSujeto(idTipoInterviniente) === '6' // 6: 'Víctima'
}

function esImputado (idTipoInterviniente) {
  return mantenedor_getCodigoTipoSujeto(idTipoInterviniente) === '3' // 3: 'Imputado'
}

const numeroImputados = computed(() => {
  const imputados = causa.value?.intervinientes.filter(i => esImputado(i.idTipo))
  return imputados?.length
})
const numeroVictimas = computed(() => {
  const victimas = causa.value?.intervinientes.filter(i => esVictima(i.idTipo))
  const denuncianteVictima = causa.value?.intervinientes.filter(i => i.esVictima)
  return victimas?.length + denuncianteVictima?.length
})
</script>
