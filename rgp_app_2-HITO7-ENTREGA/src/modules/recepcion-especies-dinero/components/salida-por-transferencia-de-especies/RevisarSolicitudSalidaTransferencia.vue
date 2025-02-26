<template>
<AppFieldset legend="Solicitud de Salida por Transferencia">
  <AppForm
    :id="'formSolicitudSalida'"
    class="col-12 grid"
    :form-submitted="formSubmitted"
    :validation-scope="'formSolicitudSalida'"
  >
    <ShowTwoColumnData
      :data-col1="registroEspecies.dataCol1"
      :data-col2="registroEspecies.dataCol2"
    />
    <div class="grid col-12 p-fluid">
      <RutInput
        id="rut-sujeto"
        v-model="formData.runReceptor"
        class="col-12 md:col-6 lg:col-4"
        label="RUN Receptor"
        :rules="{ required }"
      />
      <AppInput
        id="nombre"
        v-model="formData.nombreReceptor"
        class="col-12 md:col-6 lg:col-4"
        :disabled="readOnly"
        label="Nombre Receptor"
        :rules="{ required }"
      />
    </div>
  </AppForm>
</AppFieldset>
<AppFieldset
  legend="Causa"
  :toggleable="true"
>
  <Causa
    :data-causa="dataCausaPorRuc"
    :data-instruccion="dataInstruccion"
  />
</AppFieldset>
<AppFieldset
  legend="Especie"
  :toggleable="true"
>
  <EspeciesDinero
    :especies-dineros="dataEspecie"
  />
</AppFieldset>
<AppFieldset
  legend="Ingresar Observaciones para la salida"
  :toggleable="true"
>
  <AppTextarea
    id="observacionesDelEslabon"
    v-model="formData.observacionesSalidaTransferencia"
    :auto-resize="true"
    class="col-12 p-fluid"
    cols="100"
    label="Observaciones"
    rows="3"
    :rules="{ required }"
  />
</AppFieldset>
<AppBtnNextTeleported
  :disabled="deshabilitar"
  label="Generar Acta Salida Transferencia"
  @click="handleNextStep"
/>
</template>

<script setup>
import { useIdentificacionNueStore, useRegistroSalida } from '../../composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import EspeciesDinero from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/EspeciesDinero.vue'
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import { reactive, ref } from 'vue'
import { requestUtil } from '@/utils'
// composables
import { useAppGlobalProperties, useFormValidation } from '@/modules/common/composables'
import { useRouter } from 'vue-router'

const formData = reactive({
  runReceptor: '',
  nombreReceptor: '',
  observacionesSalidaTransferencia: ''
})
const dataCausaPorRuc = ref({})
const dataDelitosPorRuc = ref({})
const dataEspecie = ref()
const { $userName } = useAppGlobalProperties()
const nombreCustodio = $userName.value
const router = useRouter()
const { dataSalidaTransferencia, dataRegistrarSalidaTransferenciaEspecie, registroSalida_getEspeciesSalidaTemporal, registroSalida_generarActaSalidaTransferencia } = useRegistroSalida()
const { stepIdentificacionNue_obtenerCausaPorRUC } =
  useIdentificacionNueStore()
const { required, formSubmitted } =
  useFormValidation({
    formData,
    validationScope: 'formSolicitudSalida'
  })
const registroEspecies = {
  dataCol1: [
    { label: 'Fecha de Solicitud: ', value: dataSalidaTransferencia.value.fechaSolicitud },
    { label: 'Fiscalía de Destino: ', value: dataSalidaTransferencia.value.fiscaliaDestino },
    { label: 'Fecha de salida agendada: ', value: dataSalidaTransferencia.value.fechaSalidaAgendada },
    { label: 'Fiscal de Destino: ', value: dataSalidaTransferencia.value.fiscalDestino },
    { label: 'Fiscalía de Origen:: ', value: dataSalidaTransferencia.value.fiscaliaOrigen }
  ],
  dataCol2: [
    { label: 'Fiscal de Origen:: ', value: dataSalidaTransferencia.value.fiscalOrigen }
  ]
}
function dataCausaRuc () {
  console.log('causa transfer', dataRegistrarSalidaTransferenciaEspecie.value.data)
  requestUtil({
    action: stepIdentificacionNue_obtenerCausaPorRUC,
    payload: { ruc: dataRegistrarSalidaTransferenciaEspecie.value.data.ruc },
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
function especiesNue () {
  requestUtil({
    action: registroSalida_getEspeciesSalidaTemporal,
    payload: {
      idTipoSalida: dataSalidaTransferencia.value?.idSalidaTransferencia,
      nue: dataRegistrarSalidaTransferenciaEspecie.value?.data?.nue
    },
    resolve: (res) => {
      console.log('Especies:', res)
      dataEspecie.value = {
        nue: dataRegistrarSalidaTransferenciaEspecie.value?.data?.nue,
        items: res
      }
    }
  })
}
especiesNue()
function handleNextStep (to) {
  requestUtil({
    action: registroSalida_generarActaSalidaTransferencia,
    payload: {
      nue: dataRegistrarSalidaTransferenciaEspecie.value.data.nue,
      tareaId: dataRegistrarSalidaTransferenciaEspecie.value.tarea.taskId,
      observaciones: formData.observacionesSalidaTransferencia,
      runReceptor: formData.runReceptor,
      receptor: formData.nombreReceptor,
      custodioOrigen: nombreCustodio,
      runCustodioOrigen: '12.234.567-9'
    },
    resolve: (res) => {
      router.push('/custodia/custodio/salida-por-transferencia-de-especies/acta-salida-por-transferencia-especie')
    }
  })
}
</script>
