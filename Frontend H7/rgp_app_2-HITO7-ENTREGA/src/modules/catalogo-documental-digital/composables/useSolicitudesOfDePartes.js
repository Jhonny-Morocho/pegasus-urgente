import { computed } from 'vue'
import { useStore } from 'vuex'

export const useSolicitudesOfDePartesCdd = () => {
  const { state, dispatch, commit } = useStore()

  return {
    tareasBandeja: computed(() => state.solicitudesOfDePartes.tareasBandeja),
    paginacionBandeja: computed(
      () => state.solicitudesOfDePartes.paginacionBandeja
    ),
    antecedentesCatalogo: computed(
      () => state.solicitudesOfDePartes.antecedentesCatalogo
    ),
    antecedentesDocumento: computed(
      () => state.solicitudesOfDePartes.antecedentesDocumento
    ),
    taskId: computed(() => state.solicitudesOfDePartes.taskId),

    solicitudesOfPartesCdd_getDataBandeja: (payload) =>
      dispatch(
        'solicitudesOfDePartes/solicitudesOfPartesCdd_getDataBandeja',
        payload
      ),

    solicitudesOfPartesCdd_getDataSolicitudIngresoDocumento: (payload) =>
      dispatch(
        'solicitudesOfDePartes/solicitudesOfPartesCdd_getDataSolicitudIngresoDocumento',
        payload
      ),
    solicitudesOfPartesCdd_ingresoDocumentoOfDePartes: (payload) =>
      dispatch(
        'solicitudesOfDePartes/solicitudesOfPartesCdd_ingresoDocumentoOfDePartes',
        payload
      ),
    solicitudesOfPartesCdd_SET_TASK_ID: (payload) =>
      commit(
        'solicitudesOfDePartes/solicitudesOfPartesCdd_SET_TASK_ID',
        payload
      )
  }
}
