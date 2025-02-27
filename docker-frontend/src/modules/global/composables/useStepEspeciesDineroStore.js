import { useStore } from 'vuex'
import { computed } from 'vue'

export const useStepEspeciesDineroStore = () => {
  const { dispatch, state, commit } = useStore()
  return {
    // COMPUTED PROPERTIES
    familiaEspecie: computed(() => state.stepEspeciesDinero.familiaEspecies),
    tipoEspecies: computed(() => state.stepEspeciesDinero.tipoEspecies),
    fotoVideoEspecie: computed(() => state.stepEspeciesDinero.fotoVideoEspecie),
    especies: computed(() => state.stepEspeciesDinero.especies),
    dineros: computed(() => state.stepEspeciesDinero.dineros),
    documentoGeolocalizacion: computed(
      () => state.stepEspeciesDinero.documentoGeolocalizacion
    ),

    // ACTIONS
    stepEspeciesDinero_get_familia_especies: () =>
      dispatch('stepEspeciesDinero/stepEspeciesDinero_get_familia_especies'),

    stepEspeciesDinero_get_tipo_especie: () =>
      dispatch('stepEspeciesDinero/stepEspeciesDinero_get_tipo_especie'),

    stepEspeciesDinero_addEspecie: (payload) =>
      dispatch('stepEspeciesDinero/stepEspeciesDinero_addEspecie', payload),

    // MUTATIONS
    stepEspeciesDinero_ADD_FOTOGRAFIA_VIDEO: (fotoVideo) =>
      commit(
        'stepEspeciesDinero/stepEspeciesDinero_ADD_FOTOGRAFIA_VIDEO',
        fotoVideo
      ),

    stepEspeciesDinero_DELETE_FOTOGRAFIA_VIDEO: (index) =>
      commit(
        'stepEspeciesDinero/stepEspeciesDinero_DELETE_FOTOGRAFIA_VIDEO',
        index
      ),

    stepEspeciesDinero_ADD_ONE_DINERO: (payload) =>
      commit('stepEspeciesDinero/stepEspeciesDinero_ADD_ONE_DINERO', payload),

    stepEspeciesDinero_DELETE_ONE_DINERO: (index) =>
      commit('stepEspeciesDinero/stepEspeciesDinero_DELETE_ONE_DINERO', index),

    stepEspeciesDinero_ADD_DOCUMENT_GEO: (payload) =>
      commit('stepEspeciesDinero/stepEspeciesDinero_ADD_DOCUMENT_GEO', payload),

    stepEspeciesDinero_DELETE_ONE_DOCUMENT_GEO: (index) =>
      commit(
        'stepEspeciesDinero/stepEspeciesDinero_DELETE_ONE_DOCUMENT_GEO',
        index
      ),

    stepEspeciesDinero_SET_DEFAULT_STATE: () =>
      commit('stepEspeciesDinero/stepEspeciesDinero_SET_DEFAULT_STATE'),

    stepEspeciesDinero_SET_ESPECIE: (especie) =>
      commit('stepEspeciesDinero/stepEspeciesDinero_SET_ESPECIE', especie)
  }
}
