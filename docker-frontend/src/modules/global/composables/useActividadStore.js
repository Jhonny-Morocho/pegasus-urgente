import { computed } from 'vue'
import { useStore } from 'vuex'

export const useActividadStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // #region STATE
    actividades: computed(() => state.actividad.actividades),
    paginacionActividades: computed(() => state.actividad.paginacionActividades),
    diligenciasSugeridas: computed(() => state.actividad.diligenciasSugeridas),
    paginacionDiligenciasSugeridas: computed(() => state.actividad.paginacionDiligenciasSugeridas),
    // #endregion

    // #region ACTIONS
    actividad_getActividades: (payload) =>
      dispatch('actividad/actividad_getActividades', payload),

    actividad_enviarSolicitud: (payload) =>
      dispatch('actividad/actividad_enviarSolicitud', payload),

    actividad_deleteActividad: (payload) =>
      dispatch('actividad/actividad_deleteActividad', payload),

    actividad_getDiligenciasSugeridas: (payload) =>
      dispatch('actividad/actividad_getDiligenciasSugeridas', payload),

    actividad_getDirectrizAutomatica: (payload) =>
      dispatch('actividad/actividad_getDirectrizAutomatica', payload),

    actividad_getManyActividadesByIdCausa: (payload) =>
      dispatch('actividad/actividad_getManyActividadesByIdCausa', payload),
    // #endregion

    // #region MUTATIONS
    actividad_RESET_ACTIVIDADES: () => commit('actividad/actividad_RESET_ACTIVIDADES')
    // #endregion

  }
}
