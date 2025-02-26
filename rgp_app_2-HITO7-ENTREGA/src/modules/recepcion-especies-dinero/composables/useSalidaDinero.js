import { useStore } from 'vuex'
import { computed } from 'vue'

export const useSalidaDinero = () => {
  const { dispatch, commit, state } = useStore()

  return {
    // STATES
    datosRegistroChequeRecibido: computed(() => state.salidaDinero.datosRegistroChequeRecibido),
    datosRegistroDeposito: computed(() => state.salidaDinero.datosRegistroDeposito),
    // ACTIONS
    salidaDinero_registrarMetodoEntrega: (data) =>
      dispatch('salidaDinero/salidaDinero_registrarMetodoEntrega', data),
    salidaDinero_generarCheque: (payload) => dispatch('salidaDinero/salidaDinero_generarCheque', payload),
    salidaDinero_registrarRecepcionCheque: (payload) => dispatch('salidaDinero/salidaDinero_registrarRecepcionCheque', payload),
    salidaDinero_dataRegistrarChequeRecibido: (payload) => dispatch('salidaDinero/salidaDinero_dataRegistrarChequeRecibido', payload),
    salidaDinero_dataRegistrarDeposito: (payload) => dispatch('salidaDinero/salidaDinero_dataRegistrarDeposito', payload),
    // MUTATIONS
    useSalidaDinero_SET_ARCHIVOS: (data) =>
      commit('salidaDinero/salidaDinero__SET_ARCHIVOS', data),
    salidaDinero__SET_ARCHIVOS: () => commit('useSalidaDinero/salidaDinero__SET_ARCHIVOS')
  }
}
