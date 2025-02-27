<template>
<AppFieldset
  class="col-12 mb-0 pb-0"
  legend="Relato del Hecho"
>
  <RelatoEditor
    can-edit
    v-bind="{ ...$attrs }"
    :read-only="readonly"
    :relato="dataCausa"
    @editor-relato:generar-plantilla="generarPlantilla"
    @editor-relato:guardar-relato="guardarRelato"
  />
</AppFieldset>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import RelatoEditor from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import { defineProps } from 'vue'
const readonly = true
defineProps({
  dataCausa: propTypes.object
})
</script>
