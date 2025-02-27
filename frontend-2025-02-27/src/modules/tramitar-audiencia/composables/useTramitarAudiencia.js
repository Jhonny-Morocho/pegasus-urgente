import { computed } from 'vue'
import { useStore } from 'vuex'

export const useTramitarAudiencia = () => {
  const { dispatch, state, commit } = useStore()

  return {
    resumenCausa: computed(() => state.tramitarAudiencia.causa),
    ruc: computed(() => state.tramitarAudiencia.ruc),
    idDenuncia: computed(() => state.tramitarAudiencia.idDenuncia),
    relacionesSeleccionadas: computed(() => state.tramitarAudiencia.relacionesSeleccionadas),
    especiesSeleccionadas: computed(() => state.tramitarAudiencia.especiesSeleccionadas),
    documentosSeleccionados: computed(() => state.tramitarAudiencia.documentosSeleccionados),
    medidasCautelares: computed(() => state.tramitarAudiencia.medidasCautelares),
    audiosMarcados: computed(() => state.tramitarAudiencia.audiosMarcados),
    nomina: computed(() => state.tramitarAudiencia.nomina),
    minuta: computed(() => state.tramitarAudiencia.minuta),
    historialCausa: computed(() => state.tramitarAudiencia.historialCausa),

    /* ACTIONS */
    tramitarAudiencia_getAntecedentesCausa: () => dispatch('tramitarAudiencia/tramitarAudiencia_getAntecedentesCausa'),

    tramitarAudiencia_getAntecedentesAudiencia: () => dispatch('tramitarAudiencia/tramitarAudiencia_getAntecedentesAudiencia'),

    tramitarAudiencia_postSolicitudAudiencia: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_postSolicitudAudiencia', payload),

    tramitarAudiencia_respuestaPrevioResolver: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_respuestaPrevioResolver', payload),

    /* Minuta */

    tramitarAudiencia_getMinuta: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_getMinuta', payload),

    tramitarAudiencia_postMinuta: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_postMinuta', payload),

    /* Nómina Detenidos ACD */

    tramitarAudiencia_addNuevoDetenidoACD: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_addNuevoDetenidoACD', payload),

    tramitarAudiencia_apercibirDetenidoACD: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_apercibirDetenidoACD', payload),

    tramitarAudiencia_postNominaACD: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_postNominaACD', payload),

    tramitarAudiencia_getNominaDetenidos: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_getNominaDetenidos', payload),

    /***************************************/

    tramitarAudiencia_getHistorialCausa: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_getHistorialCausa', payload),

    tramitarAudiencia_getDiligencias: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_getHistorialCausa', payload),

    tramitarAudiencia_postRegistroAudiencia: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_postRegistroAudiencia', payload),

    tramitarAudiencia_updateActualizarMinuta: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_updateActualizarMinuta', payload),

    tramitarAudiencia_getAudiosAudiencia: (payload) => dispatch('tramitarAudiencia/tramitarAudiencia_getAudiosAudiencia', payload),

    tramitarAudiencia_getResultadosAudiencia: () => dispatch('tramitarAudiencia/tramitarAudiencia_getResultadosAudiencia'),

    mantenedor_getListaMedidasCautelares: () => dispatch('tramitarAudiencia/mantenedor_getListaMedidasCautelares'),

    mantenedor_getListaTiposAudiencia: () => dispatch('tramitarAudiencia/mantenedor_getListaTiposAudiencia'),

    mantenedor_getListaOtrosTiposAudiencia: () => dispatch('tramitarAudiencia/mantenedor_getListaOtrosTiposAudiencia'),

    /* MUTATIONS */
    tramitarAudiencia_SET_RUC: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_RUC', payload),
    tramitarAudiencia_SET_CAUSA: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_CAUSA', payload),
    tramitarAudiencia_SET_ID_DENUNCIA: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_ID_DENUNCIA', payload),
    tramitarAudiencia_SET_MEDIDAS_CAUTELARES: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_MEDIDAS_CAUTELARES', payload),
    tramitarAudiencia_DELETE_MEDIDA_CAUTELAR: (payload) => commit('tramitarAudiencia/tramitarAudiencia_DELETE_MEDIDA_CAUTELAR', payload),
    tramitarAudiencia_SET_RELACIONES: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_RELACIONES', payload),
    tramitarAudiencia_RESET_MEDIDAS_CAUTELARES: () => commit('tramitarAudiencia/tramitarAudiencia_RESET_MEDIDAS_CAUTELARES'),
    tramitarAudiencia_SET_ESPECIES: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_ESPECIES', payload),
    tramitarAudiencia_SET_DOCS: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_DOCS', payload),
    tramitarAudiencia_SET_AUDIOS_MARCADOS: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_AUDIOS_MARCADOS', payload),
    tramitarAudiencia_ADD_MARCADOR: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_MARCADOR', payload),
    tramitarAudiencia_SET_NOMINA: (payload) => commit('tramitarAudiencia/tramitarAudiencia_SET_NOMINA', payload)
  }
}
