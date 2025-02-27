<template>
<AppFieldset legend="Solicitud de salida por transferencia">
  <ShowTwoColumnData
    :data-col1="data.dataCol1"
    :data-col2="data.dataCol2"
  />
</AppFieldset>
<AppFieldset
  legend="Causa"
>
  <Causa :data-causa="dataCausa" />
</AppFieldset>
<AppFieldset legend="Dinero a Transferir">
  <ShowTwoColumnData
    :data-col1="dineroATransferir.dataDinero1"
    :data-col2="dineroATransferir.dataDinero2"
  />
</AppFieldset>
<AppFieldset legend="Registrar Recepción de Cheque">
  <RecepcionDeCheque :data-recepcion-cheque="dataRecepcioncheque" />
</AppFieldset>
</template>

<script setup>
import RecepcionDeCheque from '@/modules/recepcion-especies-dinero/components/registro-cheque-recibido/RecepcionDeCheque.vue'
import ShowTwoColumnData from '@/modules/recepcion-especies-dinero/components/global/ShowTwoColumnData.vue'
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import { propTypes } from '@/modules/common/types'
import { defineProps, ref } from 'vue'

defineProps({
  data: propTypes.object,
  dataCausa: propTypes.object
})
const mockDataSolicitud = ref([])
const dineroATransferir = {
  dataDinero1: [
    { label: 'NUE', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'RUE', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Tipo de Delito', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Responsabilidad de UAF', value: mockDataSolicitud.value?.fechaSolicitud }
  ],
  dataDinero2: [
    { label: 'TIpo de Moneda', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Monto', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Interés', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Monto Total', value: mockDataSolicitud.value?.fechaSolicitud }
  ]
}
const dataRecepcioncheque = {
  dataRecepcion1: [
    { label: 'NUE', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'RUE', value: mockDataSolicitud.value?.fechaSolicitud }
  ],
  dataRecepcion2: [
    { label: 'TIpo de Moneda', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Monto', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Interés', value: mockDataSolicitud.value?.fechaSolicitud },
    { label: 'Monto Total', value: mockDataSolicitud.value?.fechaSolicitud }
  ]
}
</script>
