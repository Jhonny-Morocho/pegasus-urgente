import { apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: {
    ruc: '',
    idDenuncia: '',
    medidasCautelares: [],
    causa: null,
    antecedentes: null,
    fiscaliaLocal: null,
    institucion: null,
    resumenCausa: null,
    medidasCautelaresSolicitudes: [],
    seleccionDecision: null,
    hasDirectrizObligatoria: false,
    idCausa: null,

    // #region Agrupacion de Causas
    causaPrincipal: null
    // #endregion
  },

  actions: {
    async dirigirInvestigacion_getResumenCausa ({ commit }, payload) {
      const { ruc } = payload

      try {
        const { data } = await apiRGP.get(`/causa/causas/causa/${ruc}/resumen`)

        commit('dirigirInvestigacion_SET_RESUMEN_CAUSA', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async dirigirInvestigacion_getResumenCausaByIdCausa ({ commit }, payload) {
      const { idCausa } = payload

      try {
        const { data } = await apiRGP.get(`/causa/causas/${idCausa}`)

        commit('dirigirInvestigacion_SET_RESUMEN_CAUSA', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async dirigirInvestigacion_getObtenerDetalleDenunciaCompleto (
      { commit },
      payload
    ) {
      const { ruc, idDenuncia } = payload

      try {
        const { data } = await apiRGP.get(
          `/denuncia/denuncias/${idDenuncia}/${ruc}/detalle`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // #region tab - relato hecho - PODRIAN IR EN LA STORE GLOBAL DE RELATO?
    async dirigirInvestigacion_getComentariosRelato ({ _ }, payload) {
      const { idDenuncia } = payload
      const { params } = payload

      try {
        const { data } = await apiRGP.get(
          `/denuncia/comentarios-relato/relato/${idDenuncia}`,
          { params }
        )

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },

    async dirigirInvestigacion_postGuardarComentarioRelato ({ _ }, payload) {
      try {
        const { data } = await apiRGP.post(
          `/denuncia/comentarios-relato`,
          payload
        )

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    // #endregion

    // #region PAM
    async dirigirInvestigacion_iniciarYReservar (_, payload) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.put(
          `/bandeja/tarea/${taskId}/iniciar-y-reservar`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async dirigirInvestigacion_iniciar (_, payload) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.put(`/bandeja/tarea/${taskId}/iniciar`)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async dirigirInvestigacion_completarRevisarAntecedentesInvestigacion (
      { commit },
      payload
    ) {
      try {
        const { taskId, requestBody } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/revisar-antecedente-causa`,
          requestBody
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
    async dirigirInvestigacion_completarIngresarDirectrizInvestigacion (
      { commit },
      payload
    ) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/ingresar-directriz-investigacion`
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
    async dirigirInvestigacion_completarDesarrolloInvestigacion (
      { commit },
      payload
    ) {
      try {
        const { taskId, requestBody } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/analizar-antecedente-y-decidir-acciones-investigativas`,
          requestBody
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
    async dirigirInvestigacion_completarActualizarDirectrizInvestigacion (
      { commit },
      payload
    ) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/actualizar-directriz-investigacion`
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
    async dirigirInvestigacion_completarSolicitarAudienciaFormalizacion (
      { commit },
      payload
    ) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/solicitar-audiencia-formalizacion`,
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
    async dirigirInvestigacion_completarTomarDecisionCausaRelacion (
      { commit },
      payload
    ) {
      try {
        const { taskId } = payload
        const motivoTermino = payload.motivoTermino
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/tomar-decision-causa-relacion`,
          { ...payload, motivoTermino }
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
    async dirigirInvestigacion_completarElaborarPropuestaTransferencia ({ commit }, payload) {
      try {
        const { taskId, body } = payload

        const { data } = await apiRGP.post(`/bandeja/investigacion/${taskId}/elaborar-propuesta-transferencia`, body)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async dirigirInvestigacion_completarDefinirNuevaCausa ({ commit }, payload) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/definir-nueva-causa`,
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
    async dirigirInvestigacion_completarDefinirRedistribucionEspeciesDinero (
      { commit },
      payload
    ) {
      try {
        const { taskId } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${taskId}/definir-redistribucion-especies-dinero`,
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

    // Completar tarea definir diligencias, h6 (puede que sirva para otros)
    async dirigirInvestigacion_completarDefinirInstruirDiligencia (
      { commit },
      payload
    ) {
      try {
        const { idTask } = payload

        const { data } = await apiRGP.post(
          `/bandeja/investigacion/${idTask}/definir-instruir-diligencias`,
          payload
        )

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        }

        commit('pam/pam_SET_PROCESO', task, { root: true })

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error.response.data)
      }
    },
    // #endregion

    // #region view - Ingresar Directriz Investigacion
    async dirigirInvestigacion_postGuardarDirectrizInvestigacion (
      { _ },
      payload
    ) {
      try {
        const { data } = await apiRGP.post(`/causa/directriz/`, payload)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async dirigirInvestigacion_patchGuardarDirectrizInvestigacion (
      { _ },
      payload
    ) {
      const { idCausa } = payload

      try {
        const { data } = await apiRGP.put(
          `/causa/directriz/modifica-directriz/${idCausa}`,
          payload
        )

        return Promise.resolve(data)
      } catch (error) {
        Promise.reject(error)
      }
    },
    async dirigirInvestigacion_getObtenerDirectrizInvestigacion (
      { _ },
      payload
    ) {
      const { idCausa } = payload

      try {
        const { data } = await apiRGP.get(
          `/causa/directriz/lista-directriz/${idCausa}`
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async dirigirInvestigacion_getObtenerHistorialDirectrizCausa (
      { _ },
      payload
    ) {
      const { idCausa } = payload
      const { params } = payload

      try {
        const { data } = await apiRGP.get(
          `/causa/directriz/historial/causa/${idCausa}`,
          { params }
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async dirigirInvestigacion_getObtenerHistorialDirectrizRelacion (
      { _ },
      payload
    ) {
      const { idCausa } = payload
      const { params } = payload

      try {
        const { data } = await apiRGP.get(
          `/causa/directriz/historial/relacion/${idCausa}`,
          { params }
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region 'Solicitar Audiencia de Formalizacion' Refactorizar en store gestion solicitudes???
    async dirigirInvestigacion_postEnviarSolicitudAudienciaFormalizacion (
      { _ },
      payload
    ) {
      try {
        const { data } = await apiRGP.post('/tarea/tareas/solicitud', payload)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    dirigirInvestigacion_createMedidaCautelar ({ commit }, medidaCautelar) {
      commit('dirigirInvestigacion_CREATE_MEDIDA_CAUTELAR', medidaCautelar)
    },
    dirigirInvestigacion_deleteMedidaCautelar ({ commit }, idx) {
      commit('dirigirInvestigacion_DELETE_MEDIDA_CAUTELAR', idx)
    },
    // #endregion

    // #region Definir Nueva Causa
    async dirigirInvestigacion_putSepararCausa ({ _ }, payload) {
      /* payload = {
          ruc: 'string, // ruc de la causa principal
          listaIdRelacionesParaSeparar: ['string'], // ids de las relaciones a separar
          listaIdEspeciesDinero: ['string] // ids de las especies a separar
      } */
      try {
        const { data } = await apiRGP.put(
          'causa/causas/separar-causa',
          payload
        )

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region Definir Curso Causa
    async dirigirInvestigacion_persistirDecisionCausa (_, payload) {
      try {
        const { persistData } = payload

        const { data } = await apiRGP.post(
          '/causa/asignacion/movimiento',
          persistData
        )

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async dirigirInvestigacion_crearNotificacionTransferencia (_, payload) {
      try {
        const { notificacion } = payload

        const { data } = await apiRGP.post(
          '/actividad/causa/gestion-direccion-investigacion/notificacion-transferencia',
          notificacion
        )

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    // #region

    async dirigirInvestigacion_postRegistrarAutorizacionMedidasIntrusivas (_, payload) {
      try {
        const { autorizacion } = payload

        const { data } = await apiRGP.post(`/actividad/solicitud/autorizacion-telefonica-medidas`, autorizacion)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async dirigirInvestigacion_postCompletarCierreInvestigacionEscrito (_, payload) {
      try {
        const { data } = await apiRGP.post(`/actividad/solicitud/comunica-cierre-investigacion`, payload)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async dirigirInvestigacion_putAgrupacionCausas (_, payload) {
      try {
        const { data } = await apiRGP.put(`/causa/causas/agrupar-causa`, payload)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response)
      }
    }
  },

  mutations: {
    dirigirInvestigacion_SET_DEFAULT_STATE (state) {
      state.resumenCausa = null
      state.seleccionDecision = null
      state.hasDirectrizObligatoria = false
      state.causaPrincipal = null
    },
    dirigirInvestigacion_SET_RUC (state, ruc) {
      state.ruc = ruc
    },
    dirigirInvestigacion_SET_ID_DENUNCIA (state, idDenuncia) {
      state.idDenuncia = idDenuncia
    },
    dirigirInvestigacion_SET_CAUSA (state, causa) {
      state.causa = causa
      state.idCausa = causa?.data?.causa?.idCausa
    },
    dirigirInvestigacion_SET_RESUMEN_CAUSA (state, data) {
      state.resumenCausa = data
    },
    dirigirInvestigacion_CREATE_MEDIDA_CAUTELAR (state, medida) {
      state.medidasCautelaresSolicitudes.push(medida)
    },
    dirigirInvestigacion_DELETE_MEDIDA_CAUTELAR (state, idx) {
      state.medidasCautelaresSolicitudes.splice(idx, 1)
    },
    dirigirInvestigacion_SET_MEDIDAS_CAUTELARES (state, medidas) {
      state.medidasCautelaresSolicitudes = medidas
    },
    dirigirInvestigacion_SET_SELECCION_DECISION (state, decision) {
      state.seleccionDecision = decision
    },
    dirigirInvestigacion_SET_DIRECTRIZ_OBLIGATORIA (state, value) {
      state.hasDirectrizObligatoria = value
    },
    dirigirInvestigacion_SET_CAUSA_PRINCIPAL (state, causaPrincipal) {
      state.causaPrincipal = causaPrincipal
    }
  }
}
