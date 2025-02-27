/* eslint-disable no-unused-vars */
import { useStore } from 'vuex'
import { computed } from 'vue'
export const useFichaCausaStore = () => {
  const { dispatch, commit, state } = useStore()

  return {
    origenCausa: computed(() => state.fichaCausa.origenCausa),
    resumenFichaCausa: computed(() => state.fichaCausa.resumenFichaCausa),
    idDenuncia: computed(() => state.fichaCausa.idDenuncia),
    idCausa: computed(() => state.fichaCausa.idCausa),
    causa: computed(() => state.fichaCausa.causa),
    ruc: computed(() => state.fichaCausa.ruc),

    fichaCausa_getResumenFichaCausa: (payload) =>
      dispatch('fichaCausa/fichaCausa_getResumenFichaCausa', payload),
    fichaCausa_recomendacionPreclasificador: (payload) =>
      dispatch('fichaCausa/fichaCausa_recomendacionPreclasificador', payload),
    fichaCausa_getCausa: (payload) =>
      dispatch('fichaCausa/fichaCausa_getCausa', payload),
    fichaCausa_getResumenCausa: (payload) =>
      dispatch('fichaCausa/fichaCausa_getResumenCausa', payload),

    fichaCausa_SET_ORIGEN_CAUSA: (origenCausa) =>
      commit('fichaCausa/fichaCausa_SET_ORIGEN_CAUSA', origenCausa),
    fichaCausa_SET_ID_DENUNCIA: (idDenuncia) =>
      commit('fichaCausa/fichaCausa_SET_ID_DENUNCIA', idDenuncia),
    fichaCausa_SET_ID_CAUSA: (idCausa) =>
      commit('fichaCausa/fichaCausa_SET_ID_CAUSA', idCausa),
    fichaCausa_SET_CAUSA: (causa) =>
      commit('fichaCausa/fichaCausa_SET_CAUSA', causa),
    fichaCausa_SET_RUC: (ruc) => commit('fichaCausa/fichaCausa_SET_RUC', ruc),
    fichaCausa_SET_SUJETO_SELECCIONADO: (sujeto) =>
      commit('fichaCausa/fichaCausa_SET_SUJETO_SELECCIONADO', sujeto)
  }
}
