import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCompetenciaTerritorialStore = () => {
  const { state, dispatch, getters, commit } = useStore()

  return {
    // COMPUTED PROPERTIES
    listaGeorreferenciaDelitos: computed(() => state.competenciaTerritorial.listaGeorreferenciaDelitos),
    fiscaliasCompetentes: computed(() => state.competenciaTerritorial.fiscaliasCompetentes),
    delitosGeorreferenciados: computed(() => state.competenciaTerritorial.delitosGeorreferenciados),

    // GETTERS
    competenciaTerritorial_getGeorreferenciaDelito: (idDelito) => getters['competenciaTerritorial/competenciaTerritorial_getGeorreferenciaDelito'](idDelito),
    competenciaTerritorial_getCompetenciaDelito: (idDelito) => getters['competenciaTerritorial/competenciaTerritorial_getCompetenciaDelito'](idDelito),

    // ACTIONS
    competenciaTerritorial_getListaGeorreferenciaDelitos: (payload) =>
      dispatch('competenciaTerritorial/competenciaTerritorial_getListaGeorreferenciaDelitos', payload),
    competenciaTerritorial_consultarCompetenciaTerritorial: (payload) =>
      dispatch('competenciaTerritorial/competenciaTerritorial_consultarCompetenciaTerritorial', payload),
    competenciaTerritorial_guardarGeorrenferenciacion: (payload) =>
      dispatch('competenciaTerritorial/competenciaTerritorial_guardarGeorrenferenciacion', payload),
    competenciaTerritorial_getDelitosGeorreferenciados: (payload) =>
      dispatch('competenciaTerritorial/competenciaTerritorial_getDelitosGeorreferenciados', payload),

    // MUTATIONS
    competenciaTerritorial_SET_LISTA_GEORREFERENCIA_DELITOS: (payload) =>
      commit('competenciaTerritorial/competenciaTerritorial_SET_LISTA_GEORREFERENCIA_DELITOS', payload)
  }
}
