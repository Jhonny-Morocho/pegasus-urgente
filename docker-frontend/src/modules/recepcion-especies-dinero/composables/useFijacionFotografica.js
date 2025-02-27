import { computed } from 'vue'
import { useStore } from 'vuex'

export const useFijacionFotografica = () => {
  const { dispatch, state } = useStore()

  return {
    dataFijacion: computed(() => state.fijacionfotografica.dataFijacion),
    fijacionfotografica_getDataEspecieFijacion: (payload) => dispatch('fijacionfotografica/fijacionfotografica_getDataEspecieFijacion', payload)
  }
}
