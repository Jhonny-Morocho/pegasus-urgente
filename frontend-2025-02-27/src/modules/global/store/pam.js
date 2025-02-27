/* eslint-disable no-unused-vars */
import { apiRGP /* apiRGPDev */ } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    processInstanceId: null,
    // proceso pam completo
    procesoPam: {},
    completarProcesoFlagrancia: null
  },
  actions: {
    async pam_getDiagramaProcesoActual (_, payload) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.get(`bandeja/proceso/imagen/${taskId}`)

        return Promise.resolve(data.imagen)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async pam_getDiagramaProcesoPrincipal (_, payload) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.get(
          `bandeja/proceso/imagen/${taskId}/principal`
        )

        return Promise.resolve(data.imagen)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async pam_iniciarProceso ({ commit }, payload) {
      return apiRGP
        .get(
          `causa/proceso-pam-ingreso/iniciar/${payload.tipoDenuncia}/${payload.region}/${payload.fiscalia}/M`
        )
        .then((response) => {
          commit('pam_SET_PROCESO', response.data)
          console.log(response.data, 'iniciar proceso')
        })
    },

    async pam_iniciarProcesoFlagrancia ({ commit }, params) {
      try {
        const res = await apiRGP.get(
          `flagrancia/proceso-pam-flagrancia/iniciar`,
          { params }
        )
        commit('pam_SET_PROCESO', res.data)
        console.log(res.data, 'iniciar proceso')
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async pam_completarProcesoFlagrancia ({ commit }, payload) {
      try {
        const res = await apiRGP.post(
          `flagrancia/proceso-pam-flagrancia/completar/recepcionar-procedimiento-y-registrar-antecedentes`,
          payload
        )
        commit('pam_SET_PROCESO', res.data)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async pam_completarCerrarFoliolagrancia ({ commit, state }, payload) {
      // Esta llamada la hace el fiscal para cerrar folio
      const task = {
        taskInstanceId: undefined,
        processInstanceId: undefined,
        idDenuncia: state.procesoPam.idDenuncia,
        idProcedimiento: state.procesoPam.idProcedimiento
      }
      try {
        const res = await apiRGP.post(
          `flagrancia/proceso-pam-flagrancia/completar/cerrar-folio`,
          payload
        )
        if (res.data) commit('pam_SET_PROCESO', res.data)
        else commit('pam_SET_PROCESO', task)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async pam_reservarIniciarTarea ({ commit }, payload) {
      try {
        const res = await apiRGP.put(
          `bandeja/tarea/${payload.taskInstanceId}/iniciar-y-reservar`,
          payload
        )
        console.log(res.data)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async pam_reservarFolio (_, payload) {
      // Esta llamada la hace el equipo turno para cerrar folio
      try {
        const res = await apiRGP.post(
          `flagrancia/proceso-pam-flagrancia/completar/revisar-folio-y-decidir-instrucciones`,
          payload
        )
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    pam_SET_PROCESO (state, proceso) {
      state.procesoPam = proceso.tarea ? proceso.tarea : proceso
      if (proceso.tarea) {
        state.procesoPam.idDenuncia = proceso.data.denuncia.idDenuncia
        state.procesoPam.idCausa = proceso.data.denuncia.idCausa
        state.procesoPam.idCatalogo = proceso.data.denuncia?.idCatalogo
        console.log(proceso.data.denuncia?.idCatalogo)
        console.log(proceso.data.denuncia)
      }
      if (proceso.taskInstanceId) {
        proceso.taskId = Number(proceso.taskInstanceId)
        proceso.taskProcessInstanceId = Number(proceso.processInstanceId)
      }
      console.log('Proceso Pam: ', state.procesoPam)
    },

    pam_SET_COMPLETAR_PROCESO_FLAGRANCIA (state, data) {
      state.completarProcesoFlagrancia = data
    },

    pam_SET_INSTANCE_ID (state, id) {
      state.processInstanceId = id
    }
  }
}
