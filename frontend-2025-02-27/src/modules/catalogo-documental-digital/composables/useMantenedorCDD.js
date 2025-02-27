import { computed } from 'vue'
import { useStore } from 'vuex'

export const useMantenedorCDD = () => {
  const { state, commit, dispatch } = useStore()

  return {
    ruc: computed(() => state.mantenedorCDD.ruc),
    tipoCatalogo: computed(() => state.mantenedorCDD.tipoCatalogo),
    nivelAcceso: computed(() => state.mantenedorCDD.nivelAcceso),
    disponibilidad: computed(() => state.mantenedorCDD.disponibilidad),
    formatoRecepcion: computed(() => state.mantenedorCDD.formatoRecepcion),
    claseDocumental: computed(() => state.mantenedorCDD.claseDocumental),
    procedencia: computed(() => state.mantenedorCDD.procedencia),
    nivelFirma: computed(() => state.mantenedorCDD.nivelFirma),
    idiomas: computed(() => state.mantenedorCDD.idiomas),
    ubicacionEdificios: computed(() => state.mantenedorCDD.ubicacionEdificios),
    ubicacionBodegas: computed(() => state.mantenedorCDD.ubicacionBodegas),
    ubicacionEstantes: computed(() => state.mantenedorCDD.ubicacionEstantes),
    ubicacionCasilleros: computed(
      () => state.mantenedorCDD.ubicacionCasilleros
    ),
    ubicacionPasillos: computed(() => state.mantenedorCDD.ubicacionPasillos),
    salidas: computed(() => state.mantenedorCDD.salidas),
    motivosEliminacion: computed(() => state.mantenedorCDD.motivosEliminacion),
    funcionarios: computed(() => state.mantenedorCDD.funcionarios),
    estadoDocumento: computed(() => state.mantenedorCDD.estadoDocumento),
    destinosDocumentosFisicos: computed(
      () => state.mantenedorCDD.destinosDocumentosFisicos
    ),
    causas: computed(() => state.mantenedorCDD.causas),

    // Listado de busqueda avanzada

    mantenedorCDD_getTipoCatalogo: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getTipoCatalogo', payload),
    mantenedorCDD_getNivelAcceso: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getNivelAcceso', payload),
    mantenedorCDD_getDisponibilidad: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getDisponibilidad', payload),
    mantenedorCDD_getFormatoRecepcion: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getFormatoRecepcion', payload),
    mantenedorCDD_getClaseDocumental: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getClaseDocumental', payload),
    mantenedorCDD_getProcedencia: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getProcedencia', payload),
    mantenedorCDD_getNivelFirma: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getNivelFirma', payload),
    mantenedorCDD_getIdiomas: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getIdiomas', payload),
    mantenedorCDD_searchCausas: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_searchCausas', payload),
    mantenedorCDD_getTiposSalidas: () =>
      dispatch('mantenedorCDD/mantenedorCDD_getTiposSalidas'),
    mantenedorCDD_getUbicacionEdificios: () =>
      dispatch('mantenedorCDD/mantenedorCDD_getUbicacionEdificios'),
    mantenedorCDD_getUbicacionBodegas: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getUbicacionBodegas', payload),
    mantenedorCDD_getUbicacionPasillos: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getUbicacionPasillos', payload),
    mantenedorCDD_getUbicacionEstantes: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getUbicacionEstantes', payload),
    mantenedorCDD_getUbicacionCasilleros: (payload) =>
      dispatch('mantenedorCDD/mantenedorCDD_getUbicacionCasilleros', payload),
    mantenedorCDD_getMotivosEliminacion: () =>
      dispatch('mantenedorCDD/mantenedorCDD_getMotivosEliminacion'),
    mantenedorCDD_getFuncionarios: () =>
      dispatch('mantenedorCDD/mantenedorCDD_getFuncionarios'),
    mantenedorCDD_getEstadoDocumento: () =>
      dispatch('mantenedorCDD/mantenedorCDD_getEstadoDocumento'),
    mantenedorCDD_getdestinosDocumentoFisco: () =>
      dispatch('mantenedorCDD/mantenedorCDD_getdestinosDocumentoFisco'),

    mantenedorCDD_SET_CAUSAS_DEFAULT_STATE: () =>
      commit('mantenedorCDD/mantenedorCDD_SET_CAUSAS_DEFAULT_STATE')
  }
}
