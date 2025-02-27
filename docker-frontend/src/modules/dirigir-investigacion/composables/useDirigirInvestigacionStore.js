import { computed } from 'vue'
import { useStore } from 'vuex'

export const useDirigirInvestigacionStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    ruc: computed(() => state.dirigirInvestigacion.ruc),
    idDenuncia: computed(() => state.dirigirInvestigacion.idDenuncia),
    medidasCautelares: computed(() => state.dirigirInvestigacion.medidasCautelares),
    medidasCautelaresSolicitudes: computed(() => state.dirigirInvestigacion.medidasCautelaresSolicitudes),
    causa: computed(() => state.dirigirInvestigacion.causa),
    antecedentes: computed(() => state.dirigirInvestigacion.antecedentes),
    fiscaliaLocal: computed(() => state.dirigirInvestigacion.fiscaliaLocal),
    institucion: computed(() => state.dirigirInvestigacion.institucion),
    resumenCausa: computed(() => state.dirigirInvestigacion.resumenCausa),
    seleccionDecision: computed(() => state.dirigirInvestigacion.seleccionDecision),
    hasDirectrizObligatoria: computed(() => state.dirigirInvestigacion.hasDirectrizObligatoria),
    idCausa: computed(() => state.dirigirInvestigacion.idCausa),
    causaPrincipal: computed(() => state.dirigirInvestigacion.causaPrincipal),

    // #region tab - resumen causa
    dirigirInvestigacion_getResumenCausa: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_getResumenCausa',
        payload
      ),
    dirigirInvestigacion_getResumenCausaByIdCausa: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_getResumenCausaByIdCausa',
        payload
      ),
    dirigirInvestigacion_getObtenerDetalleDenunciaCompleto: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_getObtenerDetalleDenunciaCompleto',
        payload
      ),
    // #endregion

    // #region tab - relato hecho
    dirigirInvestigacion_getComentariosRelato: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_getComentariosRelato',
        payload
      ),
    dirigirInvestigacion_postGuardarComentarioRelato: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_postGuardarComentarioRelato',
        payload
      ),
    // #endregion

    // #region PAM
    dirigirInvestigacion_iniciarYReservar: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_iniciarYReservar', payload),
    dirigirInvestigacion_iniciar: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_iniciar', payload),
    dirigirInvestigacion_completarRevisarAntecedentesInvestigacion: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarRevisarAntecedentesInvestigacion', payload),
    dirigirInvestigacion_completarIngresarDirectrizInvestigacion: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarIngresarDirectrizInvestigacion', payload),
    dirigirInvestigacion_completarDesarrolloInvestigacion: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarDesarrolloInvestigacion', payload),
    dirigirInvestigacion_completarActualizarDirectrizInvestigacion: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarActualizarDirectrizInvestigacion', payload),
    dirigirInvestigacion_completarSolicitarAudienciaFormalizacion: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarSolicitarAudienciaFormalizacion', payload),
    dirigirInvestigacion_completarTomarDecisionCausaRelacion: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarTomarDecisionCausaRelacion', payload),
    dirigirInvestigacion_completarDefinirNuevaCausa: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarDefinirNuevaCausa', payload),
    dirigirInvestigacion_completarDefinirRedistribucionEspeciesDinero: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarDefinirRedistribucionEspeciesDinero', payload),
    dirigirInvestigacion_completarDefinirInstruirDiligencia: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarDefinirInstruirDiligencia', payload),
    // #endregion

    // #region view - Ingresar Directriz Investigacion
    dirigirInvestigacion_postGuardarDirectrizInvestigacion: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_postGuardarDirectrizInvestigacion',
        payload
      ),
    dirigirInvestigacion_patchGuardarDirectrizInvestigacion: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_patchGuardarDirectrizInvestigacion',
        payload
      ),
    dirigirInvestigacion_getObtenerDirectrizInvestigacion: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_getObtenerDirectrizInvestigacion',
        payload
      ),
    dirigirInvestigacion_getObtenerHistorialDirectrizCausa: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_getObtenerHistorialDirectrizCausa',
        payload
      ),
    dirigirInvestigacion_getObtenerHistorialDirectrizRelacion: (payload) =>
      dispatch(
        'dirigirInvestigacion/dirigirInvestigacion_getObtenerHistorialDirectrizRelacion',
        payload
      ),
    // #endregion

    // #region Agregar Medidas Cautelares
    dirigirInvestigacion_createMedidaCautelar: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_createMedidaCautelar', payload),
    dirigirInvestigacion_deleteMedidaCautelar: (idx) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_deleteMedidaCautelar', idx),
    dirigirInvestigacion_SET_MEDIDAS_CAUTELARES: (medidas) =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_MEDIDAS_CAUTELARES', medidas),
    // #endregion

    // #region Solicitud Medidas Cautelares (pam)
    dirigirInvestigacion_postEnviarSolicitudAudienciaFormalizacion: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_postEnviarSolicitudAudienciaFormalizacion', payload),
    // #endregion

    // #region extras
    dirigirInvestigacion_postRegistrarAutorizacionMedidasIntrusivas: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_postRegistrarAutorizacionMedidasIntrusivas', payload),
    dirigirInvestigacion_postCompletarCierreInvestigacionEscrito: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_postCompletarCierreInvestigacionEscrito', payload),
    // #endregion

    // #region MUTATIONS
    dirigirInvestigacion_SET_DEFAULT_STATE: () =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_DEFAULT_STATE'),

    dirigirInvestigacion_SET_RUC: (ruc) =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_RUC', ruc),

    dirigirInvestigacion_SET_ID_DENUNCIA: (idDenuncia) =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_ID_DENUNCIA', idDenuncia),

    dirigirInvestigacion_SET_CAUSA: (causa) =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_CAUSA', causa),
    dirigirInvestigacion_SET_SELECCION_DECISION: (causa) =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_SELECCION_DECISION', causa),
    dirigirInvestigacion_SET_DIRECTRIZ_OBLIGATORIA: (causa) =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_DIRECTRIZ_OBLIGATORIA', causa),
    // #endregion

    dirigirInvestigacion_putSepararCausa: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_putSepararCausa', payload),

    // #region Definir Curso Causa
    dirigirInvestigacion_persistirDecisionCausa: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_persistirDecisionCausa', payload),
    dirigirInvestigacion_crearNotificacionTransferencia: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_crearNotificacionTransferencia', payload),
    // #endregion

    dirigirInvestigacion_putAgrupacionCausas: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_putAgrupacionCausas', payload),

    dirigirInvestigacion_completarElaborarPropuestaTransferencia: (payload) =>
      dispatch('dirigirInvestigacion/dirigirInvestigacion_completarElaborarPropuestaTransferencia', payload),

    dirigirInvestigacion_SET_CAUSA_PRINCIPAL: (causaPrincipal) =>
      commit('dirigirInvestigacion/dirigirInvestigacion_SET_CAUSA_PRINCIPAL', causaPrincipal)
  }
}
