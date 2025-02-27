import { computed } from 'vue'
import { useStore } from 'vuex'

export const useAnotacionCausaStore = () => {
  const { state, dispatch } = useStore()

  return {
    // #region STATE
    paginacion: computed(() => state.anotacionCausa.paginacion),
    anotaciones: computed(() => state.anotacionCausa.anotaciones),
    // #endregion

    // #region ACTIONS
    anotacionCausa_getAnotacionesByIdDenuncia: (payload) =>
      dispatch('anotacionCausa/anotacionCausa_getAnotacionesByIdDenuncia', payload),

    anotacionCausa_getAnotacionById: (payload) =>
      dispatch('anotacionCausa/anotacionCausa_getAnotacionById', payload),

    anotacionCausa_crearAnotacion: (payload) =>
      dispatch('anotacionCausa/anotacionCausa_crearAnotacion', payload),

    anotacionCausa_modificarAnotacion: (payload) =>
      dispatch('anotacionCausa/anotacionCausa_modificarAnotacion', payload),

    anotacionCausa_eliminarAnotacion: (payload) =>
      dispatch('anotacionCausa/anotacionCausa_eliminarAnotacion', payload)

    // #endregion

  }
}
