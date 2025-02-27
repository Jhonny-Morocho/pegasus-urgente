import { apiRGP } from '@/config/axios/'
import {
  causa,
  antecedentesAudiencia
} from '@/modules/termino-postermino/data/causa.json'
export default {
  namespaced: true,

  state: () => ({
    causa: {},
    ruc: '',
    idDenuncia: '',
    consultaTermino: {},
    respuestaFJ: {}
  }),

  actions: {
    /* -------- PAM ---------- */

    // Revisar Consulta
    async termino_PamCompletarRevisarConsulta ({ commit }, payload) {
      console.log('respuesta enviada cuando haya back :', payload)
      const { taskId } = payload
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/termino/${taskId}/completar/revisar-consulta`,
          payload
        )

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(task)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // Revisar y resolver las  observaciones

    async termino_PamCompletarRevisarObservaciones (
      { commit },
      { requiereConstancia, taskId, requiereAudiencia }
    ) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/termino/${taskId}/completar/revisar-resolver-observaciones?requiereAudiencia=${requiereAudiencia}`
        )

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(task)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_PamCompletarGestionarEnTribunales ({ commit }, payload) {
      try {
        const { taskId, destinoCausa } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/termino/${taskId}/completar/gestionar-termino-tribunales?complementarSuspensionTermino=${true}&causaSuspendidaTerminada=${true}&destinoCausa=${destinoCausa}`
        )

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(task)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_PamCompletarGestionarAudienciaSuspencionTermino (
      { commit },
      payload
    ) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/termino/${taskId}/completar/gestionar-audiencia-suspension-termino?joOrdinarioConVeredicto=${true}&causaSuspendidaTerminada=${true}&complementarSuspensionTermino=${true}`
        )

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(task)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_PamCompletarTerminarCausa ({ commit }, payload) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/termino/${taskId}/completar/terminar-causa?accionTermino=${
            payload.accionTermino
          }&apelaExclusionPruebas=${true}`
        )

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(task)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* =================================== */

    async termino_getAntecedentesAudiencia ({ commit }) {
      return antecedentesAudiencia
    },

    async termino_setDestinoEspecies ({ commit }, payload) {
      console.log('Enviar decisión especies a custodio: ', payload)
    },

    async termino_getAntecedentesCausa ({ commit, state }) {
      if (!state.idDenuncia) {
        commit('termino_SET_CAUSA', causa)
        console.log('No hay id de denuncia')
        console.log(state)

        return causa
      } else {
        try {
          const { data } = await apiRGP.get(
            `/causas/antecedentes/${state.idDenuncia}`
          )
          commit('bandejaFiscalJefe_SET_PAGINACION_BANDEJA', data.paginacion)
          return Promise.resolve(data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async termino_getConsultaTermino ({ commit, state }, { idCausa }) {
      if (state.consultaTermino.idCausa === idCausa) {
        setTimeout(() => {
          return state.consultaTermino
        }, 500)
      }
      try {
        const { data } = await apiRGP.get(
          `/actividad/causa/termino/consulta?idCausa=${idCausa}`
        )
        commit('termino_SET_CONSULTA_TERMINO', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_getRespuestaFiscalJefe ({ commit }, { idConsulta }) {
      try {
        const { data } = await apiRGP.get(
          `/actividad/causa/termino/consulta/respuesta-fj?idConsulta=${idConsulta}`
        )

        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_getComplementoFiscal ({ commit }, { idRespuesta }) {
      try {
        const { data } = await apiRGP.get(
          `/actividad/causa/termino/consulta/respuesta-fj/complemento?idRespuesta=${idRespuesta}`
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_postRespuestaFiscalJefe ({ commit }, payload) {
      console.log({ payload })
      try {
        const { data } = await apiRGP.post(
          `/actividad/causa/termino/consulta/respuesta-fj`,
          payload
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_postComplementoFiscal ({ commit }, payload) {
      console.log({ payload })
      try {
        const { data } = await apiRGP.post(
          `/actividad/causa/termino/consulta/respuesta-fj/complemento`,
          payload
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async termino_postEscritoSolicitud ({ coSmmit }, payload) {
      console.log({ payload })
      try {
        const { data } = await apiRGP.post(
          `/actividad/actividad/solicitud`,
          payload
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* ==== Informar Termino de Causa ==== */

    async termino_postEscritoTermino ({ commit }, payload) {
      console.log({ payload })
      try {
        const { data } = await apiRGP.post(
          `/actividad/causa/termino/informe`,
          payload
        )
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }

    /* =================== */
  },

  mutations: {
    termino_SET_RUC (state, ruc) {
      state.ruc = ruc
    },
    termino_SET_ID_DENUNCIA (state, idDenuncia) {
      state.idDenuncia = idDenuncia
    },
    termino_SET_CAUSA (state, payload) {
      state.causa = { ...payload }
    },

    termino_SET_RESPUESTA_FJ (state, payload) {
      state.respuestaFJ = { ...payload }
    },

    termino_SET_CONSULTA_TERMINO (state, payload) {
      state.consultaTermino = payload
    }
  }
}
