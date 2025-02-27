import { computed } from 'vue'
import { useStore } from 'vuex'

export const useSujetosIntervinientesStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    tablaSentencias: computed(() => state.sujetosIntervinientes.tablaSentencias),
    ordenesDetencionVigentes: computed(() => state.sujetosIntervinientes.ordenesDetencionVigentes),
    tablaFormalizacion: computed(() => state.sujetosIntervinientes.tablaFormalizacion),
    tablaCausasAsociadas: computed(() => state.sujetosIntervinientes.tablaCausasAsociadas),
    tablaOrdenesDetencion: computed(() => state.sujetosIntervinientes.tablaOrdenesDetencion),
    sujetosIntervinientes: computed(() => state.sujetosIntervinientes.sujetos),
    paginacion: computed(() => state.sujetosIntervinientes.paginacion),
    tablaMedidasCautelares: computed(() => state.sujetosIntervinientes.tablaMedidasCautelares),
    tiposDocumento: computed(() => state.sujetosIntervinientes.tablaMedidasCautelares),
    flags: computed(() => state.sujetosIntervinientes.flags),
    medidasProteccionPersona: computed(() => state.sujetosIntervinientes.medidasProteccionPersona),

    sujetosIntervinientes_SET_SUJETOS: (sujetos) => {
      commit('sujetosIntervinientes/sujetosIntervinientes_SET_SUJETOS', sujetos)
    },

    sujetosIntervinientes_SET_DEFAULT_STATE: () => {
      commit('sujetosIntervinientes/sujetosIntervinientes_SET_DEFAULT_STATE')
    },

    // ACTIONS
    sujetosIntervinientes_addSujeto: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_addSujeto', payload),
    sujetosIntervinientes_updateSujeto: (sujeto) => dispatch('sujetosIntervinientes/sujetosIntervinientes_updateSujeto', sujeto),
    sujetosIntervinientes_deleteSujeto: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_deleteSujeto', payload),
    sujetosIntervinientes_addDireccion: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_addDireccion', payload),
    sujetosIntervinientes_deleteDireccion: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_deleteDireccion', payload),
    sujetosIntervinientes_getDatosHistoricos: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_getDatosHistoricos', payload),
    sujetosInvervinientes_getInformacionSrcel: (payload) => dispatch('sujetosIntervinientes/sujetosInvervinientes_getInformacionSrcel', payload),
    sujetosIntervinientes_getInformacionDelictual: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_getInformacionDelictual', payload),
    sujetosInvervinientes_getPoseeOrdenesDetencion: (payload) => dispatch('sujetosIntervinientes/sujetosInvervinientes_getPoseeOrdenesDetencion', payload),
    sujetosIntervinientes_getSujetosByIdGlobal: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_getSujetosByIdGlobal', payload),
    sujetosIntervinientes_getSujetosByIdRelacionSujeto: (payload) => dispatch('sujetosIntervinientes/sujetosIntervinientes_getSujetosByIdRelacionSujeto', payload),
    // #region Medidas Proteccion Persona
    sujetosIntervinientes_getMedidasProteccionPersonaById: (payload) =>
      dispatch('sujetosIntervinientes/sujetosIntervinientes_getMedidasProteccionPersonaById', payload),
    sujetosIntervinientes_postAgregarMedidaProteccion: (payload) =>
      dispatch('sujetosIntervinientes/sujetosIntervinientes_postAgregarMedidaProteccion', payload),
    sujetosIntervinientes_deleteMediaProteccionById: (payload) =>
      dispatch('sujetosIntervinientes/sujetosIntervinientes_deleteMediaProteccionById', payload),
    // #endregion

    sujetosIntervinientes_getManySujetosByIdDenuncia: (payload) =>
      dispatch('sujetosIntervinientes/sujetosIntervinientes_getManySujetosByIdDenuncia', payload)
  }
}
