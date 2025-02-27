import { useConfirm } from 'primevue/useconfirm'

export const useConfirmDialog = () => {
  const { require } = useConfirm()

  function launchConfirmDialog (config) {
    require({
      acceptLabel: 'Confirmar',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      rejectLabel: 'Cancelar',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      ...config
    })
  }

  return {
    launchConfirmDialog
  }
}
