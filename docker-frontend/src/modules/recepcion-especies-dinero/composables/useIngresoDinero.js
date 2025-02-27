import { useStore } from 'vuex'
import { computed } from 'vue'

export const useIngresoDinero = () => {
  const { state, dispatch } = useStore()

  return {
    // STATES
    especiesIncautadas: computed(() => state.stepIngresoDinero.especiesIncautadas),
    dataFijacionFotografica: computed(() => state.stepIngresoDinero.dataFijacionFotografica),
    datosEspecie: computed(() => state.stepIngresoDinero.datosEspecie),
    datosEtiquetaQr: computed(() => state.stepIngresoDinero.datosEtiquetaQr),
    rues: computed(() => state.stepIngresoDinero.rues),
    dataInstruccion: computed(() => state.stepIngresoDinero.dataInstruccion),
    dataInspeccionVisual: computed(() => state.stepIngresoDinero.dataInspeccionVisual),
    dataFijacionFotograficaCustodia: computed(() => state.stepIngresoDinero.dataFijacionFotograficaCustodia),
    // ACTIONS
    stepIngresoDinero_getRucEspecieSeleccionada: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getRucEspecieSeleccionada', payload),
    stepIngresoDinero_getEspeciesDinerosNoIngresados: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getEspeciesDinerosNoIngresados', payload),
    stepIngresoDinero_ingresarEspeciesDineros: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_ingresarEspeciesDineros', payload),
    stepIngresoDinero_actualizarEspeciesDineros: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_actualizarEspeciesDineros', payload),
    stepIngresoDinero_agregarDetallesDinero: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_agregarDetallesDinero', payload),
    stepIngresoDinero_pronunciamientoAutomatico: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_pronunciamientoAutomatico', payload),
    stepIngresoDinero_enviarPronunciamiento: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_enviarPronunciamiento', payload),
    stepIngresoDinero_realizarFijacionFotografica: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_realizarFijacionFotografica', payload),
    stepIngresoDinero_darUbicacion: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_darUbicacion', payload),
    stepIngresoDinero_actualizarCasillero: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_actualizarCasillero', payload),
    stepIngresoDinero_getUbicacionByRuc: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getUbicacionByRuc', payload),
    stepIngresoDinero_getGenerarEtiqueta: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getGenerarEtiqueta', payload),
    stepIngresoDinero_getGenerarDataQr: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getGenerarDataQr', payload),
    stepIngresoDinero_denominacionDeDineros: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_denominacionDeDineros', payload),
    stepIngresoDinero_getBodegasByIdFiscalia: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getBodegasByIdFiscalia', payload),
    stepIngresoDinero_getSectoresByIdBodega: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getSectoresByIdBodega', payload),
    stepIngresoDinero_getCasillerosByIdSector: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getCasillerosByIdSector', payload),
    stepIngresoDinero_getRuesByIdCasillero: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getRuesByIdCasillero', payload),
    stepIngresoDinero_crearTareaSalidaTemporal: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_crearTareaSalidaTemporal', payload),
    stepIngresoDinero_crearTareaCustodiaInspeccion: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_crearTareaCustodiaInspeccion', payload),
    stepIngresoDinero_getDataCustodiaInspeccion: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getDataCustodiaInspeccion', payload),
    stepIngresoDinero_getDataRevisarInstruccion: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getDataRevisarInstruccion', payload),
    stepIngresoDinero_getBodegaDinero: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_getBodegaDinero', payload),
    // MUTATIONS
    stepIngresoDinero_GET_DATA: (payload) => dispatch('stepIngresoDinero/stepIngresoDinero_GET_DATA', payload)
  }
}
