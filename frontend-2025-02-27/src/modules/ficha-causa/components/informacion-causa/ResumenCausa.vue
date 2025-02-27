<template>
<ul class="grid mt-3 w-full">
  <li class="col-12 md:col-4">
    <strong>Fecha Creación:</strong>
    {{ formatDate(resumenCausa?.fechaCreacion) }}
  </li>
  <li class="col-12 md:col-4">
    <strong>Estado de la Causa:</strong>
    {{ resumenCausa?.descripcionEstado || 'Estado Desconocido' }}
  </li>
  <li class="col-12 md:col-4">
    <strong>Cantidad de Sujetos:</strong>
    <span>
      <Button
        class="p-button-link p-0"
        :label="cantidad?.sujetos?.toString()"
        @click="scrollTo('#lista-intervinientes')"
      />
    </span>
  </li>
  <li class="col-12 md:col-4">
    <strong>Fecha Asignación:</strong>
    {{ formatDate(resumenCausa?.fechaAsignacion) }}
  </li>
  <li class="col-12 md:col-4">
    <strong>Etapa de la Causa:</strong>
    {{ resumenCausa?.nombreEtapaProceso || 'Etapa Desconocida' }}
  </li>
  <li class="col-12 md:col-4">
    <strong>Cantidad de Delitos:</strong>
    <span>
      <Button
        class="p-button-link p-0"
        :label="cantidad?.delitos?.toString()"
        @click="scrollTo('#lista-delitos')"
      />
    </span>
  </li>
  <li class="col-12 md:col-4">
    <strong>Cantidad de Diligencias:</strong>
    <span>
      <Button
        class="p-button-link p-0"
        :label="cantidad?.diligencias?.toString()"
        @click="scrollTo('#diligencias')"
      />
    </span>
  </li>
  <li class="col-12 md:col-4">
    <strong>Cantidad de Especies:</strong>
    <span>
      <Button
        class="p-button-link p-0"
        :label="cantidad?.especies?.toString()"
        @click="scrollTo('#lista-especies')"
      />
    </span>
  </li>
  <li class="col-12 md:col-4">
    <strong>Cantidad de Relaciones:</strong>
    <span>
      <Button
        class="p-button-link p-0"
        :label="cantidad?.relaciones?.toString()"
        @click="scrollTo('#relaciones')"
      />
    </span>
  </li>
  <li
    v-if="!resumenCausa?.alertas?.length"
    class="col-12 md:col-4"
  >
    <strong>Alertas:</strong> Sin Alertas
  </li>
  <li
    v-else
    class="col-12 md:col-4 flex align-self-center mb-1"
  >
    <strong class="flex align-self-center mr-2">Alertas: </strong>
    <span class="flex">
      <ChipAlerta
        v-for="(alerta, index) in resumenCausa?.alertas"
        :key="index"
        :alerta="alerta"
        class="m-1"
      />
    </span>
  </li>
</ul>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { appUtil, dateTimeUtil } from '@/utils'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'

defineProps({
  resumenCausa: propTypes.object,
  cantidad: propTypes.object
})

const { scrollTo } = appUtil

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}
</script>
<style lang="scss" scoped>
li{
  list-style: none;
}
</style>
