export default {
  namespaced: true,
  state: () => ({
    datosInspeccion: {
      fechaAgendada: '2022-07-18',
      fechaSolicitud: '2022-07-15',
      plazoEsperadoRespuesta: '5 días',
      inspectorSolicita: 'Juan Pérez',
      motivoInspeccion: 'Se tomó la decisión a raíz de ..........................................................................'
    },
    especiesDinero: {
      nue: 19394036,
      especiesDineros: [
        {
          rue: '00012345-1',
          familiaEspecie: 'Herramienta',
          tipoEspecie: 'Napoleón',
          descripcion: 'Napoleón marca Stanley',
          alerta: true,
          cantidadMonto: 1,
          observaciones: 'Especie fue encontrada en un bolso de mano',
          bodega: 'Bodega 1',
          sector: 'Sector 1',
          casillero: 'Casillero 1'
        },
        {
          rue: '00012346-1',
          familiaEspecie: 'Herramienta',
          tipoEspecie: 'Alicate',
          descripcion: 'Alicate color rojo',
          alerta: false,
          cantidadMonto: 1,
          observaciones: 'Alicate con grasa',
          bodega: 'Bodega 1',
          sector: 'Sector 2',
          casillero: 'Casillero 2'
        },
        {
          rue: '00012347-1',
          familiaEspecie: 'Herramienta',
          tipoEspecie: 'Llaves',
          descripcion: 'Llave inglesa, llave francesa',
          alerta: false,
          cantidadMonto: 1,
          observaciones: 'Especie fue encontrada en un bolso de mano',
          bodega: 'Bodega 1',
          sector: 'Sector 2',
          casillero: 'Casillero 2'
        }
      ]
    },
    dataCausa: {
      ruc: '2200938215-8',
      fechaCreacionCausa: '2022-09-18',
      fiscaliaLocal: 'Casablanca',
      estadoCausa: 'Vigente',
      fiscalAsignado: 'Samuel Núñez P.',
      nombreCausa: 'Hurto simple 4 A 40 UTM a Gustavo',
      delitos: ['810 - Robo en lugar no habitado']
    },
    personasAsisten: {
      personasAsisten: [
        {
          nroDocumento: '12.234.987-0',
          nombreCompleto: 'Miguel Elgueta Elgueta',
          institucion: 'Servicio Médico Legal',
          especialidad: 'Servicio Médico Legal'
        }
      ]
    },
    inspeccionRealizada: {}
  }),
  actions: {
    stepDatosInspeccionVisual_registrarInspeccionVisualRealizada ({ commit, state }, payload) {
      try {
        commit('stepDatosInspeccionVisual_SET_DATA_INSPECCION_REALIZADA', payload)
        return payload
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    stepDatosInspeccionVisual_SET_DATA_INSPECCION_REALIZADA (state, payload) {
      state.inspeccionRealizada = payload
    }
  }
}
