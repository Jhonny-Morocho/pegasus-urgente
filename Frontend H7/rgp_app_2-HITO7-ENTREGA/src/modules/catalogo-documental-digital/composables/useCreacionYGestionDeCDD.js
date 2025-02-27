import { useStore } from 'vuex'
import { computed } from 'vue'

export const useCreacionYGestionDeCDD = () => {
  const { state, dispatch, commit } = useStore()

  return {
    documentos: computed(() => state.creacionYGestionDeCDD.documentos),
    ruc: computed(() => state.creacionYGestionDeCDD.ruc),
    tipoCatalogo: computed(() => state.creacionYGestionDeCDD.tipoCatalogo),
    nivelAcceso: computed(() => state.creacionYGestionDeCDD.nivelAcceso),
    disponibilidad: computed(() => state.creacionYGestionDeCDD.disponibilidad),
    catalogo: computed(() => state.creacionYGestionDeCDD.catalogo),
    paginacionDocumentos: computed(() => state.creacionYGestionDeCDD.paginacionDocumentos),

    solicitudesCatalogo: computed(() => state.creacionYGestionDeCDD.solicitudesCatalogo),
    antecedentesSolicitud: computed(() => state.creacionYGestionDeCDD.antecedentesSolicitud),
    versionesDocumento: computed(() => state.creacionYGestionDeCDD.versionesDocumento),
    documentoActualizar: computed(() => state.creacionYGestionDeCDD.documentoActualizar),

    paginacion: computed(() => null),
    paginacionCatalogo: computed(() => state.creacionYGestionDeCDD.paginacionCatalogo),
    paginacionVersiones: computed(() => state.creacionYGestionDeCDD.paginacionVersiones),
    taskId: computed(() => state.creacionYGestionDeCDD.taskId),

    // GESTION DE CATALOGO CDD
    // actions
    creacionYGestionDeCDD_addDocumento: (documento) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_addDocumento', documento),
    creacionYGestionDeCDD_getDataSolicitudes: (payload) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_getDataSolicitudes', payload),
    creacionYGestionDeCDD_deleteDocumento: (payload) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_deleteDocumento', payload),
    creacionYGestionDeCDD_updateDocumento: (documento) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_updateDocumento', documento),
    creacionYGestionDeCDD_getHistorialVersionesDocumento: (idDocumento) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_getHistorialVersionesDocumento', idDocumento),
    // mutations
    creacionYGestionDeCDD_SET_DEFAULT_STATE: () => commit('creacionYGestionDeCDD/creacionYGestionDeCDD_SET_DEFAULT_STATE'),

    // GESTION DE DOCUMENTOS CDDD
    // actinos
    creacionYGestionDeCDD_addCatalogo: (payload) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_addCatalogo', payload),
    creacionYGestionDeCDD_buscarCatalogoByNombre: (payload) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_buscarCatalogoByNombre', payload),
    creacionYGestionDeCDD_getDocumentosPorCatalogo: (payload) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_getDocumentosPorCatalogo', payload),
    creacionYGestionDeCDD_getDocumentoById: (payload) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_getDocumentoById', payload),

    // mutations
    creacionYGestionDeCDD_SET_DOCUMENTOS_DEFAULT_STATE: () => commit('creacionYGestionDeCDD/creacionYGestionDeCDD_SET_DOCUMENTOS_DEFAULT_STATE'),

    // GET DATA SOLICITUD
    creacionYGestionDeCDD_getDataSolicitudById: (payload) => dispatch('creacionYGestionDeCDD/creacionYGestionDeCDD_getDataSolicitudById', payload)
  }
}
