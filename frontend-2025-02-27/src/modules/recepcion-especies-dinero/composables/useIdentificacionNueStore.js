import { useStore } from 'vuex'
import { computed } from 'vue'

export const useIdentificacionNueStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // STATES
    causaEncontradaAsociadaANue: computed(() => state.stepIdentificacionNue.causaEncontradaAsociadaANue),
    dataNueEncontrado: computed(() => state.stepIdentificacionNue.dataNueEncontrado),

    // ACTIONS
    stepIdentificacionNue_getPorNue: (nue) => dispatch('stepIdentificacionNue/stepIdentificacionNue_getPorNue', nue),
    stepIdentificacionNue_controlarDuplicadoNue: (nue) => dispatch('stepIdentificacionNue/stepIdentificacionNue_controlarDuplicadoNue', nue),
    stepIdentificacionNue_solicitudRucAlAdministrador: (payload) => dispatch('stepIdentificacionNue/stepIdentificacionNue_solicitudRucAlAdministrador', payload),
    stepIdentificacionNue_obtenerCausaPorRUC: (payload) => dispatch('stepIdentificacionNue/stepIdentificacionNue_obtenerCausaPorRUC', payload),
    stepIdentificacionNue_agregarEspecieNue: (payload) => dispatch('stepIdentificacionNue/stepIdentificacionNue_agregarEspecieNue', payload),
    stepIdentificacionNue_obtenerDocumentosByIdEspecie: (payload) => dispatch('stepIdentificacionNue/stepIdentificacionNue_obtenerDocumentosByIdEspecie', payload),

    // MUTATIONS
    especieIncautadaPendienteRecepcion_SET_DECISION: (decision) => commit('stepIdentificacionNue/especieIncautadaPendienteRecepcion_SET_DECISION', decision),
    stepIdentificacionNue_SET_DATA_MOCK: () => commit('stepIdentificacionNue/stepIdentificacionNue_SET_DATA_MOCK'),
    stepIdentificacionNue_RESET_CAUSA_ENCONTRADA: () => commit('stepIdentificacionNue/stepIdentificacionNue_RESET_CAUSA_ENCONTRADA'),
    stepIdentificacionNue_RECTIFICAR_MONTO: (nuevoMonto) => commit('stepIdentificacionNue/stepIdentificacionNue_RECTIFICAR_MONTO', nuevoMonto),
    especieIncautadaPendienteRecepcion_SET_ESPECIE_PELIGROSA: () => commit('stepIdentificacionNue/especieIncautadaPendienteRecepcion_SET_ESPECIE_PELIGROSA'),
    stepIdentificacionNue_SET_CAUSA_ENCONTRADA: (d) => commit('stepIdentificacionNue/stepIdentificacionNue_SET_CAUSA_ENCONTRADA', d)
  }
}
