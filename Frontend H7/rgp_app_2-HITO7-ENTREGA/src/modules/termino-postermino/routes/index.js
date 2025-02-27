export default {
  path: 'termino-postermino',
  component: () => import('@/modules/termino-postermino/views/Index.vue'),
  children: [
    {
      path: '',
      redirect: {
        name: 'Inicio'
      }
    },
    {
      path: 'fiscal-jefe',
      name: 'IndexFiscalJefe',
      component: () => import('@/modules/termino-postermino/views/IndexFiscalJefe.vue'),
      children: [
        {
          path: '',
          name: 'BandejaFiscalJefe',
          component: () => import('@/modules/termino-postermino/views/BandejaFiscalJefe.vue')
        },
        {
          path: 'revisar-consulta-termino',
          name: 'TPTFJRevisarConsultaTermino',
          component: () => import('@/modules/termino-postermino/views/fiscal-jefe/RevisarConsultaTermino.vue')
        },
        {
          path: 'revisar-antecedentes-causa',
          name: 'TPTFJRevisarAntecedentesCausa',
          component: () => import('@/modules/termino-postermino/views/RevisarAntecedentesCausa.vue'),
          children: [
            {
              path: 'resumen-causa',
              name: 'TPTFJRACResumenCausa',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/ResumenCausa.vue')
            },
            {
              path: 'sujetos-intervinientes',
              name: 'TPTFJRACSujetosIntervinientes',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/SujetosIntervinientes.vue')
            },
            {
              path: 'delitos',
              name: 'TPTFJRACDelitos',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/Delitos.vue')
            },
            {
              path: 'relaciones',
              name: 'TPTFJRACRelaciones',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/Relaciones.vue')
            },
            {
              path: 'especies-dinero',
              name: 'TPTFJRACEspeciesDinero',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/EspeciesDinero.vue')
            },
            {
              path: 'relato',
              name: 'TPTFJRACRelato',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/Relato.vue')
            },
            {
              path: 'documentos',
              name: 'TPTFJRACDocumentos',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/Documentos.vue')
            },
            {
              path: 'diligencias',
              name: 'TPTFJRACDiligencias',
              component: () => import('@/modules/termino-postermino/views/revisar-antecedentes-causa/Diligencias.vue')
            }
            // ACA LOS DEMAS TABS DE VER CAUSA
          ],
          meta: {
            breadcrumb: {
              label: 'Ver Toda la Causa'
            }
          }
        },
        {
          path: 'revisar-agrupacion-causas',
          name: 'RevisarAgrupacionCausas',
          component: () => import('@/modules/termino-postermino/views/revisar-agrupacion-causas/RevisarAgrupacionCausas.vue')
        },
        {
          path: 'revisar-transferencia-causa',
          name: 'TPTFJRevisarTransferenciaCausas',
          component: () => import('@/modules/termino-postermino/views/revisar-transferencia-causa/RevisarTransferenciaCausa.vue')
        },
        {
          path: 'ver-carga-trabajo',
          name: 'TPTVerCargaTrabajo',
          component: () => import('@/modules/termino-postermino/views/ver-carga-trabajo/VerCargaTrabajo.vue'),
          children: [
            {
              path: 'carga-fiscal',
              name: 'TPTCargaFiscal',
              component: () => import('@/modules/termino-postermino/views/ver-carga-trabajo/CargaFiscal.vue')
            },
            {
              path: 'carga-unidad',
              name: 'TPTCargaUnidad',
              component: () => import('@/modules/termino-postermino/views/ver-carga-trabajo/CargaUnidad.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Visualizar Carga de Trabajo FL',
              previousTo: { name: 'BandejaFiscalJefe' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Bandeja Fiscal Jefe'
        }
      }
    },
    {
      path: 'fiscal',
      name: 'IndexFiscal',
      component: () => import('@/modules/termino-postermino/views/IndexFiscal.vue'),
      children: [
        {
          path: '',
          name: 'BandejaFiscal',
          component: () => import('@/modules/termino-postermino/views/BandejaFiscal.vue')
        },
        {
          path: 'revisar-corregir-observaciones',
          name: 'TPTFJRevisarCorregirObservaciones',
          component: () => import('@/modules/termino-postermino/views/fiscal/RevisarCorregirObservaciones.vue')
        },
        {
          path: 'solicitar-audiencia-termino',
          name: 'TPTFJSolicitarAudienciaTermino',
          component: () => import('@/modules/termino-postermino/views/fiscal/SolicitarAudienciaTermino.vue')
        },
        {
          path: 'preparar-escrito-de-termino',
          name: 'TPTFPrepararEscritoDeTermino',
          component: () => import('@/modules/termino-postermino/views/fiscal/PrepararEscritoDeTermino.vue')
        },
        {
          path: 'informar-termino-de-causa',
          name: 'TPTFInformarTerminoDeCausa',
          component: () => import('@/modules/termino-postermino/views/fiscal/informar-termino-causa/InformarTerminoCausa.vue')
        },
        {
          path: 'acta-de-audiencia',
          name: 'TPTFActaDeAudiencia',
          component: () => import('@/modules/termino-postermino/views/fiscal/informar-termino-causa/ActaAudiencia.vue')
        },
        {
          path: 'solicitud-reapertura-causa',
          name: 'TPTFSolicitudReaperturaCausa',
          component: () => import('@/modules/termino-postermino/views/fiscal/EvaluarSolicitudReaperturaCausa.vue')
        },
        {
          path: 'registrar-modificacion-AR',
          name: 'RegistrarModificacionAR',
          component: () => import('@/modules/termino-postermino/views/encargado-control/RegistrarModificacionAR.vue')
        },
        {
          path: 'revisar-causa-SCP-AR',
          name: 'RevisarCausaConSCPoAR',
          component: () => import('@/modules/termino-postermino/views/fiscal/RevisarCausaConSCPoAR.vue')
        },
        {
          path: 'evaluar-informe-psiquiatrico',
          name: 'EvaluarInformePsiquiatrico',
          component: () => import('@/modules/termino-postermino/views/fiscal/EvaluarInformePsiquiatrico.vue')
        },
        {
          path: 'solicitar-sobreseimiento-definitivo',
          name: 'TPTFSolicitudSobreseimientoDefinitivo',
          component: () => import('@/modules/termino-postermino/views/fiscal/SolicitudSobreseimientoDefinitivo.vue')
        },
        {
          path: 'reactivar-causa-penal',
          name: 'TPTFReactivarCausaPenal',
          component: () => import('@/modules/termino-postermino/views/fiscal/ReactivarCausaPenal.vue')
        },
        {
          path: 'registrar-cumplimiento',
          name: 'RegistrarCumplimiento',
          component: () => import('@/modules/termino-postermino/views/control-condiciones/RegistrarCumplimiento.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Bandeja Fiscal'
        }
      }
    },
    {
      path: 'fiscal-regional',
      name: 'IndexFiscalRegional',
      component: () => import('@/modules/termino-postermino/views/IndexFiscalRegional.vue'),
      children: [
        {
          path: '',
          name: 'BandejaFiscalRegional',
          component: () => import('@/modules/termino-postermino/views/BandejaFiscalRegional.vue')
        }
      ]
    },
    {
      path: 'gestion-direccion-investigacion',
      name: 'IndexGestionDireccionInvestiagacion',
      children: [
        {
          path: '',
          name: 'BandejaGestionDireccionInvestigacion',
          component: () => import('@/modules/termino-postermino/views/BandejaGestionDireccionInvestigacion.vue')
        },
        {
          path: 'revisar-transferencia-causa',
          name: 'TPTGDIRevisarTransferenciaCausa',
          component: () => import('@/modules/termino-postermino/views/revisar-transferencia-causa/RevisarTransferenciaCausa.vue'),
          meta: {
            breadcrumb: {
              label: 'Revisar Transferencia de Causa',
              previousTo: { name: 'BandejaGestionDireccionInvestigacion' }
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
  ]
}
