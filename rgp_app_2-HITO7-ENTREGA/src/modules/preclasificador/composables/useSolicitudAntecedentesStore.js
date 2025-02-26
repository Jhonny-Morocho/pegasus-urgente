import { computed } from 'vue'
import { useStore } from 'vuex'

// DISCLAIMER: A PESAR DE ESTAR EN PRECLASIFICADOR, SE UTILIZA EN H5 y H6
export const useSolicitudAntecedentesStore = () => {
  const { state, dispatch } = useStore()

  return {
    antecedentesEspecificos: computed(() => state.solicitudAntecedentes.antecedentesEspecificos),
    origenesAntecedentes: computed(() => state.solicitudAntecedentes.origenesAntecedentes),
    antecedentesSolicitados: computed(() => state.solicitudAntecedentes.antecedentesSolicitados),
    paginacionAntecedentesSolicitados: computed(() => state.solicitudAntecedentes.paginacionAntecedentesSolicitados),

    solicitudAntecedentes_getAntecedentesEspecificos: (_payload) =>
      dispatch('solicitudAntecedentes/solicitudAntecedentes_getAntecedentesEspecificos'),

    solicitudAntecedentes_getAntecedentesSolicitados: (payload) =>
      dispatch('solicitudAntecedentes/solicitudAntecedentes_getAntecedentesSolicitados', payload),

    solicitudAntecedentes_solicitarAntecedenteEspecifico: (payload) =>
      dispatch('solicitudAntecedentes/solicitudAntecedentes_solicitarAntecedenteEspecifico', payload)
  }
}
