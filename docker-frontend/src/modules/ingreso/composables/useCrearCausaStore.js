import { computed } from 'vue'
import { useStore } from 'vuex'

export const useCrearCausaStore = () => {
  const { dispatch, state, commit } = useStore()

  return {
    causa: computed(() => state.crearCausa.causa),
    idDenuncia: computed(() => state.crearCausa.idDenuncia),
    causasCreadas: computed(() => state.crearCausa.causasCreadas),
    datosCompletosCausa: computed(() => state.crearCausa.datosCompletosCausa),
    identificadorUnicoDenuncia: computed(() => state.crearCausa.identificadorUnicoDenuncia),
    ruc: computed(() => state.crearCausa.ruc),
    processInstanceId: computed(() => state.crearCausa.processInstanceId),
    idCausa: computed(() => state.crearCausa.idCausa),
    tipoDenuncia: computed(() => state.crearCausa.tipoDenuncia),
    dataDenuncia: computed(() => state.crearCausa.dataDenuncia),
    esDenunciaElectronica: computed(() => state.crearCausa.esDenunciaElectronica),

    /* MUTATIONS */
    crearCausa_SET_DATOS_COMPLETOS: (data) =>
      commit('crearCausa/crearCausa_SET_DATOS_COMPLETOS', data),
    crearCausa_SET_TIPO_DENUNCIA: (payload) =>
      commit('crearCausa/crearCausa_SET_TIPO_DENUNCIA', payload),
    crearCausa_SET_CAUSA_SELECCIONADA: (payload) =>
      commit('crearCausa/crearCausa_SET_CAUSA_SELECCIONADA', payload),
    crearCausa_ES_DENUNCIA_ELECTRONICA: (payload) =>
      commit('crearCausa/crearCausa_ES_DENUNCIA_ELECTRONICA', payload),

    crearCausa_SET_ID_DENUNCIA: (payload) =>
      commit('crearCausa/crearCausa_SET_ID_DENUNCIA', payload),
    crearCausa_SET_RUC: (payload) =>
      commit('crearCausa/crearCausa_SET_RUC', payload),
    crearCausa_RESET_RUC: () =>
      commit('crearCausa/crearCausa_RESET_RUC'),
    crearCausa_SET_DEFAULT_STATE: () => commit('crearCausa/crearCausa_SET_DEFAULT_STATE'),
    crearCausa_SET_DEFAULT_CAUSA: () => commit('crearCausa/crearCausa_SET_DEFAULT_CAUSA'),

    /* ACTIONS */
    crearCausa_getCausa: (payload) => dispatch('crearCausa/crearCausa_getCausa', payload),

    crearCausa_crearCausa: (data) => dispatch('crearCausa/crearCausa_crearCausa', data),

    crearCausa_iniciarYReservarCausa: (payload) => dispatch('crearCausa/crearCausa_iniciarYReservarCausa', payload),

    crearCausa_completarTareaCausa: (payload) => dispatch('crearCausa/crearCausa_completarTareaCausa', payload),

    crearCausa_crearCausaOficio_Fisica: (payload) => dispatch('crearCausa/crearCausa_crearCausaOficio_Fisica', payload)
  }
}
