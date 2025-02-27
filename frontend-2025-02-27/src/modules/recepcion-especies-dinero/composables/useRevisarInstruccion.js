import { useStore } from 'vuex'
import { computed } from 'vue'

export const useRevisarInstruccion = () => {
  const { state, dispatch } = useStore()

  return {
    dataSolicitud: computed(
      () => state.revisarInstruccion.dataSolicitud
    ),
    dataSalida: computed(
      () => state.revisarInstruccion.dataSalida
    ),
    dataActa: computed(
      () => state.revisarInstruccion.dataActa
    ),
    donacion: computed(
      () => state.revisarInstruccion.donacion
    ),
    dataSalidaTransferencia: computed(() => state.revisarInstruccion.dataSalidaTransferencia),
    peritajeSalida: computed(() => state.revisarInstruccion.peritajeSalida),
    // ACTIONS
    revisarInstruccion_getSolicitudSalida: (payload) =>
      dispatch(
        'revisarInstruccion/revisarInstruccion_getSolicitudSalida',
        payload
      ),
    revisarInstruccion_registrarInstruccion: (payload) => dispatch(
      'revisarInstruccion/revisarInstruccion_registrarInstruccion',
      payload
    ),
    revisarInstruccion_registrarInstruccionTransferencia: (payload) => dispatch('revisarInstruccion/revisarInstruccion_registrarInstruccionTransferencia', payload),
    revisarInstruccion_ingresarSolicitudSalidaperitaje: (payload) => dispatch('revisarInstruccion/revisarInstruccion_ingresarSolicitudSalidaperitaje', payload)
  }
}
