import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    archivo: {},
    archivos: []
  }),
  actions: {
    async subirArchivosStore_subirArchivo ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/filenet/subir-archivo`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async subirArchivosStore_deleteArchivo ({ commit }, payload) {
      try {
        const data = await apiESPECIEDINERO.post(`/filenet/eliminar-archivos-by-id`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async subirArchivosStore_getArchivosSubidosByIdEspecie ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/documentos-especie/${payload.id}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async subirArchivosStore_addArchivoLocal ({ commit }, payload) {
      try {
        commit('subirArchivosStore_SET_ARCHIVOS', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async subirArchivosStore_deleteArchivoLocal ({ commit }, payload) {
      try {
        commit('subirArchivosStore_DELETE_ARCHIVO', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    subirArchivosStore_SET_ARCHIVOS (state, data) {
      state.archivos.push(data)
    },
    subirArchivosStore_DELETE_ARCHIVO (state, data) {
      state.archivos = state.archivos.filter(a => a.titulo !== data.titulo)
    },
    subirArchivosStore_RESET_ARCHIVOS_TABLA (state) {
      state.archivos = []
    }
  }
}
