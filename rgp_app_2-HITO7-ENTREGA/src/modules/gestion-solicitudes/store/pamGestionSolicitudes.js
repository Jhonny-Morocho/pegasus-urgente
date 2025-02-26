import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    pamGDS: '',
    tareaPam: ''
  },

  actions: {
    pamGestionSolicitudes_getPam ({ commit }, payload) {
      commit('pamGestionSolicitudes_SET_PAM', payload)
    },
    async pamGestionSolicitudes_getTarea ({ commit }, payload) {
      try {
        const { data } = await apiRGP.get(`tarea/tareas/${payload.idTarea}`)
        console.log(data.tarea)
        commit('pamGestionSolicitudes_SET_TAREA', data.tarea)
        commit('pamGestionSolicitudes_SET_CAUSA', payload.causa)
        commit('pamGestionSolicitudes_SET_TAREAPAM', payload.tarea)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async pamGestionSolicitudes_iniciarYReservar ({ commit }, payload) {
      try {
        await apiRGP.put(
          `/bandeja/pam/tarea/${payload.idTarea}/iniciar-y-reservar`,
          {
            solicitudOk: true
          }
        )

        commit('pamGestionSolicitudes_SET_TAREAPAM', payload.tareaPam)

        return payload.tareaPam
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async pamGestionSolicitudes_materializarSolicitud ({ _commit }, payload) {
      try {
        const { solicitud, idTarea } = payload
        const { data } = await apiRGP.post(`bandeja/gestor-solicitud/${idTarea}/materializar-solicitudes`, solicitud)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    gestionSolicitudes_SET_PROCESO_PAM (state, data) {
      state.pamGDS = data
    },
    pamGestionSolicitudes_SET_TAREAPAM (state, data) {
      state.tareaPam = data
    }
  }
}
