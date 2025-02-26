import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    ruc: '',
    idDenuncia: '',
    causaActual: null,
    isBotonBackFromPA: false
  },

  actions: {
    async causaPreclasificador_iniciarYReservar ({ _commit }, payload) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.put(`/bandeja/tarea/${taskId}/iniciar-y-reservar`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async causaPreclasificador_completarValidarCalidadAntecedentes ({ commit }, payload) {
      try {
        const { taskId, antecedentes } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/completar/validar-calidad-antecedentes`, antecedentes)

        const task = {
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

    async causaPreclasificador_completarAnalizarPreclasificacion ({ commit }, payload) {
      try {
        const { taskId, decisionCausa } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/completar/analizar-preclasificacion`, decisionCausa)

        const task = {
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

    async causaPreclasificador_completarSeguirLineaInvestigativa ({ _commit }, payload) {
      try {
        const { taskId, completarSLI } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/completar/clasificar-por-complejidad`, completarSLI)
        console.log('completarSeguirLineaInvestigativa: ', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async causaPreclasificador_completarTransferirCausa ({ _commit }, payload) {
      try {
        const { taskId, propuestaAsignacion } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/completar/separar-causas-competencia-territorial`, propuestaAsignacion)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async causaPreclasificador_completarAgruparCausa ({ _commit }, payload) {
      try {
        const { taskId, propuestaAsignacion } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/completar/agrupar-causas`, propuestaAsignacion)
        console.log('completarAgruparCausa: ', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async causaPreclasificador_completarDesestimarCausa ({ _commit }, payload) {
      try {
        const { taskId, propuestaAsignacion } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/completar/indicar-motivo-y-tipo-termino`, propuestaAsignacion)
        console.log('completarDesestimarCausa: ', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async causaPreclasificador_solicitarAntecedentesPAM ({ commit }, payload) {
      try {
        const { taskId, solicitud } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/solicitar-antecedentes`, solicitud)
        console.log('causaPreclasificador_solicitarAntecedentesPAM: ', data)

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName,
          procesoPrincipal: data?.procesoPrincipal
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async causaPreclasificador_solicitarAntecedentesEspecificosPAM ({ commit }, payload) {
      try {
        const { taskId, solicitud } = payload

        const { data } = await apiRGP.post(`/bandeja/tarea/${taskId}/solicitar-antecedentes-especificos`, solicitud)
        console.log('causaPreclasificador_solicitarAntecedentesEspecificosPAM: ', data)

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName,
          procesoPrincipal: data?.procesoPrincipal
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async causaPreclasificador_cambiarNombreCausa (_, payload) {
      try {
        const { nombre, ruc } = payload

        const response = await apiRGP.patch(`/causa/causas/${ruc}`, { nombre })

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    causaPreclasificador_SET_RUC (state, ruc) {
      state.ruc = ruc
      console.log('ruc: ', ruc)
    },

    causaPreclasificador_SET_ID_DENUNCIA (state, idDenuncia) {
      state.idDenuncia = idDenuncia
      console.log('idDenuncia: ', idDenuncia)
    },

    causaPreclasificador_SET_BOTON_BACK_FROM_PA (state, boolean) {
      state.isBotonBackFromPA = boolean
    },
    causaPreclasificador_SET_CAUSA_ACTUAL (state, causaActual) {
      state.causaActual = causaActual
      console.log('causaActual: ', causaActual)
    },

    causaPreclasificador_SET_DEFAULT_STATE (state) {
      state.ruc = ''
      state.idDenuncia = ''
      state.causaActual = null
      state.isBotonBackFromPA = false
    }
  }
}
