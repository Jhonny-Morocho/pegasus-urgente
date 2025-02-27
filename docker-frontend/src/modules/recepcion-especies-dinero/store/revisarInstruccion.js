// import { apiRGP, apiBFF } from '@/config/axios'

import { apiESPECIEDINERO } from '@/config/axios'

export default {
  namespaced: true,
  datosInstruccion: {},
  dataSalida: [],
  peritajeSalida: {},
  dataSalidaTransferencia: {},

  state: () => ({
    dataSolicitud: {
      fechaSolicitud: '2022-07-15',
      fechaSalidaAgendada: '2022-07-23',
      direccion: 'Sazie 123',
      tipoSalida: 'Definitiva',
      correoElectronico: 'a@a.cl',
      motivoDeSalida: 'Devolver a Dueño',
      telefono: '+56923456788',
      nombreDelDueno: 'jorge Rojas',
      runDelDueno: '12.345.678-9',
      institucion: 'Primera Compañía de Bomberos de Viña del Mar',
      receptor: 'Jorge Rojas',
      plazoDeSalida: '5 días'
    },
    dataActa: {
      ruc: '2200002303-9',
      fiscalAutoriza: 'Samuel Nuñez',
      fiscalia: 'Casablanca',
      runReceptor: '23.456.789-0',
      nombreCustodio: 'María Gonzalez',
      runCustodio: '3.456.789-0',
      observaciones: 'eyd eyd eyd eyd'
    },
    donacion: false,
    salidaTemporal: false
  }),
  actions: {
    revisarInstruccion_getSolicitudSalida ({ commit, state }, payload) {
      try {
        commit('revisarInstruccion_SET_DATA_SOLICITUD_SALIDA', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async revisarInstruccion_registrarInstruccion ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put('/especie-salida/temporal/registrar-instruccion', payload)
        commit('revisarInstruccion_DATA_SALIDA', data)
        return data.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async revisarInstruccion_registrarInstruccionTransferencia ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put('especie-salida/transferencia/registrar/instruccion', payload)
        commit('revisarInstruccion_DATA_SALIDA_TRANSFERENCIA', data)
        return data.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async revisarInstruccion_ingresarSolicitudSalidaperitaje ({ commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`/especie-salida/solicitud-salida-temporal/peritaje`, payload)
        commit('revisarInstruccion_SET_DATA_SOLICITUD_SALIDA_PERITAJE', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    revisarInstruccion_SET_DATA_SOLICITUD_SALIDA (state, payload) {
      state.inspeccionRealizada = payload
    },
    revisarInstruccion_SET_DATA_SOLICITUD_SALIDA_PERITAJE (state, payload) {
      state.peritajeSalida = payload
      console.log('peritaje', state.peritajeSalida)
    },
    revisarInstruccion_DATA_SALIDA (state, payload) {
      console.log('es la dAta', payload)
      state.dataSalida = payload
    },
    revisarInstruccion_DATA_SALIDA_TRANSFERENCIA (state, payload) {
      console.log('es la dAta', payload)
      state.dataSalidaTransferencia = payload
    }
  }
}
