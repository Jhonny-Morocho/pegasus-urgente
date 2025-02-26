import { computed } from 'vue'
import { useStore } from 'vuex'

export const useRelacionesStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    relacionesConMedidas: computed(() => state.relacionesGb.relacionesConMedidas),
    paginacionRelacionesConMedidas: computed(() => state.relacionesGb.paginacionRelacionesConMedidas),
    relacionesConMedidasSegundaTabla: computed(() => state.relacionesGb.relacionesConMedidasSegundaTabla),
    paginacionRelacionesConMedidasSegundaTabla: computed(() => state.relacionesGb.paginacionRelacionesConMedidasSegundaTabla),
    relaciones: computed(() => state.relacionesGb.relaciones),
    paginacion: computed(() => state.relacionesGb.paginacion),
    parentesco: computed(() => state.relacionesGb.parentesco),
    paginacionParentesco: computed(() => state.relacionesGb.paginacionParentesco),

    relaciones_SET_RELACIONES: (relaciones) =>
      commit('relacionesGb/relaciones_SET_RELACIONES', relaciones),

    relaciones_SET_DEFAULT_STATE: () =>
      commit('relacionesGb/relaciones_SET_DEFAULT_STATE'),

    relaciones_addRelacion: (relacion) =>
      dispatch('relacionesGb/relaciones_addRelacion', relacion),

    relaciones_deleteRelacion: (relacion) =>
      dispatch('relacionesGb/relaciones_deleteRelacion', relacion),

    relaciones_getRelacionesByIdGlobal: (idGlobal) =>
      dispatch('relacionesGb/relaciones_getRelacionesByIdGlobal', idGlobal),

    relaciones_getByIdRelacionDelito: (idRelacionDelito) => 
      dispatch('relacionesGb/relaciones_getByIdRelacionDelito', idRelacionDelito),

    relaciones_getRelaciones: (id) =>
      dispatch('relacionesGb/relaciones_getRelaciones', id),

    relaciones_editRelacion: (relacion) =>
      dispatch('relacionesGb/relaciones_editRelacion', relacion),

    relaciones_putActualizarEstadoRelacion: (payload) =>
      dispatch('relacionesGb/relaciones_putActualizarEstadoRelacion', payload),
    relaciones_getRelacionesCausaUltimaDirectriz: (payload) =>
      dispatch('relacionesGb/relaciones_getRelacionesCausaUltimaDirectriz', payload),

    // #region 'Relacion Sujeto con medidas'
    relaciones_getRelacionesConMedidasCautelares: (payload) =>
      dispatch('relacionesGb/relaciones_getRelacionesConMedidasCautelares', payload),
    relaciones_postAgregarMedidaCautelar: (payload) =>
      dispatch('relacionesGb/relaciones_postAgregarMedidaCautelar', payload),
    relaciones_deleteMedidaCautelar: (payload) =>
      dispatch('relacionesGb/relaciones_deleteMedidaCautelar', payload),
    // #endregion

    relaciones_postManyRelacionesByIdDenuncia: (payload) =>
      dispatch('relacionesGb/relaciones_postManyRelacionesByIdDenuncia', payload),

    // BFF (🤡) DEBE ELIMINARSE
    relaciones_getRelacionesEnCausa: (payload) =>
      dispatch('relacionesGb/relaciones_getRelacionesEnCausa', payload),

    // #region ACTIONS PARENTESCO
    relaciones_addParentesco: (payload) =>
      dispatch('relacionesGb/relaciones_addParentesco', payload),
    relaciones_getParentesco: (payload) =>
      dispatch('relacionesGb/relaciones_getParentesco', payload),
    relaciones_deleteParentesco: (payload) =>
      dispatch('relacionesGb/relaciones_deleteParentesco', payload),
    relaciones_editParentesco: (payload) =>
      dispatch('relacionesGb/relaciones_editParentesco', payload),
    // #endregion

    // #region MUTATIONS PARENTESCO
    relaciones_SET_PARENTESCO_DEFAULT_STATE: () =>
      commit('relacionesGb/relaciones_SET_PARENTESCO_DEFAULT_STATE')
    // #endregion

  }
}
