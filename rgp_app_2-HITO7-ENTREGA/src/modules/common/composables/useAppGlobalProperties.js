import { getCurrentInstance } from 'vue'

export const useAppGlobalProperties = () => {
  const i = getCurrentInstance()

  const ctx = i.appContext.app.config.globalProperties

  return {
    $hasSomeRoles: ctx.$hasSomeRoles,
    $hasAllRoles: ctx.$hasAllRoles,
    $userAuth: ctx.$userAuth,
    $userRoles: ctx.$userRoles,
    $userSub: ctx.$userSub,
    $userFiscalias: ctx.$userFiscalias,
    $userDefaultFiscalia: ctx.$userDefaultFiscalia,
    $userPrincipalRole: ctx.$userPrincipalRole,
    $userFiscaliaActual: ctx.$userFiscaliaActual,
    $userName: ctx.$userName,
    $userRut: ctx.$userRut,
    $hasOrigin: ctx.$hasOrigin,
    $origin: ctx.$origin,
    $hasPrincipal: ctx.$hasPrincipal
  }
}
