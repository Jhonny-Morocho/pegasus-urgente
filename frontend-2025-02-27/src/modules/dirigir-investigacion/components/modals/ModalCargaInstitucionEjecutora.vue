<template>
<hr>
<section class="grid px-4 mt-4">
  <div class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora último mes"
      no-margin-bottom
    >
      <ul class="lista-carga">
        <li><strong>Cantidad de diligencias o solicitudes:</strong> {{ cargaLastMonth.solicitudes }}</li>
        <li><strong>Cantidad de diligencias o solicitudes respondidas:</strong> {{ cargaLastMonth.solicitudesRespondidas }}</li>
        <li><strong>Tiempo promedio de demora en Responder:</strong> {{ cargaLastMonth.tiempoPromedioRespuesta }} días</li>
      </ul>
    </AppFieldset>
  </div>
  <div class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora últimos 3 meses"
      no-margin-bottom
    >
      <ul class="lista-carga">
        <li><strong>Cantidad de diligencias o solicitudes:</strong> {{ cargaLast3Month.solicitudes }}</li>
        <li><strong>Cantidad de diligencias o solicitudes respondidas:</strong> {{ cargaLast3Month.solicitudesRespondidas }}</li>
        <li><strong>Tiempo promedio de demora en Responder:</strong> {{ cargaLast3Month.tiempoPromedioRespuesta }} días</li>
      </ul>
    </AppFieldset>
  </div>
  <div class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora últimos 6 meses"
      no-margin-bottom
    >
      <ul class="lista-carga">
        <li><strong>Cantidad de diligencias o solicitudes:</strong> {{ cargaLast6Month.solicitudes }}</li>
        <li><strong>Cantidad de diligencias o solicitudes respondidas:</strong> {{ cargaLast6Month.solicitudesRespondidas }}</li>
        <li><strong>Tiempo promedio de demora en Responder:</strong> {{ cargaLast6Month.tiempoPromedioRespuesta }} días</li>
      </ul>
    </AppFieldset>
  </div>
  <div class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora último 12 meses"
      no-margin-bottom
    >
      <ul class="lista-carga">
        <li><strong>Cantidad de diligencias o solicitudes:</strong> {{ cargaLast12Month.solicitudes }}</li>
        <li><strong>Cantidad de diligencias o solicitudes respondidas:</strong> {{ cargaLast12Month.solicitudesRespondidas }}</li>
        <li><strong>Tiempo promedio de demora en Responder:</strong> {{ cargaLast12Month.tiempoPromedioRespuesta }} días</li>
      </ul>
    </AppFieldset>
  </div>
</section>
</template>
<script setup>
import { reactive } from 'vue'

const cargaLastMonth = reactive({
  solicitudes: 4,
  solicitudesRespondidas: 4,
  tiempoPromedioRespuesta: 2
})
const cargaLast3Month = reactive({
  solicitudes: 7,
  solicitudesRespondidas: 6,
  tiempoPromedioRespuesta: 5
})
const cargaLast6Month = reactive({
  solicitudes: 15,
  solicitudesRespondidas: 14,
  tiempoPromedioRespuesta: 8
})
const cargaLast12Month = reactive({
  solicitudes: 34,
  solicitudesRespondidas: 31,
  tiempoPromedioRespuesta: 17
})
</script>
<style scoped lang="scss">
.lista-carga{
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-left: 1rem;
}
</style>
