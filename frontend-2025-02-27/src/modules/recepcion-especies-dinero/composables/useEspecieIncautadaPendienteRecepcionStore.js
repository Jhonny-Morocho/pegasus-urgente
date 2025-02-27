import { useStore } from 'vuex'
import { computed } from 'vue'

export const useEspecieIncautadaPendienteRecepcionStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    // STATES
    especiesIncautadas: computed(() => state.stepEspeciesIncautadasPendientesDeRecepcion.especiesIncautadas),
    dineroIncautadoSeleccionado: computed(() => state.stepEspeciesIncautadasPendientesDeRecepcion.dineroIncautadoSeleccionado),
    especiesDinerosNoIngresados: computed(() => state.stepEspeciesIncautadasPendientesDeRecepcion.especiesDinerosNoIngresados),
    dataEspeciesNoIngresadas: computed(() => state.stepEspeciesIncautadasPendientesDeRecepcion.dataEspeciesNoIngresadas),
    // ACTIONS
    stepEspeciesIncautadasPendientesDeRecepcion_separarPorNue: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_separarPorNue', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_getEspecieDineroNoIngresado', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazarEspecies: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazarEspecies', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_setEspeciePeligrosa: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_setEspeciePeligrosa', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazar: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_aceptarORechazar', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdDenunciaNue: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdDenunciaNue', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_rectifcarMonto: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_rectifcarMonto', payload),
    stepEspeciesIncautadasPendientesDeRecepcion_ingresarDesgloseDinero: (payload) => dispatch('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_ingresarDesgloseDinero', payload),

    // MUTATIONS
    stepEspeciesIncautadasPendientesDeRecepcion_SET_DINERO_INCAUTADO_SELECCIONADO: (dinero) => commit('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_SET_DINERO_INCAUTADO_SELECCIONADO', dinero),
    stepEspeciesIncautadasPendientesDeRecepcion_RECTIFICAR_MONTO: (dinero) => commit('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_RECTIFICAR_MONTO', dinero),
    stepEspeciesIncautadasPendientesDeRecepcion_SET_MONTO_RECTIFICADO: (dinero) => commit('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_SET_MONTO_RECTIFICADO', dinero),
    stepEspeciesIncautadasPendientesDeRecepcion_RESET: () => commit('stepEspeciesIncautadasPendientesDeRecepcion/stepEspeciesIncautadasPendientesDeRecepcion_RESET')
  }
}
