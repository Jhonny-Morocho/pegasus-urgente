import { useStore } from 'vuex'
import { computed } from 'vue'

export const useComprobanteDeRecepcionRechazoStore = () => {
  const { state, dispatch } = useStore()

  return {
    // STATES
    comprobante: computed(() => state.stepComprobanteDeRecepcionRechazo.comprobante),
    // ACTIONS
    stepComprobanteDeRecepcionRechazo_getDataComprobante: (payload) => dispatch('stepComprobanteDeRecepcionRechazo/stepComprobanteDeRecepcionRechazo_getDataComprobante', payload),
    stepComprobanteDeRecepcionRechazo_getArchivosSubidosByIdEspecie: (payload) => dispatch('stepComprobanteDeRecepcionRechazo/stepComprobanteDeRecepcionRechazo_getArchivosSubidosByIdEspecie', payload),
    stepComprobanteDeRecepcionRechazo_subirArchivo: (payload) => dispatch('stepComprobanteDeRecepcionRechazo/stepComprobanteDeRecepcionRechazo_subirArchivo', payload),
    stepComprobanteDeRecepcionRechazo_obtenerArchivo: (payload) => dispatch('stepComprobanteDeRecepcionRechazo/stepComprobanteDeRecepcionRechazo_obtenerArchivo', payload)
  }
}
