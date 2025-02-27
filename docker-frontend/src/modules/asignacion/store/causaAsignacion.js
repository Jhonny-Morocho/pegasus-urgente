/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    ruc: '',
    idDenuncia: '',
    causaActual: null,
    isBotonBackFromRa: false,
    isBotonBackFromDa: false,
    propuestaPreclasificador: null, // PROBABLEMENTE NO SE UTILICE
    preclasificacion: null,
    escritoConsultaFR: null,
    hasPropuestaAsignacion: true,
    esAnalizaAsignacion: false
  },

  actions: {
    /* Iniciar Proceso Asignacion */
    async causaAsignacion_iniciarProcesoAsignacion ({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(
          '/bandeja/tarea/asignacion/iniciar/proceso-asignacion',
          payload
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Aprobar Proceso Asignacion Masivo */
    async causaAsignacion_aprobarMultiplesPropuestasAsignacion (_, payload) {
      try {
        const { causas } = payload
        console.log('causas: ', causas)

        const { data } = await apiRGP.post(
          '/bandeja/tarea/asignacion/iniciar/aprobar-proceso-asignacion-masivo',
          causas
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Revisar Decidir Propuesta */
    async causaAsignacion_completarRevisarDecidirPropuesta (
      { commit },
      payload
    ) {
      try {
        const {
          idInstanciaTarea,
          requiereRevisarDetallePropuesta,
          aceptaPropuesta
        } = payload

        const params = `requiereRevisarDetallePropuesta=${requiereRevisarDetallePropuesta}&aceptaPropuesta=${aceptaPropuesta}`

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/revisar-decidir-propuesta?${params}`
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Revisar Calidad Antecedentes */
    async causaAsignacion_completarRevisarCalidadAntecedentes (
      { commit },
      payload
    ) {
      try {
        const {
          requiereCambiarTipificacion,
          antecedentesSuficientes,
          revisaObtiene,
          analizaAsignacion,
          aceptaPropuesta,
          idInstanciaTarea,
          revisaEspecies
        } = payload

        const params = `requiereCambiarTipificacion=${requiereCambiarTipificacion}&antecedentesSuficientes=${antecedentesSuficientes}&revisaObtiene=${revisaObtiene}&analizaAsignacion=${analizaAsignacion}&aceptaPropuesta=${aceptaPropuesta}&revisaEspecies=${revisaEspecies}`

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/revisar-calidad-antecedentes?${params}`
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response?.data)
      }
    },

    /* Completar Decidir Asignacion */
    async causaAsignacion_completarDecidirAsignacion ({ commit }, payload) {
      try {
        const { idInstanciaTarea, decision } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/completar/${idInstanciaTarea}/decidir-asignacion`,
          decision
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Seguir Linea Investigativa (Clasificar por complejidad) */
    async causaAsignacion_completarSeguirLineaInvestigativa (
      { commit },
      payload
    ) {
      try {
        const {
          idInstanciaTarea,
          requiereInstruirDiligenciasPrioritarias,
          body
        } = payload

        const params = `requiereInstruirDiligenciasPrioritarias=${requiereInstruirDiligenciasPrioritarias}`

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/clasificar-complejidad?${params}`,
          body
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Transferir Causa (Separar Causa) */
    async causaAsignacion_completarTransferirCausa ({ commit }, payload) {
      try {
        const {
          idInstanciaTarea,
          requiereInstruirDiligenciasPrioritarias, // MANDAR EN FALSE, PONER EN LA URL COMO PARAMS
          body
        } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/separar-causas?requiereInstruirDiligenciasPrioritarias=${requiereInstruirDiligenciasPrioritarias}`,
          body
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Agrupar Causas */
    async causaAsignacion_completarAgruparCausas ({ commit }, payload) {
      try {
        const { causa, idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/agrupar-causas-asignacion`,
          causa
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    /* Completar Desestimar Causa (Indicar Motivo y Tipo Termino) */
    async causaAsignacion_completarDesestimarCausa ({ commit }, payload) {
      try {
        const { idInstanciaTarea, motivo } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/indicar-motivo-tipo-termino`,
          motivo
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Agregar Comentario Preclasificador */
    async causaAsignacion_completarAgregarComentarioPreclasificador (
      { commit },
      payload
    ) {
      try {
        const { idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/agregar-comentario-preclasificador`
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Materializar Solicitud */
    async causaAsignacion_completarMaterializarSolicitud ({ commit }, payload) {
      try {
        const { causa, idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/materializar-solicitud`,
          causa
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Sugerir FR Transferencia */
    async causaAsignacion_completarSugerirFRTransferencia ({ commit }, payload) {
      try {
        const { idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/sugerir-fr-transferencia`
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Registrar Respuesta */
    async causaAsignacion_completarRegistrarRespuesta ({ commit }, payload) {
      try {
        const { causa, idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/registrar-respuesta`,
          causa
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Modificar Tipificacion Delito */
    async causaAsignacion_completarModificarTipificacionDelito (
      { commit },
      payload
    ) {
      try {
        const { causa, idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/modificar-tipificacion-delito`,
          causa
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    /* Completar Solicitar Antecedentes (Tab Diligencias) */
    async causaAsignacion_completarSolicitarAntecedentes ({ commit }, payload) {
      try {
        const { solicitud, idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/solicitar-antecedentes`,
          solicitud
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /* Completar Solicitar Antecedentes Especificos (Tab Documentos) */
    async causaAsignacion_completarSolicitarAntecedentesEspecificos (
      { commit },
      payload
    ) {
      try {
        const { solicitud, idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/solicitar-antecedentes-especificos`,
          solicitud
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async causaAsignacion_cambiarNombreCausa (_, payload) {
      try {
        const { nombre, ruc } = payload

        const response = await apiRGP.patch(`/causa/causas/${ruc}`, { nombre })

        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /* Completar Instruir Diligencias (Seguir Linea Investigativa | Transferir Causa) */
    async causaAsignacion_completarInstruirDiligencias ({ commit }, payload) {
      try {
        const { solicitud, idInstanciaTarea } = payload

        const { data } = await apiRGP.post(
          `/bandeja/tarea/asignacion/${idInstanciaTarea}/completar/instruir-diligencias`,
          solicitud
        )

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /* Persistir Causa Termino (Desestimar Causa) */
    async causaAsignacion_guardarCausaDesestimacion (_, payload) {
      try {
        const { idCausa, body } = payload

        const { data } = await apiRGP.post(
          `/causa/causas/${idCausa}/desestimacion`,
          body
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },

  mutations: {
    causaAsignacion_SET_RUC (state, ruc) {
      state.ruc = ruc
      console.log(`SET_RUC(${state.ruc})`)
    },

    causaAsignacion_SET_ANALIZA_ASIGNACION (state, boolean) {
      state.esAnalizaAsignacion = boolean
    },

    causaAsignacion_SET_ID_DENUNCIA (state, idDenuncia) {
      state.idDenuncia = idDenuncia
      console.log(`SET_ID_DENUNCIA(${state.idDenuncia})`)
    },

    causaAsignacion_SET_CAUSA_ACTUAL (state, causaActual) {
      state.causaActual = causaActual
      state.preclasificacion = {
        decisionAsignacion: causaActual?.causa?.decisionAsignacion,
        ...causaActual?.causa?.preclasificacion
      }
      console.log('causaActual: ', state.causaActual)
      console.log('preclasificacion: ', state.preclasificacion)
    },

    causaAsignacion_SET_HAS_PROPUESTA_ASIGNACION (
      state,
      hasPropuestaAsignacion
    ) {
      state.hasPropuestaAsignacion = hasPropuestaAsignacion
      console.log(
        `SET_HAS_PROPUESTA_ASIGNACION(${state.hasPropuestaAsignacion})`
      )
    },

    causaAsignacion_SET_BOTON_BACK_FROM_RA (state, fromRA) {
      state.isBotonBackFromRa = fromRA
    },

    causaAsignacion_SET_BOTON_BACK_FROM_DA (state, fromDA) {
      state.isBotonBackFromDa = fromDA
    },

    causaAsignacion_SET_DEFAULT_STATE (state) {
      state.ruc = ''
      state.idDenuncia = ''
      state.isBotonBackFromRa = false
      state.isBotonBackFromDa = false
      state.causaActual = null
      state.preclasificacion = null
      state.escritoConsultaFR = null
      state.esAnalizaAsignacion = false
    },

    causaAsignacion_SET_PROPUESTA_PRECLASIFICADOR (state, payload) {
      state.propuestaPreclasificador = payload
    },

    causaAsignacion_SET_ESCRITO_CONSULTA_FR (state, payload) {
      state.escritoConsultaFR = payload
    }
  }
}
