import { computed } from 'vue';
import { useStore } from 'vuex';

export const usePostermino = () => {
  const { dispatch, state, getters } = useStore();

  return {
    solicitudReapertura: computed(() => state.postermino.solicitudReapertura),
    acuerdoReparatorio: computed(() => state.postermino.acuerdoReparatorio),
    registroCumplimiento: computed(() => state.postermino.registroCumplimiento),

    /* GETTERS */
    postermino_getNombreCondicionMantenedor: (idCondicion) =>
      getters['postermino/postermino_getNombreCondicionMantenedor'](
        idCondicion
      ),

    postermino_getCondicionesByIdImputado: (idImputado) =>
      getters['postermino/postermino_getCondicionesByIdImputado'](idImputado),

    /* ACTIONS */

    /* Pam ------ */

    termino_PamCompletarEvaluarSolicitudReapertura: (payload) =>
      dispatch(
        'postermino/termino_PamCompletarEvaluarSolicitudReapertura',
        payload
      ),
    termino_PamCompletarRegistrarModificaciónAR: (payload) =>
      dispatch(
        'postermino/termino_PamCompletarRegistrarModificaciónAR',
        payload
      ),
    termino_PamCompletarRegistrarCumplimientoIncumplimiento: (payload) =>
      dispatch(
        'postermino/termino_PamCompletarRegistrarCumplimientoIncumplimiento',
        payload
      ),
    termino_PamCompletarRevisarCausa: (payload) =>
      dispatch('postermino/termino_PamCompletarRevisarCausa', payload),
    termino_PamCompletarEvaluarInformePsiquiatrico: (payload) =>
      dispatch(
        'postermino/termino_PamCompletarEvaluarInformePsiquiatrico',
        payload
      ),
    termino_PamCompletarSolicitarSobreseimientoDefinitivo: (payload) =>
      dispatch(
        'postermino/termino_PamCompletarSolicitarSobreseimientoDefinitivo',
        payload
      ),
    termino_PamCompletarReactivarCausaPenal: (payload) =>
      dispatch('postermino/termino_PamCompletarReactivarCausaPenal', payload),

    /* ----------------- */

    postermino_getSolicitudReapertura: (payload) =>
      dispatch('postermino/postermino_getSolicitudReapertura', payload),

    postermino_postDecisionSolicitudReapertura: (payload) =>
      dispatch(
        'postermino/postermino_postDecisionSolicitudReapertura',
        payload
      ),

    postermino_postAcuerdoReparatorio: (payload) =>
      dispatch('postermino/postermino_postAcuerdoReparatorio', payload),

    postermino_getRegistroCumplimiento: (payload) =>
      dispatch('postermino/postermino_getRegistroCumplimiento', payload),

    postermino_getAcuerdoReparatorio: (payload) =>
      dispatch('postermino/postermino_getAcuerdoReparatorio', payload),

    postermino_postRegistroCumplimiento: (payload) =>
      dispatch('postermino/postermino_postRegistroCumplimiento', payload),

    postermino_postDecisionRevisarCausa: (payload) =>
      dispatch('postermino/postermino_postDecisionRevisarCausa', payload),

    postermino_getInformePsiquiatrico: (payload) =>
      dispatch('postermino/postermino_getInformePsiquiatrico', payload),

    postermino_postInformePsiquiatrico: (payload) =>
      dispatch('postermino/postermino_postInformePsiquiatrico', payload),

    postermino_postSobreseimientoDefinitivo: (payload) =>
      dispatch('postermino/postermino_postSobreseimientoDefinitivo', payload),

    postermino_postReactivarCausa: (payload) =>
      dispatch('postermino/postermino_postReactivarCausa', payload),

    postermino_setResignarCausa: (payload) =>
      dispatch('postermino/postermino_setResignarCausa', payload)
  };
};
