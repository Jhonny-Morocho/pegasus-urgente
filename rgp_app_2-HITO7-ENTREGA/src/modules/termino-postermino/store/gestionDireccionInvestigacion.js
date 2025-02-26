/* eslint-disable no-unused-vars */
import { apiRGP } from '@/config/axios/';
export default {
  namespaced: true,

  state: () => ({
    resumenCausa: null,
    ruc: null,
    idCausa: null,
    idDenuncia: null,
    causaActual: null,
    cargaFiscal: null,
    cargaUnidad: null,
    cargaUnidadFiscal: null
  }),

  actions: {
    async gestionDireccionInvestigacion_getResumenCausa({ commit }, payload) {
      try {
        const { ruc } = payload;

        const { data } = await apiRGP.get(`/causa/causas/causa/${ruc}/resumen`);

        commit('gestionDireccionInvestigacion_SET_RESUMEN_CAUSA', data);

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async gestionDireccionInvestigacion_getDecisionCausa(_, payload) {
      try {
        const { idCausa } = payload;

        const { data } = await apiRGP.get(
          `/causa/asignacion/movimiento/${idCausa}`
        );

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async gestionDireccionInvestigacion_completarRevisarCausa(
      { commit },
      payload
    ) {
      try {
        const { idInstanciaTarea, apruebaDecisionFiscal } = payload;

        const { data } = await apiRGP.post(
          `/bandeja/tarea/gestion-direccion-investigacion/${idInstanciaTarea}/completar/revisar-causa?apruebaDecisionFiscal=${apruebaDecisionFiscal}`
        );

        const task = {
          taskId: data?.taskInstanceId,
          taskProcessInstanceId: data?.processInstanceId,
          taskName: data?.taskName
        };

        commit('pam/pam_SET_PROCESO', task, { root: true });

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    // TAREA FINAL NO NECESITA GUARDAR DATA EN STORE DE PAM
    async gestionDireccionInvestigacion_completarDefinirAccionMotivoCambio(
      { commit },
      payload
    ) {
      try {
        const { idInstanciaTarea, decisionFiscal } = payload;

        const { data } = await apiRGP.post(
          `/bandeja/tarea/gestion-direccion-investigacion/${idInstanciaTarea}/completar/definir-accion-motivo-cambio-agrupar-transferir?decisionFiscal=${decisionFiscal}`
        );

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async gestionDireccionInvestigacion_getNotificacionTransferencia(
      _,
      payload
    ) {
      try {
        const { params } = payload;

        const { data } = await apiRGP.get(
          '/actividad/causa/gestion-direccion-investigacion/notificacion-transferencia',
          { params }
        );

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async gestionDireccionInvestigacion_getCargaTrabajoUnidad(
      { commit },
      payload
    ) {
      try {
        const { codigoFiscalia, params } = payload;

        const { data } = await apiRGP.get(
          `/causa/fiscalia/unidad/carga/${codigoFiscalia}`,
          { params }
        );

        commit('gestionDireccionInvestigacion_SET_CARGA_UNIDAD', data);

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async gestionDireccionInvestigacion_getCargaTrabajoFiscal(
      { commit },
      payload
    ) {
      try {
        const { codigoFiscalia, params } = payload;

        const { data } = await apiRGP.get(
          `/causa/fiscalia/fiscal/carga/${codigoFiscalia}`,
          { params }
        );

        commit('gestionDireccionInvestigacion_SET_CARGA_FISCAL', data);
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async gestionDireccionInvestigacion_filtrarCargaUnidadTrabajoFiscal({ commit }, payload) {
      try {
        const { data } = await apiRGP.post(`/causa/fiscalia/unidad/fiscal/carga`, payload);
        commit('gestionDireccionInvestigacion_SET_CARGA_UNIDAD_FISCAL', data);
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },

  mutations: {
    gestionDireccionInvestigacion_SET_RESUMEN_CAUSA(state, payload) {
      state.resumenCausa = payload;
    },
    gestionDireccionInvestigacion_SET_CARGA_FISCAL(state, payload) {
      state.cargaFiscal = payload;
    },
    gestionDireccionInvestigacion_SET_CARGA_UNIDAD(state, payload) {
      state.cargaUnidad = payload;
    },

    gestionDireccionInvestigacion_SET_CAUSA_ACTUAL(state, payload) {
      state.idDenuncia = payload?.causa?.idDenuncia;
      state.idCausa = payload?.causa?.idCausa;
      state.ruc = payload?.causa?.ruc;
      state.causaActual = payload;
    },
    gestionDireccionInvestigacion_SET_CARGA_UNIDAD_FISCAL(state, payload){
      state.cargaUnidadFiscal = payload
    }
  }
};
