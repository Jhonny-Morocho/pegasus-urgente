import { apiRGP } from '@/config/axios/'

export default {
  namespaced: true,

  state: () => ({
    saved: false,
    identificacionDenuncia: null,
    idProcedimiento: null,
    informacionInstitucion: null,
    tipoDenunciaObject: null,
    idFiscalia: '', // no es el id del mantenedor
    direccionFiscalia: null,
    idCatalogo: null
  }),

  mutations: {
    identificacionDenuncia_SET_IDENTIFICACION_DENUNCIA (state, payload) {
      state.identificacionDenuncia = {
        ...payload,
        identificadorUnicoDenuncia: payload?.identificadorUnicoDenuncia,
        usuarioRecepcionaDenuncia: payload?.idFuncionarioRol,
        tipoDenuncia: payload?.tipoDenuncia ?? payload?.idTipoDenuncia,
        medioDeRecepcion: payload?.medioDeRecepcion ?? payload?.idMedioRecepcion
      }
      state.saved = true
    },

    identificacionDenuncia_SET_ID_CATALOGO (state, payload) {
      console.log(payload)
      state.idCatalogo = payload.idCatalogo
      console.log('ID del Catalogo Creado: ', state.idCatalogo)
    },
    identificacionDenuncia_SET_ID_PROCEDIMIENTO (state, payload) {
      state.idProcedimiento = payload.procedimiento_id
    },

    identificacionDenuncia_SET_INFORMACION_INSTITUCION (state, payload) {
      state.informacionInstitucion = payload
    },

    identificacionDenuncia_SET_DEFAULT_STATE (state) {
      state.saved = false
      state.identificacionDenuncia = null
      state.informacionInstitucion = null
      state.idProcedimiento = null
      state.idFiscalia = ''
      state.direccionFiscalia = null
    },
    identificacionDenuncia_SET_TIPO_DENUNCIA (state, payload) {
      state.tipoDenunciaObject = payload
    },
    identificacionDenuncia_SET_ID_FISCALIA (state, payload) {
      state.idFiscalia = payload
    },
    identificacionDenuncia_SET_DIRECCION_FISCALIA (state, payload) {
      state.direccionFiscalia = payload
    }
  },

  actions: {
    async identificacionDenuncia_getIdentificadorUnicoDenuncia (
      { commit },
      payload
    ) {
      const { sigla } = payload
      try {
        const response = await apiRGP.get(
          `denuncia/identificacion-denuncia/${sigla}`
        )
        const data = response.data
        payload.identificadorUnicoDenuncia = data.identificadorUnicio
        commit('identificacionDenuncia_SET_IDENTIFICACION_DENUNCIA', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async identificacionDenuncia_iniciarProceso ({ commit }, payload) {
      try {
        const { tipoDenuncia } = payload
        const res = await apiRGP.get(
          `/denuncia/idenficacion-denuncia/directa/${tipoDenuncia}`
        )
        commit('identificacionDenuncia_SET_ID_PROCEDIMIENTO', res.data)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async identificacionDenuncia_getParteDenuncia (_, payload) {
      try {
        const { numeroParteDenuncia } = payload
        const res = await apiRGP.get(
          `/denuncia/partes-denuncias/numero-parte/${numeroParteDenuncia}`
        )
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async identificacionDenuncia_getByIdDenuncia ({ commit }, payload) {
      try {
        const res = await apiRGP.get(
          `/denuncia/denuncias/${payload.idDenuncia}`
        )
        const data = res.data
        console.log(data)
        commit('identificacionDenuncia_SET_IDENTIFICACION_DENUNCIA', {
          ...data,
          ...payload
        })
        commit('identificacionDenuncia_SET_ID_CATALOGO', data)
        return res.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async identificacionDenuncia_guardarInformacionInstitucion (
      { commit },
      payload
    ) {
      try {
        const { contrato, ref } = payload
        const response = await apiRGP.post(
          '/organismocolaborador/organismos-colaboradores/denuncia/guardar',
          contrato
        )
        commit('identificacionDenuncia_SET_INFORMACION_INSTITUCION', ref)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async identificacionDenuncia_getInformacionInstitucion (
      { commit },
      payload
    ) {
      try {
        const response = await apiRGP.get(
          `/organismocolaborador/organismos-colaboradores/institucion-denunciante/denuncia/${payload.idDenuncia}`
        )
        commit('identificacionDenuncia_SET_INFORMACION_INSTITUCION', {
          ...response.data,
          unidadPolicialOrganismo: response.data.unidadPoliciaOrganismo,
          prefecturaDependencia: response.data.prefecturaDependenciaUP
        })
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async identificacionDenuncia_addIdentificacion ({ commit }, payload) {
      const { tipoDenuncia, idDenuncia } = payload
      try {
        const response = await apiRGP.put(
          `/denuncia/identificacion-denuncia/${tipoDenuncia}/${idDenuncia}`,
          payload
        )
        commit('identificacionDenuncia_SET_IDENTIFICACION_DENUNCIA', {
          ...response.data,
          identificadorUnicoDenuncia: payload.identificadorUnicoDenuncia,
          numeroOficio: payload.numeroOficio,
          nroParteDenuncia: payload.nroParteDenuncia
        })
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // obtiene objeto tipo denuncia con el código del mantenedor
    async identificacionDenuncia_getTipoDenuncia ({ commit }, payload) {
      try {
        const response = await apiRGP.get('mantenedor/denuncia/tipo/')

        commit('mantenedor/mantenedor_SET_TIPOS_DENUNCIA', response.data, {
          root: true
        })
        const tipoDenuncia = response.data.find(
          (tipo) => tipo.codigo === payload
        )
        commit('identificacionDenuncia_SET_TIPO_DENUNCIA', tipoDenuncia)
        return tipoDenuncia
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // obtiene el idFiscalia (el idFiscalia que se envia al pjud etc) con el idFiscalia que usamos en los mantenedores normalmente
    // si! existen dos idFiscalias gg
    async identificacionDenuncia_getIdFiscaliaByIdFiscaliaMantenedor (
      { commit },
      payload
    ) {
      try {
        const response = await apiRGP.get(
          `/general/fiscalia/mantenedor/${payload.idFiscaliaMantenedor}/idFiscalia/`
        )
        commit('identificacionDenuncia_SET_ID_FISCALIA', response.data)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async identificacionDenuncia_getDireccionFiscalia ({ commit }, payload) {
      try {
        const response = await apiRGP.get(
          `/direccion/direccion/fiscalia/${payload.idFiscalia}`
        )
        commit('identificacionDenuncia_SET_DIRECCION_FISCALIA', response.data)
        return response.data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
