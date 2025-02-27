import { apiRGP } from '@/config/axios'
export default {
  namespaced: true,

  state: {
    denuncias: [],
    paginacion: null,
    denunciasConPartes: []
  },
  actions: {
    async bandejaDenunciaFisica_getDenunciasByMultiple ({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get(
          `/bandeja/bandeja/denuncia`, { params })

        commit('bandejaDenunciaOficio_SET_DENUNCIAS', data.data)
        commit('bandejaDenunciaOficio_SET_PAGINACION', data.paginacion)

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async bandejaDenunciaFisica_setPrioritario ({ state, commit }, payload) {
      try {
        // Hacer la llamada al backend para obtener las denuncias
        // hacer commit de las denuncias
        // const res = await axios.get(listaDenuncias)
        // console.log(res)
        console.log(payload)
        const denuncia = state.denuncias.find(
          (d) => d.idBandeja === payload.denuncia.idBandeja
        )

        const value = payload.isPrioritario
        const estado = value ? 'Prioritaria' : 'En Curso'

        commit('bandejaDenunciaFisica_SET_PRIORITARIO', { denuncia, value })
        commit('bandejaDenunciaFisica_SET_ESTADO', { denuncia, estado })
        return { denuncia }
      } catch (error) {
        Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaDenunciaOficio_SET_DENUNCIAS (state, payload) {
      state.denuncias = payload
    },
    bandejaDenunciaOficio_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    bandejaDenunciaFisica_SET_PRIORITARIO (state, { denuncia, value }) {
      const index = state.denuncias.findIndex(
        (d) => d.idBandeja === denuncia.idBandeja
      )
      state.denuncias[index].prioritario = value
    },
    bandejaDenunciaFisica_SET_ESTADO (state, { denuncia, estado }) {
      const index = state.denuncias.findIndex(
        (d) => d.idBandeja === denuncia.idBandeja
      )
      state.denuncias[index].estadoTarea = estado
      console.log(state.denuncias)
    },
    bandejaDenunciaOficio_SET_DENUNCIAS_CON_PARTES (state, payload) {
      state.denunciasConPartes = payload
    }
  }
}
