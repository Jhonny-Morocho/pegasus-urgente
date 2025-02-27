import { setTokenToApiRGP, setTokenToApiRGPDev, setTokenToApiRGPPam, setTokenToApiBFF, setTokenToApiBFF2, setTokenToApiESPECIEDINERO, setTokenToApiCDD, setTokenToApiTAUD } from '@/config/axios'

import { getKeycloak, isTokenReady } from '@baloise/vue-keycloak'

export default {
  namespaced: true,

  state: () => ({
    user: null,
    roles: [],
    originalRoles: [],
    principal: null,
    userSub: null,
    userFiscalias: null,
    fiscaliaActual: null,
    perfiles: [
      {
        atendedor_juridico: [
          // roles rgp
          'admin',
          'fiscalia_1_atendedor_juridico',
          'fiscalia_5_atendedor_juridico',
          // roles CAPA y QA
          'zona_2_fiscalia_901_atendedor_juridico_IYA',
          'zona_2_fiscalia_902_atendedor_juridico_IYA',
          'zona_2_fiscalia_903_atendedor_juridico_IYA',
          'zona_2_fiscalia_904_atendedor_juridico_IYA',
          'zona_2_fiscalia_905_atendedor_juridico_IYA',
          'zona_2_fiscalia_906_atendedor_juridico_IYA',
          'zona_2_fiscalia_907_atendedor_juridico_IYA',
          'zona_2_fiscalia_909_atendedor_juridico_IYA',
          'zona_2_fiscalia_910_atendedor_juridico_IYA',
          'zona_2_fiscalia_911_atendedor_juridico_IYA',
          'zona_2_fiscalia_912_atendedor_juridico_IYA',
          'zona_2_fiscalia_913_atendedor_juridico_IYA',
          'zona_2_fiscalia_915_atendedor_juridico_IYA',
          'zona_2_fiscalia_916_atendedor_juridico_IYA',
          'zona_2_fiscalia_917_atendedor_juridico_IYA'
        ]
      },
      {
        fiscal_jefe: [
          // roles rgp
          'admin',
          'fiscal_turno',
          'fiscalia_1_fiscal',
          'fiscalia_2_fiscal',
          'fiscalia_1_fiscal_jefe',
          'fiscalia_2_fiscal_jefe',
          'zona_2_turno_instrucciones',
          // roles CAPA y QA
          'zona_2_fiscalia_901_fiscal_jefe_ASI',
          'zona_2_fiscalia_902_fiscal_jefe_ASI',
          'zona_2_fiscalia_902_fiscal_jefe_ASI',
          'zona_2_fiscalia_903_fiscal_jefe_ASI',
          'zona_2_fiscalia_904_fiscal_jefe_ASI',
          'zona_2_fiscalia_905_fiscal_jefe_ASI',
          'zona_2_fiscalia_906_fiscal_jefe_ASI',
          'zona_2_fiscalia_907_fiscal_jefe_ASI',
          'zona_2_fiscalia_909_fiscal_jefe_ASI',
          'zona_2_fiscalia_910_fiscal_jefe_ASI',
          'zona_2_fiscalia_911_fiscal_jefe_ASI',
          'zona_2_fiscalia_912_fiscal_jefe_ASI',
          'zona_2_fiscalia_913_fiscal_jefe_ASI',
          'zona_2_fiscalia_915_fiscal_jefe_ASI',
          'zona_2_fiscalia_901_fiscal_jefe_TPT',
          'zona_2_fiscalia_902_fiscal_jefe_TPT',
          'zona_2_fiscalia_903_fiscal_jefe_TPT',
          'zona_2_fiscalia_904_fiscal_jefe_TPT',
          'zona_2_fiscalia_905_fiscal_jefe_TPT',
          'zona_2_fiscalia_906_fiscal_jefe_TPT',
          'zona_2_fiscalia_907_fiscal_jefe_TPT',
          'zona_2_fiscalia_909_fiscal_jefe_TPT',
          'zona_2_fiscalia_910_fiscal_jefe_TPT',
          'zona_2_fiscalia_911_fiscal_jefe_TPT',
          'zona_2_fiscalia_912_fiscal_jefe_TPT',
          'zona_2_fiscalia_913_fiscal_jefe_TPT',
          'zona_2_fiscalia_915_fiscal_jefe_TPT',
          'zona_2_fiscalia_916_fiscal_jefe_TPT',
          'zona_2_fiscalia_917_fiscal_jefe_TPT'
        ]
      },
      {
        funcionario_oficina_partes: [
          // roles rgp
          'admin',
          'fiscalia_5_recepcionista',
          'fiscalia_2_recepcionista',
          // roles CAPA y QA
          'zona_2_fiscalia_901_funcionario_IYA',
          'zona_2_fiscalia_902_funcionario_IYA',
          'zona_2_fiscalia_903_funcionario_IYA',
          'zona_2_fiscalia_904_funcionario_IYA',
          'zona_2_fiscalia_905_funcionario_IYA',
          'zona_2_fiscalia_906_funcionario_IYA',
          'zona_2_fiscalia_907_funcionario_IYA',
          'zona_2_fiscalia_909_funcionario_IYA',
          'zona_2_fiscalia_910_funcionario_IYA',
          'zona_2_fiscalia_911_funcionario_IYA',
          'zona_2_fiscalia_912_funcionario_IYA',
          'zona_2_fiscalia_913_funcionario_IYA',
          'zona_2_fiscalia_915_funcionario_IYA',
          'zona_2_fiscalia_916_funcionario_IYA',
          'zona_2_fiscalia_917_funcionario_IYA'
        ]
      },
      {
        preclasificador: [
          // roles rgp
          'admin',
          'fiscalia_2_preclasificador',
          // roles CAPA y QA
          'zona_2_fiscalia_901_preclasificador_IYA',
          'zona_2_fiscalia_902_preclasificador_IYA',
          'zona_2_fiscalia_903_preclasificador_IYA',
          'zona_2_fiscalia_904_preclasificador_IYA',
          'zona_2_fiscalia_905_preclasificador_IYA',
          'zona_2_fiscalia_906_preclasificador_IYA',
          'zona_2_fiscalia_907_preclasificador_IYA',
          'zona_2_fiscalia_909_preclasificador_IYA',
          'zona_2_fiscalia_910_preclasificador_IYA',
          'zona_2_fiscalia_911_preclasificador_IYA',
          'zona_2_fiscalia_912_preclasificador_IYA',
          'zona_2_fiscalia_913_preclasificador_IYA',
          'zona_2_fiscalia_915_preclasificador_IYA',
          'zona_2_fiscalia_916_preclasificador_IYA',
          'zona_2_fiscalia_917_preclasificador_IYA'
        ]
      },
      {
        digitador: [
          // roles rgp
          'admin',
          'fiscalia_5_digitador',
          'fiscalia_2_digitador',
          'fiscalia_1_digitador',
          'fiscalia_1_digitador',
          // roles CAPA y QA
          'zona_2_fiscalia_901_digitador_IYA',
          'zona_2_fiscalia_902_digitador_IYA',
          'zona_2_fiscalia_903_digitador_IYA',
          'zona_2_fiscalia_904_digitador_IYA',
          'zona_2_fiscalia_905_digitador_IYA',
          'zona_2_fiscalia_906_digitador_IYA',
          'zona_2_fiscalia_907_digitador_IYA',
          'zona_2_fiscalia_909_digitador_IYA',
          'zona_2_fiscalia_910_digitador_IYA',
          'zona_2_fiscalia_911_digitador_IYA',
          'zona_2_fiscalia_912_digitador_IYA',
          'zona_2_fiscalia_913_digitador_IYA',
          'zona_2_fiscalia_915_digitador_IYA',
          'zona_2_fiscalia_916_digitador_IYA',
          'zona_2_fiscalia_917_digitador_IYA'
        ]
      },
      {
        policia_turno: [
          // roles rgp
          'policias',
          // roles CAPA y QA
          'zona_2_fiscalia_901_equipo_turnoif_TIN'
        ]
      },
      {
        fiscal_turno: [
          // roles rgp
          'admin',
          // roles CAPA y QA
          'zona_2_fiscalia_901_fiscal_turno_TIN'
        ]
      },
      {
        fiscal: [
          // roles CAPA y QA
          'zona_2_fiscalia_901_fiscal_DIN',
          'zona_2_fiscalia_902_fiscal_DIN',
          'zona_2_fiscalia_903_fiscal_DIN',
          'zona_2_fiscalia_904_fiscal_DIN',
          'zona_2_fiscalia_905_fiscal_DIN',
          'zona_2_fiscalia_906_fiscal_DIN',
          'zona_2_fiscalia_907_fiscal_DIN',
          'zona_2_fiscalia_909_fiscal_DIN',
          'zona_2_fiscalia_910_fiscal_DIN',
          'zona_2_fiscalia_911_fiscal_DIN',
          'zona_2_fiscalia_912_fiscal_DIN',
          'zona_2_fiscalia_913_fiscal_DIN',
          'zona_2_fiscalia_915_fiscal_DIN',
          'zona_2_fiscalia_916_fiscal_DIN',
          'zona_2_fiscalia_917_fiscal_DIN'
        ]
      },
      {
        equipo_juridico: [
          // roles
          'zona_2_fiscalia_901_equipo_juridico_DIN',
          'zona_2_fiscalia_901_equipo_juridico_GDS',
          'zona_2_fiscalia_901_equipo_juridico_TAU',
          'zona_2_fiscalia_901_equipo_juridico_TPT'
        ]
      }
    ]
  }),

  actions: {
    async session_getUserInfo ({ commit, state }) {
      try {
        // espera por el token en keyclock
        await isTokenReady()
        // carga la información de usuario
        const data = await getKeycloak().loadUserInfo()
        // establece el token en la instancia de axios
        setTokenToApiRGP(getKeycloak().token)
        setTokenToApiRGPPam(getKeycloak().token)
        setTokenToApiRGPDev(getKeycloak().token)
        setTokenToApiBFF(getKeycloak().token)
        setTokenToApiBFF2(getKeycloak().token)
        setTokenToApiESPECIEDINERO(getKeycloak().token)
        setTokenToApiCDD(getKeycloak().token)
        setTokenToApiTAUD(getKeycloak().token)

        // obtiene los roles del token
        const roles = getKeycloak().tokenParsed.realm_access.roles

        // obtiene el sub del usuario
        const userSub = getKeycloak().userInfo?.sub

        // obtiene las fiscalias del usuario
        const userFiscalias = getKeycloak().userInfo?.fiscalias

        commit('session_SET_USER_SESSION', data)
        commit('session_SET_USER_ROLES', roles)
        commit('session_SET_ORIGINAL_ROLES', roles)
        commit('session_SET_USER_SUB', userSub)
        commit('session_SET_USER_FISCALIAS', userFiscalias)

        if (!state.fiscaliaActual) {
          const defaultFiscalia = userFiscalias?.find((f) => f.default)
          commit('session_SET_FISCALIA_ACTUAL', defaultFiscalia)
        }

        commit('session_SET_PRINCIPAL', roles[0])
        console.log('Informacion Usuario: ', getKeycloak().userInfo)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    session_logout () {
      return getKeycloak().logout({ redirectUri: '' })
    }
  },

  mutations: {
    session_SET_USER_SESSION (state, user) {
      state.user = user
    },

    session_SET_USER_ROLES (state, roles) {
      state.roles = roles
    },

    session_SET_ORIGINAL_ROLES (state, originalRoles) {
      state.originalRoles = originalRoles
    },

    session_ADD_INGRESO_ROLES (state, roles) {
      state.roles = [...state.originalRoles, ...roles]
    },

    session_SET_PRINCIPAL (state, principal) {
      state.principal = principal
    },

    session_SET_USER_SUB (state, sub) {
      state.userSub = sub
    },

    session_SET_USER_FISCALIAS (state, fiscalias) {
      if (fiscalias) {
        state.userFiscalias = fiscalias
      } else {
        const defaultFiscalia = [
          {
            fiscalia: 1,
            region: 1,
            default: true
          }
        ]
        state.userFiscalias = defaultFiscalia
      }
    },

    session_SET_FISCALIA_ACTUAL (state, fiscalia) {
      state.fiscaliaActual = fiscalia
    }
  }
}
