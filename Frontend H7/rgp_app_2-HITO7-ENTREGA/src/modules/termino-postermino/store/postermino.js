import { apiRGP } from '@/config/axios/';
export default {
  namespaced: true,

  state: () => ({
    solicitudReapertura: {},
    acuerdoReparatorio: null,
    registroCumplimiento: null
  }),

  actions: {
    /* ------- PAM ------ */

    async termino_PamCompletarEvaluarSolicitudReapertura(
      { commit },
      { taskId, apruebaSolicitud, accionTermino }
    ) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/post-termino/${taskId}/completar/evaluar-solicitud-reapertura?apruebaSolicitud=${apruebaSolicitud}&accionTermino=${accionTermino}`
        );

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(task);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async termino_PamCompletarRegistrarModificaciónAR({ commit }, { taskId }) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/post-termino/${taskId}/completar/registrar-modificaciones`
        );

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(task);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async termino_PamCompletarRegistrarCumplimientoIncumplimiento(
      { commit },
      { taskId, cumpleCondicionAcuerdo, idImputado }
    ) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/post-termino/${taskId}/completar/registrar-cumplimiento-incumplimiento?cumpleCondicionAcuerdo=${cumpleCondicionAcuerdo}&idImputado=${idImputado}`
        );

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(task);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async termino_PamCompletarRevisarCausa(
      { commit },
      { taskId, revocacionRevisionCondicion }
    ) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/post-termino/${taskId}/completar/revisar-causa?revocacionRevisionCondicion=${revocacionRevisionCondicion}`
        );

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(task);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async termino_PamCompletarEvaluarInformePsiquiatrico(
      { commit },
      { taskId, ...payload }
    ) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/post-termino/${taskId}/completar/evaluar-informe-psiquiatrico`,
          payload
        );

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(task);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async termino_PamCompletarSolicitarSobreseimientoDefinitivo(
      { commit },
      { taskId, accionTermino }
    ) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/post-termino/${taskId}/completar/solicitar-sobreseimiento-definitivo?accionTermino=${accionTermino}`
        );

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(task);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async termino_PamCompletarReactivarCausaPenal(
      { commit },
      { taskId, accionTermino }
    ) {
      try {
        const { data } = await apiRGP.post(
          `/bandeja/tarea/post-termino/${taskId}/completar/reactivar-causa-penal?accionTermino=${accionTermino}`
        );

        const task = {
          ...data,
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(task);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /* ========================================================= */

    async postermino_getSolicitudReapertura({ commit }, payload) {
      const { idCausa } = payload;
      try {
        const { data } = await apiRGP.get(
          `/actividad/causa/postermino/solicitud/reapertura-causa?idCausa=${idCausa}`
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async postermino_postDecisionSolicitudReapertura({ commit }, payload) {
      try {
        const { data } = await apiRGP.put(
          `/actividad/causa/postermino/solicitud/reapertura-causa`,
          payload
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /* Acuerdo Reparatorio */

    async postermino_getAcuerdoReparatorio({ commit }, payload) {
      const { idImputado, idCausa } = payload;
      try {
        const { data } = await apiRGP.get(
          `/actividad/causa/postermino/acuerdo-reparatorio?idCausa=${idCausa}&idImputado=${idImputado}`
        );
        commit('postermino_SET_ACUERDO_REPARATORIO', data);
        return data;
      } catch (error) {
        commit('postermino_SET_ACUERDO_REPARATORIO', null);
        return Promise.reject(error);
      }
    },
    async postermino_postAcuerdoReparatorio({ commit }, payload) {
      try {
        const { data } = await apiRGP.put(
          `/actividad/causa/postermino/acuerdo-reparatorio`,
          { ...payload }
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async postermino_getRegistroCumplimiento({ commit }, payload) {
      const { idImputado, idCausa } = payload;
      try {
        const { data } = await apiRGP.get(
          `/actividad/causa/postermino/acuerdo-reparatorio/registro-cumplimiento?idCausa=${idCausa}&idImputado=${idImputado}`
        );
        commit('postermino_SET_REGISTRO_CUMPLIMIENTO', data);
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async postermino_postRegistroCumplimiento({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(
          `/actividad/causa/postermino/acuerdo-reparatorio/registro-cumplimiento`,
          payload
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async postermino_postDecisionRevisarCausa({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(
          `/actividad/causa/postermino/escrito/revisar-causa`,
          payload
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async postermino_getInformePsiquiatrico({ commit }, payload) {
      const { idImputado, idCausa } = payload;
      try {
        const { data } = await apiRGP.get(
          `/actividad/causa/postermino/informe-psiquiatrico?idCausa=${idCausa}&idImputado=${idImputado}`
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async postermino_postInformePsiquiatrico({ commit }, payload) {
      try {
        const { data } = await apiRGP.put(
          `/actividad/causa/postermino/informe-psiquiatrico`,
          payload
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async postermino_postReactivarCausa({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(
          `/actividad/causa/postermino/audiencia/reactivar-causa`,
          payload
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async postermino_postSobreseimientoDefinitivo({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(
          `/actividad/causa/postermino/audiencia/sobreseimiento-definitivo`,
          payload
        );
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /************************************/
    async postermino_setResignarCausa({ commit }, payload) {
      // desde gestionar carga de trabajo
      console.log(payload);
    }
  },

  getters: {
    postermino_getNombreCondicionMantenedor: (state) => (idCondicion) => {
      const { label } = state.condiciones.find(
        (condicion) => condicion.id === idCondicion
      );
      return label;
    },

    postermino_getCondicionesByIdImputado: (state) => (idImputado) => {
      console.log(state.condicionesRegistradas);
      const condicionRegistradaDeImputado = state.condicionesRegistradas?.find(
        (condicion) => condicion.idImputado === idImputado
      );
      console.log({ condicionRegistradaDeImputado });
      if (condicionRegistradaDeImputado) {
        return condicionRegistradaDeImputado.condiciones.map((condicion) => {
          const { label } = state.condiciones.find(
            (c) => c.id === condicion.id
          );
          return {
            id: condicion.id,
            label,
            estado: condicion.estado
          };
        });
      } else {
        return [];
      }
    }
  },

  mutations: {
    postermino_SET_SOLICITUD_REAPERTURA(state, payload) {
      state.solicitudRepertura = { ...payload };
      console.log('MUTATIONS : ', state.solicitudRepertura);
    },
    postermino_SET_ACUERDO_REPARATORIO(state, payload) {
      state.acuerdoReparatorio = payload;
    },
    postermino_SET_REGISTRO_CUMPLIMIENTO(state, payload) {
      state.registroCumplimiento = payload;
    }
  }
};
