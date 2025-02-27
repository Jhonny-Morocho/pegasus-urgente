<template>
<div class="grid col-12">
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">Cantidad Solicitada: </span> {{ props.data.cantidadSolicitada }}
    </p>
  </div>
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">NUE Inicial: </span> {{ props.data.RangoNUEInicio }}
    </p>
  </div>
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">NUE Final: </span> {{ props.data.RangoNUEFinal }}
    </p>
  </div>
  <p>Si desea imprimir los códigos de las NUE'S asignadas descargue aquí.</p>
  <div class="mx-3 my-3">
    <Button
      class="btn-form"
      icon="pi pi-download"
      icon-pos="right"
      label="Descargar NUE"
      @click="descargaZipNue(props)"
    />
  </div>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useSolicitudAsignacionNue } from '@/modules/recepcion-especies-dinero/composables/useSolicitudAsignacionNue'
import { requestUtil } from '@/utils'

const props = defineProps({
  data: propTypes.object
})
const { solicitudAsignacionNue_getListadoSolicitudNuesQR, solicitudAsignacionNue_getDescargaZipNues } = useSolicitudAsignacionNue()

async function descargaZipNue (props) {
  console.log('data nues', props.data)
  await requestUtil({
    action: solicitudAsignacionNue_getListadoSolicitudNuesQR,
    payload: {
      idNueAsignada: props.data.IDNUEAsignada,
      idOrganismo: props.data.IDOrganismo
    },
    resolve: (res) => {
      descargar(res)
      console.log('rws data QR', res)
    }
  })
}
async function descargar (res) {
  await requestUtil({
    action: solicitudAsignacionNue_getDescargaZipNues,
    payload: {
      idNueAsignada: res.IDNUEAsignada,
      idOrganismo: res.IDOrganismo
    }
  })
  console.log('modal descarga', res.IDNUEAsignada)
}
// console.log('modal', props.data)
</script>
