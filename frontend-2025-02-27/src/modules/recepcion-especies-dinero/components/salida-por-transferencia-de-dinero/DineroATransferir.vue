
<template>
<p class="col-12 md:col-6">
  <span class="font-bold">NUE: </span>{{ dataDineroATransferir.nue }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Fecha de Ingreso: </span>{{ dataDineroATransferir.fechaDeIngreso }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">RUE: </span>{{ dataDineroATransferir.rue }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Tipo de Moneda: </span>{{ dataDineroATransferir.tipoDeMoneda }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Tipo de Delito: </span>{{ dataDineroATransferir.tipoDeDelito }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Monto: </span>{{ dataDineroATransferir.monto }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Responsable de UAF de Origen: </span>{{ dataDineroATransferir.responsableDeUAFDeOrigen }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Tipo de Depósito: </span>{{ dataDineroATransferir.tipoDeDeposito }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold">Responsable de UAF de Destino: </span>{{ dataDineroATransferir.responsableDeUAFDeDestino }}
</p>
</template>

<script setup >
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  dataDineroATransferir: propTypes.object
})

</script>
