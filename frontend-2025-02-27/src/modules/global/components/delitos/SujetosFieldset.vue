<template>
<AppFieldset legend="Sujetos que Cometieron el Hecho Delictual">
  <AppDropdown
    id="cantidad-sujetos"
    v-model="formData.cantidadSujetosCometieronHechoDelictual"
    class="col-12"
    :disabled="readOnly"
    label="Cantidad de Sujetos"
    option-label="descripcion"
    option-value="id"
    :options="cantidadSujetos"
    :retrieve-data-action="mantenedor_getCantidadSujetos"
    show-clear
  />
  <AppDropdown
    id="modalidad-grupo"
    v-model="formData.modalidadGrupo"
    class="col-12 pb-1"
    :disabled="readOnly"
    label="Modalidad de Grupo"
    option-label="descripcion"
    option-value="id"
    :options="modalidadGrupo"
    :retrieve-data-action="mantenedor_getModalidadGrupo"
    show-clear
  />
</AppFieldset>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useMantenedorStore } from '@/modules/global/composables/'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject
const {
  modalidadGrupo, mantenedor_getModalidadGrupo,
  cantidadSujetos, mantenedor_getCantidadSujetos
} = useMantenedorStore()

</script>
