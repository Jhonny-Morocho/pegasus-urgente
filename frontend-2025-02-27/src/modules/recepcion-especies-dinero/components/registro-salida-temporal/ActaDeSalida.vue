<template>
<div :class="modal ? 'grid col-12 p-fluid': 'grid col-12'">
  <div
    :class="modal ? 'col-6': 'col-12 md:col-6'"
  >
    <p><span>RUC:</span>{{ dataActa?.RUC }}</p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12 md:col-6'"
  >
    <p><span>Receptor:</span>{{ dataActa?.nombreReceptor }}</p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12 md:col-6'"
  >
    <p><span>Fiscal que autoriza:</span>{{ dataActa?.fiscalAutoriza }}</p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12 md:col-6'"
  >
    <p><span>RUN del Receptor:</span>{{ dataActa?.runReceptor }}</p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12 md:col-6'"
  >
    <p><span>Fiscalía:</span>{{ dataActa?.fiscalia }}</p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12 md:col-6'"
  >
    <p><span>Institución a quién se le entrega la(s) especie(s):</span>{{ dataActa?.institucionReceptora }}</p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12'"
  >
    <p><span>Custodio:</span>{{ dataActa?.nombreCustodio }}</p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12'"
  >
    <p class="mt-3">
      <span>RUN Custodio:</span>{{ dataActa?.runCustodio }}
    </p>
  </div>
  <div
    :class="modal ? 'col-6': 'col-12 md:col-6'"
  >
    <p><span>Observaciones:</span>{{ dataActa?.observaciones }}</p>
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'

defineProps({
  dataActa: propTypes.object,
  modal: Boolean,
  dataActaSalidaTemporal: propTypes.object
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
