import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const injectGlobalProperties = (app, store) => {
  app.config.globalProperties.$userAuth = computed(() => store.state.session.user)

  app.config.globalProperties.$userRoles = computed(() => store.state.session?.roles)

  app.config.globalProperties.$userSub = computed(() => store.state.session?.userSub)

  app.config.globalProperties.$userFiscalias = computed(() => store.state.session?.userFiscalias)

  app.config.globalProperties.$userPrincipalRole = computed(() => store.state.session?.principal)

  app.config.globalProperties.$userDefaultFiscalia = computed(() => store.state.session?.userFiscalias?.find((uf) => uf.default))

  app.config.globalProperties.$userFiscaliaActual = computed(() => store.state.session?.fiscaliaActual)

  app.config.globalProperties.$userName = computed(() => store.state.session?.user.name || store.state.session?.user.preferred_username)

  app.config.globalProperties.$userRut = computed(() => store.state.session?.user.rut)

  app.config.globalProperties.$hasSomeRoles = (roleRequired) => {
    const roles = store.state.session?.roles

    if (!roles.length) return false

    if (Array.isArray(roleRequired)) {
      return roleRequired.some((rr) => rr === roles.find((r) => r === rr))
    }

    return false
  }

  app.config.globalProperties.$hasAllRoles = (roleRequired) => {
    const roles = store.state.session?.roles

    if (!roles.length) return false

    if (Array.isArray(roleRequired)) {
      return roleRequired.every((rr) => rr === roles.find((r) => r === rr))
    }

    return false
  }

  app.config.globalProperties.$hasOrigin = (originRequired) => {
    const route = useRoute()
    const pathOrigin = route.path.split('/')[1]

    return originRequired === pathOrigin
  }

  app.config.globalProperties.$origin = computed(() => {
    const route = useRoute()
    return route.path.split('/')[1]
  })

  app.config.globalProperties.$hasPrincipal = (principalRequired) => {
    const principal = store.state.session?.principal

    return principalRequired === principal
  }
}
