<template>
<main class="w-full grid p-fluid">
  <AppDropdown
    id="tipo-documento-victima"
    v-model="consulta.idTipoDocumentoVictima"
    class="col-12 md:col-6 lg:col-3"
    label="Tipo Documento Víctima"
    option-label="descripcion"
    option-value="id"
    :options="tiposDocumento"
    :retrieve-data-action="mantenedor_getTiposDocumento"
    show-clear
  />
  <RutInput
    v-if="esCedula(consulta.idTipoDocumentoVictima)"
    id="numero-documento-victima"
    v-model="consulta.numeroDocumentoVictima"
    class="col-12 md:col-6 lg:col-3"
    label="N° Documento Víctima"
  />
  <AppInput
    v-else
    id="numero-documento-victima"
    v-model="consulta.numeroDocumentoVictima"
    class="col-12 md:col-6 lg:col-3"
    label="N° Documento Víctima"
  />
  <AppDropdown
    id="tipo-documento-imputado"
    v-model="consulta.idTipoDocumentoImputado"
    class="col-12 md:col-6 lg:col-3"
    label="Tipo Documento Imputado"
    option-label="descripcion"
    option-value="id"
    :options="tiposDocumento"
    :retrieve-data-action="mantenedor_getTiposDocumento"
    show-clear
  />
  <RutInput
    v-if="esCedula(consulta.idTipoDocumentoImputado)"
    id="numero-documento-imputado"
    v-model="consulta.numeroDocumentoImputado"
    class="col-12 md:col-6 lg:col-3"
    label="N° Documento Imputado"
  />
  <AppInput
    v-else
    id="numero-documento-imputado"
    v-model="consulta.numeroDocumentoImputado"
    class="col-12 md:col-6 lg:col-3"
    label="N° Documento Imputado"
  />
  <AppCalendar
    id="fecha-delito-desde"
    v-model="consulta.fechaHoraDelitoDesde"
    class="col-12 md:col-6 lg:col-3"
    label="Fecha/Hora Delito (desde)"
    show-time
  />
  <AppCalendar
    id="fecha-delito-hasta"
    v-model="consulta.fechaHoraDelitoHasta"
    class="col-12 md:col-6 lg:col-3"
    label="Fecha/Hora Delito (hasta)"
    show-time
  />
  <div class="col-12 md:col-6">
    <AppInputDireccion
      id="direccion-delito"
      ref="refDireccion"
      label="Dirección del Delito"
      @set-place="setPlace"
    />
  </div>
  <AppDropdown
    id="unidad-policial"
    v-model="consulta.idUnidadPolicial"
    class="col-12 md:col-6 lg:col-3"
    label="Unidad Policial"
    option-label="descripcion"
    option-value="id"
    :options="unidadPolicial"
    :retrieve-data-action="mantenedor_getUnidadPolicial"
    show-clear
  />
  <AppInput
    id="palabras-clave"
    v-model="consulta.palabraClaveRelato"
    class="col-12 md:col-9"
    label="Palabras Clave del Relato del Hecho"
  />
</main>
</template>

<script setup>
import { useCausaRelacionadaState, useMantenedorStore } from '@/modules/global/composables'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'

const { consulta, refDireccion } = useCausaRelacionadaState()

const {
  tiposDocumento,
  unidadPolicial,
  mantenedor_getTiposDocumento,
  mantenedor_getCodigoTipoDocumentoIdentidad,
  mantenedor_getUnidadPolicial
} = useMantenedorStore()

function esCedula (value) {
  return mantenedor_getCodigoTipoDocumentoIdentidad(value) === '1'
}

function setPlace (values) {
  consulta.direccion = values?.string
}
</script>
