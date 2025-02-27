<template>
<AppFieldset legend="Fecha y Hora del Delito">
  <div
    v-if="$route.path === '/ingreso/denuncia-directa/nueva-denuncia/delitos'"
    class="col-12 field-checkbox"
  >
    <Checkbox
      id="es-flagrante"
      v-model="formData.esFlagrante"
      binary
      :disabled="readOnly "
    />
    <label for="es-flagrante">¿Es Flagrante?</label>
  </div>
  <div class="col-12 field-checkbox">
    <Checkbox
      id="es-por-rango"
      v-model="formData.fechaHoraRango"
      binary
      :disabled="readOnly"
      @change="setPorRango"
    />
    <label for="es-por-rango">¿Ingresar Fecha y Hora por Rango?</label>
  </div>
  <AppCalendar
    v-if="!formData.fechaHoraRango"
    id="fecha-hora-delito"
    v-model="formData.fechaOcurrencia"
    class="col-12"
    :disabled="readOnly"
    label="Fecha y Hora del Delito"
    :rules="{ required }"
    show-time
  />
  <AppCalendar
    v-if="formData.fechaHoraRango"
    id="fecha-hora-delito-inicio"
    v-model="formData.fechaHoraDelitoInicio"
    class="col-12"
    :disabled="readOnly"
    label="Fecha y Hora Inicio del Delito"
    show-time
  />
  <AppCalendar
    v-if="formData.fechaHoraRango"
    id="fecha-hora-delito-fin"
    v-model="formData.fechaHoraDelitoFin"
    class="col-12 pt-0"
    :disabled="readOnly"
    label="Fecha y Hora Fin del Delito"
    :min-date="formData.fechaHoraDelitoInicio"
    show-time
  />
</AppFieldset>
</template>
<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { defineProps } from 'vue'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useRoute } from 'vue-router'
const $route = useRoute()
defineProps({
  readOnly: Boolean
})

const { required } = useFormValidation()

const { delitoInject } = useDelitoInject()

const formData = delitoInject

function setPorRango () {
  if (formData.fechaHoraRango) {
    formData.fechaOcurrencia = '1900-01-01T00:00:00.000'
    formData.fechaHoraDelitoInicio = null
    formData.fechaHoraDelitoFin = null
  } else {
    formData.fechaHoraDelitoInicio = '1900-01-01T00:00:00.000'
    formData.fechaHoraDelitoFin = '1900-01-01T00:00:00.000'
    formData.fechaOcurrencia = null
  }
}

</script>
