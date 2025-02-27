<template>
<AppFieldset legend="Fecha y Hora del Delito">
  <div class="col-12 field-checkbox">
    <AppCheckbox
      id="esFechaHoraPorRango"
      v-model="form.esFechaHoraPorRango"
      binary
    />
    <label for="esFechaHoraPorRango">Ingresar Fecha y Hora por Rango</label>
  </div>
  <div
    v-if="form.esFechaHoraPorRango"
    class="col-12"
  >
    <span class="p-float-label">
      <Calendar
        id="fechaHoraDelitoInicio"
        v-model="form.fechaHoraDelitoInicio"
        date-format="dd-mm-yy"
        input-class="p-inputtext-sm"
        :max-date="new Date()"
        show-button-bar
        show-icon
        show-time
      />
      <label for="fechaHoraDelitoInicio">Fecha y Hora Inicio del Delito</label>
    </span>
  </div>
  <div
    v-if="form.esFechaHoraPorRango"
    class="col-12"
  >
    <span class="p-float-label">
      <Calendar
        id="fechaHoraDelitoFin"
        v-model="form.fechaHoraDelitoFin"
        date-format="dd-mm-yy"
        input-class="p-inputtext-sm"
        :max-date="new Date()"
        show-button-bar
        show-icon
        show-time
      />
      <label for="fechaHoraDelitoFin">Fecha y Hora Fin del Delito</label>
    </span>
  </div>
  <AppCalendar
    v-else
    id="fechaDelito"
    v-model="form.fechaDelito"
    class="col-12"
    label="Fecha y Hora del Delito"
    :rules="{ required }"
    show-time
  />
  <div class="col-12 field-checkbox mt-4 mb-1">
    <AppCheckbox
      id="esFlagrante"
      v-model="form.esFlagrante"
      binary
    />
    <label for="esFlagrante">Es Flagrante</label>
  </div>
</AppFieldset>
</template>
<script setup>
import { defineProps, watch } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useDelitoInject } from '@/modules/global/composables/useDelito'

// ready
const { required } = useFormValidation()

const { delitoInject } = useDelitoInject()

const form = delitoInject.fechaHoraDelito

watch(form, () => {
  if (!form.esFechaHoraPorRango) {
    form.fechaHoraDelitoInicio = null
    form.fechaHoraDelitoFin = false
  }
})

defineProps({
  fechaDelito: {
    type: String,
    default: null
  }
})
</script>
