import { computed } from 'vue'
import { useStore } from 'vuex'

export const useBuscarDuplicidadStore = () => {
  const { dispatch, state, commit } = useStore()

  return {
    candidatasDuplicidad: computed(() => state.buscarDuplicidad.candidatasDuplicidad),
    dataPam: computed(() => state.buscarDuplicidad.dataPam),
    seDenegoDuplicidad: computed(() => state.buscarDuplicidad.seDenegoDuplicidad),
    paginacion: computed(() => state.buscarDuplicidad.paginacion),

    buscarDuplicidad_buscarDuplicidad: (data) =>
      dispatch('buscarDuplicidad/buscarDuplicidad_buscarDuplicidad', data),

    buscarDuplicidad_decisionCausaDuplicada: (payload) =>
      dispatch('buscarDuplicidad/buscarDuplicidad_decisionCausaDuplicada', payload),

    // mutations
    buscarDuplicidad_RESET: () =>
      commit('buscarDuplicidad/buscarDuplicidad_RESET')
  }
}
