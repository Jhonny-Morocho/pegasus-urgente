import { createRouter, createWebHistory } from 'vue-router'
import flagranciaRoutes from '@/modules/flagrancia/routes'
import preclasificadorRoutes from '@/modules/preclasificador/routes'
import ingresoRoutes from '@/modules/ingreso/routes'
import custodioRoutes from '@/modules/recepcion-especies-dinero/routes/index.js'
import asignacionRoutes from '@/modules/asignacion/routes'
import dirigirInvestigacionRoutes from '@/modules/dirigir-investigacion/routes'
import catalogoDocumentalDigitalRoutes from '@/modules/catalogo-documental-digital/routes'
import terminoPosterminoRoutes from '@/modules/termino-postermino/routes'
// import globlalRoutes from '@/modules/global/routes'
import tramitarAudienciaRoutes from '@/modules/tramitar-audiencia/routes'
import gestionSolicitudesRoutes from '@/modules/gestion-solicitudes/routes'
import fichaCausaRoutes from '@/modules/ficha-causa/routes'
import solicitudesRoutes from '@/modules/solicitudes/routes'

import { requireRolesGuard } from './guards'

const routes = [
  {
    path: '/',
    component: () => import('@/modules/common/layouts/AppLayout.vue'),
    children: [
      {
        path: 'direcciones',
        name: 'direcciones',
        component: () => import('@/modules/direcciones.vue')
      },
      {
        path: '',
        name: 'Inicio',
        component: () => import('@/modules/Index.vue')
      },
      flagranciaRoutes,
      ingresoRoutes,
      preclasificadorRoutes,
      custodioRoutes,
      asignacionRoutes,
      dirigirInvestigacionRoutes,
      catalogoDocumentalDigitalRoutes,
      {
        path: 'ficha-causa/:ruc',
        name: 'FichaCausa',
        component: () => import('@/modules/global/views/FichaCausa.vue')
      },
      terminoPosterminoRoutes,
      // globlalRoutes,
      {
        path: 'ficha-sujeto',
        name: 'FichaSujeto',
        component: () => import('@/modules/ingreso/views/FichaSujeto.vue')
      },
      gestionSolicitudesRoutes,
      fichaCausaRoutes,
      tramitarAudienciaRoutes,
      solicitudesRoutes,
      {
        path: 'formkit-test',
        children: [
          {
            path: 'ar-test',
            name: 'ArTest',
            component: () => import('@/modules/formkit-test/ar-test/views/Index.vue')
          },
          {
            path: 'form-builder',
            name: 'formBuilder',
            component: () => import('@/modules/formkit-test/ar-test/views/FormBuilder.vue')
          },
          {
            path: 'form-sujetos-intervinientes',
            name: 'formSujetosIntervinientes',
            component: () => import('@/modules/formkit-test/ar-test/views/SujetosIntervinientes.vue')
          }
        ]
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/views/Error404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(requireRolesGuard)

export default router
