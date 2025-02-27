<template>
<AppFieldset legend="Solicitud de Salida">
  <ShowTwoColumnData
    v-if="dataInstruccion.salidaTemporal"
    :data-col1="dataSalidasolicitud.dataCol1"
    :data-col2="dataSalidasolicitud.dataCol2"
  />
  <ShowTwoColumnData
    v-else-if="dataInstruccion.salidaTransferencia"
    :data-col1="dataSalidasolicitudTransferencia.dataColTrans1"
    :data-col2="dataSalidasolicitudTransferencia.dataColTrans2"
  />
  <!-- <ShowTwoColumnData
    v-else-if="salidaDefinitivaDevolverDueno"
    :data-col1="dataSalidasolicitud.dataCol1"
    :data-col2="dataSalidasolicitud.dataCol2"
  />
  <ShowTwoColumnData
    v-else-if="salidaDefinitivaDonacion"
    :data-col1="dataSalidasolicitud.dataCol1"
    :data-col2="dataSalidasolicitud.dataCol2"
  />
  <ShowTwoColumnData
    v-else-if="salidaDefinitivaDestruccion"
    :data-col1="dataSalidasolicitud.dataCol1"
    :data-col2="dataSalidasolicitud.dataCol2"
  /> -->
</AppFieldset>

<AppFieldset
  :collapsed="true"
  legend="Causa"
  :toggleable="true"
>
  <Causa
    :data-causa="dataCausaPorRuc"
    :data-instruccion="dataInstruccion.data"
  />
</AppFieldset>
<AppFieldset
  :collapsed="true"
  legend="Especie"
  :toggleable="true"
>
  <Especie
    :especie="dataEspecie"
    :revision-instruccion="true"
  />
</AppFieldset>
<div class="col-12">
  <AppTextarea
    id="comentario"
    v-model="form.observaciones"
    class="col-12 mx-0 px-0"
    cols="150"
    label="Observaciones"
    rows="5"
  />
</div>
</template>
<script setup>
import { defineProps, reactive, defineExpose, ref } from 'vue'
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import Especie from '@/modules/recepcion-especies-dinero/components/decidir-reubicacion/Especie.vue'
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import {
  useEspecieIncautadaPendienteRecepcionStore,
  useIdentificacionNueStore
} from '@/modules/recepcion-especies-dinero/composables'
import { propTypes } from '@/modules/common/types'
import { requestUtil } from '@/utils'
const props = defineProps({
  dataInstruccion: propTypes.object,
  salidaTemporal: Boolean
})
const { stepIdentificacionNue_obtenerCausaPorRUC } =
  useIdentificacionNueStore()
const { stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie } =
  useEspecieIncautadaPendienteRecepcionStore()
const form = reactive({
  observaciones: ''
})
const dataCausaPorRuc = ref({})
const dataDelitosPorRuc = ref({})
const dataEspecie = ref({})
// se deja en duro el motivo de salida al venir de una simulacion de solicitud de peritaje
const dataSalidasolicitud = {
  dataCol1: [
    { label: 'Fecha de Solicitud: ', value: props.dataInstruccion.data.data.solicitudSalida.fechaSolicitud },
    { label: 'Receptor: ', value: props.dataInstruccion.data.data.solicitudSalida?.nombreReceptor },
    { label: 'Tipo de Salida: ', value: props.dataInstruccion.data.data.solicitudSalida?.idTipoSalida },
    { label: 'Motivo de Salida: ', value: 'AFA2FA94-6C63-494F-BEED-99D64E32CD8C' },
    { label: 'Rut Recepctor: ', value: props.dataInstruccion.data.data.solicitudSalida?.runReceptor },
    { label: 'plazo: ', value: props.dataInstruccion.data.data.solicitudSalida?.plazo }
  ],
  dataCol2: [
    { label: 'Institución: ', value: props.dataInstruccion.data.data.solicitudSalida?.institucion }
  ]
}

const dataSalidasolicitudTransferencia = {
  dataColTrans1: [
    { label: 'Fecha de Solicitud: ', value: props.dataInstruccion.data.data.solicitudSalida.fechaSolicitud },
    { label: 'Fiscalía Origen: ', value: props.dataInstruccion.data.data.solicitudSalida },
    { label: 'Tipo de Salida: ', value: props.dataInstruccion.data.data.solicitudSalida?.idTipoSalida },
    { label: 'Fiscal Origen: ', value: props.dataInstruccion.data.data.solicitudSalida },
    { label: 'Fiscalía de destino: ', value: props.dataInstruccion.data.data.solicitudSalida }
  ],
  dataColTrans2: [
    { label: 'Fiscal de destino: ', value: props.dataInstruccion.data.data.solicitudSalida }
  ]
}
function dataCausaRuc () {
  console.log('dataIns', props.dataInstruccion.data)
  requestUtil({
    action: stepIdentificacionNue_obtenerCausaPorRUC,
    payload: { ruc: props.dataInstruccion.data.data.ruc },
    resolve: (r) => {
      dataCausaPorRuc.value = r.fichaCausa
      dataDelitosPorRuc.value = r.fichaCausa.hechoDelictuales
      console.log('dataCausa', dataCausaPorRuc.value)
    },
    reject: (e) => {
      console.log(e)
      let mensaje = e.response?.data.cod.replaceAll('_', ' ')
      mensaje = mensaje?.charAt(0).toUpperCase() + mensaje?.slice(1)
      console.log('mensaje', mensaje)
    }
  })
}
dataCausaRuc()
function dataEspeciePorRuc () {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: {
      id: props.dataInstruccion.data.data.especie.idEspecie
    },
    resolve: (data) => {
      dataEspecie.value = data
      console.log('estpeice', dataEspecie.value)
    },
    reject: (err) => {
      console.log('err', err)
    }
  })
}
dataEspeciePorRuc()

defineExpose({ form })
</script>
