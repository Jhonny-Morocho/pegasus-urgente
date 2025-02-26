import { useStore } from 'vuex'
import { computed } from 'vue'

export const useRegistroSalida = () => {
  const { state, dispatch } = useStore()

  return {
    datosRegistroSalidaTemporal: computed(
      () => state.registroSalida.datosRegistroSalidaTemporal
    ),
    dataActa: computed(() => state.registroSalida.dataActa),
    dataActaSalidaTemporal: computed(() => state.registroSalida.dataActaSalidaTemporal),
    dataEspecieSalidaTEmporal: computed(() => state.registroSalida.dataEspecieSalidaTEmporal),
    dataSalidaTransferenciaDinero: computed(() => state.registroSalida.dataSalidaTransferenciaDinero),
    dataSalidaTransferencia: computed(() => state.registroSalida.dataSalidaTransferencia),
    dataActaSalidaTransferencia: computed(() => state.registroSalida.dataActaSalidaTransferencia),
    dataRegistrarSalidaTransferenciaEspecie: computed(() => state.registroSalida.dataRegistrarSalidaTransferenciaEspecie),
    // ACTIONS
    registroSalida_getSolicitudSalida: (payload) =>
      dispatch(
        'registroSalida/registroSalida_getSolicitudSalida',
        payload
      ),
    registroSalida_comprobanteRegistrarSalidaTemporal: (payload) => dispatch(
      'registroSalida/registroSalida_comprobanteRegistrarSalidaTemporal',
      payload
    ),
    registroSalida_ingresarSolicitudSalidaperitaje: (payload) => dispatch('registroSalida/registroSalida_ingresarSolicitudSalidaperitaje', payload),
    registroSalida_ingresarSolicitudSalida: (payload) => dispatch('registroSalida/registroSalida_ingresarSolicitudSalida', payload),
    registroSalida_registroSalidaTemporal: (payload) => dispatch('registroalida/registroSalida_registroSalidaTemporal', payload),
    registroSalida_registrarComprobanteTransferencia: (payload) => dispatch('registroSalida/registroSalida_registrarComprobanteTransferencia', payload),
    registroSalida_generarActaSalida: (payload) => dispatch('registroSalida/registroSalida_generarActaSalida', payload),
    registroSalida_getEspeciesSalidaTemporal: (payload) => dispatch('registroSalida/registroSalida_getEspeciesSalidaTemporal', payload),
    registroSalida_ingresarSolicitudSalidaTransferencia: (payload) => dispatch('registroSalida/registroSalida_ingresarSolicitudSalidaTransferencia', payload),
    registroSalida_ingresarSolicitudSalidaTransferenciaDinero: (payload) => dispatch('registroSalida/registroSalida_ingresarSolicitudSalidaTransferenciaDinero', payload),
    registroSalida_registrarSalidaPorTransferenciaEspecie: (payload) => dispatch('registroSalida/registroSalida_registrarSalidaPorTransferenciaEspecie', payload),
    registroSalida_generarActaSalidaTransferencia: (payload) => dispatch('registroSalida/registroSalida_generarActaSalidaTransferencia', payload),
    registroSalida_registroSalidaTransferencia: (payload) => dispatch('registroSalida/registroSalida_registroSalidaTransferencia', payload)
  }
}
