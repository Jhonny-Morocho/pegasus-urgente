<template>
<DatosSolicitarSalida />
<div class="col-12 flex">
  <div class="col-4">
    <AppDropdown
      id="lugarRecepcion"
      class="col-12 p-fluid"
      label="Lugar de Recepción"
    />
  </div>
  <div class="col-4">
    <AppInput
      id="run"
      class="col-12 p-fluid"
      label="RUN Receptor"
    />
  </div>
  <div class="col-4">
    <AppInput
      id="nombreReceptor"
      class="col-12 p-fluid"
      label="Nombre Receptor"
    />
  </div>
</div>
<div class="col-12 flex">
  <div class="col-6">
    <AppCalendar
      id="fechaAgendada"
      class="col-12 p-fluid"
      label="Fecha Agendada"
    />
  </div>
  <div class="col-6">
    <AppDropdown
      id="lugarRecepcion"
      class="col-12 p-fluid"
      label="Plazo de salida"
    />
  </div>
</div>
<div class="col-12 flex">
  <div class="col-12">
    <AppInput
      id="observaciones"
      class="col-12 p-fluid"
      label="Observaciones"
    />
  </div>
</div>
</template>
<script setup>
import DatosSolicitarSalida from '@/modules/gestion-solicitudes/components/DatosSolicitarSalida.vue'
</script>
