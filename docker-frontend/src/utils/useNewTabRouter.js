import { useRouter } from 'vue-router'

export function useNewTabRouter () {
  const router = useRouter()

  /**
   * Abre una nueva pestaña utilizando alguna ruta ya definida en el router
   * @param {{ name: String, params?: object, query?: object }} name Nombre de la ruta definida en el router
   * @param params Objeto params en path, opcional
   * @param query Objeto query params en path, opcional
   */
  function pushToNewTab ({ name, params, query }) {
    const newTabRoute = router.resolve({ name, params, query })
    window.open(newTabRoute.href, '_blank')
  }

  return { pushToNewTab }
}
