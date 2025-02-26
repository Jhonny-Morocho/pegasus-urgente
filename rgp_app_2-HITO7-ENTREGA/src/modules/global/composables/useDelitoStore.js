import { computed } from 'vue'
import { useStore } from 'vuex'

export const useDelitoStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    /* COMPUTED STATE */
    mediosTransporte: computed(() => state.delitoGb.mediosTransporte),
    delitos: computed(() => state.delitoGb.delitos),
    paginacion: computed(() => state.delitoGb.paginacion),

    /* ACTIONS */
    delito_addDelito: (delito) => dispatch('delitoGb/delito_addDelito', delito),
    delito_deleteDelito: (delito) =>
      dispatch('delitoGb/delito_deleteDelito', delito),
    delito_updateDelito: (delito) =>
      dispatch('delitoGb/delito_updateDelito', delito),
    delito_crearDenuncia: (delito) =>
      dispatch('delitoGb/delito_crearDenuncia', delito),
    delito_getDelitoByIdDenuncia: (delito) =>
      dispatch('delitoGb/delito_getDelitoByIdDenuncia', delito),
    delito_getDelitoByIdDetalleHechoDelictual: (idDetalleHechoDelictual) =>
      dispatch('delitoGb/delito_getDelitoByIdDetalleHechoDelictual', idDetalleHechoDelictual),
    delito_postManyDelitosByIdDenuncia: (payload) =>
      dispatch('delitoGb/delito_postManyDelitosByIdDenuncia', payload),

    // BFF (🤡)
    delito_getDelitosEnCausa: (payload) =>
      dispatch('delitoGb/delito_getDelitosEnCausa', payload),

    /* MUTATIONS */
    delito_ADD_MEDIO_TRANSPORTE: (medioTransporte) =>
      commit('delitoGb/delito_ADD_MEDIO_TRANSPORTE', medioTransporte),
    delito_EDIT_MEDIO_TRANSPORTE: (medioTransporte) =>
      commit('delitoGb/delito_EDIT_MEDIO_TRANSPORTE', medioTransporte),
    delito_DELETE_MEDIO_TRANSPORTE: (medioTransporte) =>
      commit('delitoGb/delito_DELETE_MEDIO_TRANSPORTE', medioTransporte),
    delito_SET_MEDIOSTRANSPORTE: (mediosTransporte) =>
      commit('delitoGb/delito_SET_MEDIOSTRANSPORTE', mediosTransporte),
    delito_RESET_MEDIOSTRANSPORTE: () =>
      commit('delitoGb/delito_RESET_MEDIOSTRANSPORTE'),
    delito_SET_DELITOS: (delitos) =>
      commit('delitoGb/delito_SET_DELITOS', delitos),
    delito_SET_DEFAULT_STATE: () => commit('delitoGb/delito_SET_DEFAULT_STATE')
  }
}
