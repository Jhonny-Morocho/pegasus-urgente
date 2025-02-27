import { useStore } from 'vuex'
import { computed } from 'vue'

export const useBandejaCustodioStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // STATES
    especiesDinero: computed(() => state.bandejaCustodio.especiesDinero),
    especieDineroSeleccionadaEnBandeja: computed(() => state.bandejaCustodio.especieDineroSeleccionadaEnBandeja),
    esDinero: computed(() => state.bandejaCustodio.esDinero),
    paginacion: computed(() => state.bandejaCustodio.paginacion),
    flujo: computed(() => state.bandejaCustodio.flujo),
    // ACTIONS
    bandejaCustodio_getDataBandeja: (params) => dispatch(`bandejaCustodio/bandejaCustodio_getDataBandeja`, params),
    bandejaCustodio_setPrioritario: (payload) => dispatch('bandejaCustodio/bandejaCustodio_setPrioritario', payload),
    bandejaCustodio_getEspeciePorNue: (payload) => dispatch('bandejaCustodio/bandejaCustodio_getEspeciePorNue', payload),
    bandejaCustodio_actualizarPrioridad: dataTarea => dispatch('bandejaCustodio/bandejaCustodio_actualizarPrioridad', dataTarea),

    // MUTATIONS
    bandejaCustodio_SET_ESPECIE_DINERO_SELECCIONADA: (especieSeleccionada) => commit('bandejaCustodio/bandejaCustodio_SET_ESPECIE_DINERO_SELECCIONADA', especieSeleccionada),
    bandejaCustodio_SET_REGISTRAR_ESPECIE_DINERO: (payload) => commit('bandejaCustodio/bandejaCustodio_SET_REGISTRAR_ESPECIE_DINERO', payload),
    bandejaCustodio_SET_FLUJO: (flujo) => commit('bandejaCustodio/bandejaCustodio_SET_FLUJO', flujo)
  }
}
