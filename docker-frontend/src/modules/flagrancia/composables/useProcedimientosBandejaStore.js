import { computed } from 'vue'
import { useStore } from 'vuex'

export const useProcedimientosBandejaStore = () => {
  const { state, dispatch, commit } = useStore()

  return {
    nextStep: computed(() => state.procedimientosBandeja.nextStep),
    procedimientos: computed(() => state.procedimientosBandeja.procedimientos),
    nuevosProcedimientos: computed(() => state.procedimientosBandeja.nuevosProcedimientos),
    folioProcedimientoData: computed(() => state.procedimientosBandeja.folioProcedimientoData),
    tieneFolio: computed(() => state.procedimientosBandeja.tieneFolio),
    paginacion: computed(() => state.procedimientosBandeja.paginacion),
    esDenunciaDirectaFlagrante: computed(() => state.procedimientosBandeja.esDenunciaDirectaFlagrante),
    estadoFolio: computed(() => state.procedimientosBandeja.estadoFolio),
    loader: computed(() => state.procedimientosBandeja.loader),
    esNuevaAtencionFiscal: computed(() => state.procedimientosBandeja.esNuevaAtencionFiscal),

    procedimientosBandeja_getProcedimientos: (payload) => dispatch(`procedimientosBandeja/procedimientosBandeja_getProcedimientos`, payload),

    procedimientosBandeja_getProcedimiento: ({ idDenuncia }) => dispatch(`procedimientosBandeja/procedimientosBandeja_getProcedimiento`, { idDenuncia }),

    procedimientosBandeja_postCerrarFolio: (folio) => dispatch(`procedimientosBandeja/procedimientosBandeja_postCerrarFolio`, folio),

    procedimientosBandeja_postReAbrirFolio: (folio) => dispatch(`procedimientosBandeja/procedimientosBandeja_postReAbrirFolio`, folio),

    procedimientosBandeja_postSolicitudReAbrirFolio: (folio) => dispatch(`procedimientosBandeja/procedimientosBandeja_postSolicitudReAbrirFolio`, folio),

    procedimientosBandeja_postResponderSolicitudReAbrirFolio: (folio) => dispatch(`procedimientosBandeja/procedimientosBandeja_postResponderSolicitudReAbrirFolio`, folio),

    procedimientosBandeja_crearFolio: (idRegistroContacto) => dispatch(`procedimientosBandeja/procedimientosBandeja_crearFolio`, idRegistroContacto),

    procedimientosBandeja_SET_FOLIO_PROCEDIMIENTO_DATA: (dataFolio) => commit(`procedimientosBandeja/procedimientosBandeja_SET_FOLIO_PROCEDIMIENTO_DATA`, dataFolio),

    procedimientosBandeja_RESET_FOLIO_PROCEDIMIENTO_DATA: () => commit(`procedimientosBandeja/procedimientosBandeja_RESET_FOLIO_PROCEDIMIENTO_DATA`),

    procedimientosBandeja_SET_TIENE_FOLIO: (boolean) => commit(`procedimientosBandeja/procedimientosBandeja_SET_TIENE_FOLIO`, boolean),

    procedimientosBandeja_SET_LOADER: (boolean) => commit(`procedimientosBandeja/procedimientosBandeja_SET_LOADER`, boolean),

    procedimientosBandeja_SET_ESFLAGRANTE: (boolean) => commit(`procedimientosBandeja/procedimientosBandeja_SET_ESFLAGRANTE`, boolean),

    procedimientosBandeja_NEXT_STEP: (boolean) => commit(`procedimientosBandeja/procedimientosBandeja_NEXT_STEP`, boolean),

    procedimientosBandeja_SET_ESTADO_FOLIO: (estado) => commit(`procedimientosBandeja/procedimientosBandeja_SET_ESTADO_FOLIO`, estado),

    procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL: (boolean) => commit(`procedimientosBandeja/procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL`, boolean),

    procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL_SET_DEFAULT_STATE: () => commit(`procedimientosBandeja/procedimientosBandeja_ES_NUEVA_ATENCION_FISCAL_SET_DEFAULT_STATE`),

    procedimientosBandeja_ESFLAGRANTE_SET_DEFAULT_STATE: () => commit(`procedimientosBandeja/procedimientosBandeja_ESFLAGRANTE_SET_DEFAULT_STATE`)
  }
}
