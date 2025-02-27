export default {
  path: 'asignacion',
  component: () => import('@/modules/asignacion/views/Index.vue'),
  children: [
    {
      path: '',
      name: 'BandejaAsignacion',
      component: () => import('@/modules/asignacion/views/BandejaAsignacion.vue')
    },
    {
      path: 'revisar-preclasificacion',
      name: 'ARevisarPreclasificacion',
      component: () => import('@/modules/asignacion/views/RevisarPreclasificacion.vue'),
      children: [
        {
          path: '',
          name: 'redirectBandejaAsignacion',
          redirect: {
            name: 'BandejaAsignacion'
          }
        },
        {
          path: 'propuesta-asignacion',
          name: 'ARevisarPropuestaAsignacion',
          component: () => import('@/modules/asignacion/views/revisar-preclasificacion/PropuestaAsignacion.vue')
        },
        {
          path: 'antecedentes',
          name: 'ARevisarAntecedentes',
          component: () => import('@/modules/asignacion/views/revisar-preclasificacion/RevisarAntecedentes.vue'),
          children: [
            {
              path: 'antecedentes-causa',
              name: 'RAAntecedentesCausa',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/AntecedentesDeCausa.vue')
            },
            {
              path: 'sujetos-intervinientes',
              name: 'RASujetosIntervinientes',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/SujetosIntervinientes.vue')
            },
            {
              path: 'delitos',
              name: 'RADelitos',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/Delito.vue')
            },
            {
              path: 'relaciones',
              name: 'RARelaciones',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/Relaciones.vue')
            },
            {
              path: 'especies-dinero',
              name: 'RAEspeciesDinero',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/EspeciesDinero.vue')
            },
            {
              path: 'relato',
              name: 'RARelato',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/Relato.vue')
            },
            {
              path: 'documentos',
              name: 'RADocumentos',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/Documentos.vue')
            },
            {
              path: 'diligencias',
              name: 'RADiligencias',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/Diligencias.vue')
            },
            {
              path: 'historial-causa',
              name: 'RAHistorialCausa',
              component: () =>
                import('@/modules/asignacion/components/revisar-antecedentes/HistorialCausa.vue')
            }
          ]
        },
        {
          path: 'decision',
          name: 'ADecidirAsignacion',
          component: () => import('@/modules/asignacion/views/revisar-preclasificacion/DecidirAsignacion.vue'),
          children: [
            {
              path: '',
              name: 'DAAnalizarDecision',
              component: () => import('@/modules/asignacion/components/decidir-asignacion/AnalizarDecision.vue')
            },
            {
              path: 'seguir-linea-investigativa',
              name: 'DASeguirLineaInvestigativa',
              component: () =>
                import('@/modules/asignacion/components/decidir-asignacion/SeguirLineaInvestigativa.vue')
            },
            {
              path: 'transferir-causa',
              name: 'DATransferirCausa',
              component: () =>
                import('@/modules/asignacion/components/decidir-asignacion/TransferirCausa.vue')
            },
            {
              path: 'agrupar-causa',
              name: 'DAAgruparCausa',
              component: () =>
                import('@/modules/asignacion/components/decidir-asignacion/AgruparCausa.vue')
            },
            {
              path: 'desestimar-causa',
              name: 'DADesestimarCausa',
              component: () =>
                import('@/modules/asignacion/components/decidir-asignacion/DesestimarCausa.vue')
            }
          ]
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Revisar Preclasificación',
          previousTo: { name: 'BandejaAsignacion' }
        }
      }
    }
  ],
  meta: {
    breadcrumb: {
      label: 'Bandeja Fiscal Jefe'
    }
  }
}
