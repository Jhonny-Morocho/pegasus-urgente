import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    denuncias: [],
    paginacion: null,
    denunciaSeleccionadaEnBandeja: []
  },
  actions: {
    async bandejaAtendedorJuridico_getDenunciasByMultiple ({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get(`/bandeja/bandeja/denuncia`, { params })

        commit('bandejaAtendedorJuridico_SET_DENUNCIAS', data.data)
        commit('bandejaAtendedorJuridico_SET_PAGINACION', data.paginacion)

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async bandejaAtendedorJuridico_setPrioritario ({ state, commit }, payload) {
      try {
        const res = await apiRGP.put(`/bandeja/bandeja-denuncia/prioritario/${payload.denuncia.data.denuncia.idDenuncia}`)
        console.log('response: ' + res.data)
        const denuncia = state.denuncias.find((d) => d.idBandeja === payload.denuncia.idBandeja)

        const value = payload.isPrioritario
        const estado = value ? 'Prioritaria' : 'En Curso'

        commit('bandejaAtendedorJuridico_SET_PRIORITARIO', { denuncia, value })
        commit('bandejaAtendedorJuridico_SET_ESTADO', { denuncia, estado })
        return { denuncia }
      } catch (error) {
        Promise.reject(error)
      }
    },

    async bandejaAtendedorJuridico_get_nueva_atencion ({ _commit }, payload) {
      console.log('bandejaAtendedorJuridico_get_nueva_atencion', payload)
      try {
        const res = await apiRGP.get(`/causa/proceso-pam-ingreso/iniciar/B0DE0803-6633-410D-95F1-40278B16ECC2/5/1`)
        // commit('bandejaAtendedorJuridico_GET_DIAGRAMA_PAM', res.data)
        console.log(res)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    }
    // async bandejaAtendedorJuridico_setCompletado (
    //   { state, commit },
    //   payload
    // ) {
    //   try {
    //     const denuncia = state.denuncias.find((d) => d.ruc === payload.ruc)
    //     denuncia.estado = 'COMPLETADA'
    //     commit('bandejaAtendedorJuridico_SET_ESTADO_COMPLETADO', { denuncia })

    //     return { denuncia }
    //   } catch (error) {
    //     Promise.reject(error)
    //   }
    // }
  },

  mutations: {
    bandejaAtendedorJuridico_SET_DENUNCIAS (state, denuncias) {
      state.denuncias = denuncias
    },
    bandejaAtendedorJuridico_SET_PAGINACION (state, paginacion) {
      state.paginacion = paginacion
    },
    bandejaAtendedorJuridico_SET_PRIORITARIO (state, { denuncia, value }) {
      const index = state.denuncias.findIndex((d) => d.idBandeja === denuncia.idBandeja)
      state.denuncias[index].prioritario = value
    },
    bandejaAtendedorJuridico_SET_ESTADO (state, { denuncia, estado }) {
      const index = state.denuncias.findIndex((d) => d.idBandeja === denuncia.idBandeja)
      state.denuncias[index].estadoTarea = estado
      console.log(state.denuncias)
    },
    bandejaAtendedorJuridico_GET_DIAGRAMA_PAM (res) {
      console.log(res)
    },
    bandejaAtendedorJuridico_GET_DENUNCIAS (state, data) {
      state.denuncias = data
    }
    // bandejaAtendedorJuridico_SET_ESTADO_COMPLETADO (state, payload) {
    //   const denuncia = payload
    //   state.denuncias = state.denuncias.map((d) =>
    //     d.ruc === denuncia.ruc ? denuncia : c
    //   )
    // }
  }
}
