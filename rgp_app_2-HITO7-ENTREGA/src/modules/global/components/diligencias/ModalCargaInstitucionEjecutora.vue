<template>
<main class="px-3 w-full formgrid grid">
  <hr class="w-full mb-5">
  <section class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora Último Mes"
      :loading="isLoading"
    >
      <ul class="list-none w-full flex flex-column gap-2 px-3">
        <li>
          <strong>Cantidad de diligencias o solicitudes: </strong> {{ cargaUltimoMes?.cantDiligenciasYSolicitudes || 'Sin Datos' }}
        </li>
        <li>
          <strong>Cantidad de diligencias o solicitudes respondidas: </strong> {{ cargaUltimoMes?.cantDiligenciasYSolicitudesRespondidas || 'Sin Datos' }}
        </li>
      </ul>
    </AppFieldset>
  </section>
  <section class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora Últimos 3 Meses"
      :loading="isLoading"
    >
      <ul class="list-none w-full flex flex-column gap-2 px-3">
        <li>
          <strong>Cantidad de diligencias o solicitudes: </strong> {{ cargaUltimos3Meses?.cantDiligenciasYSolicitudes || 'Sin Datos' }}
        </li>
        <li>
          <strong>Cantidad de diligencias o solicitudes respondidas: </strong> {{ cargaUltimos3Meses?.cantDiligenciasYSolicitudesRespondidas || 'Sin Datos' }}
        </li>
        <li>
          <strong>Tiempo promedio de respuesta: </strong> {{ diasRespuesta(cargaUltimos3Meses?.respuestaPromedioDias) }}
        </li>
      </ul>
    </AppFieldset>
  </section>
  <section class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora Últimos 6 Meses"
      :loading="isLoading"
    >
      <ul class="list-none w-full flex flex-column gap-2 px-3">
        <li>
          <strong>Cantidad de diligencias o solicitudes: </strong> {{ cargaUltimos6Meses?.cantDiligenciasYSolicitudes || 'Sin Datos' }}
        </li>
        <li>
          <strong>Cantidad de diligencias o solicitudes respondidas: </strong> {{ cargaUltimos6Meses?.cantDiligenciasYSolicitudesRespondidas || 'Sin Datos' }}
        </li>
        <li>
          <strong>Tiempo promedio de respuesta: </strong> {{ diasRespuesta(cargaUltimos6Meses?.respuestaPromedioDias) }}
        </li>
      </ul>
    </AppFieldset>
  </section>
  <section class="col-12 md:col-6">
    <AppFieldset
      legend="Carga Institución Ejecutora Últimos 12 Meses"
      :loading="isLoading"
    >
      <ul class="list-none w-full flex flex-column gap-2 px-3">
        <li>
          <strong>Cantidad de diligencias o solicitudes: </strong> {{ cargaUltimos12Meses?.cantDiligenciasYSolicitudes || 'Sin Datos' }}
        </li>
        <li>
          <strong>Cantidad de diligencias o solicitudes respondidas: </strong> {{ cargaUltimos12Meses?.cantDiligenciasYSolicitudesRespondidas || 'Sin Datos' }}
        </li>
        <li>
          <strong>Tiempo promedio de respuesta: </strong> {{ diasRespuesta(cargaUltimos12Meses?.respuestaPromedioDias) }}
        </li>
      </ul>
    </AppFieldset>
  </section>
  <section class="w-full flex flex-row-reverse">
    <Button
      class="p-button-text px-3"
      label="Cerrar"
      @click="dialogRef.close"
    />
  </section>
</main>
</template>

<script setup>
import { inject, computed, ref, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useCargaTrabajoStore } from '../../composables'

const dialogRef = inject('dialogRef')

const { cargaTrabajo_getCargaInstitucionEjecutora } = useCargaTrabajoStore()

const idInstitucionEjecutora = computed(() => dialogRef.value?.data?.idInstitucionEjecutora)

const isLoading = ref(false)

const cargaUltimoMes = ref()
const cargaUltimos3Meses = ref()
const cargaUltimos6Meses = ref()
const cargaUltimos12Meses = ref()

function diasRespuesta (dias) {
  if (!dias) return 'Sin Datos'

  if (dias === 0 || dias > 1) {
    return `${dias} Días`
  }

  return `${dias} Día`
}

function getCargaInsitucion () {
  requestUtil({
    action: cargaTrabajo_getCargaInstitucionEjecutora,
    loader: (l) => { isLoading.value = l },
    payload: {
      idInstitucionEjecutora: idInstitucionEjecutora.value
    },
    resolve: (data) => {
      cargaUltimoMes.value = data?.estadisticaUltimoMes
      cargaUltimos3Meses.value = data?.estadisticaUltimo3Meses
      cargaUltimos6Meses.value = data?.estadisticaUltimo6Meses
      cargaUltimos12Meses.value = data?.estadisticaUltimo12Meses
    }
  })
}

onMounted(() => {
  getCargaInsitucion()
})
</script>
