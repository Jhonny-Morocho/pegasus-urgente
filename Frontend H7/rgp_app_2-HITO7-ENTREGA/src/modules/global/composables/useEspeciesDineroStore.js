import { useStore } from 'vuex'
import { computed } from 'vue'

export const useEspeciesDineroStore = () => {
  const { dispatch, state, commit } = useStore()
  return {
    // COMPUTED STATE
    especies: computed(() => state.especiesDineroGb.especies),
    paginacionEspecies: computed(() => state.especiesDineroGb.paginacionEspecies),
    dineros: computed(() => state.especiesDineroGb.dineros),

    // ACTIONS
    especiesDinero_addEspecie: (especie) => dispatch('especiesDineroGb/especiesDinero_addEspecie', especie),
    especiesDinero_updateEspecie: (especie) => dispatch('especiesDineroGb/especiesDinero_updateEspecie', especie),
    especiesDinero_deleteEspecie: (especie) => dispatch('especiesDineroGb/especiesDinero_deleteEspecie', especie),
    especiesDinero_postManyEspeciesByIdDenuncia: (payload) =>
      dispatch('especiesDineroGb/especiesDinero_postManyEspeciesByIdDenuncia', payload),

    // BFF(🤡)
    especiesDinero_getEspeciesEnCausa: (payload) => dispatch('especiesDineroGb/especiesDinero_getEspeciesEnCausa', payload),
    especiesDinero_getEspecieEnCausaByID: (payload) => dispatch('especiesDineroGb/especiesDinero_getEspecieEnCausaByID', payload),
    especiesDinero_proponerDestinoEspecieEnCausa: (payload) => dispatch('especiesDineroGb/especiesDinero_proponerDestinoEspecieEnCausa', payload),

    especiesDinero_getEspecieByIdDenuncia: (payload) => dispatch('especiesDineroGb/especiesDinero_getEspecieByIdDenuncia', payload),

    especiesDinero_getEspecieByIdEspecie: (payload) => dispatch('especiesDineroGb/especiesDinero_getEspecieByIdEspecie', payload),
    especieDinero_bff_addEspecie: (payload) =>
      dispatch('especiesDineroGb/especieDinero_bff_addEspecie', payload),
    especieDinero_bff_solicitarInspecccionVisual: (payload) =>
      dispatch('especiesDineroGb/especieDinero_bff_solicitarInspecccionVisual', payload),
    especieDinero_bff_definirDestinoEspecies: (payload) =>
      dispatch('especiesDineroGb/especieDinero_bff_definirDestinoEspecies', payload),

    // MUTATIONS
    especiesDinero_SET_ESPECIES: (especie) => commit('especiesDineroGb/especiesDinero_SET_ESPECIES', especie),

    especiesDinero_DELETE_ESPECIE: (especie) => commit('especiesDineroGb/especiesDinero_DELETE_ESPECIE', especie),

    especiesDinero_SET_DINERO: (dinero) => commit('especiesDineroGb/especiesDinero_SET_DINERO', dinero),

    especiesDinero_RESET_DINERO: () => commit('especiesDineroGb/especiesDinero_RESET_DINERO'),

    especiesDinero_ADD_DINERO: (dinero) => commit('especiesDineroGb/especiesDinero_ADD_DINERO', dinero),

    especiesDinero_DELETE_DINERO: (dinero) => commit('especiesDineroGb/especiesDinero_DELETE_DINERO', dinero),

    especiesDinero_EDIT_DINERO: (dinero) => commit('especiesDineroGb/especiesDinero_EDIT_DINERO', dinero),

    especiesDinero_SET_DEFAULT_STATE: () => commit('especiesDineroGb/especiesDinero_SET_DEFAULT_STATE')
  }
}
