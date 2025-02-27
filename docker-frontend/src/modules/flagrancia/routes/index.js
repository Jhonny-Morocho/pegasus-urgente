export default {
  path: 'flagrancia',
  component: () => import('@/modules/flagrancia/views/Index.vue'),
  children: [
    {
      path: '',
      name: 'FlagranciaBandeja',
      component: () => import('@/modules/flagrancia/views/BandejaFlagrancia.vue')
    },
    {
      path: '/flagrancia/nomina-detenidos/',
      name: 'NominaDetenidosACD',
      component: () => import('@/modules/flagrancia/views/NominaDetenidosACD.vue'),

      meta: {
        breadcrumb: {
          label: 'Nómina de Detenidos',
          previousTo: { name: 'FlagranciaBandeja' }
        }
      }
    },
    {
      path: ':idProcedimiento?/nueva-atencion',
      name: 'FlagranciaNuevaAtencion',
      component: () => import('@/modules/flagrancia/views/NuevaAtencion.vue'),
      children: [
        {
          path: '',
          name: 'RedirectFlagrancia',
          redirect: { name: 'FlagranciaNuevaAtencionRegistroContacto' }
        },
        {
          path: 'registro-contacto',
          name: 'FlagranciaNuevaAtencionRegistroContacto',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/RegistroContacto.vue')
        },
        {
          path: 'sujeto-intervinientes',
          name: 'FlagranciaNuevaAtencionSujetoIntervinientes',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/SujetosIntervinientes.vue')
        },
        {
          path: 'delito',
          name: 'FlagranciaNuevaAtencionDelito',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/Delito.vue')
        },
        {
          path: 'relaciones',
          name: 'FlagranciaNuevaAtencionRelaciones',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/Relaciones.vue')
        },
        {
          path: 'especies-dinero',
          name: 'FlagranciaNuevaAtencionEspeciesDinero',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/EspeciesDinero.vue')
        },
        {
          path: 'relato-hecho',
          name: 'FlagranciaNuevaAtencionRelatoHecho',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/Relato.vue')
        },
        {
          path: 'documentos',
          name: 'FlagranciaNuevaAtencionDocumentos',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/Documentos.vue')
        },
        {
          path: 'diligencias-e-instrucciones',
          name: 'FlagranciaNuevaAtencionDiligenciasEInstrucciones',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/DiligenciasEInstrucciones.vue')
        },
        {
          path: 'detenidos-acd',
          name: 'FlagranciaNuevaAtencionDetenidosACD',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/DetenidosACD.vue'),
          meta: {
            // requireSomeRoles: ['zona_2_turno_instrucciones', 'fiscal_turno']
          }
        }
      ],

      meta: {
        breadcrumb: {
          label: 'Nueva Atención',
          previousTo: { name: 'FlagranciaBandeja' }
        }
      }
    },
    {
      path: ':idProcedimiento?/procedimiento-creado/',
      name: 'NuevaAtencionFiscal',
      component: () => import('@/modules/flagrancia/views/NuevaAtencionFiscal.vue'),
      children: [
        {
          path: '',
          name: 'RedirectFlagranciaModoLecturaFiscal',
          redirect: { name: 'FlagranciaBandeja' }
        },
        {
          path: 'analizar-procedimiento',
          name: 'AnalizarProcedimiento',
          component: () => import('@/modules/flagrancia/views/nueva-atencion-fiscal/AnalizarProcedimiento.vue'),
          children: [
            {
              path: 'registro-contacto',
              name: 'FlagranciaNuevaAtencionRegistroContactoFiscal',
              component: () => import('@/modules/flagrancia/views/nueva-atencion/RegistroContacto.vue')
            },
            {
              path: 'sujeto-intervinientes',
              name: 'FlagranciaNuevaAtencionSujetoIntervinientesFiscal',
              component: () => import('@/modules/flagrancia/views/nueva-atencion/SujetosIntervinientes.vue')
            },
            {
              path: 'delito',
              name: 'FlagranciaNuevaAtencionDelitoFiscal',
              component: () => import('@/modules/flagrancia/views/nueva-atencion/Delito.vue')
            },
            {
              path: 'relaciones',
              name: 'FlagranciaNuevaAtencionRelacionesFiscal',
              component: () => import('@/modules/flagrancia/views/nueva-atencion/Relaciones.vue')
            },
            {
              path: 'especies-dinero',
              name: 'FlagranciaNuevaAtencionEspeciesDineroFiscal',
              component: () => import('@/modules/flagrancia/views/nueva-atencion/EspeciesDinero.vue')
            },
            {
              path: 'relato-hecho',
              name: 'FlagranciaNuevaAtencionRelatoHechoFiscal',
              component: () => import('@/modules/flagrancia/views/nueva-atencion/Relato.vue')
            },
            {
              path: 'documentos',
              name: 'FlagranciaNuevaAtencionDocumentosFiscal',
              component: () => import('@/modules/flagrancia/views/nueva-atencion/Documentos.vue')
            }
          ]
        },
        {
          path: 'diligencias-e-instrucciones',
          name: 'FlagranciaNuevaAtencionDiligenciasEInstruccionesFiscal',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/DiligenciasEInstrucciones.vue')
        },
        {
          path: 'detenidos-acd',
          name: 'FlagranciaNuevaAtencionDetenidosACDFiscal',
          component: () => import('@/modules/flagrancia/views/nueva-atencion/DetenidosACD.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: `Procedimiento `,
          previousTo: { name: 'FlagranciaBandeja' }
        }
      }
    },
    {
      path: 'rucs-creados',
      name: 'FlagranciaRucsCreados',
      component: () => import('@/modules/flagrancia/views/RUCsCreados.vue')
    },
    {
      path: 'conexiones-PJUD',
      name: 'FlagranciaConexionesPJUD',
      component: () => import('@/modules/flagrancia/views/ConexionesPJUD.vue')
    }
  ],
  meta: {
    breadcrumb: {
      label: 'Flagrancia'
    }
  }
}
