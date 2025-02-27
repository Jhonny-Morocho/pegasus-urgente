/* eslint-disable no-unused-vars */
import { computed } from 'vue';
import { useStore } from 'vuex';

export const useGestionDireccionInvestigacionStore = () => {
  const { dispatch, commit, state } = useStore();

  return {
    // #region COMPUTED STATE
    resumenCausa: computed(() => state.gestionDireccionInvestigacion.resumenCausa),
    ruc: computed(() => state.gestionDireccionInvestigacion.ruc),
    idDenuncia: computed(() => state.gestionDireccionInvestigacion.idDenuncia),
    idCausa: computed(() => state.gestionDireccionInvestigacion.idCausa),
    causaActual: computed(() => state.gestionDireccionInvestigacion.causaActual),
    cargaUnidad: computed(() => state.gestionDireccionInvestigacion.cargaUnidad),
    cargaFiscal: computed(() => state.gestionDireccionInvestigacion.cargaFiscal),
    cargaUnidadFiscal: computed(() => state.gestionDireccionInvestigacion.cargaUnidadFiscal),
    // #endregion

    // #region ACTIONS
    gestionDireccionInvestigacion_getResumenCausa: (payload) =>
      dispatch(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_getResumenCausa',
        payload
      ),
    gestionDireccionInvestigacion_getDecisionCausa: (payload) =>
      dispatch(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_getDecisionCausa',
        payload
      ),
    gestionDireccionInvestigacion_completarRevisarCausa: (payload) =>
      dispatch(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_completarRevisarCausa',
        payload
      ),
    gestionDireccionInvestigacion_completarDefinirAccionMotivoCambio: (
      payload
    ) =>
      dispatch(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_completarDefinirAccionMotivoCambio',
        payload
      ),
    gestionDireccionInvestigacion_getNotificacionTransferencia: (payload) =>
      dispatch(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_getNotificacionTransferencia',
        payload
      ),
    gestionDireccionInvestigacion_getCargaTrabajoUnidad: (payload) =>
      dispatch(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_getCargaTrabajoUnidad',
        payload
      ),
    gestionDireccionInvestigacion_getCargaTrabajoFiscal: (payload) =>
      dispatch(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_getCargaTrabajoFiscal',
        payload
      ),
    gestionDireccionInvestigacion_filtrarCargaUnidadTrabajoFiscal: (payload) => 
        dispatch('gestionDireccionInvestigacion/gestionDireccionInvestigacion_filtrarCargaUnidadTrabajoFiscal', payload),
    // #endregion

    // #region MUTATIONS
    gestionDireccionInvestigacion_SET_CAUSA_ACTUAL: (causa) =>
      commit(
        'gestionDireccionInvestigacion/gestionDireccionInvestigacion_SET_CAUSA_ACTUAL',
        causa
      )
    // #endregion
  };
};
