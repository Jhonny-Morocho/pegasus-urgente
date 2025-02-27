import { useStore } from 'vuex'
import { computed } from 'vue'

export const useAgregarEslabon = () => {
  const { state, dispatch } = useStore()

  return {
    historialSolicitudNues: computed(() => state.solicitudAsignacionNue.historialSolicitudNues),

    agregarEslabon_addAgregarEslabon: (payload) => dispatch('agregarEslabon/agregarEslabon_addAgregarEslabon', payload)
  }
}
