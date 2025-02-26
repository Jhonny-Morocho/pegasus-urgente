import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCausasRelacionadasStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // COMPUTED PROPERTIES
    causasRelacionadas: computed(() => state.causasRelacionadas.causasRelacionadas),
    causasRelacionadasGuardadas: computed(() => state.causasRelacionadas.causasRelacionadasGuardadas),
    paginacionCausasRelacionadas: computed(() => state.causasRelacionadas.paginacionCausasRelacionadas),

    // GETTERS

    // ACTIONS
    causasRelacionadas_getCausasRelacionadas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_getCausasRelacionadas', payload),
    causasRelacionadas_postCausasRelacionadas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_postCausasRelacionadas', payload),
    causasRelacionadas_buscarCausasRelacionadas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_buscarCausasRelacionadas', payload),
    causasRelacionadas_relacionarCausas: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_relacionarCausas', payload),
    causasRelacionadas_deleteCausaRelacionada: (payload) =>
      dispatch('causasRelacionadas/causasRelacionadas_deleteCausaRelacionada', payload),

    // MUTATIONS
    causasRelacionadas_SET_CAUSAS_RELACIONADAS: (payload) =>
      commit('causasRelacionadas/causasRelacionadas_SET_CAUSAS_RELACIONADAS', payload),
    causasRelacionadas_SET_CAUSAS_RELACIONADAS_GUARDADAS: (payload) =>
      commit('causasRelacionadas/causasRelacionadas_SET_CAUSAS_RELACIONADAS_GUARDADAS', payload)
  }
}
