<template>
<AppFieldset legend="Solicitud de Salida Temporal">
  <SolicitudDeSalida
    :data-solicitud="dataSalidasolicitud"
    :salida-temporal="true"
  />
</AppFieldset>
<AppFieldset
  :collapsed="true"
  legend="Causa"
  :toggleable="true"
>
  <Causa :data-causa="dataCausaPorRuc" />
</AppFieldset>
<AppFieldset
  :collapsed="true"
  legend="Especie"
  :toggleable="true"
>
  <EspeciesDinero
    :especies-dineros="dataEspecie"
    :salida-temporal="true"
  />
</AppFieldset>
<AppFieldset legend="Ingresar Observaciones para la salida">
  <AppTextarea
    id="comentario"
    v-model="form.observaciones"
    class="col-12 mx-0 px-0"
    cols="150"
    label="Observaciones"
    rows="5"
    :rules="{required}"
  />
</AppFieldset>
<AppBtnNextTeleported
  :disabled="deshabilitar"
  label="Generar Acta Salida Temporal"
  @click="handleNextStep"
/>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { requestUtil } from '@/utils'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import SolicitudDeSalida from '@/modules/recepcion-especies-dinero/components/revisar-instruccion/SolicitudDeSalida.vue'
import Causa from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/Causa.vue'
import EspeciesDinero from '@/modules/recepcion-especies-dinero/components/registrar-inspeccion-visual/EspeciesDinero.vue'
import { useIdentificacionNueStore, useRegistroSalida } from '@/modules/recepcion-especies-dinero/composables'
import { useRouter } from 'vue-router'
import { useFormValidation } from '@/modules/common/composables'

const {
  datosRegistroSalidaTemporal, registroSalida_generarActaSalida, registroSalida_getEspeciesSalidaTemporal
} = useRegistroSalida()
const router = useRouter()

const form = reactive({
  observaciones: ''
})
const {
  stepIdentificacionNue_obtenerCausaPorRUC
} = useIdentificacionNueStore()

const { required } = useFormValidation()
const dataCausaPorRuc = ref({})
const dataDelitosPorRuc = ref({})
const dataEspecie = ref()
const dataSalidasolicitud = computed(() => datosRegistroSalidaTemporal.value?.data?.solicitudSalida)

function dataCausaRuc () {
  requestUtil({
    action: stepIdentificacionNue_obtenerCausaPorRUC,
    payload: { ruc: datosRegistroSalidaTemporal.value?.data?.ruc },
    resolve: (r) => {
      dataCausaPorRuc.value = r.fichaCausa
      dataDelitosPorRuc.value = r.fichaCausa.hechoDelictuales
    },
    reject: (e) => {
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
      idTipoSalida: dataSalidasolicitud.value?.idTipoSalida,
      nue: datosRegistroSalidaTemporal.value?.data?.nue
    },
    resolve: (res) => {
      console.log('Especies:', res)
      dataEspecie.value = {
        nue: datosRegistroSalidaTemporal.value?.data?.nue,
        items: res
      }
    }
  })
}
especiesNue()

function handleNextStep (to) {
  requestUtil({
    action: registroSalida_generarActaSalida,
    payload: {
      nue: datosRegistroSalidaTemporal.value.data.nue,
      tareaId: datosRegistroSalidaTemporal.value.tarea.taskId,
      observaciones: form.observaciones
    },
    resolve: (res) => {
      router.push('/custodia/custodio/registrar-salida-temporal/acta-salida-temporal')
    }
  })
}
</script>
