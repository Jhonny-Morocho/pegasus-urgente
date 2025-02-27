import store from '@/store'

export const requireRolesGuard = (to, _from, next) => {
  const roles = store.state.session.roles

  // si no presenta roles requeridos permite navegar
  if (!to.meta?.requireSomeRoles && !to.meta?.requireAllRoles) {
    return next()
  }

  if (to.meta.requireSomeRoles?.length) {
    const hasSomeRoles = to.meta.requireSomeRoles.some(rr => rr === roles.find(r => r === rr))
    if (hasSomeRoles) return next()

    return next('/')
  }

  if (to.meta.requireAllRoles?.length) {
    const hasAllRoles = to.meta.requireAllRoles.every(rr => rr === roles.find(r => r === rr))
    if (hasAllRoles) return next()

    return next('/')
  }

  next()
}
