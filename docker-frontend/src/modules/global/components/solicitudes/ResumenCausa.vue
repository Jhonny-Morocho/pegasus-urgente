<template>
<AppFieldset
  class="w-full mt-4 p-2 m-0"
  :legend="title"
>
  <div class="col-12">
    <div class="col-12 grid">
      <div class="col-12 md:col-6">
        <p class="flex align-items-center p-0 mb-3">
          <strong>RUC:</strong>
          <Button
            class="p-button-text btn-primary-outline p-0 ml-1"
            :label="causa?.ruc ?? causa?.rolUnico"
            @click="openFichaCausa(causa)"
          />
        </p>
        <p class="my-3">
          <strong>Nombre Causa: </strong> {{ causa?.nombre ?? 'No Disponible' }}
        </p>
        <p class="my-3">
          <strong>Causa Reservada: </strong>{{ causa?.esReservada ? 'SI' : 'NO' }}
        </p>
        <p class="mt-3">
          <strong>Fecha Creación Causa: </strong>{{ causa?.fecha ?? 'No Disponible' }}
        </p>
      </div>
      <div class="col-12 md:col-6">
        <p class="mb-3">
          <strong>Fiscalía Local: </strong>{{ causa?.fiscalia ?? 'No Disponible' }}
        </p>
        <p class="my-3">
          <strong>Fiscal Asignado: </strong>{{ causa?.fiscalAsignado ?? 'No Disponible' }}
        </p>
        <p class="my-3">
          <strong>Estado de la Causa: </strong>{{ causa?.descripcionEstado ?? 'No Disponible' }}
        </p>
        <p class="mt-3">
          <strong>Fecha de Prescripción: </strong>{{ causa?.fechaPreinscripcion ?? 'No Disponible' }}
        </p>
      </div>
    </div>
    <div
      v-show="false"
      class="col-12"
    >
      <div class="flex flex-column px-1">
        <p class="mb-3">
          <strong>Proceso de la Causa: </strong>{{ causa?.procesoCausa ?? 'No Disponible' }}
        </p>
        <p class="mt-3 my-3">
          <strong>Estado de las Relaciones de la Causa: </strong>{{ causa?.idEstado ?? 'No Disponible' }}
        </p>
        <p class="mt-3 my-3">
          <strong>Etapa de las Relaciones de la Causa: </strong>{{ causa?.idEtapaProceso ?? 'No Disponible' }}
        </p>
        <p class="mt-3 my-3">
          <strong>Estado Procesal: </strong>{{ causa?.estadoProcesal ?? 'No Disponible' }}
        </p>
        <p class="my-3">
          <strong>Fecha de Asignación: </strong>{{ causa?.fechaAsignacion ?? 'No Disponible' }}
        </p>
        <p class="mt-3 mb-3">
          <strong>Fecha de Formalización: </strong>{{ causa?.fechaFormalizacion ?? 'No Disponible' }}
        </p>
        <p class="mt-3 mb-3">
          <strong>Plazo investigación: </strong>{{ causa?.plazoInvestigacion ?? 'No Disponible' }}
        </p>
      </div>
    </div>
  </div>
</AppFieldset>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'

import { propTypes } from '@/modules/common/types'

defineProps({
  title: propTypes.string,
  causa: propTypes.object
})

const emit = defineEmits(['ficha-causa'])

function openFichaCausa (causa) {
  emit('ficha-causa', causa)
}
</script>
