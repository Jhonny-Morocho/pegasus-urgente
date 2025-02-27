import { computed } from 'vue'
import { useStore } from 'vuex'

export const usePanelesStore = () => {
  const { dispatch, state } = useStore()

  return {
    paneles: computed(() => state.panelesStore.paneles),

    /* ACTIONS */
    paneles_updatePanel: ({ panel }) => dispatch('panelesStore/paneles_updatePanel', panel)

    /* MUTATIONS */
  }
}
