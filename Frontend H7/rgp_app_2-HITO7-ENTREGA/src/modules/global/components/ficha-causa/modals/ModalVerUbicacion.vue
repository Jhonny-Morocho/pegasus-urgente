<template>
<section>
  <MapInput
    :auto-complete="false"
    class="col-12 mt-0 pt-0"
    :draggable="false"
    :height="'h-28rem'"
    :position="coordenadasDelito"
    :zoom="18"
  />
  <div class="grid my-4 ml-8">
    <div class="col-5 flex flex-column px-1">
      <p class="mb-2">
        <span style="font-weight: bold">Tipo de Dirección: </span> {{ props.delito.lugarDelito.zonaDelito ? props.delito.lugarDelito.zonaDelito : 'No Informado' }}
      </p>
      <p class="my-2">
        <span style="font-weight: bold">Región: </span> {{ props.delito.direccionDelito.region }}
      </p>
      <p class="my-2">
        <span style="font-weight: bold">Comuna: </span> {{ props.delito.direccionDelito.comuna }}
      </p>
      <p class="my-2">
        <span style="font-weight: bold">Calle: </span> {{ props.delito.direccionDelito.calle }}
      </p>
      <p class="my-2">
        <span style="font-weight: bold">Número: </span> {{ props.delito.direccionDelito.numero }}
      </p>
      <p class="mt-1">
        <span style="font-weight: bold">Ubicación Rural: </span> {{ props.delito.direccionDelito.ubicacionRural ? 'Si' : 'No' }}
      </p>
    </div>
    <div class="col-6 flex flex-column px-1">
      <p class="mb-2">
        <span style="font-weight: bold">Casa/Depto/Oficina: </span> {{ props.delito.direccionDelito.departamentoOficina ? props.delito.direccionDelito.departamentoOficina : 'No Informado' }}
      </p>
      <p class="my-2">
        <span style="font-weight: bold">Cuadrante Policial: </span> {{ props.delito.direccionDelito.cuadrante ? props.delito.direccionDelito.cuadrante : 'No Informado' }}
      </p>
      <p class="my-1">
        <span style="font-weight: bold">Sector: </span> {{ props.delito.direccionDelito.sector ? props.delito.direccionDelito.sector : 'No Informado' }}
      </p>
      <p class="my-2">
        <span style="font-weight: bold">Población o Villa: </span> {{ props.delito.direccionDelito.poblacionVilla ? props.delito.direccionDelito.poblacionVilla : 'No Informado' }}
      </p>
      <p class="my-2">
        <span style="font-weight: bold">Intersección: </span> {{ props.delito.direccionDelito.interseccion ? props.delito.direccionDelito.interseccion : 'No Informado' }}
      </p>
      <p class="mt-2">
        <span style="font-weight: bold">Observación de referencia: </span> {{ props.delito.direccionDelito.observacionReferencia ? props.delito.direccionDelito.observacionReferencia : 'No Informado' }}
      </p>
    </div>
  </div>
</section>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  delito: propTypes.object
})

const coordenadasDelito = {
  latitude: props.delito.direccionDelito.latitud,
  longitude: props.delito.direccionDelito.longitud
}
</script>
