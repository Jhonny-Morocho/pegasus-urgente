<template>
<AppFieldset
  class="col-12 p-fluid"
  legend="Antecedentes de la Causa"
>
  <AppInput
    id="ruc"
    v-model="antecedentes.ruc"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="RUC"
  />
  <AppInput
    id="rit"
    v-model="antecedentes.rit"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="RIT"
  />
  <AppInput
    id="folio"
    v-model="antecedentes.folio"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Folio"
  />
  <AppInput
    id="id-unico-denuncia"
    v-model="antecedentes.identificadorUnicoDenuncia"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Identificador Única de Denuncia"
  />
  <AppDropdown
    id="tipo-denuncia"
    v-model="antecedentes.idTipoDenuncia"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Tipo de Denuncia"
    option-label="descripcion"
    option-value="id"
    :options="tiposDenuncia"
    :retrieve-data-action="mantenedor_getTiposDenuncia"
    show-clear
  />
  <AppInput
    id="numero-parte-denuncia"
    v-model="antecedentes.numeroParteDenuncia"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Número de Parte Denuncia"
  />
  <AppCalendar
    id="fecha-denuncia"
    v-model="fechaHoraDenuncia"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Fecha y Hora Denuncia"
    show-time
  />
  <AppCalendar
    id="fecha-recepcion"
    v-model="fechaHoraRecepcion"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Fecha y Hora Recepción"
    show-time
  />
  <AppDropdown
    id="forma-envio"
    v-model="antecedentes.formaEnvio"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Forma de Envío"
    option-label="descripcion"
    option-value="idFormaEnvio"
    :options="[
      { descripcion: 'Manual', idFormaEnvio: '1' },
      { descripcion: 'Digital', idFormaEnvio: '2' },
      { descripcion: 'CORREO ELECTRONICO', idFormaEnvio: '3' },
    ]"
    show-clear
  />
  <AppInput
    id="estado"
    v-model="antecedentes.estado"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Estado"
  />
  <div class="col-12 md:col-6 lg:col-4">
    <Button
      id="nombre-causa"
      v-tooltip.top="'Pulsa para modificar el nombre de la causa'"
      class="p-button-outlined"
      :label="`Causa: ${antecedentes.nombreCausa}`"
      :loading="loading"
      @click="cambiarNombreCausa"
    />
  </div>
  <AppInput
    id="medio-recepcion"
    v-model="antecedentes.medioRecepcion"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Medio de Recepción"
  />
  <AppInput
    id="nombre-digitador"
    v-model="antecedentes.nombreDigitador"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Nombre Digitador"
  />
  <AppInput
    id="funcionario-a-cargo-procedimiento"
    v-model="antecedentes.funcionarioCargoProcedimiento"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Funcionario a Cargo del Procedimiento"
  />
  <AppInput
    id="fiscal-asignado"
    v-model="antecedentes.fiscalAsignado"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Fiscal Asignado"
  />
</AppFieldset>
</template>
<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { useAntecedentesCausaData } from '@/modules/preclasificador/composables'

const emit = defineEmits(['cambiar-nombre-causa'])
defineProps({
  loading: Boolean
})

const { tiposDenuncia, mantenedor_getTiposDenuncia } = useMantenedorStore()

const { antecedentes } = useAntecedentesCausaData()

const fechaHoraDenuncia = computed(() => {
  return formatoFecha(antecedentes.fechaHoraDenuncia)
})

const fechaHoraRecepcion = computed(() => {
  return formatoFecha(antecedentes.fechaHoraRecepcion)
})

function formatoFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontendWithTime(fecha)
  }
}

function cambiarNombreCausa () {
  emit('cambiar-nombre-causa')
}
</script>
