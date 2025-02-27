import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useItemsMenuSuperiorCadena = (
  actualizar,
  exportTable
) => {
  const router = useRouter()

  const itemsMenuSuperior = ref([
    {
      label: 'Cadena de Custodia',
      icon: 'pi pi-plus-circle',
      items: [
        {
          label: 'Solicitud / Asignación de NUES',
          command: () => {
            console.log('solicitud-nues')
            router.push('/custodia/custodio/cadena-custodio/solicitud-de-nues')
          }
        },
        {
          label: 'Levantar Cadena de Custodia',
          command: () => {
            router.push('/custodia/custodio/cadena-custodio/levantar-cadena-custodia')
          }
        },
        {
          label: 'Ver Cadena de Custodia',
          command: () => {
            console.log('Ver Cadena de Custodia')
            router.push('/custodia/custodio/cadena-custodio/ver-cadena-custodia')
          }
        },
        {
          label: 'Agregar Eslabón',
          command: () => {
            console.log('Agregar Eslabón')
            router.push('/custodia/custodio/cadena-custodio/agregar-eslabon')
          }
        },
        {
          label: 'Agregar Observación a Cadena de Custodia',
          command: () => {
            router.push(
              '/custodia/custodio/cadena-custodio/observacion-cadena-custodia'
            )
          }
        }
      ]
    },
    {
      label: 'Especies y Dineros',
      items: [
        {
          label: 'Ingresar Transferencia Especie',
          command: () => {
            router.push('/custodia/custodio/ingresar-transferencia-especie/ingreso-de-nue')
          }
        },
        {
          label: 'Recepcionar Especie/Dinero',
          command: () => {
            router.push('/custodia/custodio/nueva-recepcion/identificacion-nue')
          }
        },
        {
          label: 'Visualizar Especie/Dinero',
          command: () => {
            console.log('Visualizar Especie/Dinero')
            router.push('/custodia/custodio/registrar-inspeccion-visual/datos-inspeccion-visual')
          }
        },
        {
          label: 'Reubicar Especie/Dinero',
          command: () => {
            router.push('/custodia/custodio/decidir-reubicacion/busqueda-por-rue')
          }
        },
        {
          label: 'Realizar Fijación Fotográfica',
          command: () => {
            router.push('/custodia/custodio/realizar-fijacion-fotografica/realizar-fijacion-fotografica')
          }
        },
        {
          label: 'Imprimir',
          command: () => {
            console.log('Imprimir')
          }
        },
        {
          label: 'Procesos Masivos',
          items: [
            {
              label: 'Generar Cupón de Deposito',
              command: () => {
                router.push('/custodia/custodio/especie-dinero/generar-cupon-de-depositos')
              }
            },
            {
              label: 'Confirmar Registro de Depósito'
            },
            {
              label: 'Realizar Nómina Depósito'
            },
            {
              label: 'Destruir Especies'
            },
            {
              label: 'Registrar Tasación'
            },
            {
              label: 'Generar Cheque Masivo'
            },
            {
              label: 'Destruir Dineros'
            },
            {
              label: 'Generar Nómina de Traspasos'
            }
          ]
        }
      ]
    },
    {
      icon: 'pi pi-refresh',
      label: 'Actualizar',
      visible: typeof actualizar === 'function',
      command: () => actualizar()
    },
    {
      icon: 'pi pi-download',
      label: 'Exportar',
      visible: typeof exportTable === 'function',
      command: () => exportTable()
    }
  ])

  return {
    itemsMenuSuperior
  }
}
