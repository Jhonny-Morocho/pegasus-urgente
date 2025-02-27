import { useStore } from 'vuex'
import { computed } from 'vue'

export const useSubirArchivosStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // STATES
    archivo: computed(() => state.subirArchivosStore.archivo),
    archivos: computed(() => state.subirArchivosStore.archivos),

    // ACTIONS
    subirArchivosStore_subirArchivo: (data) =>
      dispatch('subirArchivosStore/subirArchivosStore_subirArchivo', data),
    subirArchivosStore_deleteArchivo: (data) =>
      dispatch('subirArchivosStore/subirArchivosStore_deleteArchivo', data),
    subirArchivosStore_getArchivosSubidosByIdEspecie: (data) =>
      dispatch(
        'subirArchivosStore/subirArchivosStore_getArchivosSubidosByIdEspecie', data),
    subirArchivosStore_addArchivoLocal: (data) =>
      dispatch(
        'subirArchivosStore/subirArchivosStore_addArchivoLocal', data),
    subirArchivosStore_deleteArchivoLocal: (data) =>
      dispatch(
        'subirArchivosStore/subirArchivosStore_deleteArchivoLocal', data),

    // MUTATIONS
    subirArchivosStore_SET_ARCHIVOS: (data) =>
      commit('subirArchivosStore/subirArchivosStore_SET_ARCHIVOS', data),
    subirArchivosStore_RESET_ARCHIVOS_TABLA: () => commit('subirArchivosStore/subirArchivosStore_RESET_ARCHIVOS_TABLA')
  }
}
