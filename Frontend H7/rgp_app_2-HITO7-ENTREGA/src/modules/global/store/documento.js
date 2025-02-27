import { apiRGP, apiBFF, apiFilenet } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    documentos: [],
    paginacion: null,
    // documentos por sección FUD
    pautasVif: [],
    declaraciones: [],
    hospitalizacion: [],
    ordenesDetencion: [],
    formulariosRiesgo: [],
    fotoHuellaFirma: [],
    videosDelitos: [],
    formulariosDenuncia: [],
    fotosVideosEyD: []
  },

  actions: {
    async documento_addDocumento ({ commit }, payload) {
      // esto es porque backend pide el idEspecie ahora :)
      payload.idEspecie = payload.idEspecie ?? 'nohayid'
      console.log('payload', payload)
      try {
        const req = await apiRGP.post(
          `/documento/antecedentes-documentos/`,
          payload
        )
        commit('documento_ADD_DOCUMENTO', req.data)
        return req.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_deleteDocumento ({ _commit }, payload) {
      try {
        const req = await apiRGP.delete(
          `/documento/antecedentes-documentos/${payload.idDocumentoAsociacion}`
        )
        return req.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_updateDocumento ({ _commit }, payload) {
      console.log(payload)
      try {
        await apiRGP.put(
          `/documento/antecedentes-documentos/${payload.idDocumento}`,
          payload
        )
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_getDocumentosByIdDenuncia ({ commit }, id) {
      try {
        const response = await apiRGP.get(
          `/documento/antecedentes-documentos/denuncia/${id?.idDenuncia}`
        )
        commit('documento_SET_DOCUMENTOS', response.data)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async documento_getDocumentoByIdDocumentoSolicitud ({ commit }, payload) {
      try {
        const { idDocumentoSolicitud } = payload

        const { data } = await apiRGP.get(
          `/documento/filenet/documento/${idDocumentoSolicitud}`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // CDD (🤡))
    async documento_addDocumentoCDD ({ commit }, payload) {
      try {
        const response = await apiRGP.post(`/documento/documento`, {
          ...payload
        })
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // Asocia el documento a un idPersona/idDelito/etc correspondiente
    async documento_asociarIdPropietarioDocumentoCDD ({ commit }, payload) {
      try {
        const response = await apiRGP.patch(
          `/documento/documento/varios/propietario`,
          payload.request
        )
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_updateMetadataDocumentoCDD ({ commit }, payload) {
      try {
        const response = await apiRGP.put(
          `/documento/documento/${payload.idDocumento}`,
          payload.request
        )
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_getDocumentoByIdCDD ({ commit }, payload) {
      try {
        const response = await apiRGP.get(
          `/documento/filenet/${payload.idFilenet}`
        )
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_getDocumentoBySeccionCDD ({ commit }, payload) {
      try {
        console.log(payload)
        const idCatalogo = payload?.idCatalogo?.replace('{', '').replace('}', '')
        const params = {
          page: `?page=${payload.page}`,
          size: `&size=${payload.size}`,
          idCategoria: `&id-categoria-documento=${payload.idCategoriaDocumento}`
          // idPropietario: ''
        }
        const response = await apiRGP.get(
          `/documento/documento/catalogo/${idCatalogo}${params.page}${params.size}${params.idCategoria}`
        )

        if (payload.categoria === 'Pauta VIF') {
          commit('documento_SET_PAUTASVIF', response.data)
        } else if (payload.categoria === 'Declaración') {
          commit('documento_SET_DECLARACIONES', response.data)
        } else if (payload.categoria === 'Hospitalización') {
          commit('documento_SET_HOSPITALIZACION', response.data)
        } else if (payload.categoria === 'Orden Dentención Medida Cautelar') {
          commit('documento_SET_ORDENES_DETENCION', response.data)
        } else if (payload.categoria === 'Formulario riesgo NNA') {
          commit('documento_SET_FORMULARIOS_RIESGO', response.data)
        } else if (payload.categoria === 'Foto/Huella/Firma') {
          commit('documento_SET_FOTOHUELLAFIRMA', response.data)
        } else if (payload.categoria === 'Delito Video') {
          commit('documento_SET_VIDEOSDELITO', response.data)
        } else if (payload.categoria === 'Formulario Denuncia') {
          commit('documento_SET_FORMULARIOS_DENUNCIA', response.data)
        } else if (payload.categoria === 'Fotografias Videos Especie') {
          commit('documento_SET_FOTOS_VIDEOS_EYD', response.data)
        }
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_getDocumentosByCatalogoCDD ({ commit }, payload) {
      console.log(payload)
      const params = payload.params
      try {
        const response = await apiFilenet.post(`consultar-documento-folder`, payload.payload, { params })
        console.log(response)
        commit('documento_SET_DOCUMENTOS_FICHA_CAUSA', response.data.descResult?.catalogo)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async documento_deleteDocumentoCDD ({ commit }, payload) {
      try {
        const response = await apiRGP.delete(
          `/documento/documento/${payload.idDocumento}`
        )
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // BFF (🤡))

    async documento_getDocumentosByIdDenunciaBff ({ commit }, payload) {
      try {
        const { data } = await apiBFF.get(
          `/bff/modulo-documento/denuncia/${payload.idDenuncia}/documento`
        )
        console.log(data)
        commit('documento_SET_DOCUMENTOS', data)
        commit('documento_SET_PAGINACION', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async documento_getDocumentosEnCausa ({ commit }, payload) {
      try {
        const { ruc, params } = payload
        const { data } = await apiBFF.get(
          `/bff/modulo-documento/causa/${ruc}/documento`,
          { params }
        )

        commit('documento_SET_DOCUMENTOS', data?.data)
        commit('documento_SET_PAGINACION', data?.paginacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async documento_getDocumentoEnCausaByID ({ _commit }, payload) {
      try {
        const { data } = await apiBFF.get(
          `/bff/modulo-documento/${payload.idDocumento}`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async documento_getTiposSujetosEnCausa (_, payload) {
      try {
        const { ruc } = payload

        const { data } = await apiBFF(
          `/bff/modulo-documento/causa/${ruc}/tipo-sujeto`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async documento_getIntervinientesEnCausaByTipo (_, payload) {
      try {
        const { ruc, idTipoSujeto } = payload

        const { data } = await apiBFF(
          `/bff/modulo-documento/causa/${ruc}/tipo-sujeto/${idTipoSujeto}/interviniente`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async documento_getFamiliasEspeciesEnCausa (_, payload) {
      try {
        const { ruc } = payload

        const { data } = await apiBFF(
          `/bff/modulo-documento/causa/${ruc}/familia-especie`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async documento_getEspeciesEnCausaByFamilia (_, payload) {
      try {
        const { ruc, idFamiliaEspecie } = payload

        const { data } = await apiBFF(
          `/bff/modulo-documento/causa/${ruc}/familia-especie/${idFamiliaEspecie}/tipo-especie`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    documento_ADD_DOCUMENTO (state, data) {
      state.documentos.push(data)
    },
    documento_DELETE_DOCUMENTO (state, idDocumento) {
      state.documentos = state.documentos.filter(
        (doc) => doc.idArchivo !== idDocumento
      )
      return Promise.resolve()
    },
    documento_UPDATE_DOCUMENTO (state, documento) {
      state.documentos = state.documentos.map((d) =>
        d.id === documento.id ? documento : d
      )
    },
    documento_SET_DOCUMENTOS (state, documentos) {
      state.documentos = documentos.data
      state.paginacion = documentos.paginacion
    },
    documento_SET_DOCUMENTOS_FICHA_CAUSA (state, documentos) {
      state.documentos = documentos?.[0].archivos || []
      state.paginacion = documentos?.[0].paginacion || null
    },

    documento_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    documento_SET_DEFAULT_STATE (state) {
      state.documentos = []
      state.pautasVif = []
      state.declaraciones = []
      state.hospitalizacion = []
      state.ordenesDetencion = []
      state.formulariosRiesgo = []
      state.fotoHuellaFirma = []
    },
    documento_SET_PAUTASVIF (state, data) {
      state.pautasVif = data
    },
    documento_SET_DECLARACIONES (state, data) {
      state.declaraciones = data
    },
    documento_SET_HOSPITALIZACION (state, data) {
      state.hospitalizacion = data
    },
    documento_SET_ORDENES_DETENCION (state, data) {
      state.ordenesDetencion = data
    },
    documento_SET_FORMULARIOS_RIESGO (state, data) {
      state.formulariosRiesgo = data
    },
    documento_SET_FOTOHUELLAFIRMA (state, data) {
      state.fotoHuellaFirma = data
    },
    documento_SET_VIDEOSDELITO (state, data) {
      state.videosDelitos = data
    },
    documento_SET_FORMULARIOS_DENUNCIA (state, data) {
      state.formulariosDenuncia = data
    },
    documento_SET_FOTOS_VIDEOS_EYD (state, data) {
      state.fotosVideosEyD = data
    }
  }
}
