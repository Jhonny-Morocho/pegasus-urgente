import { watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCommonStore } from '.'

export const useAppToast = (watchCommonToast = false) => {
  // estado de toast global
  const { toast } = useCommonStore()

  const life = 5000

  // instancia
  const iToast = useToast()

  function toastSuccess (detail) {
    iToast.add({ severity: 'success', summary: 'Correcto', detail, life })
  }

  function toastError (detail) {
    iToast.add({ severity: 'error', summary: 'Error', detail, life })
  }

  function toastWarning (detail) {
    iToast.add({ severity: 'warn', summary: 'Advertencia', detail, life })
  }

  if (watchCommonToast) {
    watch(toast, ({ type, detail }) => {
      switch (type) {
        case 'error':
          toastError(detail)
          break
        case 'success':
          toastSuccess(detail)
          break
        case 'warning':
          toastWarning(detail)
          break
      }
    })
  }

  return {
    toastError,
    toastSuccess,
    toastWarning,

    // messages
    TOAST_MESSAGES: {
      formInvalid: 'Algunos campos del formulario no son válidos',
      formSuccess: 'La información ha sido enviada con éxito'
    }
  }
}
