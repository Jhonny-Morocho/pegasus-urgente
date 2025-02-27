import { useStore } from 'vuex'
import { computed } from 'vue'

export const useBandejaGestionSolicitudesStore = () => {
  const { state, dispatch } = useStore()

  return {
    // COMPUTED PROPERTIES
    denuncias: computed(() => state.bandejaGestionSolicitudes.denuncias),
    paginacion: computed(() => state.bandejaGestionSolicitudes.paginacion),

    // ACTIONS
    bandejaGestor_getDenunciasByMultiple: (params) => dispatch('bandejaGestionSolicitudes/bandejaGestor_getDenunciasByMultiple', params)

    // GETTERS

    // MUTATIONS

  }
}
