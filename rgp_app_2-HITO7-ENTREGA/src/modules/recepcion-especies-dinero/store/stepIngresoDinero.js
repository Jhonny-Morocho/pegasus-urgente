
import { apiESPECIEDINERO, apiRGP } from '@/config/axios'

export default {
  namespaced: true,

  state: () => ({
    imagenesFijacionFotografica: [],
    datosEtiqueta: {},
    datosEtiquetaQr: {},
    dataFijacionFotografica: {},
    datosEspecie: [],
    bodegas: [],
    nombreBoodegas: [],
    rues: [],
    dataInstruccion: {},
    dataInspeccionVisual: {},
    dataFijacionFotograficaCustodia: {}
  }),

  actions: {
    stepIngresoDinero_getRucEspecieSeleccionada ({ commit }, payload) {
      commit('stepIngresoDinero_GET_DATA', payload)
    },
    async stepIngresoDinero_getEspeciesDinerosNoIngresados ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`/especie-o-dinero/no-ingresado/${payload.nue}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_actualizarEspeciesDineros ({ commit, state }, payload) {
      try {
        const { data } = await apiRGP.put('/especiedinero/especies-dinero/', payload)
        commit('stepIngresoDinero_GET_DATA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_ingresarEspeciesDineros ({ commit, state }, payload) {
      console.log('dineor ingresado', payload)
      try {
        const { data } = await apiESPECIEDINERO.put('especie-o-dinero', payload)
        commit('stepIngresoDinero_SET_ESPECIE_PARA_FIJACION_FOTOGRAFICA', data)
        commit('stepIngresoDinero_GET_DATA', data)
        commit('stepIngresoDinero_RUES_INGRESO', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_agregarDetallesDinero ({ _commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post('especie-o-dinero/agregar-detalle-dinero', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_pronunciamientoAutomatico  ({ _commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.put('especie-o-dinero/pronunciamiento-automatico', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_enviarPronunciamiento ({ _commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post('especie-o-dinero/ingresar-pronunciamiento', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_realizarFijacionFotografica ({ _commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`especie-o-dinero/${payload.rue}/realizarFijacionFotografica`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_darUbicacion ({ _commit, state }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`especie-o-dinero/dar-ubicacion`, payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_actualizarCasillero ({ commit, state }, payload) {
      try {
        const data = await apiRGP.put('/especie-o-dinero/actualizar-casillero/', payload)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getUbicacionByRuc ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/ubicacion-by-ruc/${payload.ruc}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getGenerarEtiqueta ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/etiqueta/${payload.rue}`)
        commit('stepIngresoDinero_GET_GENERAR_ETIQUETA_QR_DATA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getGenerarDataQr ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.post(`especie-o-dinero/generar-qr-data`, payload)
        commit('stepIngresoDinero_GET_GENERAR_ETIQUETA', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_denominacionDeDineros ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especiedinero/especies-dinero/${payload.idEspecie}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // mantenedores bodega,casillero,sector
    async stepIngresoDinero_getBodegaDinero ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/bodegas/${payload.esDinero}`)
        // commit('stepIngresoDinero_GET_BODEGAS_FISCALIAS', data)
        console.log('esDinero', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getBodegasByIdFiscalia ({ commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/bodegas/fiscalia/${payload.idFiscalia}`)
        commit('stepIngresoDinero_GET_BODEGAS_FISCALIAS', data)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getSectoresByIdBodega ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/sectores/${payload.idBodega}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getCasillerosByIdSector ({ _commit }, payload) {
      try {
        const { data } = await apiESPECIEDINERO.get(`especie-o-dinero/casilleros/${payload.idSector}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getRuesByIdCasillero ({ commit }, payload) {
      try {
        const data = await apiESPECIEDINERO.get(`especie-o-dinero/rues-casillero/${payload.id}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_crearTareaCustodiaInspeccion ({ commit }, payload) {
      try {
        const data = await apiESPECIEDINERO.post(`/pam/iniciarProceso/custodia-especie/${payload.idEspecie}/${payload.opcion}`)
        if (payload.opcion === 'inspeccionVisual') {
          commit(
            'stepIngresoDinero_SET_ESPECIES_CUSTODIA_INSPECCION',
            data.data
          )
        } else if (payload.opcion === 'fijacionFotografica') {
          commit(
            'stepIngresoDinero_SET_ESPECIES_CUSTODIA_FIJACION',
            data.data
          )
        }
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_getDataRevisarInstruccion ({ commit }, payload) {
      try {
        commit(
          'stepIngresoDinero_SET_ESPECIES_REVISAR_INSTRUCCION',
          payload
        )
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async stepIngresoDinero_getDataCustodiaInspeccion ({ commit }, payload) {
      try {
        commit(
          'stepIngresoDinero_SET_ESPECIES_CUSTODIA_INSPECCION',
          payload.data
        )
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async stepIngresoDinero_crearTareaSalidaTemporal ({ commit }, payload) {
      try {
        const data = await apiESPECIEDINERO.post(`/pam/iniciarProceso/salida-temporal/${payload.idEspecie}`)
        return data
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  mutations: {
    stepIngresoDinero_GET_DATA (state, data) {
      state.datosEspecie.push(data)
    },
    stepIngresoDinero_RUES_INGRESO (state, data) {
      state.rues.push(data)
    },
    stepIngresoDinero_GET_GENERAR_ETIQUETA (state, data) {
      state.datosEtiqueta = data
    },
    stepIngresoDinero_SET_ESPECIE_PARA_FIJACION_FOTOGRAFICA (state, data) {
      state.dataFijacionFotografica = data
    },
    stepIngresoDinero_GET_GENERAR_ETIQUETA_QR_DATA (state, data) {
      state.datosEtiquetaQr = data
    },
    stepIngresoDinero_GET_BODEGAS_FISCALIAS (state, data) {
      state.bodegas = data
    },
    stepIngresoDinero_SET_ESPECIES_CUSTODIA_INSPECCION (state, data) {
      state.dataInspeccionVisual = data
      console.log('dataInspeccionVisual', state.dataInspeccionVisual)
    },
    stepIngresoDinero_SET_ESPECIES_CUSTODIA_FIJACION (state, data) {
      state.dataFijacionFotograficaCustodia = data
      console.log('dataInspeccionVisual', state.dataFijacionFotograficaCustodia)
    },
    stepIngresoDinero_SET_ESPECIES_REVISAR_INSTRUCCION (state, data) {
      state.dataInstruccion = data
      console.log('dataInstruccion', state.dataInstruccion)
    }
  }
}
