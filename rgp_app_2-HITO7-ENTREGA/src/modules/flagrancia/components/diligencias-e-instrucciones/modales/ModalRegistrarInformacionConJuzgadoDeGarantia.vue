<template>
<hr class="linea-modal">
<div class="grid mt-5 px-3">
  <div class="col-12 md:col-6">
    <span>
      <strong>Tipo Diligencia: </strong>
      <span>
        {{
          stepDiligenciasEInstrucciones_getNombreTipoDiligencia(
            props.dataDiligenciaInstruidaAEjecutar.idSubtipo
          )
        }}
      </span>
      <span />
    </span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Subtipo Diligencia: </strong>
    </span>
    <span>{{
      stepDiligenciasEInstrucciones_getNombreSubtipoDiligencia(
        props.dataDiligenciaInstruidaAEjecutar.idSubSubtipo
      )
    }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Justificación de la Diligencia: </strong>
    </span>
    <span />
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Observación de la Diligencia: </strong>
    </span>
    <span>{{ props.dataDiligenciaInstruidaAEjecutar.observacion }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Estado: </strong>
    </span>
    <span>{{
      stepDiligenciasEInstrucciones_getNombreEstado(
        props.dataDiligenciaInstruidaAEjecutar.idEstado
      )
    }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>N° de Ruc o Folio: </strong>
    </span>
    <span>{{ folioProcedimientoData.folio }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Fiscalía que Instruye: </strong>
    </span>
    <span>{{ folioProcedimientoData.nombreFiscalia }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Rut del Fiscal que Instruye: </strong>
    </span>
    <span> {{ props.dataDiligenciaInstruidaAEjecutar.rutFiscal }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Nombre del Fiscal que Instruye: </strong>
    </span>
    <span> {{ props.dataDiligenciaInstruidaAEjecutar.nombreFiscal }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Institución Ejecutora: </strong>
    </span>
    <span>{{
      stepDiligenciasEInstrucciones_getNombreInstitucion(
        props.dataDiligenciaInstruidaAEjecutar.idInstitucionEjecutora
      )
    }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Ámbito: </strong>
    </span>
    <span>{{
      stepDiligenciasEInstrucciones_getNombreAmbito(
        props.dataDiligenciaInstruidaAEjecutar.idAmbito
      )
    }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Delito: </strong>
    </span>
    <span>{{ folioProcedimientoData.delito }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Rut del Sujeto: </strong>
    </span>
    <span>{{ props.dataDiligenciaInstruidaAEjecutar.rutSujeto }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Nombre del Sujeto: </strong>
    </span>
    <span>{{ props.dataDiligenciaInstruidaAEjecutar.nombreSujeto }}</span>
  </div>
  <div class="col-12 lg:col-6">
    <span>
      <strong>Fecha y Hora Solicitud de Diligencia: </strong>
    </span>
    <span>{{ props.dataDiligenciaInstruidaAEjecutar.fechaSolicitud }}</span>
  </div>
  <AppFieldset
    class="col-12 mt-4"
    legend="Datos Complementarios"
  >
    <div class="grid">
      <div class="col-12 lg:col-6 pl-0">
        <AppFieldset
          class="col-12"
          legend="Material de Apoyo"
        >
          <FileUpload
            accept="image/*, application/*"
            choose-label="Seleccionar Archivo"
            :max-file-size="16000000"
            mode="basic"
            name="demo[]"
            url="./upload.php"
            @select="onSelectMaterialApoyo"
          />
        </AppFieldset>
      </div>
      <div class="col-12 lg:col-6 pr-0 pt-5">
        <Textarea
          v-model="textAreModalEjecutarInstruccion"
          class="text-area"
          cols="30"
          placeholder="Ingrese un comentario"
          rows="3"
        />
      </div>
    </div>
    <div class="col-12">
      <span>
        <strong>Reproducir:</strong>
      </span>
    </div>
  </AppFieldset>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import {
  useProcedimientosBandejaStore,
  useStepDiligenciasEInstruccionesStore
} from '@/modules/flagrancia/composables'

const {
  stepDiligenciasEInstrucciones_getNombreTipoDiligencia,
  stepDiligenciasEInstrucciones_getNombreSubtipoDiligencia,
  stepDiligenciasEInstrucciones_getNombreEstado,
  stepDiligenciasEInstrucciones_getNombreInstitucion,
  stepDiligenciasEInstrucciones_getNombreAmbito
} = useStepDiligenciasEInstruccionesStore()

const { folioProcedimientoData } = useProcedimientosBandejaStore()

const props = defineProps({
  dataDiligenciaInstruidaAEjecutar: {
    type: Object,
    default: () => {
      return null
    }
  }
})
</script>
