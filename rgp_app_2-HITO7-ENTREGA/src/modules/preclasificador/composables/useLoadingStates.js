import { reactive } from 'vue'

const loadingState = reactive({
  completarSolicitudAntecedentes: false,
  iniciarYReservar: false,
  getCausasRelacionadas: false,
  guardarCausasRelacionadas: false
})

export const useLoadingStates = () => {
  return { loadingState }
}
