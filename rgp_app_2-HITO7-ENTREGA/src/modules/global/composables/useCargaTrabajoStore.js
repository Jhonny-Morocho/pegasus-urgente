import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCargaTrabajoStore = () => {
  const { state, dispatch } = useStore()

  return {
    // COMPUTED PROPERTIES
    cargaUnidad: computed(() => state.cargaTrabajo.cargaUnidad),
    paginacionCargaUnidad: computed(() => state.cargaTrabajo.paginacionCargaUnidad),
    cargaFiscal: computed(() => state.cargaTrabajo.cargaFiscal),
    paginacionCargaFiscal: computed(() => state.cargaTrabajo.paginacionCargaFiscal),

    // GETTERS

    // ACTIONS
    cargaTrabajo_getCargaUnidad: (payload) =>
      dispatch('cargaTrabajo/cargaTrabajo_getCargaUnidad', payload),
    cargaTrabajo_getCargaFiscal: (payload) =>
      dispatch('cargaTrabajo/cargaTrabajo_getCargaFiscal', payload),
    cargaTrabajo_getCargaInstitucionEjecutora: (payload) =>
      dispatch('cargaTrabajo/cargaTrabajo_getCargaInstitucionEjecutora', payload)

    // MUTATIONS
  }
}
