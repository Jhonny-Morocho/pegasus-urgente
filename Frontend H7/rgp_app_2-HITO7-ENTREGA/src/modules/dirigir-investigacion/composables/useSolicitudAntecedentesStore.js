import { computed } from 'vue'
import { useStore } from 'vuex'

// DISCLAIMER: A PESAR DE ESTAR EN PRECLASIFICADOR, SE UTILIZA EN H5 y H6
export const useSolicitudAntecedentesStore = () => {
  const { state, dispatch } = useStore()

  return {
    antecedentesEspecificos: computed(() => state.solicitudAntecedentesH6.antecedentesEspecificos),
    origenesAntecedentes: computed(() => state.solicitudAntecedentesH6.origenesAntecedentes),
    antecedentesSolicitados: computed(() => state.solicitudAntecedentesH6.antecedentesSolicitados),
    paginacionAntecedentesSolicitados: computed(() => state.solicitudAntecedentesH6.paginacionAntecedentesSolicitados),

    solicitudAntecedentes_getAntecedentesEspecificos: (payload) =>
      dispatch('solicitudAntecedentesH6/solicitudAntecedentes_getAntecedentesEspecificos', payload),

    solicitudAntecedentes_getAntecedentesSolicitados: (payload) =>
      dispatch('solicitudAntecedentesH6/solicitudAntecedentes_getAntecedentesSolicitados', payload),

    solicitudAntecedentes_solicitarAntecedenteEspecifico: (payload) =>
      dispatch('solicitudAntecedentesH6/solicitudAntecedentes_solicitarAntecedenteEspecifico', payload)
  }
}
