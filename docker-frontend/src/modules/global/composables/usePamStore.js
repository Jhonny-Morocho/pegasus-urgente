import { computed } from 'vue'
import { useStore } from 'vuex'

export const usePamStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    processInstanceId: computed(() => state.pam.processInstanceId),
    procesoPam: computed(() => state.pam.procesoPam),
    completarProcesoFlagrancia: computed(() => state.pam.completarProcesoFlagrancia),

    pam_getDiagramaProcesoActual: (payload) => dispatch('pam/pam_getDiagramaProcesoActual', payload),
    pam_getDiagramaProcesoPrincipal: (payload) => dispatch('pam/pam_getDiagramaProcesoPrincipal', payload),
    pam_iniciarProceso: (payload) => dispatch('pam/pam_iniciarProceso', payload),
    pam_iniciarProcesoFlagrancia: (payload) => dispatch('pam/pam_iniciarProcesoFlagrancia', payload),
    pam_completarProcesoFlagrancia: (payload) => dispatch('pam/pam_completarProcesoFlagrancia', payload),
    pam_completarCerrarFoliolagrancia: (payload) => dispatch('pam/pam_completarCerrarFoliolagrancia', payload),
    pam_reservarIniciarTarea: (payload) => dispatch('pam/pam_reservarIniciarTarea', payload),
    pam_reservarFolio: (payload) => dispatch('pam/pam_reservarFolio', payload),

    pam_SET_PROCESO: (proceso) => commit('pam/pam_SET_PROCESO', proceso),
    pam_SET_INSTANCE_ID: (id) => commit('pam/pam_SET_INSTANCE_ID', id)
  }
}
