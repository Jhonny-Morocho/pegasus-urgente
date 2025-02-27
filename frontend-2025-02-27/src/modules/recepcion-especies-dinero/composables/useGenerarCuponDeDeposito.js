import { useStore } from 'vuex'
import { computed } from 'vue'

export const useGenerarCuponDeDeposito = () => {
  const { state, dispatch } = useStore()

  return {
    listaDineros: computed(() => state.generarCuponDeDeposito.listaDinerosCandidatosDeposito),
    dinerosCustodia: computed(() => state.generarCuponDeDeposito.dinerosCustodia),
    dataCodigoBarra: computed(() => state.generarCuponDeDeposito.dataCodigoBarra),
    generarCuponDeDeposito_getListaDineros: (payload) => dispatch('generarCuponDeDeposito/generarCuponDeDeposito_getListaDineros', payload),
    generarCuponDeDeposito_addgenerarCupon: (payload) => dispatch('generarCuponDeDeposito/generarCuponDeDeposito_addgenerarCupon', payload),
    generarCuponDeDeposito_getDinerosCustodia: (payload) => dispatch('generarCuponDeDeposito/generarCuponDeDeposito_getDinerosCustodia', payload),
    generarCuponDeDeposito_getDinerosCustodiaParaGenerarCupon: (payload) => dispatch('generarCuponDeDeposito/generarCuponDeDeposito_getDinerosCustodiaParaGenerarCupon', payload),
    generarCuponDeDeposito_generarCodigoDeBarra: (payload) => dispatch('generarCuponDeDeposito/generarCuponDeDeposito_generarCodigoDeBarra', payload),
    generarCuponDeDeposito_guardarCuponYSalir: (payload) => dispatch('generarCuponDeDeposito/generarCuponDeDeposito_guardarCuponYSalir', payload)
  }
}
