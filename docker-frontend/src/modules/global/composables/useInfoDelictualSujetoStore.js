import { computed } from 'vue'
import { useStore } from 'vuex'

export const useInfoDelictualSujetoStore = () => {
  const { state, dispatch } = useStore()

  return {
    // #region STATE
    ordenesDetencion: computed(() => state.infoDelictualSujeto.ordenesDetencion),
    paginacionOrdenesDetencion: computed(() => state.infoDelictualSujeto.paginacionOrdenesDetencion),
    medidasCautelares: computed(() => state.infoDelictualSujeto.medidasCautelares),
    paginacionMedidasCautelares: computed(() => state.infoDelictualSujeto.paginacionMedidasCautelares),
    audienciasProgramadas: computed(() => state.infoDelictualSujeto.audienciasProgramadas),
    paginacionAudienciasProgramadas: computed(() => state.infoDelictualSujeto.paginacionAudienciasProgramadas),
    formalizaciones: computed(() => state.infoDelictualSujeto.formalizaciones),
    paginacionFormalizaciones: computed(() => state.infoDelictualSujeto.paginacionFormalizaciones),
    detencionesAnteriores: computed(() => state.infoDelictualSujeto.detencionesAnteriores),
    paginacionDetencionesAnteriores: computed(() => state.infoDelictualSujeto.paginacionDetencionesAnteriores),
    causasAsociadas: computed(() => state.infoDelictualSujeto.causasAsociadas),
    paginacionCausasAsociadas: computed(() => state.infoDelictualSujeto.paginacionCausasAsociadas),
    sentenciasAplicadas: computed(() => state.infoDelictualSujeto.sentenciasAplicadas),
    paginacionSentenciasAplicadas: computed(() => state.infoDelictualSujeto.paginacionSentenciasAplicadas),
    resolucionesAplicadas: computed(() => state.infoDelictualSujeto.resolucionesAplicadas),
    paginacionResolucionesAplicadas: computed(() => state.infoDelictualSujeto.paginacionResolucionesAplicadas),
    // #endregion

    // #region ACTIONS
    infoDelictualSujeto_getOrdenesDetencion: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getOrdenesDetencion', payload),
    infoDelictualSujeto_getMedidasCautelares: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getMedidasCautelares', payload),
    infoDelictualSujeto_getAudienciasProgramadas: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getAudienciasProgramadas', payload),
    infoDelictualSujeto_getFormalizaciones: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getFormalizaciones', payload),
    infoDelictualSujeto_getDetencionesAnteriores: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getDetencionesAnteriores', payload),
    infoDelictualSujeto_getCausasAsociadas: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getCausasAsociadas', payload),
    infoDelictualSujeto_getSentenciasAplicadas: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getSentenciasAplicadas', payload),
    infoDelictualSujeto_getResolucionesAplicadas: (payload) =>
      dispatch('infoDelictualSujeto/infoDelictualSujeto_getResolucionesAplicadas', payload)
    // #endregion

  }
}
