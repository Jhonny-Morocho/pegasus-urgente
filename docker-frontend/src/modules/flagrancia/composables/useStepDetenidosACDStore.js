import { computed } from 'vue'
import { useStore } from 'vuex'

export const useStepDetenidosACDStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    detenidos: computed(() => state.stepDetenidosACD.detenidos),
    paginacion: computed(() => state.stepDetenidosACD.paginacion),
    nomina: computed(() => state.stepDetenidosACD.nomina),
    paginacionNomina: computed(() => state.stepDetenidosACD.paginacionNomina),
    procedimientoDetenidos: computed(() => state.stepDetenidosACD.procedimientoDetenidos),
    paginacionProcedimientoDetenidos: computed(() => state.stepDetenidosACD.paginacionProcedimientoDetenidos),
    procedimientoConRucs: computed(() => state.stepDetenidosACD.procedimientoConRucs),
    procedimientoSinRucs: computed(() => state.stepDetenidosACD.procedimientoSinRucs),

    // ACTIONS
    stepDetenidosACD_getDataTableACD: ({ idProcedimiento, idDenuncia }) => dispatch('stepDetenidosACD/stepDetenidosACD_getDataTableACD', { idProcedimiento, idDenuncia }),
    stepDetenidosACD_registrarDecisionACD: (payload) => dispatch('stepDetenidosACD/stepDetenidosACD_registrarDecisionACD', payload),
    stepDetenidosACD_actualizarDecisionACD: (payload) => dispatch('stepDetenidosACD/stepDetenidosACD_actualizarDecisionACD', payload),
    stepDetenidosACD_getDecisionACD: (payload) => dispatch('stepDetenidosACD/stepDetenidosACD_getDecisionACD', payload),
    stepDetenidosACD_setEsEnviadoACD: (payload) => dispatch('stepDetenidosACD/stepDetenidosACD_setEsEnviadoACD', payload),
    stepDetenidosACD_getNominaDetenidos: (payload) => dispatch('stepDetenidosACD/stepDetenidosACD_getNominaDetenidos', payload),
    stepDetenidosACD_getProcedimientoConDetenidos: (payload) => dispatch('stepDetenidosACD/stepDetenidosACD_getProcedimientoConDetenidos', payload),
    stepDetenidosACD_creacionRucsMasivos: (payload) => dispatch('stepDetenidosACD/stepDetenidosACD_creacionRucsMasivos', payload),

    // MUTATIONS
    stepDetenidosACD_EDIT_DETENIDO: (detenido) => commit('stepDetenidosACD/stepDetenidosACD_EDIT_DETENIDO', detenido),
    stepDetenidosACD_SET_DETENIDOS: (detenidos) => commit('stepDetenidosACD/stepDetenidosACD_SET_DETENIDOS', detenidos),
    stepDetenidosACD_SET_DECISION: (detenidos) => commit('stepDetenidosACD/stepDetenidosACD_SET_DECISION', detenidos),
    stepDetenidosACD_SET_PROCEDIMIENTO_SIN_RUCS: () => commit('stepDetenidosACD/stepDetenidosACD_SET_PROCEDIMIENTO_SIN_RUCS'),
    stepDetenidosACD_SET_DEFAULT_STATE: () => commit('stepDetenidosACD/stepDetenidosACD_SET_DEFAULT_STATE'),
    nominaDetenidos_SET_DEFAULT_STATE: () => commit('stepDetenidosACD/stepDetenidosACD_SET_DEFAULT_STATE'),
    procedimientoDetenidos_SET_DEFAULT_STATE: () => commit('stepDetenidosACD/procedimientoDetenidos_SET_DEFAULT_STATE')
  }
}
