import { apiRGP } from '@/config/axios/';

export default {
  namespaced: true,

  state: () => ({
    causasBandeja: [],
    paginacion: null
  }),

  actions: {
    async bandejaFiscalRegional_getDataBandeja({ commit }, { params }) {
      try {
        const { data } = await apiRGP.get('/bandeja/bandeja/denuncia', {
          params
        });

        commit('bandejaFiscalRegional_SET_CAUSAS_BANDEJA', data.data);
        commit('bandejaFiscalRegional_SET_PAGINACION_BANDEJA', data.paginacion);

        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },

  mutations: {
    bandejaFiscalRegional_SET_CAUSAS_BANDEJA(state, data) {
      state.causasBandeja = data;
    },
    bandejaFiscalRegional_SET_PAGINACION_BANDEJA(state, data) {
      state.paginacion = data;
    },
    bandejaFiscalRegional_SET_DEFAULT_STATE(state) {
      state.causasBandeja = [];
    }
  }
};
