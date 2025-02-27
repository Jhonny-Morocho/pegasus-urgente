// import { tareasFiscal } from '@/modules/tramitar-audiencia/data/tareas.json'
import { apiTAUD } from '@/config/axios/'

export default {
  namespaced: true,

  state: () => ({
    tareasBandeja: [],
    paginacion: null
  }),

  actions: {
    async bandejaTramitarAudiencia_getDataBandeja ({ commit }, { params }) {
      // commit('bandejaTramitarAudiencia_SET_CAUSAS_BANDEJA', tareasFiscal)
      try {
        const data = await apiTAUD.get(`/pam/bandeja/fiscal?`, { params })
        commit('bandejaTramitarAudiencia_SET_CAUSAS_BANDEJA', data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    bandejaTramitarAudiencia_SET_CAUSAS_BANDEJA (state, data) {
      state.tareasBandeja = data
    },
    bandejaTramitarAudiencia_SET_PAGINACION_BANDEJA (state, data) {
      state.paginacion = data
    },
    bandejaTramitarAudiencia_SET_DEFAULT_STATE (state) {
      state.causasBandeja = []
    }
  }
}
