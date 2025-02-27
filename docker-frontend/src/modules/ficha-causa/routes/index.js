export default {
  path: 'causa',
  children: [
    {
      path: 'ficha-causa/:ruc',
      name: 'FichaCausa',
      component: () => import('@/modules/ficha-causa/views/Index.vue'),
      props: (route) => ({
        ruc: route.params.ruc
      }),
      children: [
        {
          path: '',
          redirect: { name: 'FCInformacionCausa' },
          name: 'RedirectFichaCausa'
        },
        {
          path: 'informacion-causa',
          name: 'FCInformacionCausa',
          component: () => import('@/modules/ficha-causa/views/InformacionCausa.vue'),
          props: (route) => ({
            ruc: route.params.ruc
          })
        },
        {
          path: 'historial-causa',
          name: 'FCHistorialCausa',
          component: () => import('@/modules/ficha-causa/views/HistorialCausa.vue'),
          props: (route) => ({
            ruc: route.params.ruc
          })
        },
        {
          path: 'catalogo-documental-digital',
          name: 'FCCatalogoDocumentalDigital',
          component: () => import('@/modules/ficha-causa/views/CatalogoDocumentalDigital.vue'),
          props: (route) => ({
            ruc: route.params.ruc
          })
        }
      ]
    }
  ],
  meta: {
    breadcrumb: {
      label: 'Ficha Causa'
    }
  }
}
