import { computed } from 'vue'
import { useStore } from 'vuex'

export const usePamGestionSolicitudes = () => {
  const { state, dispatch } = useStore()

  return {
    tareaPam: computed(() => state.pamGestionSolicitudes.tareaPam),
    pamGDS: computed(() => state.pamGestionSolicitudes.pamGDS),

    pamGestionSolicitudes_getPam: () =>
      dispatch('pamGestionSolicitudes/pamGestionSolicitudes_getPam'),
    pamGestionSolicitudes_iniciarYReservar: (payload) =>
      dispatch('pamGestionSolicitudes/pamGestionSolicitudes_iniciarYReservar', payload),
    pamGestionSolicitudes_materializarSolicitud: (payload) =>
      dispatch('pamGestionSolicitudes/pamGestionSolicitudes_materializarSolicitud', payload)
  }
}
