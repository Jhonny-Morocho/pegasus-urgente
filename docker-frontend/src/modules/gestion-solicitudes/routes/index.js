export default {
  path: 'gestion-solicitudes',
  component: () => import('@/modules/gestion-solicitudes/views/Index.vue'),
  children: [
    {
      path: 'gestor',
      children: [
        {
          path: '',
          name: 'bandejaGestor',
          component: () => import('@/modules/gestion-solicitudes/views/BandejaGestionGestor.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Bandeja Gestor'
        }
      }
    },
    {
      path: 'materializar-solicitud',
      name: 'materializarSolicitud',
      component: () => import('@/modules/gestion-solicitudes/views/MaterializarSolicitud.vue')
    },
    {
      path: 'ejecutor',
      children: [
        {
          path: '',
          name: 'BandejaEjecutor',
          component: () => import('@/modules/gestion-solicitudes/views/BandejaEjecutor.vue')
        },
        {
          path: 'responder-solicitud',
          name: 'ResponderSolicitud',
          component: () => import('@/modules/gestion-solicitudes/views/ResponderSolicitud.vue'),
          children: [
            {
              path: '',
              name: 'EJAntecedentesCausa',
              component: () => import('@/modules/gestion-solicitudes/views/ejecutor/AntecedentesCausa.vue')
            },
            {
              path: 'antecedentes-solicitud',
              name: 'EJAntecedentesSolicitud',
              component: () => import('@/modules/gestion-solicitudes/views/ejecutor/AntecedentesSolicitud.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Revisar y Responder Solicitud a otra FL'
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Bandeja Ejecutor'
        }
      }
    },
    {
      path: 'fiscal',
      children: [
        {
          path: '',
          name: 'BandejaFiscalGestion',
          component: () => import('@/modules/gestion-solicitudes/views/BandejaEntradaFiscal.vue')
        },
        {
          path: 'revisar-solicitud-equipo',
          name: 'revisarSolicitudEquipo',
          component: () => import('@/modules/gestion-solicitudes/views/RevisarSolicitudEquipo.vue'),
          meta: {
            breadcrumb: {
              label: 'Revisar Solicitud Equipo Jurídico',
              previousTo: { name: 'BandejaFiscalGestion' }
            }
          }
        },
        {
          path: 'solicitud-ampliacion-plazo',
          name: 'solicitudAmpliacionPlazo',
          component: () => import('@/modules/gestion-solicitudes/views/SolicitudAmpliacionPlazo.vue'),
          meta: {
            breadcrumb: {
              label: 'Solicitud Ampliación de Plazo de Diligencia',
              previousTo: { name: 'BandejaFiscalGestion' }
            }
          }
        },
        {
          path: 'solicitar-audiencia',
          name: 'solicitarAudiencia',
          redirect: {
            name: 'resumenRelacionesEspecies'
          },
          component: () => import('@/modules/gestion-solicitudes/views/SolicitarAudiencia.vue'),
          children: [
            {
              path: 'resumen-relaciones-especies',
              name: 'resumenRelacionesEspecies',
              component: () => import('@/modules/solicitudes/components/ResumenRelacionesEspecies.vue')
            },
            {
              path: 'medidas-cautelares',
              name: 'medidasCautelares',
              component: () => import('@/modules/solicitudes/components/AgregarMedidasCautelares.vue')
            },
            {
              path: 'elaborar-solicitud-audiencia',
              name: 'elaborarSolicitudAudiencia',
              component: () => import('@/modules/solicitudes/components/ElaborarSolicitudAudiencia.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Solicitar Audiencia',
              component: () => import('@/modules/gestion-solicitudes/views/BandejaEntradaFiscal.vue')
            }
          }
        },
        {
          path: 'pide-cuenta',
          name: 'GDSPideCuenta',
          component: () => import('@/modules/gestion-solicitudes/views/PideCuenta.vue'),
          meta: {
            breadcrumb: {
              label: 'Pide Cuenta',
              previousTo: { name: 'BandejaFiscalGestion' }
            }
          }
        },
        {
          path: 'resultado-diligencia',
          name: 'resultadoDiligencia',
          component: () => import('@/modules/gestion-solicitudes/views/ResultadoDiligencia.vue'),
          meta: {
            breadcrumb: {
              label: 'Resultado Diligencia',
              previousTo: { name: 'BandejaFiscalGestion' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Bandeja Fiscal'
        }
      }
    }
  ]
}
