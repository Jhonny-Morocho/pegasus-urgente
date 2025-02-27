<template>
<div class="px-4 pb-4">
  <h3
    v-if="data?.tipo === 'SC'"
    class="mb-3 text-xl"
  >
    El Imputado presenta {{ data.tipo }}
  </h3>
  <h3
    v-if="data?.tipo === 'ODV'"
    class="mb-3 text-xl"
  >
    El Imputado posee {{ data.tipo }}
  </h3>
  <h3
    v-if="data?.tipo === 'PP'"
    class="mb-3 text-xl"
  >
    El Imputado tiene {{ data.tipo }}
  </h3>
  <div>
    <div class="grid px-3 text-xl justify-content-center">
      <div class="col-12 my-1">
        <span><strong>Ruc: </strong></span>
        <span>{{ data?.ruc }}</span>
      </div>
      <div class="col-12 my-1">
        <span><strong>Fiscalía: </strong></span>
        <span>{{ data?.fiscalia ?? 'Sin Información' }} </span>
      </div>
      <div class="col-12 my-1">
        <span><strong>Fiscal Asignado: </strong></span>
        <span>{{ data?.fiscal ?? 'Sin Información' }}</span>
      </div>
      <div class="col-12 my-1">
        <span><strong>Delito(s): </strong></span>
        <ul
          v-for="(delito, index) in data?.delitos"
          :key="index"
          class="list-none pl-0"
        >
          <li>
            {{ delito }}
          </li>
        </ul>
      </div>
      <div
        v-if="data?.tipo === 'SC'"
        class="col-12 my-1"
      >
        <span><strong>Acuerdo o Condición: </strong></span>
        <span>{{ data?.acuerdo ?? 'Sin Información' }}</span>
      </div>
      <div
        class="col-12 my-1"
      >
        <span v-if="data?.tipo === 'SC'"><strong>Fecha inicio SC: </strong></span>
        <span v-if="data?.tipo === 'ODV'"><strong>Fecha  de emisión ODV: </strong></span>
        <span v-if="data?.tipo === 'PP'"><strong>Fecha inicio PP: </strong></span>
        <span v-if="data?.fechaOrden"> {{ dateTimeUtil.formatToFrontendWithTime(data?.fechaOrden) }} </span>
        <span v-else> Sin Información </span>
      </div>
      <div
        v-if="data?.tipo === 'SC'"
        class="col-12 my-1"
      >
        <span><strong>Registro de Cumplimiento: </strong></span>
        <span> {{ data.registroCumplimiento ?? 'Sin Información' }} </span>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>
