import { computed, reactive } from 'vue'
import { useStore } from 'vuex'

export const useSolicitudesStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    pam: computed(() => state.solicitudes.pam),
    idDenuncia: computed(() => state.solicitudes.idDenuncia),
    ruc: computed(() => state.solicitudes.ruc),
    resumenCausa: computed(() => state.solicitudes.resumenCausa),
    idCausa: computed(() => state.solicitudes.idCausa),
    relacionesSeleccionadas: computed(() => state.solicitudes.relacionesSeleccionadas),
    sujetosSeleccionados: computed(() => state.solicitudes.sujetosSeleccionados),
    especiesSeleccionadas: computed(() => state.solicitudes.especiesSeleccionadas),
    dataSelector: computed(() => state.solicitudes.dataSelector),
    medidasCautelaresSolicitudes: computed(
      () => state.solicitudes.medidasCautelaresSolicitudes
    ),
    solicitudPJUD: computed(() => state.solicitudes.solicitudPJUD),
    isTelefonica: computed(() => state.solicitudes.isTelefonica),
    isCitacion: computed(() => state.solicitudes.isCitacion),

    solicitudes_getSolicitudById: (payload) =>
      dispatch('solicitudes/solicitudes_getSolicitudById', payload),
    solicitudes_enviarSolicitud: (payload) =>
      dispatch('solicitudes/solicitudes_enviarSolicitud', payload),
    solicitudes_iniciarYReservar: (payload) =>
      dispatch('solicitudes/solicitudes_iniciarYReservar', payload),
    solicitudes_completarTareaPam: (payload) =>
      dispatch('solicitudes/solicitudes_completarTareaPam', payload),
    solicitudes_getResumenCausa: (payload) =>
      dispatch('solicitudes/solicitudes_getResumenCausa', payload),

    // actions
    solicitudes_SET_DATA_SELECTOR_SOLICITUD: (payload) =>
      commit('solicitudes/solicitudes_SET_DATA_SELECTOR_SOLICITUD', payload),
    solicitudes_SET_RUC: (payload) =>
      commit('solicitudes/solicitudes_SET_RUC', payload),

    solicitudes_SET_ID_DENUNCIA: (payload) =>
      commit('solicitudes/solicitudes_SET_ID_DENUNCIA', payload),
    solicitudes_SET_ID_CAUSA: (payload) =>
      commit('solicitudes/solicitudes_SET_ID_CAUSA', payload),
    solicitudes_SET_DEFAULT_STATE: (payload) =>
      commit('solicitudes/solicitudes_SET_DEFAULT_STATE', payload),
    solicitudes_SET_RELACIONES_SELECCIONADAS: (payload) =>
      commit('solicitudes/solicitudes_SET_RELACIONES_SELECCIONADAS', payload),
    solicitudes_SET_SUJETOS_SELECCIONADOS: (payload) =>
      commit('solicitudes/solicitudes_SET_SUJETOS_SELECCIONADOS', payload),
    solicitudes_SET_ESPECIES_SELECCIONADAS: (payload) =>
      commit('solicitudes/solicitudes_SET_ESPECIES_SELECCIONADAS', payload),
    solicitudes_SET_IS_TELEFONICA: (payload) =>
      commit('solicitudes/solicitudes_SET_IS_TELEFONICA', payload),
    solicitudes_SET_IS_CITACION: (payload) =>
      commit('solicitudes/solicitudes_SET_IS_CITACION', payload),
    solicitudes_SET_SOLICITUD_PJUD: (payload) =>
      commit('solicitudes/solicitudes_SET_SOLICITUD_PJUD', payload),
    solicitudes_SET_RESUMEN_CAUSA: (payload) =>
      commit('solicitudes/solicitudes_SET_RESUMEN_CAUSA', payload),

    atributos: reactive({
      hasUrgente: computed(() => state.mantenedor.atributos?.find(atributo => atributo.codigoAtributo === '6')),
      hasReservada: computed(() => state.mantenedor.atributos?.find(atributo => atributo.codigoAtributo === '7')),
      hasDropdownDiligencias: computed(() => state.mantenedor.atributos?.find(atributo => atributo.codigoAtributo === '11')),
      hasSelectorSujeto: computed(() => state.mantenedor.atributos?.find(atributo => atributo.codigoAtributo === '14')),
      hasFecha: computed(() => state.mantenedor.atributos?.find(atributo => atributo.codigoAtributo === '16'))
    })
  }
}
