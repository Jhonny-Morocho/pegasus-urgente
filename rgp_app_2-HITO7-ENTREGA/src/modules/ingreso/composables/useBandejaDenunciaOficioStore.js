import { useStore } from 'vuex'
import { computed } from 'vue'

export const useBandejaDenunciaOficioStore = () => {
  const { state, dispatch } = useStore()

  return {
    // COMPUTED PROPERTIES
    denuncias: computed(() => state.bandejaDenunciaOficio.denuncias),
    paginacion: computed(() => state.bandejaDenunciaOficio.paginacion),

    // GETTERS

    // MUTATIONS

    // ACTIONS
    bandejaDenunciaOficio_getDenunciasByMultiple: (params) => dispatch('bandejaDenunciaOficio/bandejaDenunciaOficio_getDenunciasByMultiple', params)
  }
}
