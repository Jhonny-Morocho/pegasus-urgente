import { useStore } from 'vuex'
import { computed } from 'vue'

export const useBandejaDenunciaFisicaStore = () => {
  const { state, dispatch } = useStore()

  return {
    // COMPUTED PROPERTIES
    denuncias: computed(() => state.bandejaDenunciaFisica.denuncias),
    paginacion: computed(() => state.bandejaDenunciaFisica.paginacion),
    denunciasConPartes: computed(() => state.bandejaDenunciaFisica.denunciasConPartes),

    // GETTERS

    // MUTATIONS

    // ACTIONS
    bandejaDenunciaFisica_setPrioritario: (payload) => dispatch('bandejaDenunciaFisica/bandejaDenunciaFisica_setPrioritario', payload),

    bandejaDenunciaFisica_getDenunciasByMultiple: (params) => dispatch('bandejaDenunciaFisica/bandejaDenunciaFisica_getDenunciasByMultiple', params)

  }
}
