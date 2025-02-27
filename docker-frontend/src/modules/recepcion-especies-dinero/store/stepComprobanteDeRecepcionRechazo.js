// import { apiRGP } from '@/config/axios'
import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    comprobante: {}
  }),

  actions: {
    async stepComprobanteDeRecepcionRechazo_getDataComprobante (
      { commit, state },
      payload
    ) {
      const {
        nue,
        nombreFuncionario,
        cargoFuncionario,
        fiscaliaFuncionario,
        decision
      } = payload
      try {
        let data = {}
        if (decision === 0) {
          data = await apiESPECIEDINERO.get(
            `/especies-recepcion/getComprobanteRechazo?nue=${nue}`
          )
        } else {
          data = await apiESPECIEDINERO.get(
            `/especies-recepcion/getComprobanteRecepcion?nue=${nue}&nombreFuncionario=${nombreFuncionario}&cargoFuncionario=${cargoFuncionario}&fiscaliaFuncionario=${fiscaliaFuncionario}`
          )
        }
        commit(
          'stepComprobanteDeRecepcionRechazo_SET_DATA_COMPROBANTE',
          data.data
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepComprobanteDeRecepcionRechazo_subirArchivo ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/filenet/subir-archivo`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepComprobanteDeRecepcionRechazo_obtenerArchivo ({ commit }, payload) {
      console.log(payload.id)
      try {
        const data = await apiESPECIEDINERO.get(`/filenet/obtener-archivo/${payload.id}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepComprobanteDeRecepcionRechazo_getArchivosSubidosByIdEspecie ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/documentos-especie/${payload.id}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    stepComprobanteDeRecepcionRechazo_SET_DATA_COMPROBANTE (state, comprobante) {
      state.comprobante = comprobante
    }
  }
}
