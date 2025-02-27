import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCausaPreclasificadorStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    ruc: computed(() => state.causaPreclasificador.ruc),
    idDenuncia: computed(() => state.causaPreclasificador.idDenuncia),
    causaActual: computed(() => state.causaPreclasificador.causaActual),
    isBotonBackFromPA: computed(() => state.causaPreclasificador.isBotonBackFromPA),

    // MUTATIONS
    causaPreclasificador_SET_RUC: (ruc) =>
      commit('causaPreclasificador/causaPreclasificador_SET_RUC', ruc),

    causaPreclasificador_SET_ID_DENUNCIA: (idDenuncia) =>
      commit('causaPreclasificador/causaPreclasificador_SET_ID_DENUNCIA', idDenuncia),

    causaPreclasificador_SET_CAUSA_ACTUAL: (causaActual) =>
      commit('causaPreclasificador/causaPreclasificador_SET_CAUSA_ACTUAL', causaActual),

    causaPreclasificador_SET_BOTON_BACK_FROM_PA: (boolean) =>
      commit('causaPreclasificador/causaPreclasificador_SET_BOTON_BACK_FROM_PA', boolean),

    causaPreclasificador_SET_DEFAULT_STATE: () =>
      commit('causaPreclasificador/causaPreclasificador_SET_DEFAULT_STATE'),

    // ACTIONS
    causaPreclasificador_iniciarYReservar: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_iniciarYReservar', payload),

    causaPreclasificador_completarValidarCalidadAntecedentes: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_completarValidarCalidadAntecedentes', payload),

    causaPreclasificador_completarAnalizarPreclasificacion: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_completarAnalizarPreclasificacion', payload),

    causaPreclasificador_completarSeguirLineaInvestigativa: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_completarSeguirLineaInvestigativa', payload),

    causaPreclasificador_completarTransferirCausa: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_completarTransferirCausa', payload),

    causaPreclasificador_completarAgruparCausa: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_completarAgruparCausa', payload),

    causaPreclasificador_completarDesestimarCausa: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_completarDesestimarCausa', payload),

    causaPreclasificador_solicitarAntecedentesPAM: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_solicitarAntecedentesPAM', payload),

    causaPreclasificador_solicitarAntecedentesEspecificosPAM: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_solicitarAntecedentesEspecificosPAM', payload),

    causaPreclasificador_cambiarNombreCausa: (payload) =>
      dispatch('causaPreclasificador/causaPreclasificador_cambiarNombreCausa', payload)
  }
}
