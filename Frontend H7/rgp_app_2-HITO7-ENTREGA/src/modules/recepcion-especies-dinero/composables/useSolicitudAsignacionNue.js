import { useStore } from 'vuex'
import { computed } from 'vue'

export const useSolicitudAsignacionNue = () => {
  const { state, dispatch } = useStore()

  return {
    imagenes: computed(() => state.imagenes),
    historialSolicitudNues: computed(() => state.solicitudAsignacionNue.historialSolicitudNues),
    paginacion: computed(() => state.paginacion),

    solicitudAsignacionNue_addSolicitudAsignacionNue: (payload) => dispatch('solicitudAsignacionNue/solicitudAsignacionNue_addSolicitudAsignacionNue', payload),
    solicitudAsignacionNue_getHistorialSolicitudNues: (payload) => dispatch('solicitudAsignacionNue/solicitudAsignacionNue_getHistorialSolicitudNues', payload),
    solicitudAsignacionNue_getDescargaZipNues: (payload) => dispatch('solicitudAsignacionNue/solicitudAsignacionNue_getDescargaZipNues', payload),
    solicitudAsignacionNue_getListadoSolicitudNuesQR: (payload) => dispatch('solicitudAsignacionNue/solicitudAsignacionNue_getListadoSolicitudNuesQR', payload)
  }
}
