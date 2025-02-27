import { apiCDD } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    tareasBandeja: null,
    paginacionBandeja: null,
    antecedentesCatalogo: {},
    antecedentesDocumento: {},
    dataSolicitud: null,
    taskId: null
  },

  actions: {
    // DATA BANDEJA
    async solicitudesOfPartesCdd_getDataBandeja ({ commit }, payload) {
      const params = payload.params
      try {
        const res = await apiCDD.get(`pam/bandeja-oficina-partes/`, { params })
        commit('solicitudesOfPartesCdd_SET_TAREAS_BANDEJA', res.data.data)
        commit(
          'solicitudesOfPartesCdd_SET_PAGINACION_BANDEJA',
          res.data.paginacion
        )
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async solicitudesOfPartesCdd_getDataSolicitudIngresoDocumento (
      { commit },
      payload
    ) {
      const id = payload.id
      try {
        const response = await apiCDD.get(`/solicitud-archivo/${id}`)
        const dataCatalogo = {
          catalogo: { ...response.data.catalogo },
          solicitante: { ...response.data.solicitante },
          idSolicitud: response.data.solicitud.id
        }
        console.log(response)
        commit(
          'solicitudesOfPartesCdd_SET_DATA_CATALOGO_SOLICITUD',
          dataCatalogo
        )
        commit(
          'solicitudesOfPartesCdd_SET_DATA_DOCUMENTO_SOLICITUD',
          response.data.solicitud
        )
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async solicitudesOfPartesCdd_ingresoDocumentoOfDePartes (
      { commit },
      payload
    ) {
      console.log(payload)
      const data = payload.payload
      try {
        const res = await apiCDD.put(
          `solicitud-archivo/${payload.idSolicitud}/subir-archivo`,
          data
        )
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    solicitudesOfPartesCdd_SET_TAREAS_BANDEJA (state, dataCatalogo) {
      state.tareasBandeja = dataCatalogo
    },
    solicitudesOfPartesCdd_SET_PAGINACION_BANDEJA (state, dataCatalogo) {
      state.paginacionBandeja = dataCatalogo
    },
    solicitudesOfPartesCdd_SET_DATA_CATALOGO_SOLICITUD (state, dataCatalogo) {
      state.antecedentesCatalogo = dataCatalogo
    },
    solicitudesOfPartesCdd_SET_DATA_DOCUMENTO_SOLICITUD (state, solicitud) {
      state.antecedentesDocumento = solicitud
      console.log('state.antecedentesDocumento', state.antecedentesDocumento)
    },
    solicitudesOfPartesCdd_SET_TASK_ID (state, taskId) {
      state.taskId = taskId
    }
  }
}
