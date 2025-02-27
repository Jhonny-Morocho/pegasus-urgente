<template>
<AppFieldset
  class="p-fluid mb-8"
  icon="pi pi-minus"
  legend="Tipo de Salida y Observaciones"
>
  <div class="w-full grid px-4">
    <div class="col-6">
      <p><strong>Tipo de Salida: </strong>{{ data?.tipoDeSalida }}</p>
      <p v-if="esRevision">
        <strong>Disponiblididad del Documento: </strong>
        <span v-if="data?.disponibilidad">Disponible</span>
        <span v-else>No Disponible</span>
      </p>
      <p v-if="esReIngreso">
        <strong>Plazo: </strong>{{ data.plazoDias }}
      </p>
      <div v-if="esRevision">
        <p v-if="data?.nivelDeAutorizacion">
          <strong>Nivel de autorización requerido: </strong>Requiere
          Autorización del Fiscal
        </p>
      </div>
      <p>
        <strong>Observaciones de la solicitud: </strong>{{ data?.observaciones }}
      </p>
    </div>
    <div
      v-if="esRevision"
      class="col-6"
    >
      <p><strong>Edificio: </strong>{{ data?.edificio || 'N/A' }}</p>
      <p><strong>Bodega: </strong>{{ data?.bodega || 'N/A' }}</p>
      <p><strong>Pasillo: </strong>{{ data?.pasillo || 'N/A' }}</p>
      <p><strong>Estante: </strong>{{ data?.estante || 'N/A' }}</p>
      <p><strong>Casillero: </strong>{{ data?.casillero || 'N/A' }}</p>
    </div>
    <div
      v-if="esReIngreso"
      class="col-6"
    >
      <p>
        <strong>Fecha de Entrega: </strong>{{ formatDate(registroDevolucion?.fechaEntrega) }}
      </p>
      <p>
        <strong>Fecha de Devolución Requerida: </strong>{{ formatDate(registroDevolucion?.fechaDevolucionRequerida) }}
      </p>
    </div>
  </div>
</AppFieldset>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { requestUtil, dateTimeUtil } from '@/utils'
import { defineProps, onMounted } from 'vue'
import {
  useMantenedorCDD,
  useSolicitudesEncargadoBodega
} from '../../composables'
const { registroDevolucion } = useSolicitudesEncargadoBodega()

const props = defineProps({
  data: propTypes.object,
  esRevision: Boolean,
  esReIngreso: Boolean
})

function formatDate (date) {
  if (!date) {
    return ''
  }
  return dateTimeUtil.formatToFrontend(date)
}

const {
  // ubicacionEdificios,
  // ubicacionBodegas,
  // ubicacionEstantes,
  // ubicacionPasillos,
  // ubicacionCasilleros,
  mantenedorCDD_getUbicacionEdificios,
  mantenedorCDD_getUbicacionBodegas,
  mantenedorCDD_getUbicacionPasillos,
  mantenedorCDD_getUbicacionEstantes,
  mantenedorCDD_getUbicacionCasilleros
} = useMantenedorCDD()

onMounted(async () => {
  console.log(props.data)
  await requestUtil({ action: mantenedorCDD_getUbicacionEdificios })
  await requestUtil({
    action: mantenedorCDD_getUbicacionBodegas,
    payload: { idEdificio: props?.data?.edificio }
  })
  await requestUtil({
    action: mantenedorCDD_getUbicacionPasillos,
    payload: { idBodega: props?.data?.bodega }
  })
  await requestUtil({
    action: mantenedorCDD_getUbicacionEstantes,
    payload: { idPasillo: props?.data?.pasillo }
  })
  await requestUtil({
    action: mantenedorCDD_getUbicacionCasilleros,
    payload: { idEstante: props?.data?.estante }
  })
})
</script>
<style scoped>
p {
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
