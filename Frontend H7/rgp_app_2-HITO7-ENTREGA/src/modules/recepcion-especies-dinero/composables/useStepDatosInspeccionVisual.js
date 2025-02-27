import { useStore } from 'vuex'
import { computed } from 'vue'

export const useStepDatosInspeccionVisual = () => {
  const { state, dispatch } = useStore()

  return {
    datosInspeccion: computed(
      () => state.stepDatosInspeccionVisual.datosInspeccion
    ),
    especiesDinero: computed(
      () => state.stepDatosInspeccionVisual.especiesDinero
    ),
    dataCausa: computed(() => state.stepDatosInspeccionVisual.dataCausa),
    personasAsisten: computed(
      () => state.stepDatosInspeccionVisual.personasAsisten
    ),
    // ACTIONS
    stepDatosInspeccionVisual_registrarInspeccionVisualRealizada: (payload) =>
      dispatch(
        'stepDatosInspeccionVisual/stepDatosInspeccionVisual_registrarInspeccionVisualRealizada',
        payload
      )
  }
}
