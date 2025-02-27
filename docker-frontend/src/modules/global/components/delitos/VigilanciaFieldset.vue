<template>
<AppFieldset legend="Vigilancia">
  <AppDropdown
    id="tipo-vigilancia"
    v-model="formData.tipoVigilancia"
    class="col-12"
    :disabled="readOnly"
    label="Tipo Vigilancia"
    option-label="descripcion"
    option-value="id"
    :options="tipoVigilancia"
    :retrieve-data-action="mantenedor_getTipoVigilancia"
    show-clear
  />
  <AppDropdown
    id="medidas-seguridad"
    v-model="formData.medidasSeguridad"
    class="col-12 mb-0"
    :disabled="readOnly"
    label="Medidas de Seguridad"
    option-label="descripcion"
    option-value="id"
    :options="medidaSeguridad"
    :retrieve-data-action="mantenedor_getMedidasSeguridad"
    show-clear
  />
</AppFieldset>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useMantenedorStore } from '@/modules/global/composables/'

const {
  tipoVigilancia, mantenedor_getTipoVigilancia,
  medidaSeguridad, mantenedor_getMedidasSeguridad
} = useMantenedorStore()

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject

</script>
