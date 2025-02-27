/* eslint-disable no-unused-vars */
import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCausaAsignacionStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    ruc: computed(() => state.causaAsignacion.ruc),
    esAnalizaAsignacion: computed(() => state.causaAsignacion.esAnalizaAsignacion),
    idDenuncia: computed(() => state.causaAsignacion.idDenuncia),
    isBotonBackFromRa: computed(() => state.causaAsignacion.isBotonBackFromRa),
    isBotonBackFromDa: computed(() => state.causaAsignacion.isBotonBackFromDa),
    causaActual: computed(() => state.causaAsignacion.causaActual),
    propuestaPreclasificador: computed(
      () => state.causaAsignacion.propuestaPreclasificador
    ),
    preclasificacion: computed(() => state.causaAsignacion.preclasificacion),
    escritoConsultaFR: computed(() => state.causaAsignacion.escritoConsultaFR),
    hasPropuestaAsignacion: computed(
      () => state.causaAsignacion.hasPropuestaAsignacion
    ),

    // #region MUTATIONS
    causaAsignacion_SET_RUC: (ruc) =>
      commit('causaAsignacion/causaAsignacion_SET_RUC', ruc),

    causaAsignacion_SET_ANALIZA_ASIGNACION: (boolean) =>
      commit('causaAsignacion/causaAsignacion_SET_ANALIZA_ASIGNACION', boolean),

    causaAsignacion_SET_ID_DENUNCIA: (idDenuncia) =>
      commit('causaAsignacion/causaAsignacion_SET_ID_DENUNCIA', idDenuncia),

    causaAsignacion_SET_HAS_PROPUESTA_ASIGNACION: (hasPropuestaAsignacion) =>
      commit(
        'causaAsignacion/causaAsignacion_SET_HAS_PROPUESTA_ASIGNACION',
        hasPropuestaAsignacion
      ),

    causaAsignacion_SET_CAUSA_ACTUAL: (idDenuncia) =>
      commit('causaAsignacion/causaAsignacion_SET_CAUSA_ACTUAL', idDenuncia),

    causaAsignacion_SET_BOTON_BACK_FROM_RA: (boolean) =>
      commit('causaAsignacion/causaAsignacion_SET_BOTON_BACK_FROM_RA', boolean),

    causaAsignacion_SET_BOTON_BACK_FROM_DA: (boolean) =>
      commit('causaAsignacion/causaAsignacion_SET_BOTON_BACK_FROM_DA', boolean),

    causaAsignacion_SET_DEFAULT_STATE: () =>
      commit('causaAsignacion/causaAsignacion_SET_DEFAULT_STATE'),

    causaAsignacion_SET_ESCRITO_CONSULTA_FR: (escrito) =>
      commit(
        'causaAsignacion/causaAsignacion_SET_ESCRITO_CONSULTA_FR',
        escrito
      ),
    // #endregion

    // #region ACTIONS
    causaAsignacion_iniciarProcesoAsignacion: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_iniciarProcesoAsignacion',
        payload
      ),

    causaAsignacion_aprobarMultiplesPropuestasAsignacion: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_aprobarMultiplesPropuestasAsignacion',
        payload
      ),

    causaAsignacion_completarRevisarDecidirPropuesta: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarRevisarDecidirPropuesta',
        payload
      ),

    causaAsignacion_completarRevisarCalidadAntecedentes: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarRevisarCalidadAntecedentes',
        payload
      ),

    causaAsignacion_completarModificarTipificacionDelito: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarModificarTipificacionDelito',
        payload
      ),

    causaAsignacion_completarSolicitarAntecedentes: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarSolicitarAntecedentes',
        payload
      ),

    causaAsignacion_completarSolicitarAntecedentesEspecificos: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarSolicitarAntecedentesEspecificos',
        payload
      ),

    causaAsignacion_completarDecidirAsignacion: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarDecidirAsignacion',
        payload
      ),

    causaAsignacion_completarSeguirLineaInvestigativa: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarSeguirLineaInvestigativa',
        payload
      ),

    causaAsignacion_completarTransferirCausa: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarTransferirCausa',
        payload
      ),

    causaAsignacion_completarAgruparCausas: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarAgruparCausas',
        payload
      ),

    causaAsignacion_completarDesestimarCausa: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarDesestimarCausa',
        payload
      ),

    causaAsignacion_completarAgregarComentarioPreclasificador: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarAgregarComentarioPreclasificador',
        payload
      ),

    causaAsignacion_completarMaterializarSolicitud: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarMaterializarSolicitud',
        payload
      ),

    causaAsignacion_completarSugerirFRTransferencia: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarSugerirFRTransferencia',
        payload
      ),

    causaAsignacion_completarRegistrarRespuesta: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarRegistrarRespuesta',
        payload
      ),

    causaAsignacion_cambiarNombreCausa: (payload) =>
      dispatch('causaAsignacion/causaAsignacion_cambiarNombreCausa', payload),

    causaAsignacion_completarInstruirDiligencias: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_completarInstruirDiligencias',
        payload
      ),

    causaAsignacion_guardarCausaDesestimacion: (payload) =>
      dispatch(
        'causaAsignacion/causaAsignacion_guardarCausaDesestimacion',
        payload
      )
    // #endregion
  }
}
