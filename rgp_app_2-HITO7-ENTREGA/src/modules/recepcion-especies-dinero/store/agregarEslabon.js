// import { apiRGP, apiBFF } from '@/config/axios'

import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    historialSolicitudNues: []
  },
  actions: {
    async agregarEslabon_addAgregarEslabon ({ _commit }, payload) {
      console.log('paylod response post', payload)
      try {
        const { data } = await apiESPECIEDINERO.post('/custodia-eslabones/agregar-eslabon', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    // levantamientoCadenaCustodio_SET_NUE_ENCONTRADO (state, data) {
    //   state.nue = data
    //   console.log('Nue encontrada seteada en store: ', state.nue)
    // },
    // solicitudAsignacionNue_GET_HISTORIAL_SOLICITUD_NUES (state, data) {
    //   console.log('data del gistorial', data)
    //   state.historialSolicitudNues = data
    // }
  }

}
