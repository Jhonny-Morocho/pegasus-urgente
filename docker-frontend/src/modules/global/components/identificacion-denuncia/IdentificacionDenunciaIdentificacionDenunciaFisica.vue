<template>
<div class="p-fluid">
  <AppFieldset legend="Identificación de la Denuncia">
    <AppInput
      id="id-unico-denuncia"
      v-model="formData.identificadorUnicoDenuncia"
      class="col-12 md:col-4"
      disabled
      label="Identificador Único de Denuncia"
    />
    <AppInput
      id="n-parte-denuncia"
      v-model="formData.numeroParteDenuncia"
      class="col-12 md:col-4"
      disabled
      label="Nº Parte Denuncia"
    />
    <AppCalendar
      id="fecha-parte-denuncia"
      v-model="formData.fechaParteDenuncia"
      class="col-12 md:col-4"
      disabled
      label="Fecha/Hora Parte/Denuncia"
      show-time
    />
    <AppDropdown
      id="tipo-denuncia"
      v-model="formData.idTipoDenuncia"
      class="col-12 md:col-4 md:pt-4 md:pb-0"
      disabled
      label="Tipo de Denuncia"
      option-label="descripcion"
      option-value="id"
      :options="tiposDenuncia"
      show-clear
    />
    <AppInput
      id="medio-recepcion"
      v-model="formData.medioDeRecepcion"
      class="col-12 md:col-4 md:pt-4 md:pb-0"
      label="Medio de Recepción"
    />
    <div class="col-12 md:col-4 text-center md:py-0">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Denuncia Reservada (*)?
        </h4>
      </div>
      <AppSelectButton
        id="es-denuncia-reservada"
        v-model="formData.esReservada"
        class="col-12 mb-0 pt-0"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{
          required
        }"
      />
    </div>
  </AppFieldset>
</div>
</template>
<script setup>
import { defineExpose, reactive } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'

const { tiposDenuncia } = useMantenedorStore()

const { required } = useFormValidation()

const formData = reactive({
  identificadorUnicoDenuncia: '',
  numeroParteDenuncia: '',
  fechaParteDenuncia: '',
  idTipoDenuncia: '',
  medioDeRecepcion: 'Físico',
  esReservada: null
})

function populateData (data) {
  Object.assign(formData, data)
}

defineExpose({ formData, populateData })
</script>
