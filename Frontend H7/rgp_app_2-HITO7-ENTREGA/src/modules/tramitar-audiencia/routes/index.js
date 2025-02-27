export default {
  path: 'tramitar-audiencia',
  component: () => import('@/modules/tramitar-audiencia/views/Index.vue'),
  children: [
    {
      path: '',
      name: 'TABandejaTramitarAudiencia',
      component: () => import('@/modules/tramitar-audiencia/views/bandeja/BandejaTramitarAudiencia.vue')
    },
    {
      path: 'solicitar-audiencia',
      name: 'TASolicitarAudiencia',
      component: () => import('@/modules/tramitar-audiencia/views/solicitar-audiencia/SolicitarAudiencia.vue'),
      children: [
        {
          path: '',
          name: 'RedirectSolicitarAudiencia',
          redirect: { name: 'ResumenRelacionesEspecies' }
        },
        {
          path: 'resumen-relaciones-especies',
          name: 'ResumenRelacionesEspecies',
          component: () => import('@/modules/tramitar-audiencia/views/solicitar-audiencia/steps/ResumenRelacionesEspecies.vue')
        },
        {
          path: 'medidas-cautelares',
          name: 'MedidasCautelares',
          component: () => import('@/modules/tramitar-audiencia/views/solicitar-audiencia/steps/MedidasCautelares.vue')
        },
        {
          path: 'elaborar-escrito',
          name: 'ElaborarEscrito',
          component: () => import('@/modules/tramitar-audiencia/views/solicitar-audiencia/steps/ElaborarEscrito.vue')
        }
      ]
    },
    {
      path: 'evaluar-resolucion',
      name: 'TAEvaluarResolucionTribunal',
      component: () => import('@/modules/tramitar-audiencia/views/EvaluarResolucionTribunal.vue')
    },
    {
      path: 'actualizar-minuta',
      name: 'TAActualizarMinutaAudiencia',
      component: () => import('@/modules/tramitar-audiencia/views/ActualizarMinuta.vue')
    },
    {
      path: 'gestionar-previo-resolver',
      name: 'TAGestionarPrevioResolver',
      component: () => import('@/modules/tramitar-audiencia/views/RevisarRespuestaPJUD.vue')
    },
    {
      path: 'nomina-detenidos-a-ACD',
      name: 'TANominaDetenidosACD',
      component: () => import('@/modules/tramitar-audiencia/views/NominaDetenidosaACD.vue')
    },
    {
      path: 'revisar-minuta-y-agendar-audiencia',
      name: 'TARevisarMinutaAgendarAudiencia',
      component: () => import('@/modules/tramitar-audiencia/views/RevisarMinutaAgendarAudiencia.vue')
    },
    {
      path: 'vista-audiencia',
      name: 'TAVistaAudiencia',
      component: () => import('@/modules/tramitar-audiencia/views/vista-audiencia/VistaDeAudiencia.vue'),
      children: [
        {
          path: 'minuta-audiencia',
          name: 'TAVAMinutaAudiencia',
          component: () => import('@/modules/tramitar-audiencia/views/vista-audiencia/tabs/MinutaAudiencia.vue')
        },
        {
          path: 'antecedentes-causa',
          name: 'TAVAAntecedentesCausa',
          component: () => import('@/modules/tramitar-audiencia/views/vista-audiencia/tabs/AntecedentesCausa.vue')
        },
        {
          path: 'diligencias',
          name: 'TAVADiligencias',
          component: () => import('@/modules/tramitar-audiencia/views/vista-audiencia/tabs/Diligencias.vue')
        },
        {
          path: 'documentos',
          name: 'TAVADocumentos',
          component: () => import('@/modules/tramitar-audiencia/views/vista-audiencia/tabs/Documentos.vue')
        },
        {
          path: 'historial',
          name: 'TAVAHistorial',
          component: () => import('@/modules/tramitar-audiencia/views/vista-audiencia/tabs/Historial.vue')
        },
        {
          path: 'registro-audiencia',
          name: 'TAVARegistroAudiencia',
          component: () => import('@/modules/tramitar-audiencia/views/vista-audiencia/tabs/RegistroAudiencia.vue')
        }
      ]
    },
    {
      path: 'consolidar-resultado-audiencia',
      name: 'TAConsolidarResultadoAudiencia',
      component: () => import('@/modules/tramitar-audiencia/views/ConsolidarResultadoAudiencia.vue')
    }
  ],
  meta: {
    breadcrumb: {
      label: 'Tramitar Audiencia'
    }
  }
}
