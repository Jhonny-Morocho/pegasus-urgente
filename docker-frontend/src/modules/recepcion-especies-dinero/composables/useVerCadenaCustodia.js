import { useStore } from 'vuex'
import { computed } from 'vue'

export const useVerCadenaCustodia = () => {
  const { state, dispatch } = useStore()

  return {
    imagenes: computed(() => state.imagenes),
    cadena: computed(() => state.verCadenaCustodio.cadenaEncontradaAsociadaANue),
    evidencias: computed(() => state.verCadenaCustodio.evidencias),
    eslabones: computed(() => state.verCadenaCustodio.eslabones),
    observaciones: computed(() => state.verCadenaCustodio.observaciones.listaObservacionesCustodia),
    idCustodiaEvidencia: computed(() => state.verCadenaCustodio.idCustodiaEvidencia),

    verCadenaCustodio_getDataCadenaCustodia: (payload) => dispatch('verCadenaCustodio/verCadenaCustodio_getDataCadenaCustodia', payload),
    cadenaCustodio_agregarObservacion: (payload) => dispatch('verCadenaCustodio/cadenaCustodio_agregarObservacion', payload),
    cadenaCustodio_getEslabonesCadenaCustodia: (payload) => dispatch('verCadenaCustodio/cadenaCustodio_getEslabonesCadenaCustodia', payload),
    cadenaCustodio_getObservacionesCadenaCustodia: (payload) => dispatch('verCadenaCustodio/cadenaCustodio_getObservacionesCadenaCustodia', payload)
  }
}
