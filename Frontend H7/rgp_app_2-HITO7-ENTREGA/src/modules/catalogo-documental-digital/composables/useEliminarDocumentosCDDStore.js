import { computed } from 'vue'
import { useStore } from 'vuex'

export const useEliminarDocumentosCDDStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    // STATES
    idDocumento: computed(() => state.eliminarDocumentosCDD.idDocumento),
    idCatalogo: computed(() => state.eliminarDocumentosCDD.idCatalogo),
    dataEliminacion: computed(
      () => state.eliminarDocumentosCDD.dataEliminacion
    ),
    dataDevolucion: computed(() => state.eliminarDocumentosCDD.dataDevolucion),

    // ACTIONS
    eliminarDocumentosCDD_destruirDocumentosFisico: (params) =>
      dispatch(
        'eliminarDocumentosCDD/eliminarDocumentosCDD_destruirDocumentosFisico',
        params
      ),
    eliminarDocumentosCDD_devolverDocumentosFisico: (params) =>
      dispatch(
        'eliminarDocumentosCDD/eliminarDocumentosCDD_destruirDocumentosFisico',
        params
      ),
    eliminarDocumentosCDD_autorizar: (params) =>
      dispatch('eliminarDocumentosCDD/eliminarDocumentosCDD_autorizar', params),
    eliminarDocumentosCDD_validarCodigoBarras: (payload) =>
      dispatch(
        'eliminarDocumentosCDD/eliminarDocumentosCDD_validarCodigoBarras',
        payload
      ),

    // MUTATIONS
    eliminarDocumentosCDD_SET_ID_DOCUMENTO: (id) =>
      commit(
        'eliminarDocumentosCDD/eliminarDocumentosCDD_SET_ID_DOCUMENTO',
        id
      ),
    eliminarDocumentosCDD_SET_ID_CATALOGO: (id) =>
      commit(
        'eliminarDocumentosCDD/eliminarDocumentosCDD_SET_ID_CATALOGO:',
        id
      ),
    eliminarDocumentosCDD_SET_DATA_ELIMINACION: (payload) =>
      commit(
        'eliminarDocumentosCDD/eliminarDocumentosCDD_SET_DATA_ELIMINACION',
        payload
      ),
    eliminarDocumentosCDD_SET_DATA_DEVOLUCION: (payload) =>
      commit(
        'eliminarDocumentosCDD/eliminarDocumentosCDD_SET_DATA_DEVOLUCION',
        payload
      )
  }
}
