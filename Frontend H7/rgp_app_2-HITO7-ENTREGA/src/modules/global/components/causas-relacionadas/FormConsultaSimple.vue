<template>
<main class="grid p-fluid">
  <AppInput
    id="nombre-victima"
    v-model="consulta.nombreVictima"
    class="col-12 md:col-6"
    label="Nombre Víctima"
  />
  <AppInput
    id="nombre-imputado"
    v-model="consulta.nombreImputado"
    class="col-12 md:col-6"
    label="Nombre Imputado"
  />
  <AppCalendar
    id="fecha-delito"
    v-model="consulta.fechaDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Fecha Delito"

    show-time
  />
  <AppDropdown
    id="familia-delito"
    v-model="consulta.idFamiliaDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Familia del Delito"
    option-label="descripcion"
    option-value="id"
    :options="familiasDelito"
    :retrieve-data-action="mantenedor_getFamiliasDelito"

    show-clear
  />
  <AppDropdown
    id="delito"
    v-model="consulta.idTipoDelito"
    class="col-12 md:col-6 lg:col-4"
    label="Tipo de Delito"
    option-label="descripcion"
    option-value="id"
    :options="tipoDelitoOptions"
    :retrieve-data-action="mantenedor_getTiposDelito"

    show-clear
  />
</main>
</template>

<script setup>
import { computed } from 'vue'
import { useCausaRelacionadaState, useMantenedorStore } from '@/modules/global/composables'
import { useFormValidation } from '@/modules/common/composables'

const { consulta } = useCausaRelacionadaState()

const {
  familiasDelito,
  tiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getTiposDelito
} = useMantenedorStore()

// eslint-disable-next-line no-unused-vars
const { required } = useFormValidation()

const tipoDelitoOptions = computed(() => {
  const tipos = tiposDelito.value?.filter(d => d.idPadre === consulta.idFamiliaDelito)
  if (tipos?.length) {
    return tipos
  }
  return [{ id: -1, descripcion: 'Sin Tipo Delito' }]
})
</script>
