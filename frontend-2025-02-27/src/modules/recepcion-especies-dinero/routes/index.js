export default {
  path: 'custodia',
  component: () =>
    import('@/modules/recepcion-especies-dinero/views/Index.vue'),
  children: [
    {
      path: '',
      redirect: {
        name: 'Inicio'
      }
    },
    {
      path: 'custodio',
      name: 'IndexCustodio',
      component: () =>
        import('@/modules/recepcion-especies-dinero/views/IndexCustodio.vue'),
      children: [
        {
          path: '',
          name: 'BandejaCustodio',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/BandejaCustodio.vue'
            )
        },
        {
          path: 'nueva-recepcion',
          name: 'NuevaRecepcion',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/RecepcionEspecieDinero'
            ),
          children: [
            {
              path: 'identificacion-nue',
              name: 'IdentificacionNue',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nueva-recepcion/IdentificacionNue.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Recepción de Especies y Dinero',
                  previousTo: { name: 'BandejaCustodio' }
                }
              }
            },
            {
              path: 'especies-incautadas-pendientes-de-recepcion',
              name: 'EspeciesIncautadasPendientesDeRecepcion',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nueva-recepcion/EspeciesIncautadasPendientesDeRecepcion.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Recepción de Especies y Dinero',
                  previousTo: { name: 'BandejaCustodio' }
                }
              }
            },
            {
              path: 'comprobante-de-recepcion-rechazo',
              name: 'ComprobanteDeRecepcionORechazo',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nueva-recepcion/ComprobanteDeRecepcionORechazo.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Recepción de Especies y Dinero',
                  previousTo: { name: 'BandejaCustodio' }
                }
              }
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Nueva Recepcion'
            }
          }
        },
        {
          path: 'ingresar-transferencia-especie',
          name: 'IngresarTransferenciaEspecie',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/IngresarTransferenciaEspecie'
            ),
          children: [
            {
              path: 'ingreso-de-nue',
              name: 'IngresoDeNue',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/IngresodeNue.vue'
                )
            },
            {
              path: 'ingresar-datos-adicionales',
              name: 'IngresarDatosAdicionalesTransferencia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/IngresarDatosAdicionales.vue'
                )
            },
            {
              path: 'asignar-ubicacion',
              name: 'AsignarUbicacionTransferencia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/AsignarUbicacion.vue'
                )
            },
            {
              path: 'generar-etiqueta-ingreso',
              name: 'GenerarEtiquetaIngresoTransferencia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/GenerarEtiqueta.vue'
                )
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Transferencia de Especie'
            }
          }
        },
        {
          path: 'nuevo-ingreso',
          name: 'NuevoIngreso',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/IngresoEspecieDinero'
            ),
          children: [
            {
              path: 'ingresar-datos-adicionales',
              name: 'IngresarDatosAdicionales',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/IngresarDatosAdicionales.vue'
                )
            },
            {
              path: 'fijacion-fotografica',
              name: 'FijacionFotografica',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/FijacionFotografica.vue'
                )
            },
            {
              path: 'asignar-ubicacion',
              name: 'AsignarUbicacion',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/AsignarUbicacion.vue'
                )
            },
            {
              path: 'generar-etiqueta-ingreso',
              name: 'GenerarEtiquetaIngreso',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/nuevo-ingreso/GenerarEtiqueta.vue'
                )
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Nuevo Ingreso'
            }
          }
        },
        {
          path: 'validar-factibilidad-entrega',
          name: 'ValidarFactibilidadEntrega',
          component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-dinero/ValidarFactibilidadEntrega'),
          meta: {
            breadcrumb: {
              label: 'Validar factibilidad entrega'
            }
          }
        },
        {
          path: 'registrar-salida-definitiva-dinero',
          name: 'RegistrarSalidaDefinitivaDinero',
          component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-dinero/RegistrarSalidaDefinitivaDinero'),
          children: [
            {
              path: 'registrar-salida-definitiva',
              name: 'RegistrarSalidaDefinitiva',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/salida-definitiva-dinero/steps-registrar-salida-definitiva/RegistrarSalidaDefinitiva.vue'
                )
            },
            {
              path: 'generar-comprobante-entrega',
              name: 'GenerarComprobanteEntrega',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/salida-definitiva-dinero/steps-registrar-salida-definitiva/GenerarComprobanteEntrega.vue'
                )
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Registrar Salida Definitiva'
            }
          }
        },
        {
          path: 'preparar-salida-definitiva-dinero',
          name: 'PrepararSalidaDefinitivaDineros',
          component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-dinero/PrepararSalidaDefinitivaDineros'),
          meta: {
            breadcrumb: {
              label: 'Salida Transferencia Dineros en Depósito'
            }
          }
        },
        {
          path: 'cadena-custodio',
          name: 'CadenaCustodio',
          component: () =>
            import('@/modules/recepcion-especies-dinero/views/Index.vue'),
          children: [
            {
              path: 'solicitud-de-nues',
              name: 'SolicitudDeNue',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/cadena-custodio/SolicitudDeNues.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Solicitud de NUES',
                  previousTo: { name: 'CadenaCustodio' }
                }
              }
            },
            {
              path: 'levantar-cadena-custodia',
              name: 'LeventarCadenaCustodia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/cadena-custodio/LevantarCadenaCustodia.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Levantar Cadena Custodio',
                  previousTo: { name: 'CadenaCustodio' }
                }
              }
            },
            {
              path: 'ver-cadena-custodia',
              name: 'VerCadenaCustodia',
              props: true,
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/cadena-custodio/VerCadenaCustodia.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Consultar Cadena Custodia',
                  previousTo: { name: 'CadenaCustodio' }
                }
              }
            },
            {
              path: 'agregar-eslabon',
              name: 'AgregarEslabon',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/cadena-custodio/AgregarEslabon.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Agregar Eslabón',
                  previousTo: { name: 'CadenaCustodio' }
                }
              }
            },
            {
              path: 'observacion-cadena-custodia',
              name: 'ObservacionCadenaCustodia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/cadena-custodio/ObservacionCadenaCustodia.vue'
                ),
              meta: {
                breadcrumb: {
                  label: 'Observación a Cadena de Custodia',
                  previousTo: { name: 'CadenaCustodio' }
                }
              }
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Cadena Custodio'
            }
          }
        },
        {
          path: 'especie-dinero',
          name: 'EspecieDinero',
          component: () =>
            import('@/modules/recepcion-especies-dinero/views/Index.vue'),
          children: [
            {
              path: 'generar-cupon-de-depositos',
              name: 'GenerarCuponDeDepositos',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/GenerarCuponDeposito.vue'
                )
            },
            {
              path: 'registrar-deposito',
              name: 'RegitrarDeposito',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/registrar-deposito/RegistrarDeposito.vue'
                )
            },
            {
              path: 'registrar-ingreso-caja-fuerte',
              name: 'RegistrarIngresoCajaFuerte',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/registrar-ingreso-caja-fuerte/RegistrarIngresoCajaFuerte.vue'
                )
            },
            {
              path: 'registrar-certificado-de-deposito-a-plazo',
              name: 'RegistrarCertificadoDeDepositoAPlazo',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/registrar-certificado-deposito-plazo/RegistrarCertificadoDeDepositoAPlazo.vue'
                )
            },
            {
              path: 'pronunciamiento-de-evidencia',
              name: 'PronunciamientoDeEvidencia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/pronunciamiento-fiscal/PronunciamientoDeEvidencia.vue'
                )
            },
            {
              path: 'registrar-certificado-de-liquidacion',
              name: 'RegistrarCertificadoDeLiquidacion',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/registrar-certificado-de-liquidacion/RegistrarCertificadoDeLiquidacion.vue'
                )
            },
            {
              path: 'registrar-comprobante-de-transferencia',
              name: 'RegistrarComprobanteDeTransferencia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/RegistrarComprobanteDeTransferencia.vue'
                )
            },
            {
              path: 'salida-por-transferencia-generar-cheque',
              name: 'SalidaPorTransferenciaGenerarCheque',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/SalidaPorTransferenciaGenerarCheque.vue'
                )
            },
            {
              path: 'salida-transferencia-dineros-caja-fuerte',
              name: 'SalidaTransferenciaDinerosCajaFuerte',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/SalidaTransferenciaDinerosCajaFuerte'
                ),
              children: [
                {
                  path: 'step-transferencia-dineros-caja-fuerte',
                  name: 'StepTransferenciaDinerosCajaFuerte',
                  component: () =>
                    import(
                      '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/StepTransferenciaDinerosCajaFuerte.vue'
                    )
                },
                {
                  path: 'step-acta-salida-por-transferencia',
                  name: 'StepActaSalidaPorTransferencia',
                  component: () =>
                    import(
                      '@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-dinero/StepActaSalidaPorTransferencia.vue'
                    )
                }
              ]
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Cadena Custodio'
            }
          }
        },
        {
          path: 'realizar-fijacion-fotografica',
          name: 'RealizarFijacionFotografica', // Nombre de la ruta padre
          component: () => import('@/modules/recepcion-especies-dinero/views/RealizarFijacionFotografica'),
          children: [
            {
              path: 'realizar-fijacion-fotografica',
              // Se omite el nombre de la ruta hija
              component: () => import('@/modules/recepcion-especies-dinero/views/realizar-fijacion-fotografica/RealizarFijacionFotografica.vue')
            }
          ]
        },
        {
          path: 'registrar-inspeccion-visual',
          name: 'RegistrarInspeccionVisual',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/RegistrarInspeccionVisual'
            ),
          children: [
            {
              path: 'datos-inspeccion-visual',
              name: 'DatosInspeccionVisual',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/registrar-inspeccion-visual/DatosInspeccionVisual.vue'
                )
            },
            {
              path: 'comprobante-inspeccion-visual',
              name: 'ComprobanteInspeccionVisual',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/registrar-inspeccion-visual/ComprobanteInspeccionVisual.vue'
                )
            },
            {
              path: 'comprobante-termino-inspeccion-visual',
              name: 'ComprobanteTerminoInspeccionVisual',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/registrar-inspeccion-visual/ComprobanteTerminoInspeccionVisual.vue'
                )
            }
          ],
          meta: {
            breadcrumb: {
              label: 'Registrar Inspección Visual'
            }
          }
        },
        {
          path: 'decidir-reubicacion',
          name: 'DecidirReubicacion',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/DecidirReubicacion'
            ),
          children: [
            {
              path: 'datos-causa-agrupar-principal',
              name: 'DatosCausasAgruparPrincipal',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/decidir-reubicacion/DatosCausasAgruparPrincipal.vue'
                )
            },
            {
              path: 'busqueda-por-rue',
              name: 'DatosCausasBusquedaPorRue',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/decidir-reubicacion/DatosCausasBusquedaPorRue.vue'
                )
            },
            {
              path: 'seleccionar-reubicacion',
              name: 'SeleccionarReubicacion',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/decidir-reubicacion/SeleccionarReubicacion.vue'
                )
            },
            {
              path: 'generar-etiqueta',
              name: 'GenerarEtiqueta',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/decidir-reubicacion/GenerarEtiqueta.vue'
                )
            }
          ]
        },
        {
          path: 'revisar-instruccion',
          name: 'RevisarInstruccion',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/RevisarInstruccion'
            ),
          children: [
            {
              path: 'instruccion-de-destino',
              name: 'InstruccionDeDestino',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/revisar-instruccion/InstruccionDeDestino.vue'
                )
            }
          ]
        },
        {
          path: 'registrar-salida-temporal',
          name: 'RegistrarSalidaTemporal',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/RegistrarSalidaTemporal.vue'
            ),
          children: [
            {
              path: 'registrar-salida-temporal-de-especie',
              name: 'RegistroSalidaTemporalDeEspecie',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/registrar-salida-temporal/RegistroSalidaTemporalDeEspecie.vue'
                )
            },
            {
              path: 'acta-salida-temporal',
              name: 'ActaSalidaTemporal',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/registrar-salida-temporal/ActaSalidaTemporal.vue'
                )
            }
          ]
        },
        {
          path: 'salida-por-transferencia-de-especies',
          name: 'SalidaPorTransferenciaDeEspecies',
          component: () => import('@/modules/recepcion-especies-dinero/views/SalidaPorTransferenciaDeEspecies.vue'),
          children: [
            {
              path: 'revisar-solicitud-salida-transferencia',
              name: 'RevisarSolicitudSalidaTransferencia',
              component: () => import('@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-especies/RevisarSolicitudSalidaTransferencia.vue')
            },
            {
              path: 'acta-salida-por-transferencia-especie',
              name: 'ActaSolicitudSalidaPorTransferenciaEspecie',
              component: () => import('@/modules/recepcion-especies-dinero/components/salida-por-transferencia-de-especies/ActaSolicitudSalidaPorTransferenciaEspecie.vue')
            }
          ]
        },
        {
          path: 'salida-transferencia-dinero',
          name: 'SalidaTransferenciaDinero',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/PrepararSalidaPorTransferencia.vue'
            ),
          children: [
            {
              path: 'revisar-solicitud',
              name: 'RevisarSolicitud',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/salida-transferencia-dinero/RevisarSolicitud.vue'
                )
            },
            {
              path: 'acta-salida-transferencia',
              name: 'ActaSalidaTransferencia',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/salida-transferencia-dinero/ActaSalidaTransferencia.vue'
                )
            }
          ]
        },
        {
          path: 'salida-definitiva-generar-cheque-institucion',
          name: 'SalidaDefinitivaGenerarChequeInstitucion',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/SalidaDefinitivaGenerarChequeInstitucion.vue'
            ),
          children: [
            {
              path: 'validar-dineros-generar-cheque',
              name: 'ValidarDinerosParaGenerarCheque',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/salida-definitiva-generar-cheque-institucion/ValidarDinerosParaGenerarCheque.vue'
                )
            },
            {
              path: 'solicitar-liquidacion-deposito-plazo',
              name: 'SolicitarLiquidacionDeDepositosAPlazo',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/salida-definitiva-generar-cheque-institucion/SolicitarLiquidacionDeDepositosAPlazo.vue'
                )
            },
            {
              path: 'registrar-cheque',
              name: 'RegistrarCheque',
              component: () =>
                import(
                  '@/modules/recepcion-especies-dinero/views/salida-definitiva-generar-cheque-institucion/RegistrarCheque.vue'
                )
            }
          ]
        },
        {
          path: 'salida-transfrerencia-dineros-deposito-metodo-entrega',
          name: 'STDDepositoMetodoEntrega',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/STDDepositoMetodoEntrega.vue'
            )
        },
        {
          path: 'registrar-salida-definitiva-especie-por-destruccion',
          name: 'RSDDestruccion',
          component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-destruccion/RSDDestruccion.vue'),
          children: [
            {
              path: '',
              name: 'RedirectPrimerStep',
              redirect: { name: 'RSDDestruccionListaEspecies' }
            },
            {
              path: 'lista-especies',
              name: 'RSDDestruccionListaEspecies',
              component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-destruccion/steps/RSDDestruccionListaEspecies.vue')
            },
            {
              path: 'registrar-salida',
              name: 'RSDDestruccionRegistrarSalida',
              component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-destruccion/steps/RSDDestruccionRegistrarSalida.vue')
            },
            {
              path: 'orden-de-servicio',
              name: 'RSDDestruccionOrdenDeServicio',
              component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-destruccion/steps/RSDDestruccionOrdenDeServicio.vue')
            }
          ]
        },
        {
          path: 'registro-salida-definitiva-especie-por-destruccion',
          name: 'RSDDFinalizarTarea',
          component: () => import('@/modules/recepcion-especies-dinero/views/salida-definitiva-destruccion/steps/RSDDestruccionRegistrarSalida.vue')
        },
        {
          path: 'registrar-cheque-recibido',
          name: 'RegistrarChequeRecibido',
          component: () => import('@/modules/recepcion-especies-dinero/views/RegistrarChequeRecibido.vue')
        },
        {
          path: 'registrar-datos-dicrep',
          name: 'RegistrarDatosDICREP',
          component: () => import('@/modules/recepcion-especies-dinero/views/registrar-datos-dicrep/Index.vue'),
          children: [
            {
              path: '',
              name: 'RedirectPrimerStep',
              redirect: { name: 'DICREPListaEspecies' }
            },
            {
              path: 'lista-especies',
              name: 'DICREPListaEspecies',
              component: () => import('@/modules/recepcion-especies-dinero/views/registrar-datos-dicrep/steps/DICREPListaEspecies.vue')
            },
            {
              path: 'orden-servicio',
              name: 'DICREPOrdenServicio',
              component: () => import('@/modules/recepcion-especies-dinero/views/registrar-datos-dicrep/steps/DICREPOrdenServicio.vue')
            },
            {
              path: 'oficio-entrega',
              name: 'DICREPOficioEntrega',
              component: () => import('@/modules/recepcion-especies-dinero/views/registrar-datos-dicrep/steps/DICREPOficioEntrega.vue')
            }
          ]
        },
        {
          path: 'registro-datos-dicrep',
          name: 'RegistroDatosDICREP',
          component: () => import('@/modules/recepcion-especies-dinero/views/registrar-datos-dicrep/steps/DICREPOficioEntrega.vue')
        },
        {
          path: 'registrar-incompetencia-juridica',
          name: 'IncompetenciaJuridica',
          component: () => import('@/modules/recepcion-especies-dinero/views/registrar-incompetencia-juridica/IncompetenciaJuridica.vue')
        },
        {
          path: 'registro-incompetencia-juridica',
          name: 'IncompetenciaJuridica2',
          component: () => import('@/modules/recepcion-especies-dinero/views/registrar-incompetencia-juridica/IncompetenciaJuridica.vue')
        },
        {
          path: 'devolucion-o-donacion',
          name: 'DevolucionDonacion',
          component: () => import('@/modules/recepcion-especies-dinero/views/devolcion-donacion/DevolucionDonacion.vue')
        },
        {
          path: 'validar-usuario',
          name: 'ValidarUsuario',
          component: () => import('@/modules/recepcion-especies-dinero/views/validar-usuario/Index.vue'),
          children: [
            {
              path: '',
              name: 'ValidarUsuarioInicio',
              redirect: { name: 'SolicitarValidacionUsuario' }
            },
            {
              path: 'solicitar-validacion',
              name: 'SolicitarValidacionUsuario',
              component: () => import('@/modules/recepcion-especies-dinero/views/validar-usuario/steps/ValidarUsuario.vue')
            },
            {
              path: 'generar-comprobante-entega',
              name: 'ValidacionUsuarioComprobanteEntrega',
              component: () => import('@/modules/recepcion-especies-dinero/views/validar-usuario/steps/GenerarComprobanteEntrega.vue')
            }
          ]
        },
        {
          path: 'entrega-dueno',
          name: 'SalidaDefinitivaEntregaDueno',
          component: () => import('@/modules/recepcion-especies-dinero/views/validar-usuario/steps/GenerarComprobanteEntrega.vue')
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Custodio'
        }
      }
    },
    {
      path: 'fiscal',
      name: 'IndexCustodioFiscal',
      component: () =>
        import(
          '@/modules/recepcion-especies-dinero/views/IndexCustodioFiscal.vue'
        ),
      children: [
        {
          path: '',
          name: 'BandejaCustodioFiscal',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/BandejaCustodioFiscal.vue'
            )
        }
      ],
      meta: {
        breadcrumb: {
          label: 'Fiscal'
        }
      }
    },
    {
      path: 'uaf',
      name: 'IndexCustodioUAF',
      component: () =>
        import(
          '@/modules/recepcion-especies-dinero/views/IndexCustodioUAF.vue'
        ),
      children: [
        {
          path: 'bandeja-custodio-uaf',
          name: 'BandejaCustodioUAF',
          component: () =>
            import(
              '@/modules/recepcion-especies-dinero/views/BandejaCustodioUAF.vue'
            ),
          children: [
            {
              path: 'salida-transferencia-dinero-metodo-entrega',
              name: 'SalidaTransferenciaDineroMetodoEntrega',
              component: () => import('@/modules/recepcion-especies-dinero/views/SalidaTransferenciaDineroMetodoEntrega.vue')
            },
            {
              path: 'registrar-entrega-de-cheque-a-custodio',
              name: 'RegistrarEntregaDeChequeACustodio',
              component: () => import('@/modules/recepcion-especies-dinero/views/RegistrarEntregaDeChequeACustodio.vue')
            }
          ]
        }
      ],
      meta: {
        breadcrumb: {
          label: 'UAF'
        }
      }
    }
  ]
}
