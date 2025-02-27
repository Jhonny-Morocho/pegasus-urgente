import { useStore } from 'vuex'
import { computed } from 'vue'

export const useStepBusquedaAgregarSepararEspecies = () => {
  const { state, dispatch } = useStore()

  return {
    dataRue: computed(() => state.stepBusquedaAgregarSepararEspecies.dataRue),
    getEtiquetaReubicacion: computed(() => state.stepBusquedaAgregarSepararEspecies.getEtiquetaReubicacion),
    // ACTIONS
    stepBusquedaAgregarSepararEspecies_busquedaPorRue: (payload) => dispatch('stepBusquedaAgregarSepararEspecies/stepBusquedaAgregarSepararEspecies_busquedaPorRue', payload),
    stepBusquedaAgregarSepararEspecies_getEtiqueta: (payload) => dispatch('stepBusquedaAgregarSepararEspecies/stepBusquedaAgregarSepararEspecies_getEtiqueta', payload),
    stepBusquedaAgregarSepararEspecies_reubicarEspecie: (payload) => dispatch('stepBusquedaAgregarSepararEspecies/stepBusquedaAgregarSepararEspecies_reubicarEspecie', payload)
  }
}
