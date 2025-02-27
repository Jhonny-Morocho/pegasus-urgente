
<template>
<p class="col-12 md:col-6">
  <span class="font-bold">RUC: </span>{{ dataCausa.ruc }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fecha Creación Causa: </span>{{ dataCausa.fechaCreacionCausa }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fiscalía Regional: </span>{{ dataCausa.fiscaliaRegional }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Estado de la causa: </span>{{ dataCausa.estadoCausa }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fiscal Asignado: </span>{{ dataCausa.fiscalAsignado }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Nombre Causa: </span>{{ dataCausa.nombreCausa }}
</p><p
  v-for="delito in dataCausa.delitos"
  :key="delito"
  class="col-12 md:col-6"
>
  <span class="font-bold">Delito(s): </span>
  - {{ delito }}
</p>
</template>

<script setup >
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  dataCausa: propTypes.object
})

</script>
