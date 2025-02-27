import { computed } from 'vue'
import { useStore } from 'vuex'

export const useStepRelacionesStore = () => {
  const { state, commit } = useStore()

  return {
    relaciones: computed(() => state.stepRelaciones.relaciones),
    dinero: computed(() => state.stepRelaciones.dinero),

    stepRelaciones_DELETE_ONE_RELACION: (index) =>
      commit('stepRelaciones/stepRelaciones_DELETE_ONE_RELACION', index),

    stepRelaciones_SET_RELACIONES: (relaciones) =>
      commit('stepRelaciones/stepRelaciones_SET_RELACIONES', relaciones),

    stepRelaciones_SET_DEFAULT_STATE: () =>
      commit('stepRelaciones/stepRelaciones_SET_DEFAULT_STATE')

  }
}
