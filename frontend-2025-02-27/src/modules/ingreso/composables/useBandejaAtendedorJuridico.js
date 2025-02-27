import { useStore } from 'vuex'
import { computed } from 'vue'

export const useBandejaAtendedorJuridico = () => {
  const { dispatch, state } = useStore()

  return {
    // COMPUTED PROPERTIES
    denuncias: computed(() => state.bandejaAtendedorJuridico.denuncias),
    paginacion: computed(() => state.bandejaAtendedorJuridico.paginacion),
    // GETTERS

    // MUTATIONS
    bandejaAtendedorJuridico_get_nueva_atencion: () => dispatch('bandejaAtendedorJuridico/bandejaAtendedorJuridico_get_nueva_atencion'),
    // ACTIONS
    bandejaAtendedorJuridico_setPrioritario: (payload) => dispatch('bandejaAtendedorJuridico/bandejaAtendedorJuridico_setPrioritario', payload),
    bandejaAtendedorJuridico_getDenunciasByMultiple: (params) => dispatch('bandejaAtendedorJuridico/bandejaAtendedorJuridico_getDenunciasByMultiple', params)
  }
}
