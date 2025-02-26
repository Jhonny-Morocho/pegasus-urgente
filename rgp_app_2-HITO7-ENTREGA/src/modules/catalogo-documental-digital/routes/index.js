export default {
  path: 'catalogo-documental-digital',
  component: () => import('@/modules/catalogo-documental-digital/views/Index.vue'),
  children: [
    {
      path: 'bandeja-fiscal',
      name: 'BandejaFiscalCdd',
      component: () => import('@/modules/catalogo-documental-digital/views/BandejaFiscal.vue'),
      meta: {
        breadcrumb: {
          label: 'Escritorio Fiscal'
        }
      }
    },
    {
      path: 'bandeja-oficina-partes',
      name: 'CddBandejaOficinaPartes',
      component: () => import('@/modules/catalogo-documental-digital/views/BandejaOficinaPartes.vue'),
      meta: {
        breadcrumb: {
          label: 'Escritorio Oficina de Partes'
        }
      }
    },
    {
      path: 'bandeja-encargado-bodega',
      name: 'CddBandejaEncargadoBodega',
      component: () => import('@/modules/catalogo-documental-digital/views/BandejaEncargadoBodega.vue'),
      meta: {
        breadcrumb: {
          label: 'Escritorio Encargado de Bodega'
        }
      }
    },

    {
      path: 'creacion-cdd',
      name: 'CDDCreacion',
      children: [
        {
          path: 'creacion-catalogo',
          name: 'CDDSCreacionCatalogo',
          component: () => import('@/modules/catalogo-documental-digital/views/fiscal/creacion-cdd/SolicitudCreacionCatalogo.vue'),
          meta: {
            breadcrumb: {
              label: 'Solicitud de Creación de Catálogo Documental Digital',
              previousTo: { name: 'CDDCreacion' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'CDD'
        }
      }
    },

    {
      path: 'gestion-solicitudes-cdd',
      name: 'CDDGestion',
      children: [
        {
          path: 'solicitud-gestion-documento-archivo',
          name: 'CddSolicitudGestionDocumento',
          component: () =>
            import('@/modules/catalogo-documental-digital/views/fiscal/gestion-cdd/SolicitudGestionDocumentoOArchivo.vue'),
          meta: {
            breadcrumb: {
              label: 'Ingreso de solicitud de gestión de documento o archivo',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'solicitud-actualizacion',
          name: 'CddSolicitudActualizacion',
          component: () => import('@/modules/catalogo-documental-digital/views/fiscal/gestion-cdd/AnalisisDeActualizacion.vue'),
          meta: {
            breadcrumb: {
              label: 'Análisis de Solicitud de Actualización',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'nuevo-documento-partes',
          name: 'CddNuevoDocumentoPartes',
          component: () => import('@/modules/catalogo-documental-digital/views/oficina-partes/NuevoDocumentoPartes.vue'),
          meta: {
            breadcrumb: {
              label: 'Ingreso Nuevo documento Oficina de Partes',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'ingreso-documento-partes',
          name: 'CddingresoNuevoDocumentoOficinaPartes',
          component: () => import('@/modules/catalogo-documental-digital/views/oficina-partes/IngresoDocumentoPartes.vue'),
          meta: {
            breadcrumb: {
              label: 'Ingreso de documento Oficina de Partes',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'solicitud-almacenamiento',
          name: 'CddSolicitudAlmacenamiento',
          component: () => import('@/modules/catalogo-documental-digital/views/fiscal/gestion-cdd/RevisionSolicitudAlmacenamientoFIsico.vue'),
          meta: {
            breadcrumb: {
              label: 'Revisión de Solicitud de Almacenamiento Físico',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'ingreso-documento-bodega/',
          name: 'CddIngresoDocumentoBodega',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/gestion/IngresoDocumentoBodega.vue'),
          meta: {
            breadcrumb: {
              label: 'Registro de ingreso de documento físico a bodega',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'ingreso-bodega-temporal',
          name: 'CddIngresoBodegaTemporal',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/gestion/IngresoDocumentoBodega.vue'),
          meta: {
            breadcrumb: {
              label: 'Registro de Ingreso de Documento Físico a Bodega Temporal',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'revision-recuperacion-documento',
          name: 'CddRevisionSolicitudRecuperacionDocumentoFisico',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/gestion/RevisionSolicitudRecuperacionDocumentoFisico.vue'),
          meta: {
            breadcrumb: {
              label: 'Revisión Solicitud de Recuperación de Documento Físico',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'analizar-recuperacion-documento',
          name: 'CddAnalizarSolicitudRecuperacionDocumentoFisico',
          component: () => import('@/modules/catalogo-documental-digital/views/fiscal/gestion-cdd/AnalisisSolicitudRecuperacionDocumentoFisico.vue'),
          meta: {
            breadcrumb: {
              label: 'Analisis Solicitud de Recuperación de Documento Físico',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'registro-salida-documento',
          name: 'CddRegistroSalidaDocumentoFisico',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/gestion/RegistroSalidaDocumentoFisico.vue'),
          meta: {
            breadcrumb: {
              label: 'Registro de Salida de Documento Físico',
              previousTo: { name: 'CDDGestion' }
            }
          }
        },
        {
          path: 'registro-reingreso-documento',
          name: 'CddRegistroReingresoDocumentoFisico',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/gestion/RegistroReingresoDocumentoFisico.vue'),
          meta: {
            breadcrumb: {
              label: 'Registro de Reingreso de Documento Físico',
              previousTo: { name: 'CDDGestion' }
            }
          }
        }
      ]
    },

    {
      path: 'eliminacion-cdd',
      name: 'CDDEliminacion',
      children: [
        {
          path: 'solicitud-eliminacion-documento',
          name: 'CddSolicitudEliminacionDocumento',
          component: () => import('@/modules/catalogo-documental-digital/views/fiscal/eliminacion/SolicitudEliminacionDocumento.vue'),
          meta: {
            breadcrumb: {
              label: 'Solicitud de Eliminación de Documento',
              previousTo: { name: 'CDDEliminacion' }
            }
          }
        },
        {
          path: 'revision-solicitud-eliminacion',
          name: 'CddRevisionSolicitudEliminacion',
          component: () => import('@/modules/catalogo-documental-digital/views/fiscal/eliminacion/RevisionSolicitudEliminacion.vue'),
          meta: {
            breadcrumb: {
              label: 'Revision de Solicitud de Eliminación de Documento',
              previousTo: { name: 'CDDEliminacion' }
            }
          }
        },
        {
          path: 'agendamiento-devolucion-documento',
          name: 'CddAgendamientoDevolucionDocumento',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/eliminacion/AgendamientoDevolucionDocumento.vue'),
          meta: {
            breadcrumb: {
              label: 'Agendamiento de devolución de documento',
              previousTo: { name: 'CDDEliminacion' }
            }
          }
        },
        {
          path: 'registro-destruccion-documento',
          name: 'CddRegistroDestruccionDocumento',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/eliminacion/RegistroEliminacionDestruccion.vue'),
          children: [
            {
              path: '',
              name: 'redirectDatosDestruccion',
              redirect: {
                name: 'CddREDDatosEliminacion'
              }
            },
            {
              path: 'ingresar-datos-destruccion',
              name: 'CddREDDatosEliminacion',
              component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/eliminacion/DatosEliminacion.vue')
            },
            {
              path: 'comprobante-destruccion',
              name: 'CddREDFirmarComprobante',
              component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/eliminacion/FirmarComprobanteDestruccion.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Registro de Destrucción de Documento Físico',
              previousTo: { name: 'CDDEliminacion' }
            }
          }
        },
        {
          path: 'registro-devolucion-documento',
          name: 'CddRegistroDevolucionDocumento',
          component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/eliminacion/RegistroEliminacionDevolucion.vue'),
          children: [
            {
              path: '',
              name: 'redirectDatosDevolucion',
              redirect: {
                name: 'CddRDDDatosDevolucion'
              }
            },
            {
              path: 'ingresar-datos-devolucion',
              name: 'CddRDDDatosDevolucion',
              component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/eliminacion/DatosEliminacion.vue')
            },
            {
              path: 'comprobante-devolucion',
              name: 'CddRDDFirmarComprobante',
              component: () => import('@/modules/catalogo-documental-digital/views/encargado-bodega/eliminacion/FirmarComprobanteDevolucion.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Registro de Devolucion de Documento Físico',
              previousTo: { name: 'CDDEliminacion' }
            }
          }
        }
      ]
    }

  ],
  meta: {
    breadcrumb: {
      label: 'CDD'
    }
  }
}
