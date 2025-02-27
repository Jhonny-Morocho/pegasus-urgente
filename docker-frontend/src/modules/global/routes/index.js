export default {
  path: '',
  name: 'IndexFichaCausa',
  component: () => import('@/modules/global/views/indexFichaCausa.vue'),
  children: [
    {
      path: 'ficha-causa/:ruc',
      name: 'FichaCausa',
      component: () => import('@/modules/global/views/FichaCausa.vue')
    }
  ],
  meta: {
    breadcrumb: {
      label: 'Ficha Causa'
    }
  }
}
