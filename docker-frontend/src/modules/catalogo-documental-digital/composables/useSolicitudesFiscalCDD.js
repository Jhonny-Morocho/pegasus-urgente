import { computed } from 'vue'
import { useStore } from 'vuex'

export const useSolicitudesFiscalCDD = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // STATES
    tareasFiscal: computed(() => state.solicitudesFiscalCDD.tareasFiscal),
    paginacionBandejaFiscal: computed(() => state.solicitudesFiscalCDD.paginacionBandejaFiscal),
    dataListDocumentos: computed(() => state.solicitudesFiscalCDD.dataListDocumentos),
    solicitud: computed(() => state.solicitudesFiscalCDD.solicitud),
    paginacion: computed(() => state.solicitudGestionDocumentosCDD.paginacion),
    antecedentesSolicitud: computed(() => state.solicitudesFiscalCDD.antecedentesSolicitud),
    documentoSolicitud: computed(() => state.solicitudesFiscalCDD.documentoSolicitud),
    paginacionDocumentoSolicitud: computed(() => state.solicitudesFiscalCDD.paginacionDocumentoSolicitud),
    taskId: computed(() => state.solicitudesFiscalCDD.taskId),
    antecedentesCatalogo: computed(() => state.solicitudesFiscalCDD.antecedentesCatalogo),
    antecedentesDocumentosPaginacion: computed(() => state.solicitudesFiscalCDD.antecedentesDocumentosPaginacion),
    datosActualizados: computed(() => state.solicitudesFiscalCDD.datosActualizados),

    // ACTIONS
    // Get data bandeja fiscal
    solicitudesFiscalCDD_getDataBandejaFiscal: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_getDataBandejaFiscal', payload),

    // Creacion solicitud actualizacion documento
    solicitudesFiscalCDD_solicitudSubirOActualizarDocumento: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_solicitudSubirOActualizarDocumento', payload),

    // Solicitud de Analisis de Actualizacion
    solicitudesFiscalCDD_getSolicitudActualizacionById: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_getSolicitudActualizacionById', payload),
    solicitudesFiscalCDD_getAntecedentesCatalogo: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_getAntecedentesCatalogo', payload),
    solicitudesFiscalCDD_aprobarSolicitudActualizacion: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_aprobarSolicitudActualizacion', payload),

    // Creacion de solicitud para recuperar documento fisico
    solicitudesFiscalCDD_solicitudRecuperacionDocumentoFisico: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_solicitudRecuperacionDocumentoFisico', payload),

    // Obtencion de solicitud de recuperacion de documento fisico para analisis
    solicitudesFiscalCDD_getSolicitudAnalisisRecuperacionDocuFisicoById: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_getSolicitudAnalisisRecuperacionDocuFisicoById', payload),

    // Aprobar Analisis de solicitud de recuperacion de documento fisico
    solicitudesFiscalCDD_aprobarSolicitudRecuperacionDocuFisico: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_aprobarSolicitudRecuperacionDocuFisico', payload),

    // Obtencion Solicitud para Revisión de solicitud de almacenamiento físico
    solicitudesFiscalCDD_getSolicitudRevisionAlmacenamientoFisico: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_getSolicitudRevisionAlmacenamientoFisico', payload),

    // Aprobar o rechazar solicitud de almacenamiento físico
    solicitudesFiscalCDD_aprueboRechazoSolicitudAlmacenamientoFisico: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_aprueboRechazoSolicitudAlmacenamientoFisico', payload),

    // Creacion Solicitud de eliminacion de archivo
    solicitudesFiscalCDD_solicitudEliminacionArchivo: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_solicitudEliminacionArchivo', payload),
    // Obtencion de solicitud para revision
    solicitudesFiscalCDD_getSolicitudEliminacionArchivo: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_getSolicitudEliminacionArchivo', payload),

    // Aprobar o rechazar solicitud de eliminacion de archivo
    solicitudesFiscalCDD_aprobarSolicitudRevisionEliminacionArchivo: (payload) => dispatch('solicitudesFiscalCDD/solicitudesFiscalCDD_aprobarSolicitudRevisionEliminacionArchivo',
      payload),

    // Set taskId de tarea de la bandeja
    solicitudesFiscalCDD_SET_TASK_ID: (payload) => commit('solicitudesFiscalCDD/solicitudesFiscalCDD_SET_TASK_ID', payload)

  }
}
