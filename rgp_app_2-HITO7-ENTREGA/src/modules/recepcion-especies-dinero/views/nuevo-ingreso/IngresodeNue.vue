<template>
<BusquedaPorNue
  ref="busquedaPorNUE"
  :causa="causa"
  :datos-ingreso-transferencia="true"
  :delitos="dataDelitosPorRuc"
  :nue-loader="loader"
  :rues="rues"
  @busqueda-por-nue="busquedaNue"
/>
<AppBtnNextTeleported
  :disabled="!nueEncontrado"
  label="Ingresar Datos"
  @click="handleNextStep"
/>
</template>
<script setup>
import BusquedaPorNue from '@/modules/recepcion-especies-dinero/components/identificacion-nue/BusquedaPorNue.vue'
import { ref, defineEmits } from 'vue'
import { requestUtil } from '@/utils'
import { useEspecieIncautadaPendienteRecepcionStore, useIdentificacionNueStore, useIngresoDinero } from '../../composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useAppToast } from '@/modules/common/composables'

const {
  stepEspeciesIncautadasPendientesDeRecepcion_RESET,
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado
} = useEspecieIncautadaPendienteRecepcionStore()

const { stepIngresoDinero_getEspeciesDinerosNoIngresados } = useIngresoDinero()
const { stepIdentificacionNue_obtenerCausaPorRUC } = useIdentificacionNueStore()
const busquedaPorNUE = ref()
const loader = ref(false)
const causa = ref()
const dataDelitosPorRuc = ref()

const { toastError } = useAppToast()
const nueEncontrado = ref(null)
const nueData = ref()
const rues = ref()

function busquedaNue (nue) {
  loader.value = true
  nueData.value = nue
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_RESET
  })
  requestUtil({
    action: stepIngresoDinero_getEspeciesDinerosNoIngresados,
    payload: { nue },
    resolve: (r) => {
      if (r.idDenuncia) {
        const ruc = r.items.find(e => e.ruc).ruc
        rues.value = r.items.filter(e => e.RUE).map(e => {
          return e.RUE
        })
        requestUtil({
          action: stepIdentificacionNue_obtenerCausaPorRUC,
          payload: { ruc },
          resolve: (res) => {
            causa.value = res.fichaCausa.causa
            dataDelitosPorRuc.value = res.fichaCausa.hechoDelictuales
            nueEncontrado.value = true
            loader.value = false
          }
        })
      } else {
        toastError('NUE no asociado a nunguna especie')
        loader.value = false
      }
    }
  })
}

const emit = defineEmits(['next-step'])

function handleNextStep () {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado,
    payload: { nue: nueData.value },
    resolve: () => {
      emit('next-step', 'ingresar-datos-adicionales')
    },
    reject: (err) => {
      console.log('err', err)
      const mensaje = err.response?.data.message.replaceAll('_', ' ')
      toastError(mensaje ? mensaje.charAt(0).toUpperCase() + mensaje.slice(1) : 'error')
    }
  })
}

</script>
