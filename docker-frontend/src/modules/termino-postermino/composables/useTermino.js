import { computed } from 'vue'
import { useStore } from 'vuex'

export const useTermino = () => {
  const { dispatch, state, commit } = useStore()

  return {
    resumenCausa: computed(() => state.termino.causa),
    ruc: computed(() => state.termino.ruc),
    consultaTermino: computed(() => state.termino.consultaTermino),
    respuestaFJ: computed(() => state.termino.respuestaFJ),
    idDenuncia: computed(() => state.termino.idDenuncia),

    /* ACTIONS */

    /* ----- PAM ------ */

    termino_PamCompletarRevisarConsulta: (payload) =>
      dispatch('termino/termino_PamCompletarRevisarConsulta', payload),
    termino_PamCompletarRevisarObservaciones: (payload) =>
      dispatch('termino/termino_PamCompletarRevisarObservaciones', payload),
    termino_PamCompletarGestionarEnTribunales: (payload) =>
      dispatch('termino/termino_PamCompletarGestionarEnTribunales', payload),
    termino_PamCompletarGestionarAudienciaSuspencionTermino: (payload) =>
      dispatch(
        'termino/termino_PamCompletarGestionarAudienciaSuspencionTermino',
        payload
      ),
    termino_PamCompletarTerminarCausa: (payload) =>
      dispatch('termino/termino_PamCompletarTerminarCausa', payload),

    /* ---------------- */

    termino_getDecisionCausa: () =>
      dispatch('termino/termino_getDecisionCausa'),
    termino_postRespuestaFiscalJefe: (payload) =>
      dispatch('termino/termino_postRespuestaFiscalJefe', payload),
    termino_getRespuestaFiscalJefe: (payload) =>
      dispatch('termino/termino_getRespuestaFiscalJefe', payload),
    termino_postComplementoFiscal: (payload) =>
      dispatch('termino/termino_postComplementoFiscal', payload),
    termino_postEscritoSolicitud: (payload) =>
      dispatch('termino/termino_postEscritoSolicitud', payload),
    termino_getAntecedentesCausa: () =>
      dispatch('termino/termino_getAntecedentesCausa'),
    termino_getComplementoFiscal: (payload) =>
      dispatch('termino/termino_getComplementoFiscal', payload),
    termino_getAntecedentesAudiencia: () =>
      dispatch('termino/termino_getAntecedentesAudiencia'),
    termino_setDestinoEspecies: (payload) =>
      dispatch('termino/termino_setDestinoEspecies', payload),
    termino_getConsultaTermino: (payload) =>
      dispatch('termino/termino_getConsultaTermino', payload),
    termino_postEscritoTermino: (payload) =>
      dispatch('termino/termino_postEscritoTermino', payload),
    termino_postEscritoDeclaracionTermino: (payload) =>
      dispatch('termino/termino_postEscritoDeclaracionTermino', payload),
    termino_postEscritoLeyDrogasTribunal: (payload) =>
      dispatch('termino/termino_postEscritoLeyDrogasTribunal', payload),

    /* MUTATIONS */

    termino_SET_RUC: (payload) => commit('termino/termino_SET_RUC', payload),
    termino_SET_CAUSA: (payload) =>
      commit('termino/termino_SET_CAUSA', payload),
    termino_SET_ID_DENUNCIA: (payload) =>
      commit('termino/termino_SET_ID_DENUNCIA', payload)
  }
}
