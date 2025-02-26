import { computed } from 'vue'
import { useStore } from 'vuex'

export const useSolicitudesEncargadoBodega = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // STATES
    tareasEncargadoBodega: computed(() => state.solicitudesEncargadoBodega.tareasEncargadoBodega),
    paginacionBandejaBodega: computed(() => state.solicitudesEncargadoBodega.paginacionBandejaBodega),
    antecedentesSolicitud: computed(() => state.solicitudesEncargadoBodega.antecedentesSolicitud),
    taskId: computed(() => state.solicitudesEncargadoBodega.taskId),
    documentoReingreso: computed(() => state.solicitudesEncargadoBodega.documentoReingreso),
    documentoAgendamiento: computed(() => state.solicitudesEncargadoBodega.documentoAgendamiento),
    paginaciondocumento: computed(() => state.solicitudesEncargadoBodega.paginaciondocumento),
    catalogoSolicitud: computed(() => state.solicitudesEncargadoBodega.catalogoSolicitud),
    registroDevolucion: computed(() => state.solicitudesEncargadoBodega.registroDevolucion),
    solicitud: computed(() => state.solicitudesEncargadoBodega.solicitud),
    idSolicitud: computed(() => state.solicitudesEncargadoBodega.idSolicitud),
    intervineintesRegistroDestruccion: computed(() => state.solicitudesEncargadoBodega.intervineintesRegistroDestruccion),
    intervineintesRegistroDevolucion: computed(() => state.solicitudesEncargadoBodega.intervineintesRegistroDevolucion),

    // ACTIONS
    // Get data bandeja Encargado Bodega
    solicitudesEncargadoBodega_getDataBandeja: (params) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_getDataBandeja', params),

    // Enviar revision de solicitud de recuperacion de documento fisico
    solicitudesEncargadoBodega_getSolicitudRecuperacionDocuFisico: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_getSolicitudRecuperacionDocuFisico', payload),

    // Enviar analisis de solicitud de recuperación de documento fisicio
    solicitudesEncargadoBodega_enviarAnalisisSolicitudRecuperacionArchivo: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_enviarAnalisisSolicitudRecuperacionArchivo', payload),

    // Generar Registro de salida documentos fisico
    solicitudesEncargadoBodega_generarRegistroDesalidaDocufisico: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_generarRegistroDesalidaDocufisico',
      payload),

    // Obtener solicitud para reingreso
    solicitudesEncargadoBodega_getSolicitudParaReingreso: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_getSolicitudParaReingreso', payload),

    // Generar reingreso de documento fisico
    solicitudesEncargadoBodega_generarRegistroReingresoDocufisico: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_generarRegistroReingresoDocufisico', payload),
    // Obtener solicitud para registro de ingreso a bodega
    solicitudesEncargadoBodega_getSolicitudRegistroIngresoDocuFisico: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_getSolicitudRegistroIngresoDocuFisico', payload),

    // enviar solicitud de registro de ingreso de documento a bodega
    solicitudesEncargadoBodega_enviarRegistroDeIngresoABodega: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_enviarRegistroDeIngresoABodega', payload),

    // Enviar Solicitud De Ingreso de Documento Fisico a Bodega Temporal
    solicitudesEncargadoBodega_enviarRegistroABodegaTemporal: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_enviarRegistroABodegaTemporal', payload),

    // Obtener solicitud de eliminacion para agendamiento
    solicitudesEncargadoBodega_getSolicitudAgendamiento: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_getSolicitudAgendamiento', payload),

    // Generar Agendamiento para documento fisico
    solicitudesEncargadoBodega_generarAgendamientoParaDocumentoFisico: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_generarAgendamientoParaDocumentoFisico', payload),

    // Generar Registro de Destruccion de Documento Fisico
    solicitudesEncargadoBodega_generarRegistroDeDestruccion: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_generarRegistroDeDestruccion', payload),

    // Generar Registro de Devolucion de Documento Fisico
    solicitudesEncargadoBodega_generarRegistroDevolucion: (payload) => dispatch('solicitudesEncargadoBodega/solicitudesEncargadoBodega_generarRegistroDevolucion', payload),

    // MUTATIONS
    solicitudesEncargadoBodega__SET_DEFAULT_STATE: () => commit('solicitudesEncargadoBodega/solicitudesEncargadoBodega__SET_DEFAULT_STATE'),

    solicitudesEncargadoBodega__SET_TASK_ID: (payload) => commit('solicitudesEncargadoBodega/solicitudesEncargadoBodega__SET_TASK_ID', payload),

    solicitudesEncargadoBodega__SET_DATA_MINISTRO_FE_Y_QUIEN_DESTRUYE: (payload) => commit('solicitudesEncargadoBodega/solicitudesEncargadoBodega__SET_DATA_MINISTRO_FE_Y_QUIEN_DESTRUYE', payload),

    solicitudesEncargadoBodega__SET_DATA_INTERVINIENTE_DEVOLUCION: (payload) => commit('solicitudesEncargadoBodega/solicitudesEncargadoBodega__SET_DATA_INTERVINIENTE_DEVOLUCION', payload)

  }
}
