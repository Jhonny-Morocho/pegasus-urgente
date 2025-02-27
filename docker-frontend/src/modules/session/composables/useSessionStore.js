import { computed } from 'vue'
import { useStore } from 'vuex'

export const useSessionStore = () => {
  const { state, commit, dispatch } = useStore()

  return {
    perfiles: computed(() => state.session.perfiles),
    user: computed(() => state.session.user),
    roles: computed(() => state.session.roles),
    principal: computed(() => state.session.principal),
    userSub: computed(() => state.session.userSub),
    userFiscalias: computed(() => state.session.userFiscalias),
    fiscaliaActual: computed(() => state.session.fiscaliaActual),

    session_getUserInfo: () => dispatch('session/session_getUserInfo'),
    session_logout: () => dispatch('session/session_logout'),

    session_SET_USER_SESSION: (user) => commit('session/session_SET_USER_SESSION', user),

    session_ADD_INGRESO_ROLES: (roles) => commit('session/session_ADD_INGRESO_ROLES', roles),

    session_SET_PRINCIPAL: (principal) => commit('session/session_SET_PRINCIPAL', principal),

    session_SET_FISCALIA_ACTUAL: (fiscalia) => commit('session/session_SET_FISCALIA_ACTUAL', fiscalia)
  }
}
