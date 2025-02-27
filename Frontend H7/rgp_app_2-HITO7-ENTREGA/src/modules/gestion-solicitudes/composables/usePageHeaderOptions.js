import { ref } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import ResumenCausa from '@/modules/gestion-solicitudes/components/modals/ResumenCausa.vue'
import SujetosIntervinientes from '@/modules/gestion-solicitudes/components/modals/SujetosIntervinientes.vue'
import Documentos from '@/modules/gestion-solicitudes/components/modals/Documentos.vue'

export function usePageHeaderOptions (hiddeCdd) {
  const { launchDialog } = useAppDialog()

  function openResumenCausa () {
    launchDialog({
      component: ResumenCausa,
      header: 'Resumen de la Causa',
      width: '60%',
      cancelLabel: 'Cerrar'
    })
  }

  function openSujetosIntervinientes () {
    launchDialog({
      component: SujetosIntervinientes,
      header: 'Sujetos/Intervinientes',
      width: '60%',
      cancelLabel: 'Cerrar'
    })
  }

  function openDocumentos () {
    launchDialog({
      component: Documentos,
      header: 'Documentos',
      width: '60%',
      cancelLabel: 'Cerrar'
    })
  }

  const itemsMenuSuperior = ref([
    {
      label: 'Causa',
      icon: 'pi pi-question-circle',
      disabled: () => false,
      visible: !hiddeCdd,
      items: [
        {
          label: 'Resumen de la Causa',
          command: () => {
            openResumenCausa()
          }
        },
        {
          label: 'Sujetos Intervinientes',
          command: () => {
            openSujetosIntervinientes()
          }
        },
        {
          disabled: () => true,
          label: 'Delitos'
        },
        {
          disabled: () => true,
          label: 'Relato'
        },
        {
          disabled: () => true,
          label: 'Relaciones'
        },
        {
          disabled: () => true,
          label: 'Especies y Dinero'
        },
        {
          label: 'Documentos',
          command: () => {
            openDocumentos()
          }
        },
        {
          disabled: () => true,
          label: 'Historial'
        },
        {
          disabled: () => true,
          label: 'Diligencias'
        }
      ]
    },
    {
      label: 'Actualizar',
      icon: 'pi pi-replay',
      command: () => {
        console.log('Actualizar')
      }
    },
    {
      label: 'Exportar',
      icon: 'pi pi-download',
      command: () => {
        console.log('Exportar')
      }
    }
  ])

  return {
    itemsMenuSuperior
  }
}
