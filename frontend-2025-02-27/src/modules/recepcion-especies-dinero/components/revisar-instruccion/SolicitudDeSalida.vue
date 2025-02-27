<template>
<div class="grid col-12">
  <p class="col-6">
    <span>Fecha de solicitud:</span>{{ dateTimeUtil.formatToFrontend(dataSolicitud?.fechaSolicitud) }}
  </p>
  <p
    v-if="!salidaTemporalInstruccion"
    class="col-6"
  >
    <span>Motivo de Salida:</span>Peritaje
  </p>

  <p
    v-if="!salidaTemporal"
    class="col-6"
  >
    <span>Dirección:</span>{{ dataSolicitud?.direccion }}
  </p>
  <p
    v-if="salidaTemporal"
    class="col-6"
  >
    <span>Fecha de salida agendada:</span>{{ dataSolicitud?.fechaSalidaAgendada }}
  </p>
  <p
    v-if="donacion"
    class="col-6"
  >
    <span>Institución:</span>{{ dataSolicitud?.institucion }}
  </p>

  <p
    v-if="!salidaTemporal"
    class="col-6"
  >
    <span>Plazo de salida:</span>{{ dataSolicitud?.plazo }}
  </p>
  <p
    v-if="!salidaTemporalInstruccion"
    class="col-6"
  >
    <span>Institución a quién se le entrega las especies:</span>{{ dataSolicitud?.institucion }}
  </p>
  <p class="col-6">
    <span>Tipo de Salida:</span>{{ dataSolicitud?.idTipoSalida }}
  </p>
  <p
    v-if="!salidaTemporalInstruccion"
    class="col-6"
  >
    <span>Receptor:</span>{{ dataSolicitud?.nombreReceptor }}
  </p>
  <p
    v-if="!salidaTemporalInstruccion"
    class="col-6"
  >
    <span>Plazo de Salida:</span>{{ dataSolicitud?.plazo }}
  </p>
  <p
    v-if="!salidaTemporalInstruccion"
    class="col-6"
  >
    <span>RUN Receptor:</span>{{ dataSolicitud?.runReceptor }}
  </p>
  <p
    v-if="!salidaTemporal"
    class="col-6"
  >
    <span>Correo Electrónico:</span>{{ dataSolicitud.correoElectronico }}
  </p>
  <p
    v-if="!salidaTemporal"
    class="col-6"
  >
    <span>RUN del Dueño:</span>{{ dataSolicitud.runDelDueno }}
  </p>
  <div
    v-if="!salidaTemporal"
    class="grid p-fluid col-12"
  >
    <p

      class="col-6"
    >
      <span>Motivo de Salida:</span>{{ dataSolicitud.idMotivoSalida }}
    </p>
    <p
      class="col-6 pl-3"
    >
      <span>Teléfono:</span>{{ dataSolicitud.telefono }}
    </p>
    <p
      class="col-6"
    >
      <span>Nombre del Dueño:</span>{{ dataSolicitud.nombreDelDueno }}
    </p>
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

defineProps({
  dataSolicitud: propTypes.object,
  donacion: {
    type: Boolean,
    default: false
  },
  salidaTemporal: Boolean,
  salidaTemporalInstruccion: Boolean
})
</script>

<style scoped>
span {
  font-weight: bold;
  margin-right: 6px;
}
p {
  margin-top: 4px;
}
</style>
