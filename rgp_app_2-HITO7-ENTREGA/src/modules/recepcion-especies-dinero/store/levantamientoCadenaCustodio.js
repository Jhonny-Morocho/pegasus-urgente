// import { apiRGP, apiBFF } from '@/config/axios'

import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    imagenes: [],
    paginacion: null,
    evidencias: [],
    cadenaLevantamiento: [],
    nue: ''
  },
  getters: {
    getStoreEvidencias (state) {
      const { evidencias } = state

      return {
        evidencias
      }
    }
  },
  actions: {
    async levantamientoCadenaCustodio_addImagen ({ commit }, payload) {
      const data = payload
      console.log('imagen', payload)
      commit('levantamientoCadenaCustodio_ADD_IMAGEN', data)
    },
    levantamientoCadena_getEvidencias ({ commit }, payload) {
      console.log('get evi', payload)
    },
    async levantamientoCadena_getNue ({ _commit }, payload) {
      try {
        const response = await apiESPECIEDINERO.get(`/nue/${payload.nue}`)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async levantamientoCadena_getDataRotuloNue ({ commit }, payload) {
      try {
        const response = await apiESPECIEDINERO.get(
          `/cadena-custodia/${payload.nue}`
        )
        console.log('GET ROTULO NUE', response.data)
        const data = response.data
        commit('levantamientoCadenaCustodio_ADD_EVIDENCIA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    levantamientoCadena_addEvidencia ({ commit }, payload) {
      const data = payload
      console.log('dataevidencia', data)
      commit('levantamientoCadenaCustodio_ADD_EVIDENCIA', data)
    },
    async levantamientoCadena_addLevantamientoCadena ({ _commit }, payload) {
      try {
        await apiESPECIEDINERO
          .post('/cadena-custodia/', payload)
          .then((res) => {
            // commit('levantamientoCadenaCustodio_ADD_LEVANTAMIENTO_CADENA', data)
          })
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    levantamientoCadenaCustodio_ADD_IMAGEN (state, data) {
      state.imagenes.push(data)
    },
    levantamientoCadenaCustodio_DELETE_IMAGEN (state, idImagen) {
      state.imagenes = state.imagenes.filter(
        (doc) => doc.idArchivo !== idImagen
      )
    },
    levantamientoCadenaCustodio_DELETE_EVIDENCIA (state, idEvidencia) {
      console.log('EvidenciaDELELTE', idEvidencia)
      state.evidencias = state.evidencias.filter(
        (doc) => doc.idEvidencia !== idEvidencia
      )
    },
    levantamientoCadenaCustodio_SET_TABLA_IMAGEN (state, payload) {
      state.imagenes = []
    },
    levantamientoCadenaCustodio_SET_NUE_ENCONTRADO (state, data) {
      state.nue = data
      console.log('Nue encontrada seteada en store: ', state.nue)
    },
    levantamientoCadenaCustodio_ADD_EVIDENCIA (state, data) {
      console.log('data add', data)
      state.evidencias.push(data)
    },
    levantamientoCadenaCustodio_SET_EVIDENCIA (state, data) {
      console.log('data add', data)
      state.evidencias = []
    },
    levantamientoCadenaCustodio_SET_DATA_EVIDENCIA (state, data) {
      console.log('data SET', data)
      const evidenciaEditada = data
      state.evidencias = state.evidencias.map((d) =>
        d.idEvidencia === evidenciaEditada.idEvidencia ? evidenciaEditada : d
      )
    },
    levantamientoCadenaCustodio_ADD_LEVANTAMIENTO_CADENA (state, data) {
      console.log('data add Levantamiento', data)
      state.cadenaLevantamiento.push(data)
    }
  }
}
