export default {
  path: 'preclasificador',
  component: () => import('@/modules/preclasificador/views/Index.vue'),
  children: [
    {
      path: '',
      name: 'PreclasificadorBandeja',
      component: () => import('@/modules/preclasificador/views/BandejaPreclasificador.vue')
    },
    {
      path: 'causa',
      name: 'PreclasificadorCausa',
      component: () => import('@/modules/preclasificador/views/Causa.vue'),
      children: [
        {
          path: '',
          name: 'RedirectPreclasificador',
          redirect: { name: 'PreclasificadorBandeja' }
        },
        {
          path: 'validar-calidad-antecedentes',
          name: 'PreclasificadorCausaValidarCalidadAntecedentes',
          component: () =>
            import('@/modules/preclasificador/views/causa/ValidarCalidadAntecedentes.vue'),
          children: [
            {
              path: 'antecedentes-causa',
              name: 'VCAAntecedentesCausa',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/AntecedentesDeCausa.vue')
            },
            {
              path: 'sujetos-intervinientes',
              name: 'VCASujetosIntervinientes',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/SujetosIntervinientes.vue')
            },
            {
              path: 'delitos',
              name: 'VCADelitos',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/Delito.vue')
            },
            {
              path: 'relaciones',
              name: 'VCARelaciones',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/Relaciones.vue')
            },
            {
              path: 'especies-dinero',
              name: 'VCAEspeciesDinero',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/EspeciesDinero.vue')
            },
            {
              path: 'relato',
              name: 'VCARelato',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/Relato.vue')
            },
            {
              path: 'documentos',
              name: 'VCADocumentos',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/Documentos.vue')
            },
            {
              path: 'diligencias',
              name: 'VCADiligencias',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/Diligencias.vue')
            },
            {
              path: 'historial-causa',
              name: 'VCAHistorialCausa',
              component: () =>
                import('@/modules/preclasificador/components/validar-calidad-antecedentes/HistorialCausa.vue')
            }
          ]
        },
        {
          path: 'proponer-asignacion',
          name: 'PreclasificadorCausaProponerAsignacion',
          component: () =>
            import('@/modules/preclasificador/views/causa/ProponerAsignacion.vue'),
          children: [
            // {
            //   path: '',
            //   redirect: { name: 'PAAnalizarPreclasificacion' }
            // },
            {
              path: '',
              name: 'PAAnalizarPreclasificacion',
              component: () =>
                import('@/modules/preclasificador/components/proponer-asignacion/AnalizarPreclasificacion.vue')
            },
            {
              path: 'seguir-linea-investigativa',
              name: 'PASeguirLineaInvestigativa',
              component: () =>
                import('@/modules/preclasificador/components/proponer-asignacion/SeguirLineaInvestigativa.vue')
            },
            {
              path: 'transferir-causa',
              name: 'PATransferirCausa',
              component: () =>
                import('@/modules/preclasificador/components/proponer-asignacion/TransferirCausa.vue')
            },
            {
              path: 'agrupar-causa',
              name: 'PAAgruparCausa',
              component: () =>
                import('@/modules/preclasificador/components/proponer-asignacion/AgruparCausa.vue')
            },
            {
              path: 'desestimar-causa',
              name: 'PADesestimarCausa',
              component: () =>
                import('@/modules/preclasificador/components/proponer-asignacion/DesestimarCausa.vue')
            }
          ]
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Preclasificar Causa',
          previousTo: { name: 'PreclasificadorBandeja' }
        }
      }
    }
  ],
  meta: {
    breadcrumb: {
      label: 'Bandeja Preclasificador'
    }
  }
}
