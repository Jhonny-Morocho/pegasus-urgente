<template>
<AppFieldset legend="Descripción del Lugar del Delito">
  <AppDropdown
    id="zona-delito"
    v-model="formData.zonaDelito"
    class="col-12 md:col-6"
    :disabled="readOnly"
    label="Zona del Delito"
    option-label="descripcion"
    option-value="id"
    :options="zonaDelito"
    :retrieve-data-action="mantenedor_getZonaDelito"
    show-clear
  />
  <AppDropdown
    id="tipo-lugar-ocurrencia"
    v-model="formData.tipoLugarOcurrencia"
    class="col-12 md:col-6"
    :disabled="readOnly"
    label="Tipo de Lugar de Ocurrencia"
    option-label="descripcion"
    option-value="id"
    :options="tipoLugarOcurrencia"
    :retrieve-data-action="mantenedor_getTipoLugarOcurrencia"
    show-clear
  />
  <AppDropdown
    id="via-ingreso"
    v-model="formData.viaIngreso"
    class="col-12 md:col-6 md:mb-0"
    :disabled="readOnly"
    label="Vía de Ingreso"
    option-label="descripcion"
    option-value="id"
    :options="viaIngreso"
    :retrieve-data-action="mantenedor_getViaIngreso"
    show-clear
  />
  <AppInput
    id="lugar-especifico-ocurrencia"
    v-model="formData.lugarEspecificoOcurrencia"
    class="col-12 md:col-6 md:mb-0"
    :disabled="readOnly"
    label="Lugar Específico de Ocurrencia"
  />
</AppFieldset>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useMantenedorStore } from '@/modules/global/composables'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject

const {
  zonaDelito, mantenedor_getZonaDelito,
  tipoLugarOcurrencia, mantenedor_getTipoLugarOcurrencia,
  viaIngreso, mantenedor_getViaIngreso
} = useMantenedorStore()

</script>
