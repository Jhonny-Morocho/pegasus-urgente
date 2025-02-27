import { apiRGP } from '@/config/axios/'

export default {
  namespaced: true,

  state: () => ({
    causa: {},
    idDenuncia: null,
    dataDenuncia: null,
    causasCreadas: [],
    datosCompletosCausa: null,
    ruc: null,
    tipoDenuncia: '',
    processInstanceId: null,
    idCausa: null,
    esDenunciaElectronica: false

  }),

  actions: {
    async crearCausa_crearCausa ({ commit }, data) {
      try {
        const response = await apiRGP.post('/causa/causas/', data)
        const dataParse = response.data
        commit('crearCausa_CREAR_CAUSA', dataParse)
        console.log('Payload Denuncia y respuesta', data, dataParse)
        return response
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async crearCausa_iniciarYReservarCausa ({ _commit }, payload) {
      try {
        return apiRGP.put(`/bandeja/tarea/${payload.idInstanciaTarea}/iniciar-y-reservar`)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async crearCausa_completarTareaCausa ({ _commit }, payload) {
      try {
        return apiRGP.put(`/causa/causas/${payload.idInstanciaTarea}/completar/revisar-antecedentes`, payload)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async crearCausa_crearCausaOficio_Fisica ({ commit }, payload) {
      console.log('Payload Crar Causa Oficio Fisica', payload)
      // provisional
      let tipoDenuncia = ''

      switch (payload.dataCausa.codigoTipoDenuncia) {
        case '3':
          tipoDenuncia = 'oficio'
          break
        case '2':
          tipoDenuncia = 'fisica'
          break
        default:
          tipoDenuncia = 'electronica'
          break
      }

      try {
        const response = await apiRGP.post(`/causa/decisiones-causas-duplicadas/${tipoDenuncia}/`,
          payload)
        const data = response.data
        commit('crearCausa_CREAR_CAUSA', data.dataCausa)
        return data
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    }

  },

  mutations: {
    crearCausa_CREAR_CAUSA (state, data) {
      console.log('Data para setear', data)
      state.idCausa = data.idCausa
      state.idDenuncia = data.idDenuncia
      state.processInstanceId = data.idInstanciaTarea
      state.ruc = data.ruc
      state.causa = data
      console.log('Data de la causa ya seteada al crearla en oficio', state)
    },

    crearCausa_SET_TIPO_DENUNCIA (state, data) {
      state.tipoDenuncia = data
    },

    crearCausa_SET_DATOS_COMPLETOS (state, data) {
      state.datosCompletosCausa = data
    },
    crearCausa_ES_DENUNCIA_ELECTRONICA (state, data) {
      state.esDenunciaElectronica = data
    },
    crearCausa_SET_ID_DENUNCIA (state, data) {
      state.idDenuncia = data
    },
    crearCausa_SET_RUC (state, data) {
      state.ruc = data
    },
    crearCausa_RESET_RUC (state) {
      state.ruc = null
    },
    crearCausa_SET_DEFAULT_STATE (state) {
      state.causa = {}
      state.idDenuncia = null
      state.dataDenuncia = null
      state.causasCreadas = []
      state.datosCompletosCausa = null
      state.ruc = ''
      state.processInstanceId = null
      state.idCausa = {}
      state.esDenunciaElectronica = false
    },
    crearCausa_SET_DEFAULT_CAUSA (state) {
      state.causa = {}
      state.causaSeleccionada = {}
    }
  }
}
