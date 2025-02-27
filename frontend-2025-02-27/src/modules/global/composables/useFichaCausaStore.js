import { computed } from 'vue'
import { useStore } from 'vuex'

export const useFichaCausaStore = () => {
  const { state, dispatch, getters, commit } = useStore()

  return {
    // COMPUTED VALUES
    causaSeleccionada: computed(() => state.fichaCausa.causaSeleccionada),
    dataDenuncia: computed(() => state.fichaCausa.dataDenuncia),
    ruc: computed(() => state.fichaCausa.ruc),
    idDenuncia: computed(() => state.fichaCausa.idDenuncia),
    idCausa: computed(() => state.fichaCausa.processInstanceId),
    processInstanceId: computed(() => state.fichaCausa.processInstanceId),
    paginacion: computed(() => state.fichaCausa.paginacion),

    antecedentesEspecificos: computed(() => state.fichaCausa.antecedentesEspecificos),
    antecedentesSolicitados: computed(() => state.fichaCausa.antecedentesSolicitados),
    relaciones: computed(() => state.fichaCausa.relaciones),
    dataSujetoSeleccionado: computed(() => state.fichaCausa.dataSujetoSeleccionado),

    // GETTERS
    fichaCausa_getNombreAntecedentes: (idAntecedente) => getters['fichaCausa/fichaCausa_getNombreAntecedentes'](idAntecedente),

    fichaCausa_getNombreOrigenAntecedentes: (idOrigen) => getters['fichaCausa/fichaCausa_getNombreOrigenAntecedentes'](idOrigen),

    // ACTIONS
    fichaCausa_setCausa: (ruc) => dispatch('fichaCausa/fichaCausa_setCausa', ruc),
    fichaCausa_getAntecedentesEspecificos: () => dispatch('fichaCausa/fichaCausa_getAntecedentesEspecificos'),
    fichaCausa_postSolicitarAntecedentes: (payload) => dispatch('fichaCausa/fichaCausa_postSolicitarAntecedentes', payload),
    fichaCausa_getAntecedentesSolicitados: (payload) => dispatch('fichaCausa/fichaCausa_getAntecedentesSolicitados', payload),
    fichaCausa_recomendacionPreclasificador: (payload) => dispatch('fichaCausa/fichaCausa_recomendacionPreclasificador', payload),
    fichaCausa_getCausa: (payload) => dispatch('fichaCausa/fichaCausa_getCausa', payload),
    fichaCausa_obtenerCausaPorRUC: (payload) => dispatch('fichaCausa/fichaCausa_obtenerCausaPorRUC', payload),
    // MUTATIONS
    fichaCausa_SET_ANTECEDENTES_SOLICITADOS: (antecedente) => commit('fichaCausa/fichaCausa_SET_ANTECEDENTES_SOLICITADOS', antecedente),
    fichaCausa_SET_SUJETO_SELECCIONADO: (dataSujeto) => commit('fichaCausa/fichaCausa_SET_SUJETO_SELECCIONADO', dataSujeto),
    fichaCausa_SET_CAUSA: (payload) =>
      commit('fichaCausa/fichaCausa_SET_CAUSA', payload),
    fichaCausa_SET_DEFAULT_STATE: () => commit('fichaCausa/fichaCausa_SET_DEFAULT_STATE')

  }
}
