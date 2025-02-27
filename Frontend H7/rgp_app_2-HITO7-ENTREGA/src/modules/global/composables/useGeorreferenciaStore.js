
import { computed } from 'vue'
import { useStore } from 'vuex'

export const useGeorreferenciaStore = () => {
  const { dispatch, commit, state } = useStore()

  return {
    fiscaliasCompetentes: computed(() => state.georreferencia.fiscaliasCompetentes),

    georreferencia_getFiscaliaPorCompetenciaTerritorial: (payload) =>
      dispatch('georreferencia/georreferencia_getFiscaliaPorCompetenciaTerritorial', payload),
    georreferencia_getFiscaliaCompetenciaTerritorialByIdDenuncia: (payload) =>
      dispatch('georreferencia/georreferencia_getFiscaliaCompetenciaTerritorialByIdDenuncia', payload),
    georreferencia_postGuardarFiscaliaCompetenciaTerritorial: (payload) =>
      dispatch('georreferencia/georreferencia_postGuardarFiscaliaCompetenciaTerritorial', payload),

    georreferencia_SET_FISCALIAS_COMPETENTES: (data) =>
      commit('georreferencia/georreferencia_SET_FISCALIAS_COMPETENTES', data),
    georreferencia_RESET_FISCALIAS_COMPETENTES: (data) =>
      commit('georreferencia/georreferencia_RESET_FISCALIAS_COMPETENTES', data)
  }
}
