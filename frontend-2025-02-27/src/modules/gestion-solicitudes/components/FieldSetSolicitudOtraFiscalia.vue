<template>
<div class="col-12">
  <AppFieldset legend="Respuesta Solicitud Otra Fiscalía">
    <div class="col-6 flex w-full">
      <div class="p-inputgroup">
        <AppDropdown
          id="respuesta-solicitud-otra-fiscalia"
          v-model="formData.idRespuestaSolicitud"
          class="col-12 md:col-4"
          label="Respuesta (*)"
          option-label="name"
          option-value="value"
          :options="solicitudOpciones"
          placeholder
          show-clear
        />
      </div>
    </div>
    <div class="col-12">
      <div class="p-inputgroup">
        <AppTextarea
          id="observacion-solicitud-otra-fiscalia"
          v-model="formData.observacion"
          class="col-12"
          label="Argumentar Resultado de la Diligencia (*)"
          :rows="4"
        />
      </div>
    </div>
    <div class="col-12">
      <div class="p-inputgroup">
        <Button
          class="w-3 p-button-outlined ml-2"
          icon="pi pi-paperclip"
          icon-pos="right"
          label="Seleccionar Archivo"
        />
      </div>
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppDropdown from '@/modules/common/components/inputs/AppDropdown.vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import AppTextarea from '@/modules/common/components/inputs/AppTextarea.vue'

const solicitudOpciones = ref([
  {
    name: 'Diligencia Ejecutada',
    value: 1
  },
  {
    name: 'Diligencia No Ejecutada',
    value: 2
  },
  {
    name: 'Oficio de las constancias donde se trató de contactar a la vícitima'
  }
])

const formData = reactive({
  idRespuestaSolicitud: null,
  observacion: ''
})
</script>
