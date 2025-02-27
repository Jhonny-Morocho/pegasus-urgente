import { computed } from 'vue'
import { useStore } from 'vuex'

export const useAntecedentesCausaStore = () => {
  const { state, dispatch } = useStore()

  return {
    // COMPUTED PROPERTIES
    causa: computed(() => state.antecedentesCausa.causa),
    antecedentes: computed(() => state.antecedentesCausa.antecedentes),
    fiscaliaLocal: computed(() => state.antecedentesCausa.fiscaliaLocal),
    institucion: computed(() => state.antecedentesCausa.institucion),

    // GETTERS

    // ACTIONS
    antecedentesCausa_getAntecedentesCausa: (ruc) =>
      dispatch('antecedentesCausa/antecedentesCausa_getAntecedentesCausa', ruc),
    antecedentesCausa_getResumenFichaCausa: (ruc) =>
      dispatch('antecedentesCausa/antecedentesCausa_getResumenFichaCausa', ruc),
    antecedentesCausa_getDenuncia: (ruc) =>
      dispatch('antecedentesCausa/antecedentesCausa_getDenuncia', ruc)

    // MUTATIONS
  }
}
