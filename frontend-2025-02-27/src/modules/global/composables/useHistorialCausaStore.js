/* eslint-disable no-unused-vars */
import { computed } from 'vue'
import { useStore } from 'vuex'

export const useHistorialCausaStore = () => {
  const { state } = useStore()

  return {
    // #region STATE
    historialIngreso: computed(() => state.historialCausa.historialIngreso),
    historialPreclasificacion: computed(() => state.historialCausa.historialPreclasificacion),
    historialAsignacion: computed(() => state.historialCausa.historialAsignacion),
    historialTramitacion: computed(() => state.historialCausa.historialTramitacion),
    historialDirigirInvestigacion: computed(() => state.historialCausa.historialDirigirInvestigacion),
    historialCausa: computed(() => state.historialCausa.historialCausa)
    // #endregion

    // #region ACTIONS

    // #endregion

  }
}
