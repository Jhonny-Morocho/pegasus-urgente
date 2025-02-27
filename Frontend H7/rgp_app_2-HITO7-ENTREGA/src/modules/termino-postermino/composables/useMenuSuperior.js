import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDialog } from '@/modules/common/composables'
import ModalResumenCausa from '@/modules/termino-postermino/components/modals/ModalResumenCausa.vue'
import ModalSujetosIntervinientes from '@/modules/termino-postermino/components/modals/ModalSujetosIntervinientes.vue'
import ModalDelitos from '@/modules/termino-postermino/components/modals/ModalDelitos.vue'
import ModalRelatos from '@/modules/termino-postermino/components/modals/ModalRelatos.vue'
import ModalRelaciones from '@/modules/termino-postermino/components/modals/ModalRelaciones.vue'
import ModalEspeciesDinero from '@/modules/termino-postermino/components/modals/ModalEspeciesDinero.vue'
import ModalDocumentos from '@/modules/termino-postermino/components/modals/ModalDocumentos.vue'
import ModalHistorialCausa from '@/modules/termino-postermino/components/modals/ModalHistorialCausa.vue'
import ModalDiligencias from '@/modules/termino-postermino/components/modals/ModalDiligencias.vue'
import ModalAnotaciones from '@/modules/termino-postermino/components/modals/ModalAnotaciones.vue'
import ModalConsultarCausasRelacionadas from '@/modules/dirigir-investigacion/components/modals/ModalConsultarCausasRelacionadas.vue'

export function useMenuSuperior ({ ruc }) {
  const { launchDialog } = useAppDialog()
  const router = useRouter()

  const itemsMenuSuperior = ref([
    {
      label: 'Causa',
      icon: 'pi pi-question-circle',
      disabled: () => false,
      items: [
        {
          label: 'Resumen de la Causa',
          command: async () => {
            launchDialog({
              component: ModalResumenCausa,
              header: 'Resumen de la Causa',
              width: '67%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Sujetos Intervinientes',
          command: () => {
            launchDialog({
              component: ModalSujetosIntervinientes,
              header: 'Ver Todos los Sujetos Intervinientes',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Delitos',
          command: () => {
            launchDialog({
              component: ModalDelitos,
              header: 'Ver Todos los Delitos',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Relato',
          command: () => {
            launchDialog({
              component: ModalRelatos,
              header: 'Ver el Relato',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Relaciones',
          command: () => {
            launchDialog({
              component: ModalRelaciones,
              header: 'Ver Todas las Relaciones',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Especies y Dinero',
          command: () => {
            launchDialog({
              component: ModalEspeciesDinero,
              header: 'Ver Todas las Especies y Dineros',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Documentos',
          command: () => {
            launchDialog({
              component: ModalDocumentos,
              header: 'Ver Todos los Documentos',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Historial',
          command: () => {
            launchDialog({
              component: ModalHistorialCausa,
              header: 'Ver Todo el Historial de la Causa',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Diligencias',
          command: () => {
            launchDialog({
              component: ModalDiligencias,
              header: 'Ver Todas las Diligencias',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Anotaciones',
          command: () => {
            launchDialog({
              component: ModalAnotaciones,
              header: 'Ver Todas las Anotaciones',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        }
      ]
    },
    {
      label: 'Actualizar',
      icon: 'pi pi-replay',
      command: () => router.go()
    },
    {
      label: 'Exportar',
      icon: 'pi pi-download',
      command: () => window.print()
    }
  ])

  // provisional para hito transversar agrupar/transferir causas
  const itemsMenuSuperiorSecundario = ref([
    {
      label: 'Causa',
      icon: 'pi pi-question-circle',
      disabled: () => false,
      items: [
        {
          label: 'Resumen de la Causa',
          command: async () => {
            launchDialog({
              component: ModalResumenCausa,
              header: 'Resumen de la Causa',
              width: '67%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Sujetos Intervinientes',
          command: () => {
            launchDialog({
              component: ModalSujetosIntervinientes,
              header: 'Ver Todos los Sujetos Intervinientes',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Delitos',
          command: () => {
            launchDialog({
              component: ModalDelitos,
              header: 'Ver Todos los Delitos',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Relato',
          command: () => {
            launchDialog({
              component: ModalRelatos,
              header: 'Ver el Relato',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Relaciones',
          command: () => {
            launchDialog({
              component: ModalRelaciones,
              header: 'Ver Todas las Relaciones',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Especies y Dinero',
          command: () => {
            launchDialog({
              component: ModalEspeciesDinero,
              header: 'Ver Todas las Especies y Dineros',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Documentos',
          command: () => {
            launchDialog({
              component: ModalDocumentos,
              header: 'Ver Todos los Documentos',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Historial',
          command: () => {
            launchDialog({
              component: ModalHistorialCausa,
              header: 'Ver Todo el Historial de la Causa',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Diligencias',
          command: () => {
            launchDialog({
              component: ModalDiligencias,
              header: 'Ver Todas las Diligencias',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        },
        {
          label: 'Anotaciones',
          command: () => {
            launchDialog({
              component: ModalAnotaciones,
              header: 'Ver Todas las Anotaciones',
              width: '80%',
              props: {
                ruc: ruc
              }
            })
          }
        }
      ]
    },
    {
      label: 'Consultar',
      icon: 'pi pi-question-circle',
      items: [
        {
          label: 'Consultar FR'
          // command: () =>
        },
        {
          label: 'Causas Relacionadas',
          command: async () => {
            launchDialog({
              component: ModalConsultarCausasRelacionadas,
              header: 'Consultar Causas Relacionadas',
              width: '67%'
            })
          }
        }
      ]
    },
    {
      label: 'Actualizar',
      icon: 'pi pi-replay',
      command: () => router.go()
    },
    {
      label: 'Exportar',
      icon: 'pi pi-download',
      command: () => window.print()
    }
  ])

  return { itemsMenuSuperior, itemsMenuSuperiorSecundario }
}
