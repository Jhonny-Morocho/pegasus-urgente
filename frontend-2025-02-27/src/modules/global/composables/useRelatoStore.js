import { computed } from 'vue'
import { useStore } from 'vuex'

export const useRelatoStore = () => {
  const { state, getters, dispatch, commit } = useStore()

  return {
    /* COMPUTED STATE */
    relatoPrincipal: computed(() => state.relatoGb.relatoPrincipal),
    relato: computed(() => state.relatoGb.relato),
    relatoObtenido: computed(() => state.relatoGb.relatoObtenido),

    /* GETTERS */
    getIntervinientes: (tipoInterviniente) => getters['relatoGb/getIntervinientes'](tipoInterviniente),
    getEspecies: () => getters['relatoGb/getEspecies'],
    getDelitos: () => getters['relatoGb/getDelitos'],

    /* ACTIONS */
    relato_getPropuestaPlantilla: (payload) => dispatch('relatoGb/relato_getPropuestaPlantilla', payload),

    relato_getPropuestaRelatoById: (payload) => dispatch('relatoGb/relato_getPropuestaRelatoById', payload),

    relato_guardarRelato: (payload) => dispatch('relatoGb/relato_guardarRelato', payload),

    relato_editarRelato: (payload) => dispatch('relatoGb/relato_editarRelato', payload),

    relato_getRelatoByIdDenuncia: (id) => dispatch('relatoGb/relato_getRelatoByIdDenuncia', id),

    /* MUTATIONS */
    relato_SET_DEFAULT_STATE: () => commit('relatoGb/relato_SET_DEFAULT_STATE')
  }
}
