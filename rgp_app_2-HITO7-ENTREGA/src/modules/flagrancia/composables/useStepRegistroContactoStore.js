import { computed } from 'vue'
import { useStore } from 'vuex'

export const useStepRegistroContactoStore = () => {
  const { state, commit, dispatch, getters } = useStore()

  return {
    // STATE
    folio: computed(() => state.stepRegistroContacto.folio),
    unidadPolicialId: computed(() => state.stepRegistroContacto.unidadPolicialId),
    funcionarios: computed(() => state.stepRegistroContacto.funcionarios),
    registroContacto: computed(
      () => state.stepRegistroContacto.registroContacto
    ),
    registroContactoBandeja: computed(() => state.stepRegistroContacto.registroContactoBandeja),
    isEditando: computed(() => state.stepRegistroContacto.isEditando),

    // GETTERS
    stepRegistroContacto_getIdRegistroContacto: () =>
      getters[
        'stepRegistroContacto/stepRegistroContacto_getIdRegistroContacto'
      ],

    // ACTIONS
    stepRegistroContacto_setRegistroContacto: (payload) =>
      dispatch(
        'stepRegistroContacto/stepRegistroContacto_setRegistroContacto',
        payload
      ),
    stepRegistroContacto_updateRegistroContacto: (payload) =>
      dispatch(
        'stepRegistroContacto/stepRegistroContacto_updateRegistroContacto',
        payload
      ),
    stepRegistroContacto_getRegistroContacto: (payload) =>
      dispatch(
        'stepRegistroContacto/stepRegistroContacto_getRegistroContacto',
        payload
      ),

    // MUTATIONS
    stepRegistroContacto_SET_FOLIO: (folio) =>
      commit(
        'stepRegistroContacto/stepRegistroContacto_SET_FOLIO',
        folio
      ),
    stepRegistroContacto_SET_UNIDAD_POLICIAL: (folio) =>
      commit(
        'stepRegistroContacto/stepRegistroContacto_SET_UNIDAD_POLICIAL',
        folio
      ),
    stepRegistroContacto_SET_REGISTRO_CONTACTO: (registroContacto) =>
      commit(
        'stepRegistroContacto/stepRegistroContacto_SET_REGISTRO_CONTACTO',
        registroContacto
      ),
    stepRegistroContacto_SET_REGISTRO_CONTACTO_BANDEJA: (registroContacto) =>
      commit(
        'stepRegistroContacto/stepRegistroContacto_SET_REGISTRO_CONTACTO_BANDEJA',
        registroContacto
      ),
    stepRegistroContacto_SET_DEFAULT_STATE: () => commit('stepRegistroContacto/stepRegistroContacto_SET_DEFAULT_STATE'),
    stepRegistroContacto_SET_MODO_EDICION: (boolean) => commit('stepRegistroContacto/stepRegistroContacto_SET_MODO_EDICION', boolean),
    stepRegistroContacto_SET_DEFAULT_MODO_EDICION: () => commit('stepRegistroContacto/stepRegistroContacto_SET_DEFAULT_MODO_EDICION')
  }
}
