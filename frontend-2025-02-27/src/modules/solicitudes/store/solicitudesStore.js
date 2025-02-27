import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    pam: {},
    medidasCautelaresSolicitudes: [],
    idDenuncia: '',
    idActividad: '',
    ruc: '',
    resumenCausa: null,
    causa: null,
    idCausa: '',
    relacionesSeleccionadas: [],
    sujetosSeleccionados: [],
    especiesSeleccionadas: [],
    dataSelector: [],
    solicitudPJUD: null,
    fromSelector: false,
    isTelefonica: false,
    isCitacion: false
  },

  actions: {
    async solicitudes_enviarSolicitud ({ commit }, payload) {
      const { contract } = payload
      try {
        const res = await apiRGP.post(
          '/actividad/actividad/solicitud',
          contract
        )

        commit('solicitudes_SET_ID_ACTIVIDAD', res.data.idActividad)

        return Promise.resolve(res.data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async solicitudes_getSolicitudById ({ commit, state }) {
      try {
        const res = await apiRGP.get(
          `/actividad/actividad/solicitud/${state.idActividad}`
        )

        commit('solicitudes_SET_SOLICITUD_PJUD', res.data)

        return Promise.resolve(res.data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async solicitudes_iniciarYReservar ({ commit }, payload) {
      try {
        await apiRGP.put(
          `/bandeja/pam/tarea/${payload.idTarea}/iniciar-y-reservar`,
          {
            solicitudOk: true
          }
        )

        commit('solicitudes_SET_PAM', payload.tareaPam)

        return payload.tareaPam
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async solicitudes_completarTareaPam ({ _commit, state }, payload) {
      try {
        const url = state.dataSelector.fromSelector
          ? '/bandeja/gestor-solicitud/proceso'
          : `/bandeja/investigacion/${payload.idTask}/solicitar`

        const { data } = await apiRGP.post(url, payload)

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async solicitudes_getResumenCausa ({ commit }, payload) {
      const { idCausa } = payload
      try {
        const { data } = await apiRGP.get(`/causa/causas/${idCausa}`)
        commit('solicitudes_SET_RESUMEN_CAUSA', data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    solicitudes_SET_SOLICITUD_PJUD (state, solicitud) {
      state.solicitudPJUD = solicitud
    },
    solicitudes_SET_ID_ACTIVIDAD (state, idActividad) {
      state.idActividad = idActividad
    },
    solicitudes_SET_IS_TELEFONICA (state, pam) {
      state.isTelefonica = pam
    },
    solicitudes_SET_IS_CITACION (state, pam) {
      state.isCitacion = pam
    },
    solicitudes_SET_PAM (state, pam) {
      state.pam = pam
    },
    solicitudes_SET_RUC (state, ruc) {
      state.ruc = ruc
    },
    solicitudes_SET_ID_DENUNCIA (state, idDenuncia) {
      state.idDenuncia = idDenuncia
    },
    solicitudes_SET_ID_CAUSA (state, idCausa) {
      state.idCausa = idCausa
    },
    solicitudes_SET_RESUMEN_CAUSA (state, data) {
      state.resumenCausa = data
    },
    solicitudes_SET_RELACIONES_SELECCIONADAS (state, data) {
      state.relacionesSeleccionadas = data
    },
    solicitudes_SET_SUJETOS_SELECCIONADOS (state, data) {
      state.sujetosSeleccionados = data
    },
    solicitudes_SET_ESPECIES_SELECCIONADAS (state, data) {
      state.especiesSeleccionadas = data
    },
    solicitudes_SET_DATA_SELECTOR_SOLICITUD (state, data) {
      state.dataSelector = data
    },
    solicitudes_SET_DEFAULT_STATE (state) {
      state.causa = null
      state.resumenCausa = null
      state.idDenuncia = ''
      state.ruc = ''
      state.medidasCautelaresSolicitudes = []
      state.relacionesSeleccionadas = []
      state.dataSelector = []
    }
  }
}
