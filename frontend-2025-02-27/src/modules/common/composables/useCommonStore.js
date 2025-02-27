import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCommonStore = () => {
  const { state, commit } = useStore()

  return {
    toast: computed(() => state.common.toast),

    common_LAUNCH_TOAST: (toast) => commit('common/common_LAUNCH_TOAST', toast)
  }
}
