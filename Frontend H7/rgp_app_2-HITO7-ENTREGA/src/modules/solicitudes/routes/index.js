export default {
  path: 'solicitudes',
  component: () => import('@/modules/solicitudes/views/Index.vue'),
  children: [
    {
      path: 'completar-solicitar',
      name: 'completarSolicitar',
      component: () => import('@/modules/solicitudes/views/CompletarSolicitar.vue'),
      children: [
        {
          path: '',
          name: 'redirectcompletarSolicitar',
          redirect: { name: 'solicitudResumenRelacionesEspecies' }
        },
        {
          path: 'resumen-relaciones-especies',
          name: 'solicitudResumenRelacionesEspecies',
          component: () => import('@/modules/solicitudes/components/ResumenRelacionesEspecies.vue')
        },
        {
          path: 'medidas-cautelares',
          name: 'solicitudMedidasCautelares',
          component: () => import('@/modules/solicitudes/components/medidas-cautelares/AgregarMedidasCautelares.vue')
        },
        {
          path: 'elaborar-escrito',
          name: 'solicitudElaborarEscrito',
          component: () => import('@/modules/solicitudes/components/citacion-comunicacion/ElaborarEscrito.vue')
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
      path: 'citacion',
      name: 'solicitudCitacion',
      component: () => import('@/modules/solicitudes/views/SolicitudDeCitacion')
    },
    {
      path: 'comunicacion',
      name: 'solicitudComunicacion',
      component: () => import('@/modules/solicitudes/views/SolicitudDeComunicacion'),
      children: [
        {
          path: 'resumen-relacion',
          name: 'solicitudDeComunicacionResumenRelacion',
          component: () => import('@/modules/solicitudes/components/citacion-comunicacion/ResumenRelacion.vue')
        },
        {
          path: 'elaborar-escrito',
          name: 'solicitudDeComunicacionEleborarEscrito',
          component: () => import('@/modules/solicitudes/components/citacion-comunicacion/ElaborarEscrito.vue')
        }
      ]
    },

    {
      path: 'otro-tipo',
      name: 'solicitudesDeOtroTipo',
      component: () => import('@/modules/solicitudes/views/SolicitudesDeOtroTipo.vue'),
      children: [
        {
          path: 'resumen-relacion',
          name: 'solicitudesOtroTipoResumenRelacion',
          component: () => import('@/modules/solicitudes/components/citacion-comunicacion/ResumenRelacion.vue')
        },
        {
          path: 'agregar-medidas-cautelares',
          name: 'solicitudesOtroTipoMedidasCautelares',
          component: () => import('@/modules/solicitudes/components/medidas-cautelares/AgregarMedidasCautelares.vue')
        },
        {
          path: 'elaborar-escrito',
          name: 'solicitudesOtroTipoElaborarEscrito',
          component: () => import('@/modules/solicitudes/components/citacion-comunicacion/ElaborarEscrito.vue')
        }
      ]
    },

    {
      path: 'autorizacion-de-diligencias',
      name: 'solicitudDeCAutorizacionDeDiligencias',
      component: () => import('@/modules/solicitudes/views/SolicitudDeAutorizacionDeDiligencias.vue'),
      children: [
        {
          path: 'resumen-relacion',
          name: 'solicitudAutorizacionDiligenciaResumenRelacion',
          component: () => import('@/modules/solicitudes/components/ResumenRelacionesEspecies.vue')
        },
        {
          path: 'agregar-medidas-intrusivas',
          name: 'solicitudAutorizacionDiligenciasMedidasIntrusivas',
          component: () => import('@/modules/solicitudes/components/medidas-cautelares/AgregarMedidasCautelares.vue')
        },
        {
          path: 'elaborar-escrito',
          name: 'solicitudAutorizacionDiligenciasElaborarEscrito',
          component: () => import('@/modules/solicitudes/components/citacion-comunicacion/ElaborarEscrito.vue')
        }
      ]
    }
  ],
  meta: {
    breadcrumb: {
      label: 'Bandeja fiscal'
    }
  }
}
