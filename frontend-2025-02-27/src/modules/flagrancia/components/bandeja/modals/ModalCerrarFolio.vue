<template>
<div class="grid px-3 text-xl">
  <div class="col-12 my-1">
    <span><strong>Fiscal / Turno: </strong></span>
    <span>{{ payloadModalCerrarFolio?.fiscalTurno.toUpperCase() }}</span>
  </div>
  <div class="col-12 my-1">
    <span><strong>Procedimiento: </strong>Folio </span>
    <span>{{ payloadModalCerrarFolio?.folio }}</span>
  </div>
  <div class="col-12 my-1">
    <span><strong>Funcionario Responsable: </strong></span>
    <span> {{ payloadModalCerrarFolio?.funcionario.toUpperCase() ?? payloadModalCerrarFolio?.fiscalTurno.toUpperCase() }} </span>
  </div>
  <div class="col-12 my-1">
    <span><strong>Unidad Policial: </strong></span>
    <span> {{ payloadModalCerrarFolio?.unidadPolicial }} </span>
  </div>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'

import { defineProps } from 'vue'

defineProps({
  payloadModalCerrarFolio: propTypes.object
})
</script>
