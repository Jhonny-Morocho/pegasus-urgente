import { apiRGP } from '@/config/axios/';

export default {
  namespaced: true,

  state: () => ({
    causasBandeja: [],
    paginacion: null
  }),

  actions: {
    async bandejaFiscal_getDataBandeja({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get('/bandeja/bandeja/denuncia', {
          params
        });

        commit('bandejaFiscal_SET_CAUSAS_BANDEJA', data.data);
        commit('bandejaFiscal_SET_PAGINACION_BANDEJA', data.paginacion);

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },

  mutations: {
    bandejaFiscal_SET_CAUSAS_BANDEJA(state, data) {
      state.causasBandeja = data;
    },
    bandejaFiscal_SET_PAGINACION_BANDEJA(state, data) {
      state.paginacion = data;
    },
    bandejaFiscal_SET_DEFAULT_STATE(state) {
      state.causasBandeja = [];
    }
  }
};
