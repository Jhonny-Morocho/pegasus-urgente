import { useStore } from 'vuex'
import { computed } from 'vue'

export const useDocumentoStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    documentos: computed(() => state.documentoGb.documentos),
    paginacion: computed(() => state.documentoGb.paginacion),
    pautasVif: computed(() => state.documentoGb.pautasVif),
    declaraciones: computed(() => state.documentoGb.declaraciones),
    hospitalizacion: computed(() => state.documentoGb.hospitalizacion),
    ordenesDetencion: computed(() => state.documentoGb.ordenesDetencion),
    formulariosRiesgo: computed(() => state.documentoGb.formulariosRiesgo),
    fotoHuellaFirma: computed(() => state.documentoGb.fotoHuellaFirma),
    videosDelitos: computed(() => state.documentoGb.videosDelitos),
    formulariosDenuncia: computed(() => state.documentoGb.formulariosDenuncia),
    fotosVideosEyD: computed(() => state.documentoGb.fotosVideosEyD),

    documento_addDocumento: (documento) =>
      dispatch('documentoGb/documento_addDocumento', documento),
    documento_deleteDocumento: (payload) =>
      dispatch('documentoGb/documento_deleteDocumento', payload),
    documento_updateDocumento: (documento) =>
      dispatch('documentoGb/documento_updateDocumento', documento),
    documento_getDocumentosEnCausa: (payload) =>
      dispatch('documentoGb/documento_getDocumentosEnCausa', payload),
    documento_getDocumentoEnCausaByID: (payload) =>
      dispatch('documentoGb/documento_getDocumentoEnCausaByID', payload),
    documento_getTiposSujetosEnCausa: (payload) =>
      dispatch('documentoGb/documento_getTiposSujetosEnCausa', payload),
    documento_getIntervinientesEnCausaByTipo: (payload) =>
      dispatch('documentoGb/documento_getIntervinientesEnCausaByTipo', payload),
    documento_getFamiliasEspeciesEnCausa: (payload) =>
      dispatch('documentoGb/documento_getFamiliasEspeciesEnCausa', payload),
    documento_getEspeciesEnCausaByFamilia: (payload) =>
      dispatch('documentoGb/documento_getEspeciesEnCausaByFamilia', payload),
    documento_getDocumentosByIdDenuncia: (id) =>
      dispatch('documentoGb/documento_getDocumentosByIdDenuncia', id),
    documento_getDocumentoByIdDocumentoSolicitud: (payload) =>
      dispatch('documentoGb/documento_getDocumentoByIdDocumentoSolicitud', payload),

    documento_addDocumentoCDD: (payload) =>
      dispatch('documentoGb/documento_addDocumentoCDD', payload),
    documento_asociarIdPropietarioDocumentoCDD: (payload) =>
      dispatch('documentoGb/documento_asociarIdPropietarioDocumentoCDD', payload),
    documento_updateMetadataDocumentoCDD: (payload) =>
      dispatch('documentoGb/documento_updateMetadataDocumentoCDD', payload),
    documento_getDocumentosByCatalogoCDD: (payload) =>
      dispatch('documentoGb/documento_getDocumentosByCatalogoCDD', payload),
    documento_getDocumentoBySeccionCDD: (payload) =>
      dispatch('documentoGb/documento_getDocumentoBySeccionCDD', payload),
    documento_deleteDocumentoCDD: (payload) =>
      dispatch('documentoGb/documento_deleteDocumentoCDD', payload),

    // 🤡 bff
    documento_getDocumentosByIdDenunciaBff: (payload) =>
      dispatch('documentoGb/documento_getDocumentosByIdDenunciaBff', payload),
    documento_DELETE_DOCUMENTO: (idDocumento) =>
      commit('documentoGb/documento_DELETE_DOCUMENTO', idDocumento),
    documento_SET_DOCUMENTOS: (documentos) =>
      commit('documentoGb/documento_SET_DOCUMENTOS', documentos),
    documento_SET_DEFAULT_STATE: () =>
      commit('documentoGb/documento_SET_DEFAULT_STATE'),
    documento_ADD_DOCUMENTO: (filtro) =>
      commit('documentoGb/documento_ADD_DOCUMENTO', filtro)
  }
}
