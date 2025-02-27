import { computed } from 'vue'
import { useStore } from 'vuex'

export const useGestionSolicitudesStore = () => {
  // TO-DO: Purgar lo que está aquí con lo del storage
  const { state, dispatch, commit } = useStore()

  return {
    ruc: computed(() => state.gestionSolicitudes.ruc),
    actividad: computed(() => state.gestionSolicitudes.actividad),
    idDenuncia: computed(() => state.gestionSolicitudes.idDenuncia),
    idCausa: computed(() => state.gestionSolicitudes.idCausa),
    denuncias: computed(() => state.gestionSolicitudes.denuncias),
    paginacion: computed(() => state.gestionSolicitudes.paginacion),
    antecedentesSolicitud: computed(
      () => state.gestionSolicitudes.antecedentes
    ),
    pideCuentaAutomatico: computed(() => state.gestionSolicitudes.pideCuenta),
    nuevoPideCuenta: computed(() => state.gestionSolicitudes.nuevoPideCuenta),
    solicitud: computed(() => state.gestionSolicitudes.solicitud),
    documentosAdjuntos: computed(
      () => state.gestionSolicitudes.documentosAdjuntos
    ),
    resultadoSolicitudOtraFiscalia: computed(
      () => state.gestionSolicitudes.resultadoSolicitudOtraFiscalia
    ),
    causa: computed(() => state.gestionSolicitudes.causa),
    resumenCausa: computed(() => state.gestionSolicitudes.resumenCausa),
    listaImputados: computed(() => state.gestionSolicitudes.listaImputados),
    dataSelector: computed(() => state.gestionSolicitudes.dataSelector),
    pamGDS: computed(() => state.gestionSolicitudes.pamGDS),
    solicitudesPjud: computed(() => state.gestionSolicitudes.solicitudesPjud),

    // #region ACTIONS
    gestionSolicitudes_getActividad: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getActividad',
        payload
      ),
    gestionSolicitudes_actualizarActividad: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_actualizarActividad',
        payload
      ),

    gestionSolicitudes_enviarSolicitud: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_enviarSolicitud',
        payload
      ),

    gestionSolicitudes_getDeAlgunEndpoint: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getDeAlgunEndpoint',
        payload
      ),

    gestionSolicitudes_getBandeja: () =>
      dispatch('gestionSolicitudes/gestionSolicitudes_getBandeja'),

    gestionSolicitudes_getBandejaFiscal: () =>
      dispatch('gestionSolicitudes/gestionSolicitudes_getBandejaFiscal'),

    gestionSolicitudes_getBandejaEjecutor: () =>
      dispatch('gestionSolicitudes/gestionSolicitudes_getBandejaEjecutor'),

    gestionSolicitudes_getPautasAplicadas: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getPautasAplicadas',
        payload
      ),

    gestionSolicitudes_getMedidasProteccion: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getMedidasProteccion',
        payload
      ),

    gestionSolicitudes_getMedidasCautelares: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getMedidasCautelares',
        payload
      ),

    gestionSolicitudes_getAnotaciones: (payload) =>
      dispatch('gestionSolicitudes/gestionSolicitudes_getAnotaciones', payload),

    gestionSolicitudes_getDiligencias: (payload) =>
      dispatch('gestionSolicitudes/gestionSolicitudes_getDiligencias', payload),

    gestionSolicitudes_getMinutas: (payload) =>
      dispatch('gestionSolicitudes/gestionSolicitudes_getMinutas', payload),
    // #region solicitud ampliacion Plazo
    gestionSolicitudes_getAntecedentes: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getAntecedentes',
        payload
      ),

    gestionSolicitudes_getSolicitud: (payload) =>
      dispatch('gestionSolicitudes/gestionSolicitudes_getSolicitud', payload),

    gestionSolicitudes_getPideCuentaAutomatico: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getPideCuentaAutomatico',
        payload
      ),

    gestionSolicitudes_getNuevoPideCuenta: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getNuevoPideCuenta',
        payload
      ),

    gestionSolicitudes_getDocumentosAdjuntos: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getDocumentosAdjuntos',
        payload
      ),

    gestionSolicitudes_postResponderSolicitudAmpliacionPlazo: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_postResponderSolicitudAmpliacionPlazo',
        payload
      ),

    gestionSolicitudes_postElaborarEscritoPideCuenta: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_postElaborarEscritoPideCuenta',
        payload
      ),

    gestionSolicitudes_getPlantillaPideCuenta: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getPlantillaPideCuenta',
        payload
      ),

    // #endregion solicitud ampliacion Plazo
    gestionSolicitudes_getPlantillaMaterializaFiscal: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getPlantillaMaterializaFiscal',
        payload
      ),

    gestionSolicitudes_getRespuestaSolicitudOtraFiscalia: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getRespuestaSolicitudOtraFiscalia',
        payload
      ),

    gestionSolicitudes_getDataFromPjud: (payload) =>
      dispatch(
        'gestionSolicitudes/gestionSolicitudes_getDataFromPjud',
        payload
      ),
    // #region MUTATIONS
    gestionSolicitudes_SET_RUC: (ruc) =>
      commit('gestionSolicitudes/gestionSolicitudes_SET_RUC', ruc),
    gestionSolicitudes_SET_ID_DENUNCIA: (idDenuncia) =>
      commit(
        'gestionSolicitudes/gestionSolicitudes_SET_ID_DENUNCIA',
        idDenuncia
      ),
    gestionSolicitudes_SET_ID_CAUSA: (idCausa) =>
      commit('gestionSolicitudes/gestionSolicitudes_SET_ID_CAUSA', idCausa),
    gestionSolicitudes_SET_CAUSA: (causa) =>
      commit('gestionSolicitudes/gestionSolicitudes_SET_CAUSA', causa),
    gestionSolicitudes_SET_DEFAULT_STATE: () =>
      commit('gestionSolicitudes/gestionSolicitudes_SET_DEFAULT_STATE'),
    gestionSolicitudes_SET_IMPUTADOS: (imputados) =>
      commit('gestionSolicitudes/gestionSolicitudes_SET_IMPUTADOS', imputados),
    gestionSolicitudes_SET_DATA_SELECTOR_SOLICITUD: (data) =>
      commit(
        'gestionSolicitudes/gestionSolicitudes_SET_DATA_SELECTOR_SOLICITUD',
        data
      ),
    gestionSolicitudes_SET_DATA_FROM_PJUD: (data) =>
      commit('gestionSolitudes/gestionSolicitudes_SET_DATA_FROM_PJUD', data)
    // #endregion
  }
}
