export default {
  path: 'dirigir-investigacion',
  component: () => import('@/modules/dirigir-investigacion/views/Index.vue'),
  children: [
    {
      path: '',
      name: 'BandejaDirigirInvestigacion',
      component: () => import('@/modules/dirigir-investigacion/views/BandejaDirigirInvestigacion.vue')
    },
    {
      path: 'revisar-antecedentes',
      name: 'DIRevisarAntecedentes',
      component: () => import('@/modules/dirigir-investigacion/views/RevisarAntecedentesCausa.vue'),
      children: [
        {
          path: '',
          name: 'redirectRevisarAntecedentes',
          redirect: {
            name: 'DIRAResumenCausa'
          }
        },
        {
          path: 'resumen-causa',
          name: 'DIRAResumenCausa',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/ResumenCausa.vue')
        },
        {
          path: 'intervinientes',
          name: 'DIRASujetosIntervinientes',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/SujetosIntervinientes.vue')
        },
        {
          path: 'delitos',
          name: 'DIRADelitos',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/Delitos.vue')
        },
        {
          path: 'relaciones',
          name: 'DIRARelaciones',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/Relaciones.vue')
        },
        {
          path: 'especies-dinero',
          name: 'DIRAEspeciesDinero',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/EspeciesDinero.vue')
        },
        {
          path: 'relato',
          name: 'DIRARelato',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/Relato.vue')
        },
        {
          path: 'documentos',
          name: 'DIRADocumentos',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/Documentos.vue')
        },
        {
          path: 'diligencias',
          name: 'DIRADiligencias',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/Diligencias.vue')
        },
        {
          path: 'historial-causa',
          name: 'DIRAHistorialCausa',
          component: () => import('@/modules/dirigir-investigacion/views/revisar-antecedentes-causa/HistorialCausa.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Revisar Antecedentes de la Causa',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/ingresar-directriz',
      name: 'DIIngresarDirectrizInvestigacion',
      component: () => import('@/modules/dirigir-investigacion/views/IngresarDirectrizInvestigacion.vue'),
      meta: {
        breadcrumb: {
          label: 'Ingresar Directriz de Investigación',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/actualizar-directriz',
      name: 'DIActualizarDirectrizInvestigacion',
      component: () => import('@/modules/dirigir-investigacion/views/IngresarDirectrizInvestigacion.vue'),
      meta: {
        breadcrumb: {
          label: 'Actualizar Directriz de Investigación',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion',
      name: 'DIDesarrolloInvestigacion',
      component: () => import('@/modules/dirigir-investigacion/views/DesarrolloInvestigacion.vue'),
      meta: {
        breadcrumb: {
          label: 'Desarrollo de la Investigación',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/instruir-diligencias',
      name: 'DIInstruirDiligencias',
      component: () => import('@/modules/dirigir-investigacion/views/InstruirDiligencias.vue'),
      meta: {
        breadcrumb: {
          label: 'Instruir Diligencias',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/solicitud',
      name: 'DISolicitudCitacionComunicacion',
      children: [
        {
          path: 'comunicacion',
          name: 'DISolicitudComunicacion',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/SolicitudCitacionComunicacion.vue'),
          children: [
            {
              path: '',
              name: 'RedirectResumenComunicacion',
              redirect: { name: 'DISComunicacionResumen' }
            },
            {
              path: 'resumen',
              name: 'DISComunicacionResumen',
              component: () => import('@/modules/dirigir-investigacion/views/solicitudes/citacion-comunicacion/Resumen.vue')
            },
            {
              path: 'elaboracion-escrito',
              name: 'DISComunicacionElaboracionEscrito',
              component: () => import('@/modules/dirigir-investigacion/views/solicitudes/citacion-comunicacion/ElaboracionEscrito.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Comunicación',
              previousTo: { name: 'DIDesarrolloInvestigacion' }
            }
          }
        },
        {
          path: 'citacion',
          name: 'DISolicitudCitacion',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/SolicitudCitacionComunicacion.vue'),
          children: [
            {
              path: '',
              name: 'RedirectResumenCitacion',
              redirect: { name: 'DISCitacionResumen' }
            },
            {
              path: 'resumen',
              name: 'DISCitacionResumen',
              component: () => import('@/modules/dirigir-investigacion/views/solicitudes/citacion-comunicacion/Resumen.vue')
            },
            {
              path: 'elaboracion-escrito',
              name: 'DISCitacionElaboracionEscrito',
              component: () => import('@/modules/dirigir-investigacion/views/solicitudes/citacion-comunicacion/ElaboracionEscrito.vue')
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Citación',
              previousTo: { name: 'DIDesarrolloInvestigacion' }
            }
          }
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Desarrollo de la Investigación',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/solicitar-audiencia-formalizacion',
      name: 'DISolicitarAudienciaFormalizacion',
      component: () => import('@/modules/dirigir-investigacion/views/solicitudes/SolicitarAudienciaFormalizacion.vue'),
      children: [
        {
          path: '',
          name: 'RedirectRelacionFormalizar',
          redirect: { name: 'DISAFRelacionAFormalizar' }
        },
        {
          path: 'relacion-a-formalizar',
          name: 'DISAFRelacionAFormalizar',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/RelacionAFormalizar.vue')
        },
        {
          path: 'agregar-medidas-cautelares',
          name: 'DISAFAgregarMedidasCautelares',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/AgregarMedidasCautelares.vue')
        },
        {
          path: 'elaborar-solicitud-audiencia',
          name: 'DISAFElaborarSolicitudAudiencia',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/formalizacion/ElaborarSolicitudAudienciaFormalizacion.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Solicitar Audiencia de Formalización',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/solicitar-orden-detencion',
      name: 'DISolicitarOrdenDetencion',
      component: () => import('@/modules/dirigir-investigacion/views/solicitudes/SolicitarOrdenDetencion.vue'),
      children: [
        {
          path: '',
          name: 'RedirectOrdenDetencion',
          redirect: { name: 'DISODRelacionAFormalizar' }
        },
        {
          path: 'relacion-a-formalizar',
          name: 'DISODRelacionAFormalizar',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/RelacionAFormalizar.vue')
        },
        {
          path: 'agregar-medidas-cautelares',
          name: 'DISODAgregarMedidasCautelares',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/AgregarMedidasCautelares.vue')
        },
        {
          path: 'elaborar-solicitud-audiencia',
          name: 'DISODElaborarSolicitudAudiencia',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/orden-detencion/ElaborarSolicitudAudienciaOrdenDetencion.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Solicitar Orden de Detención',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/solicitar-medidas-cautelares-intrusivas',
      name: 'DISolicitarMedidasCautelaresIntrusivas',
      component: () => import('@/modules/dirigir-investigacion/views/solicitudes/SolicitarMedidasCautelaresIntrusivas.vue'),
      children: [
        {
          path: '',
          name: 'RedirectSolicitarMedidasCautelaresIntrusivas',
          redirect: { name: 'DISMCIRelacionAFormalizar' }
        },
        {
          path: 'relacion-a-formalizar',
          name: 'DISMCIRelacionAFormalizar',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/RelacionAFormalizar.vue')
        },
        {
          path: 'agregar-medidas-cautelares',
          name: 'DISMCIAgregarMedidasCautelares',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/AgregarMedidasCautelares.vue')
        },
        {
          path: 'elaborar-solicitud-audiencia',
          name: 'DISMCIElaborarSolicitudMedidasCautelares',
          component: () => import('@/modules/dirigir-investigacion/views/solicitudes/medidas-cautelares/ElaborarSolicitudMedidasCautelares.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Solicitar Medidas Cautelares o Intrusivas por Escrito',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/registro-autorizacion-medidas',
      name: 'DIRegistroAutorizacionTelefonicaMedidas',
      component: () => import('@/modules/dirigir-investigacion/views/RegistroAutorizacionTelefonicaMedidas.vue'),
      meta: {
        breadcrumb: {
          label: 'Registro de Autorización Telefónica de Medidas Instrusivas o Cautelares',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'desarrollo-investigacion/definir-curso-causa',
      name: 'DIDefinirCursoCausa',
      component: () => import('@/modules/dirigir-investigacion/views/definir-curso/DefinirCursoCausa.vue'),
      children: [
        {
          path: 'agrupar-causa',
          name: 'DIDCCAgruparCausas',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/causa/AgruparCausas.vue')
        },
        {
          path: 'separar-causa',
          name: 'DIDCCSepararCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/causa/SepararCausa.vue')
        },
        {
          path: 'transferir-causa',
          name: 'DIDCCTransferirCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/causa/TransferirCausa.vue')
        },
        {
          path: 'cierre-investigacion-causa',
          name: 'DIDCCCierreInvestigacionCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/causa/CierreInvestigacion.vue')
        },
        {
          path: 'suspension-causa',
          name: 'DIDCCSuspensionCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/causa/SuspensionCausa.vue')
        },
        {
          path: 'termino-causa',
          name: 'DIDCCTerminoCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/causa/TerminoCausa.vue')
        },
        {
          path: 'cierre-investigacion-relacion-causa',
          name: 'DIDCCCierreInvestigacionRelacionCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/relacion/CierreInvestigacion.vue')
        },
        {
          path: 'suspension-relacion-causa',
          name: 'DIDCCSuspensionRelacionCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/relacion/SuspensionRelacion.vue')
        },
        {
          path: 'termino-relacion-causa',
          name: 'DIDCCTerminoRelacionCausa',
          component: () => import('@/modules/dirigir-investigacion/views/definir-curso/relacion/TerminoRelacion.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Definir Curso de la Causa',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'analizar-causas-a-agrupar',
      name: 'DIAnalizarCausasAgrupar',
      component: () => import('@/modules/dirigir-investigacion/views/AnalizarCausasAgrupar.vue'),
      children: [
        {
          path: '',
          name: 'RedirectAnalizarCausasAgrupar',
          redirect: { name: 'DIACADefinirCausasAgrupar' }
        },
        {
          path: 'definir-causas-a-agrupar',
          name: 'DIACADefinirCausasAgrupar',
          component: () => import('@/modules/dirigir-investigacion/views/analizar-causas-agrupar/DefinirCausasAgrupar.vue')
        },
        {
          path: 'definir-delitos-y-relaciones',
          name: 'DIACADefinirDelitosRelaciones',
          component: () => import('@/modules/dirigir-investigacion/views/analizar-causas-agrupar/DefinirDelitosRelaciones.vue')
        },
        {
          path: 'definir-especies',
          name: 'DIACADefinirEspecies',
          component: () => import('@/modules/dirigir-investigacion/views/analizar-causas-agrupar/DefinirEspecies.vue')
        },
        {
          path: 'definir-especies',
          name: 'DIACADefinirEspecies',
          component: () => import('@/modules/dirigir-investigacion/views/analizar-causas-agrupar/DefinirEspecies.vue')
        },
        {
          path: 'resumen-agrupacion',
          name: 'DIACAResumenAgrupacion',
          component: () => import('@/modules/dirigir-investigacion/views/analizar-causas-agrupar/ResumenAgrupacion.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Analizar Causas a Agrupar',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'definir-nueva-causa',
      name: 'DIDefinirNuevaCausa',
      component: () => import('@/modules/dirigir-investigacion/views/DefinirNuevaCausa.vue'),
      meta: {
        breadcrumb: {
          label: 'Definir Nueva Causa',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'consultar-cierre-investigacion',
      name: 'DIConsultarCierreInvestigacion',
      component: () => import('@/modules/dirigir-investigacion/views/ConsultarCierreInvestigacion.vue'),
      meta: {
        breadcrumb: {
          label: 'Consultar Cierre de Investigación',
          previousTo: { name: 'DIDesarrolloInvestigacion' }
        }
      }
    },
    {
      path: 'comunicar-cierre-investigacion',
      name: 'DIComunicarCierreInvestigacion',
      component: () => import('@/modules/dirigir-investigacion/views/comunicar-cierre/ComunicarCierreInvestigacion.vue'),
      children: [
        {
          path: 'investigacion-por-escrito',
          name: 'DICCEscrito',
          component: () => import('@/modules/dirigir-investigacion/views/comunicar-cierre/ComunicarCierreEscrito.vue')
        },
        {
          path: 'investigacion-solicitar-audiencia-1',
          name: 'DICCSolicitudAudienciaSinDefinir',
          component: () => import('@/modules/dirigir-investigacion/views/comunicar-cierre/solicitar-audiencia/SolicitarAudienciaSinDefinir.vue')
        },
        {
          path: 'investigacion-solicitar-audiencia-2',
          name: 'DICCSolicitudAudienciaAcusacion',
          component: () => import('@/modules/dirigir-investigacion/views/comunicar-cierre/solicitar-audiencia/SolicitarAudienciaAcusacion.vue')
        },
        {
          path: 'investigacion-solicitar-audiencia-3',
          name: 'DICCSolicitudAudienciaNoPerseverar',
          component: () => import('@/modules/dirigir-investigacion/views/comunicar-cierre/solicitar-audiencia/SolicitarAudienciaNoPerseverar.vue')
        },
        {
          path: 'investigacion-preparar-escrito',
          name: 'DICCSolicitudAudienciaPrepararEscrito',
          component: () => import('@/modules/dirigir-investigacion/views/comunicar-cierre/solicitar-audiencia/SolicitarAudienciaPrepararEscrito.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Comunicar Cierre o Solicitar Audiencia de Cierre',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'evaluar-resultado-cierre',
      name: 'DIEvaluarResultadoCierre',
      component: () => import('@/modules/dirigir-investigacion/views/EvaluarResultadoCierre.vue'),
      meta: {
        breadcrumb: {
          label: 'Evaluar Resultado de Cierre',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'preparar-acusacion',
      name: 'DIPrepararAcusacion',
      component: () => import('@/modules/dirigir-investigacion/views/preparar-acusacion/PrepararAcusacion.vue'),
      children: [
        // {
        //   path: '',
        //   redirect: { name: 'DIPAGeneral' }
        // },
        {
          path: 'general',
          name: 'DIPAGeneral',
          component: () => import('@/modules/dirigir-investigacion/views/preparar-acusacion/PrepararAcusacionGeneral.vue')
        },
        {
          path: 'escrito',
          name: 'DIPAEscrito',
          component: () => import('@/modules/dirigir-investigacion/views/preparar-acusacion/PrepararAcusacionEscrito.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Preparar Escrito para Acusación',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'revisar-respuesta',
      name: 'DIRevisarRespuesta',
      component: () => import('@/modules/dirigir-investigacion/views/RevisarRespuesta.vue'),
      meta: {
        breadcrumb: {
          label: 'Revisar Respuesta PJUD por Cierre de Investigación',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
        }
      }
    },
    {
      path: 'solicitar-agrupacion',
      name: 'DISolicitarAgrupacion',
      component: () => import('@/modules/dirigir-investigacion/views/SolicitarAgrupacion.vue'),
      meta: {
        breadcrumb: {
          label: 'Solicitar agrupación',
          previousTo: { name: 'BandejaDirigirInvestigacion' }
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
