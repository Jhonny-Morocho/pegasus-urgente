import { reactive } from 'vue'
const loadingStates = reactive({
  completarSolicitudAntecedentes: false,
  getCausasRelacionadas: false,
  guardarCausasRelacionadas: false
})

export const useLoadingStates = () => {
  return { loadingStates }
}
