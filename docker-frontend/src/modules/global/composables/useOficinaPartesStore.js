import { computed } from 'vue'
import { useStore } from 'vuex'

export const useOficinaPartesStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    /* COMPUTED STATE */
    identificadorUnicoDenuncia: computed(() => state.oficinaPartesStore.identificadorUnicoDenuncia),

    paginacion: computed(() => state.oficinaPartesStore.paginacion),

    registroParte: computed(() => state.oficinaPartesStore.registroParte),

    actasDocumentosAdjuntos: computed(() => state.oficinaPartesStore.actasDocumentosAdjuntos),

    partes: computed(() => state.oficinaPartesStore.partes),

    dataParteDenuncia: computed(() => state.oficinaPartesStore.dataParteDenuncia),

    plantilla: computed(() => state.oficinaPartesStore.plantilla),

    partesBandeja: computed(() => state.oficinaPartesStore.partesBandeja),

    parteSeleccionado: computed(() => state.oficinaPartesStore.parteSeleccionado),

    idsDocsSolicitar: computed(() => state.oficinaPartesStore.idsDocsSolicitar),

    /* MUTATIONS */

    oficinaPartes_GET_ID_UNICO_DENUNCIA: (id) => commit('oficinaPartesStore/oficinaPartes_GET_ID_UNICO_DENUNCIA', id),

    oficinaPartes_ELIMINAR_PARTE_DENUNCIA: (idParte) => commit('oficinaPartesStore/oficinaPartes_ELIMINAR_PARTE_DENUNCIA', idParte),

    oficinaPartes_ELIMINAR_DOCUMENTO: (doc) => commit('oficinaPartesStore/oficinaPartes_ELIMINAR_DOCUMENTO', doc),

    oficinaPartes_EDITAR_DOCUMENTO: (doc) => commit('oficinaPartesStore/oficinaPartes_EDITAR_DOCUMENTO', doc),

    oficinaPartes_EDITAR_PARTE_ADD_DOCUMENTOS: (parte) => commit('oficinaPartesStore/oficinaPartes_EDITAR_PARTE_ADD_DOCUMENTOS', parte),

    oficinaPartes_LIMPIAR_DOCUMENTOS: () => commit('oficinaPartesStore/oficinaPartes_LIMPIAR_DOCUMENTOS'),

    oficinaPartes_LIMPIAR_PARTES: () => commit('oficinaPartesStore/oficinaPartes_LIMPIAR_PARTES'),

    /* ACTIONS */
    oficinaPartes_getPropuestaPlantilla: (payload) => dispatch('oficinaPartesStore/oficinaPartes_getPropuestaPlantilla', payload),

    oficinaPartes_getIdUnicoDenuncia: (id) => dispatch('oficinaPartesStore/oficinaPartes_getIdUnicoDenuncia', id),

    oficinaPartes_registrarParte: (registroParte) => dispatch('oficinaPartesStore/oficinaPartes_registrarParte', registroParte),

    oficinaPartes_agregarDocumento: (documento) => dispatch('oficinaPartesStore/oficinaPartes_agregarDocumento', documento),

    oficinaPartes_EDITAR_PARTE: (doc) => commit('oficinaPartesStore/oficinaPartes_EDITAR_PARTE', doc),

    oficinaPartes_agregarParte: (parte) => dispatch('oficinaPartesStore/oficinaPartes_agregarParte', parte),

    oficinaPartes_addParteDenuncia: () => dispatch('oficinaPartesStore/oficinaPartes_addParteDenuncia'),

    oficinaPartes_guardarSolicitudDocumentosFaltantes: (payload) => dispatch('oficinaPartesStore/oficinaPartes_guardarSolicitudDocumentosFaltantes', payload),

    oficinaPartes_addDenuncia: (usuario) => dispatch('oficinaPartesStore/oficinaPartes_addDenuncia', usuario, console.log('acaaa4')),

    oficinaPartes_getPartesDenunciaById: (id) => dispatch('oficinaPartesStore/oficinaPartes_getPartesDenunciaById', id),

    oficinaPartes_getBandeja: () => dispatch('oficinaPartesStore/oficinaPartes_getBandeja'),

    oficinaPartes_getBandejaSolicitudDocFaltante: (params) => dispatch('oficinaPartesStore/oficinaPartes_getBandejaSolicitudDocFaltante', params),

    /* MUTATIONS */
    oficinaPartes_EDIT_DOCUMENTO: (documento) => commit('oficinaPartesStore/oficinaPartes_EDIT_DOCUMENTO', documento),

    oficinaPartes_SET_PARTE_SELECCIONADO: (payload) => commit('oficinaPartesStore/oficinaPartes_SET_PARTE_SELECCIONADO', payload),

    oficinaPartes_AGREGAR_DOCUMENTACION_PLANTILLA: (payload) => commit('oficinaPartesStore/oficinaPartes_AGREGAR_DOCUMENTACION_PLANTILLA', payload),

    oficinaPartes_SET_ES_DOCUMENTO_SOLICITADO: (docuemntosSeleccionados) => commit('oficinaPartesStore/oficinaPartes_SET_ES_DOCUMENTO_SOLICITADO', docuemntosSeleccionados),

    oficinaPartes_SET_IDS_SOLICITUD_DOCUMENTOS: (ids) => commit('oficinaPartesStore/oficinaPartes_SET_IDS_SOLICITUD_DOCUMENTOS', ids)
  }
}
