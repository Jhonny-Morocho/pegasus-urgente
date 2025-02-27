export default {
  path: 'ingreso',
  component: () => import('@/modules/ingreso/views/Index.vue'),
  children: [
    {
      path: '',
      redirect: {
        name: 'Inicio'
      }
    },
    {
      path: 'denuncia-directa',
      name: 'IndexDenunciaDirecta',
      component: () => import('@/modules/ingreso/views/IndexDenunciaDirecta.vue'),
      children: [
        {
          path: '',
          name: 'BandejaDenunciaDirecta',
          component: () => import('@/modules/ingreso/views/BandejaDenunciaDirecta.vue'),
          props: route => ({ query: route.query.q })
        },
        {
          path: 'nueva-denuncia',
          name: 'NuevaDenunciaDirecta',
          component: () => import('@/modules/ingreso/views/NuevaDenunciaDirecta.vue'),
          children: [
            {
              path: '',
              name: 'DirectaRedirect',
              redirect: {
                name: 'DenunciaDirectaBandeja'
              }
            },
            {
              path: 'identificacion-denuncia',
              name: 'IdentificacionDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/IdentificacionDenuncia.vue')
            },
            {
              path: 'buscar-duplicidad',
              name: 'BuscarDuplicidadDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/BuscarDuplicidad.vue')
            },
            {
              path: 'sujetos-intervinientes',
              name: 'SujetosIntervinientesDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/SujetosIntervinientes.vue')
            },
            {
              path: 'delitos',
              name: 'DelitosDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/Delitos.vue')
            },
            {
              path: 'relaciones',
              name: 'RelacionesDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/Relaciones.vue')
            },
            {
              path: 'especies-dinero',
              name: 'EspeciesDineroDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/EspeciesDinero.vue')
            },
            {
              path: 'relatos',
              name: 'RelatosDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/Relatos.vue')
            },
            {
              path: 'documentos',
              name: 'DocumentosDenunciaDirecta',
              component: () => import('@/modules/ingreso/views/nueva-atencion/Documentos.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Nueva Denuncia',
              previousTo: { name: 'BandejaDenunciaDirecta' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Denuncia Directa'
        }
      }
    },
    {
      path: 'denuncia-oficio',
      name: 'IndexDenunciaOficio',
      component: () => import('@/modules/ingreso/views/IndexDenunciaOficio.vue'),
      children: [
        {
          path: '',
          name: 'BandejaDenunciaOficio',
          component: () => import('@/modules/ingreso/views/BandejaDenunciaOficio.vue'),
          props: route => ({ query: route.query.q })
        },
        {
          path: 'nueva-denuncia',
          name: 'NuevaDenunciaOficio',
          component: () => import('@/modules/ingreso/views/NuevaDenunciaOficio.vue'),
          children: [
            {
              path: '',
              name: 'OficioRedirect',
              redirect: {
                name: 'DenunciaOficioBandeja'
              }
            },
            {
              path: 'identificacion-denuncia',
              name: 'IdentificacionDenunciaOficio',
              component: () => import('@/modules/ingreso/views/denuncia-oficio/IdentificacionDenuncia.vue')
            },
            {
              path: 'sujetos-intervinientes',
              name: 'SujetosIntervinientesDenunciaOficio',
              component: () => import('@/modules/ingreso/views/denuncia-oficio/SujetosIntervinientes.vue')
            },
            {
              path: 'delitos',
              name: 'DelitosDenunciaOficio',
              component: () => import('@/modules/ingreso/views/denuncia-oficio/Delitos.vue')
            },
            {
              path: 'relaciones',
              name: 'RelacionesDenunciaOficio',
              component: () => import('@/modules/ingreso/views/denuncia-oficio/Relaciones.vue')
            },
            {
              path: 'especies-dinero',
              name: 'EspeciesDineroDenunciaOficio',
              component: () => import('@/modules/ingreso/views/denuncia-oficio/EspeciesDinero.vue')
            },
            {
              path: 'relato',
              name: 'RelatoDenunciaOficio',
              component: () => import('@/modules/ingreso/views/denuncia-oficio/Relato.vue')
            },
            {
              path: 'documentos',
              name: 'DocumentosDenunciaOficio',
              component: () => import('@/modules/ingreso/views/denuncia-oficio/Documentos.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Nueva Denuncia',
              previousTo: { name: 'BandejaDenunciaOficio' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Denuncia Oficio'
        }
      }
    },
    {
      path: 'validar-duplicidad',
      name: 'DOValidarDuplicidad',
      component: () => import('@/modules/ingreso/views/ValidarDuplicidad.vue'),
      meta: {
        breadcrumb: {
          label: 'Validar Duplicidad'
        }
      }
    },
    {
      path: 'registrar-parte',
      name: 'RegistroPartes',
      component: () => import('@/modules/ingreso/views/RegistroParte.vue'),
      children: [
        {
          path: '',
          name: 'RedirectRegistroPartes',
          redirect: { name: 'RegistroParte' }
        },
        {
          path: 'registro',
          name: 'RegistroParte',
          component: () => import('@/modules/ingreso/views/registro-parte-denuncia/RegistroParteDenuncia.vue')
        },
        {
          path: 'detalle-denuncia',
          name: 'DetalleDenuncia',
          component: () => import('@/modules/ingreso/views/registro-parte-denuncia/DetalleDenuncia.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Registrar Parte'
        }
      }
    },
    {
      path: 'solicitar-documentacion',
      name: 'SolicitarDocumentacion',
      component: () => import('@/modules/ingreso/views/IndexSolicitarDocumentacionFaltante.vue'),
      children: [
        {
          path: '',
          name: 'BandejaSolicitarDocumentacion',
          component: () => import('@/modules/ingreso/views/BandejaSolicitarDocumentacionFaltante.vue')
        },
        {
          path: 'faltante',
          name: 'FaltanteSolicitarDocumentacion',
          component: () => import('@/modules/ingreso/views/SolicitarDocumentacionFaltante.vue'),
          children: [
            {
              path: '',
              name: 'redirectSolicitarDocumentacion',
              redirect: 'SolicitarDocumentacion'
            },
            {
              path: 'documentos-solicitar',
              name: 'DocumentosSolicitarDocumentacion',
              component: () => import('@/modules/ingreso/views/documentacion-faltante/SolicitarDocumentacionParteDenuncia.vue')
            },
            {
              path: 'plantilla-documentos-solicitar',
              name: 'PlantillaDocumentosSolicitarDocumentacion',
              component: () => import('@/modules/ingreso/views/documentacion-faltante/SolicitarDocumentacionPlantilla.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Faltante',
              previousTo: { name: 'BandejaSolicitarDocumentacion' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Solicitar Documentación'
        }
      }
    },
    {
      path: 'denuncia-fisica',
      name: 'DenunciaFisica',
      component: () => import('@/modules/ingreso/views/IndexDenunciaFisica.vue'),
      children: [
        {
          path: '',
          name: 'BandejaDenunciaFisica',
          component: () => import('@/modules/ingreso/views/BandejaDenunciaFisica.vue'),
          props: route => ({ query: route.query.q })
        },
        {
          path: 'nueva-denuncia',
          name: 'NuevaDenunciaFisica',
          component: () => import('@/modules/ingreso/views/NuevaDenunciaFisica.vue'),
          children: [
            {
              path: 'identificacion-denuncia',
              name: 'IdentificacionDenunciaFisica',
              component: () => import('@/modules/ingreso/views/denuncia-fisica/IdentificacionDenuncia.vue')
            },
            {
              path: 'sujetos-intervinientes',
              name: 'SujetosIntervinientesDenunciaFisica',
              component: () => import('@/modules/ingreso/views/denuncia-fisica/SujetosIntervinientes.vue')
            },
            {
              path: 'delitos',
              name: 'DelitosDenunciaFisica',
              component: () => import('@/modules/ingreso/views/denuncia-fisica/Delitos.vue')
            },
            {
              path: 'relaciones',
              name: 'RelacionesDenunciaFisica',
              component: () => import('@/modules/ingreso/views/denuncia-fisica/Relaciones.vue')
            },
            {
              path: 'especies-dinero',
              name: 'EspeciesDineroDenunciaFisica',
              component: () => import('@/modules/ingreso/views/denuncia-fisica/EspeciesDinero.vue')
            },
            {
              path: 'relato',
              name: 'RelatoDenunciaFisica',
              component: () => import('@/modules/ingreso/views/denuncia-fisica/Relato.vue')
            },
            {
              path: 'documentos',
              name: 'DocumentosDenunciaFisica',
              component: () => import('@/modules/ingreso/views/denuncia-fisica/Documentos.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Nueva Denuncia',
              previousTo: { name: 'BandejaDenunciaFisica' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Denuncia Física'
        }
      }
    }
  ]
}
