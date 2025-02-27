
import { reactive } from 'vue'

export const useRegistrarsalidaDefinitivaForm = () => {
  const formData = reactive({
    observaciones: '',
    agendaRetiro: '',
    observacionesValidar: ''
  })
  return {
    formData
  }
}
