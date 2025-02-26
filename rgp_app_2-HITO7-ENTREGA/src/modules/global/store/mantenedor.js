import { apiRGP } from '@/config/axios'

import { appUtil } from '@/utils'

import {
  listClaseEspecie,
  listEstadoConservacionEspecie,
  listTipoDinero,
  listDenominacionDinero,
  listPronunciamientoFiscalEspecie,
  listTipoDocumentoEspecie
} from '@/data/datosMantenedor.json'

export default {
  namespaced: true,

  state: {
    // state general/mantenedor
    atributos: [],
    tipoRespuestaBasica: [],
    // State actividad
    tipoActividad: [],
    actividadesSubtipo: [],
    actividadesSubSubtipo: [],
    actividadesAtributos: [],
    // State Identificacion denuncia
    juzgados: [],
    // State Diligencias
    tipoActividadByCodigo: null,
    tipoOrigen: [],
    subtiposActividad: [],
    subsubTiposActividad: [],
    allSubSubTiposActividad: [],
    estadosDiligencia: [],
    ambitosDiligencia: [],
    referencias: [],
    instituciones: [],
    institucionesDenuncia: [],
    justificaciones: [],
    plazosDiligencia: [],
    plantillasDiligencia: [],
    // State Delitos
    familiasDelito: [],
    tiposDelito: [],
    mediosComisionDelitos: [],
    tiposDenuncia: [],
    zonaDelito: [],
    tipoLugarOcurrencia: [],
    viaIngreso: [],
    unidadPolicial: [],
    tipoHallazgo: [],
    tipoElementoUsado: [],
    tipoTransporte: [],
    tipoVigilancia: [],
    fuenteInfoTestigo: [],
    tipoTestigo: [],
    rolHechoDelictual: [],
    perfilImputado: [],
    tipoFuncionario: [],
    medidaSeguridad: [],
    modalidadGrupo: [],
    cantidadSujetos: [],

    // State Sujetos Intervinientes
    tiposSujeto: [],
    tipoVictima: [],
    escolaridad: [],
    tipoSexo: [],
    tipoNnaResponsable: [],
    tipoRepresentado: [],
    tipoInstitucionPerteneciente: [],
    tipoAcreditacion: [],
    tiposDocumento: [],
    tiposPersona: [],
    paises: [], // este dato se usa para nacionalidad e idioma tambien
    medidasProteccion: [],
    medidasProteccionPersona: [],
    organismoRol: [],
    relacionesSujetos: [],
    estadoCivil: [],
    estadoMigratorio: [],
    identidadGenero: [],
    pueblosOriginarios: [],
    tipoContacto: [],
    estadoTemperancia: [],
    parentesco: [],
    discapacidad: [],
    validacionIdentidad: [],
    tipoDocumento: [],
    profesiones: [],
    causaDetencion: [],
    // State Direccion
    tiposDireccion: [],
    comuna: [],
    tiposMedioContacto: [],
    tiposContactoDueno: [],
    // State Especie/Dinero
    tipoEspecies: [],
    familiaEspecies: [],
    ambitoEspecie: [],
    allTiposEspecie: [],
    razonMovimientoEspecie: [],
    unidadMedidaEspecie: [],
    clasesPeligro: [],
    claseEspecie: [],
    estadoConservacionEspecie: [],
    tipoMoneda: [],
    tipoDinero: [],
    denominacionDinero: [],
    quienRealizaAvaluo: [],
    pronunciamientoFiscalEspecie: [],
    marcaOreja: [],
    tipoTusa: [],
    tipoCola: [],
    tipoSenal: [],
    origenAnimal: [],
    tipoDocumentacionAnimal: [],
    causaMuerteAnimal: [],
    tipoDocumentoEspecie: [],
    signoFuerzaVehiculo: [],
    estadoVehiculo: [],
    tieneHerramientasDentro: [],
    tipoProcedencia: [],
    avaluadorEspecie: [],
    tipoVehiculos: [],
    estacionaEn: [],
    tipoMarcaVehiculo: [],
    tipoModeloVehiculo: [],
    // State Causa
    procesoHito: null,
    tiposAntecedentes: [],
    estadosCausa: [],
    tiposOrigenAntecedentes: [],
    tiposAmbitoAntecedentes: [],
    tiposComplejidad: [],
    tiposImpacto: [],
    motivoTransferencia: [],
    decisionAsignacion: [],
    tipoAsignacion: [],
    motivoAgrupacion: [],
    accionAgrupacion: [],
    estadoAgrupacion: [],
    detalleEstadoAgrupacion: [],
    motivosDesestimacion: [],
    tiposTermino: [],
    subtiposTermino: [],
    resultadosConsultaTermino: [],
    tiposSuspension: [],
    subtiposSuspension: [],
    tiposAccionCierre: [],
    condicionesAR: [],
    motivosSobreseimiento: [],
    evaluacionCumplimientos: [],
    // State Policias
    prefecturas: [],
    comisarias: [],
    destacamentos: [],
    // State Fiscalía
    tiposFiscalia: [],
    regiones: [],
    nombresFiscalia: [],
    especialidadesFiscalia: [],
    fiscalias: [],
    fiscales: [],
    allFiscales: [],
    // State Medidas
    estadoMedidaHito: [],
    tipoMedida: [],
    medidasCautelares: [],
    medidasIntrusivas: [],
    estadoRelacion: [],

    // State Documentos Adjuntos

    tiposDocumentosAdjuntos: [],
    nombresTipoDocumento: [],
    // #region COSAS QUE TENGO QUE HACER PORQUE ME DA PAJA ARREGLAR LA LOGICA DE LOS MANTENEDORES DE ACTIVIDAD
    subtipoActividadList: [],
    subSubtipoActividadList: [],
    tiposActividad: [],
    resultadosAutorizacion: [],
    // #endregion

    tiposAutorizacionDiligencia: [],

    decisionesRelaciones: [],
    decisionesCausa: [],
    seccionesFUD: [],

    // #region State Actividad
    tiposPericia: [],
    tiposAutopsia: [],
    tiposExamenMedico: [],
    tiposPruebaMedica: [],
    tiposAudiencias: [],
    tipoAudiencia: null
    // #endregion
  },

  actions: {
    async mantenedor_getCausaProceso ({ commit, state }) {
      try {
        const res = await apiRGP.get('/mantenedor/causa/proceso?codigo=6')
        commit('mantenedor_SET_CAUSA_PROCESO', res.data[0])
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getActividadesByCausaProceso ({ commit, state }, payload) {
      const { idCausaProceso, idTipoActividad } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/actividad/causa-proceso/${idCausaProceso}/actividad-padre/${idTipoActividad}/hijos`
        )
        commit('mantenedor_SET_ACTIVIDADES', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getActividadesByIdPadre ({ commit, state }, payload) {
      const { idCausaProceso, idTipoActividad } = payload

      try {
        const res = await apiRGP.get(
          `/mantenedor/actividad/causa-proceso/${idCausaProceso}/actividad-padre/${idTipoActividad}/hijos`
        )
        commit('mantenedor_SET_ACTIVIDADES_HIJO', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getRespuestaBasico ({ commit, state }, { params }) {
      // En el params viene nombreMantenedor: al tipo de lugar donde se usará,
      // ver swagger ambito General / Mantenedor para conocer las opciones
      // y preguntar como se usa bien esta webada
      // ejemplo: nombreMantenedor: 'SI_NO'
      if (!state.tipoRespuestaBasica.length) {
        // mientras se usa solo el SI_NO
        try {
          const res = await apiRGP.get('/general/mantenedor/basico', {
            params
          })
          commit('mantenedor_SET_RESPUESTA_BASICO', res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getAtributoByActividad ({ commit, state }, payload) {
      const { idActividad } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/actividad/${idActividad}/atributos`
        )
        commit('mantenedor_SET_ATRIBUTOS', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getjuzgados ({ commit, state }) {
      if (!state.juzgados.length) {
        try {
          const res = await apiRGP.get('/mantenedor/fiscalia/tribunales/')
          commit('mantenedor_SET_JUZGADOS', res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    // #region ACTIONS IDENTIFICACION DENUNCIAS
    async mantenedor_getTipoFiscalia ({ commit, state }) {
      if (!state.tiposFiscalia.length) {
        try {
          const res = await apiRGP.get('/mantenedor/fiscalia/tipo/')
          commit('mantenedor_SET_TIPOS_FISCALIA', res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getNombreFiscalia ({ commit }) {
      // siempre debe hacer la llamada, no colocar el if(!state.nombresFiscalia.length)
      try {
        const res = await apiRGP.get('/mantenedor/fiscalia/fiscalia/')
        commit('mantenedor_SET_NOMBRES_FISCALIA', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getFiscaliaBycodigoTipoYRegion ({ commit }, payload) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/fiscalia/fiscalia?tipo=${payload?.tipoFiscalia}&region=${payload?.regionFiscalia}`
        )
        commit('mantenedor_SET_NOMBRES_FISCALIA', res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getFiscaliaByIDFiscalia ({ commit }, payload) {
      try {
        const { idFiscalia } = payload
        const res = await apiRGP.get(
          `/mantenedor/fiscalia/fiscalia/${idFiscalia}`
        )
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getRegiones ({ commit, state }) {
      if (!state.regiones.length) {
        try {
          const res = await apiRGP.get('/mantenedor/geografia/region/')
          commit('mantenedor_SET_REGIONES', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getComunas ({ commit, state }) {
      if (!state.comuna.length) {
        try {
          const res = await apiRGP.get('/mantenedor/geografia/comuna/')
          commit('mantenedor_SET_COMUNA', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getComunasByIdRegion ({ commit }, payload) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/geografia/region/${payload.idRegion}/comuna`
        )
        // commit('mantenedor_SET_COMUNA', res.data)
        // no borrar el return Promise.resolve(res.data) por fis, se necesita la respuesta en el requestUtil
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region ACTIONS DILIGENCIAS
    // DEPRECADO REEMPLAZAR POR EL NUEVO /MANTENEDOR/ACTIVIDAD
    /*     async mantenedor_getTiposDiligencias ({ commit }) {
      return apiRGP.get('/mantenedor/diligencia/tipo/').then((res) => {
        commit('mantenedor_SET_SUBTIPOS_ACTIVIDAD', res.data)
      })
    }, */
    // DEPRECADO REEMPLAZAR POR EL NUEVO /MANTENEDOR/ACTIVIDAD
    /*     async mantenedor_getSubTiposDiligenciasByIdTipo ({ commit }, payload) {
      const { idTipoDiligencia } = payload
      return apiRGP.get(`/mantenedor/diligencia/tipo/${idTipoDiligencia}/subtipo/`).then((res) => {
        commit('mantenedor_SET_SUBTIPOS_ACTIVIDAD', res.data)
      })
    }, */
    // DEPRECADO REEMPLAZAR POR EL NUEVO /MANTENEDOR/ACTIVIDAD
    async mantenedor_getAllSubTiposDiligencias ({ commit }) {
      return apiRGP.get('/mantenedor/diligencia/subtipo').then((res) => {
        commit('mantenedor_SET_ALL_SUB_SUBTIPOS_ACTIVIDAD', res.data)
      })
    },
    async mantenedor_getEstadosDiligencia ({ commit, state }) {
      if (!state.estadosDiligencia.length) {
        try {
          const res = await apiRGP.get('/mantenedor/diligencia/estado/')
          commit('mantenedor_SET_ESTADOS_DILIGENCIA', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getActividadHijo ({ commit }, payload) {
      const { idCausaProceso, idActividad } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/actividad/causa-proceso/${idCausaProceso}/actividad-padre/${idActividad}/hijos`
        )
        payload.subsubtipo
          ? commit('mantenedor_SET_ACTIVIDADES_SUBSUBTIPO', res.data)
          : commit('mantenedor_SET_ACTIVIDADES_SUBTIPO', res.data)

        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getAtributos ({ commit }, payload) {
      const { idActividad } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/actividad/${idActividad}/atributos`
        )
        commit('mantenedor_SET_ATRIBUTOS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getAmbitosDiligencia ({ commit, state }) {
      if (!state.ambitosDiligencia.length) {
        try {
          const res = await apiRGP.get('/mantenedor/diligencia/ambito/')
          commit('mantenedor_SET_AMBITOS_DILIGENCIA', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getReferencias ({ commit, state }) {
      if (!state.referencias.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/diligencia/tipos-referencias/'
          )
          commit('mantenedor_SET_REFERENCIAS', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getInstituciones ({ commit, state }) {
      if (!state.instituciones.length) {
        try {
          const res = await apiRGP.get('/mantenedor/diligencia/institucion/')
          commit('mantenedor_SET_INSTITUCIONES', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getJustificaciones ({ commit, state }) {
      if (!state.justificaciones.length) {
        try {
          const res = await apiRGP.get('/mantenedor/diligencia/justificacion/')
          commit('mantenedor_SET_JUSTIFICACIONES', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getPlazosDiligencia ({ commit, state }) {
      if (!state.plazosDiligencia.length) {
        try {
          const res = await apiRGP.get('/mantenedor/diligencia/plazo/')
          commit('mantenedor_SET_PLAZOS_DILIGENCIA', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getPlantillasDiligencia ({ commit, state }) {
      if (!state.plantillasDiligencia.length) {
        try {
          const res = await apiRGP.get('/mantenedor/diligencia/plantilla/')
          commit('mantenedor_SET_PLANTILLAS_DILIGENCIA', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    // NUEVOS MANTENEDORES ACTIVIDAD QUE REEMPLAZAN TIPO - SUBTIPO DILIGENCIA
    async mantenedor_getTipoActividad ({ commit, state }, payload) {
      if (!state.tipoActividad.length) {
        const { idTipoActividad } = payload
        try {
          const res = await apiRGP.get(
            `/mantenedor/actividad/tipo/${idTipoActividad}`
          )
          commit('mantenedor_SET_TIPO_ACTIVIDAD', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoActividadByCodigoActividad ({ commit }, payload) {
      const { params } = payload
      try {
        const res = await apiRGP.get('/mantenedor/actividad/tipo', { params })
        commit('mantenedor_SET_TIPO_ACTIVIDAD', res.data)
        commit('mantenedor_SET_TIPO_ACTIVIDAD_BY_CODIGO', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoOrigenActividad ({ commit, state }) {
      if (!state.tipoOrigen.length) {
        try {
          const res = await apiRGP.get('/mantenedor/actividad/tipo-origen/')
          commit('mantenedor_SET_TIPO_ORIGEN', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoOrigenByCodigoActividad ({ commit }, payload) {
      const { codigo } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/actividad/tipo-origen/${codigo}`
        )
        commit('mantenedor_SET_TIPO_ORIGEN', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getAllSubTiposActividad ({ commit, state }) {
      if (!state.subtiposActividad.length) {
        try {
          const res = await apiRGP.get('/mantenedor/actividad/sub-tipo/')
          commit('mantenedor_SET_SUBTIPOS_ACTIVIDAD', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getSubTiposActividadByIdPadreTipoActividad (
      { commit },
      payload
    ) {
      try {
        const { idTipoActividad } = payload
        const res = await apiRGP.get(
          `/mantenedor/actividad/tipo/${idTipoActividad}/sub-tipo`
        )
        commit('mantenedor_SET_SUBTIPOS_ACTIVIDAD', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getAllSubSubTiposActividad ({ commit, state }) {
      if (!state.allSubSubTiposActividad.length) {
        try {
          const res = await apiRGP.get('/mantenedor/actividad/sub-subtipo/')
          commit('mantenedor_SET_ALL_SUB_SUBTIPOS_ACTIVIDAD', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getSubSubTiposActividadByIdPadre ({ commit }, payload) {
      const { IdPadre } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/actividad/sub-tipo/${IdPadre}/sub-subtipo/`
        )
        commit('mantenedor_SET_SUB_SUBTIPOS_ACTIVIDAD', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region ACTIONS CAUSA
    async mantenedor_getProcesoHito ({ commit }, payload) {
      const { codigo } = payload
      try {
        const { data } = await apiRGP.get(
          `mantenedor/causa/proceso?codigo=${codigo}`
        )
        commit('mantenedor_SET_PROCESO_HITO', data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTiposAntecedentes ({ state, commit }) {
      if (!state.tiposAntecedentes.length) {
        return apiRGP.get('/mantenedor/causa/antecedente/').then((res) => {
          commit('mantenedor_SET_TIPOS_ANTECEDENTES', res.data)
        })
      }
    },
    async mantenedor_getEstadosCausa ({ state, commit }) {
      if (!state.estadosCausa.length) {
        return apiRGP.get('/mantenedor/causa/estado-causa').then((res) => {
          commit('mantenedor_SET_ESTADOS_CAUSAS', res.data)
        })
      }
    },
    async mantenedor_getEstadoCausaById (idEstadoCausa) {
      try{
        const { data } = await apiRGP.get(`/mantenedor/causa/estado-causa/${idEstadoCausa}`)
        return Promise.resolve(data)
      }catch(error){
        return Promise.reject(error)
      }
    },
    async mantenedor_getTiposAntecedentesByOrigen ({ _state, commit }, payload) {
      const { idOrigen } = payload
      return apiRGP
        .get(`/mantenedor/causa/antecedente-origen/${idOrigen}/antecedente`)
        .then((res) => {
          commit('mantenedor_SET_TIPOS_ANTECEDENTES', res.data)
        })
    },
    async mantenedor_getTiposOrigenAntecedentes ({ state, commit }) {
      if (!state.tiposOrigenAntecedentes.length) {
        return apiRGP
          .get('/mantenedor/causa/antecedente-origen/')
          .then((res) => {
            commit('mantenedor_SET_TIPOS_ORIGEN_ANTECEDENTES', res.data)
          })
      }
    },
    async mantenedor_getTiposAmbitoAntecedentes ({ state, commit }) {
      if (!state.tiposAmbitoAntecedentes.length) {
        return apiRGP
          .get('/mantenedor/causa/antecedente-ambito/')
          .then((res) => {
            commit('mantenedor_SET_TIPOS_AMBITO_ANTECEDENTES', res.data)
          })
      }
    },
    async mantenedor_getTiposComplejidad ({ commit, state }) {
      if (!state.tiposComplejidad.length) {
        return apiRGP.get('/mantenedor/causa/complejidad').then((res) => {
          commit('mantenedor_SET_TIPOS_COMPLEJIDAD', res.data)
        })
      }
    },
    async mantenedor_getTiposImpacto ({ commit, state }) {
      if (!state.tiposImpacto.length) {
        return apiRGP.get('/mantenedor/causa/impacto').then((res) => {
          commit('mantenedor_SET_TIPOS_IMPACTO', res.data)
        })
      }
    },
    async mantenedor_getMotivosTransferencia ({ commit, state }) {
      if (!state.motivoTransferencia.length) {
        try {
          const request = await apiRGP.get(
            '/mantenedor/causa/motivo-transferencia'
          )
          commit('mantenedor_SET_MOTIVO_TRANSFERENCIA', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getDecisionAsignacion ({ commit, state }) {
      if (!state.decisionAsignacion.length) {
        try {
          const request = await apiRGP.get(
            '/mantenedor/causa/decision-asignacion'
          )
          commit('mantenedor_SET_DECISION_ASIGNACION', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getDecisionAsignacionById ({ commit }, id) {
      try {
        const request = await apiRGP.get(
          `/mantenedor/causa/decision-asignacion/${id}`
        )
        commit('mantenedor_SET_DECISION_ASIGNACION', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoAsignacion ({ commit, state }) {
      if (!state.tipoAsignacion.length) {
        try {
          const request = await apiRGP.get('/mantenedor/causa/tipo-asignacion')
          commit('mantenedor_SET_TIPO_ASIGNACION', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoAsignacionById ({ commit }, id) {
      try {
        const request = await apiRGP.get(
          `/mantenedor/causa/tipo-asignacion/${id}`
        )
        commit('mantenedor_SET_TIPO_ASIGNACION', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getMotivoAgrupacion ({ commit, state }) {
      if (!state.motivoAgrupacion.length) {
        try {
          const request = await apiRGP.get(
            '/mantenedor/causa/motivo-agrupacion'
          )
          commit('mantenedor_SET_MOTIVO_AGRUPACION', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getMotivoAgrupacionById ({ commit }, id) {
      try {
        const request = await apiRGP.get(
          `/mantenedor/causa/motivo-agrupacion/${id}`
        )
        commit('mantenedor_SET_MOTIVO_AGRUPACION', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getAccionAgrupacion ({ commit, state }) {
      if (!state.accionAgrupacion.length) {
        try {
          const request = await apiRGP.get(
            '/mantenedor/causa/accion-agrupacion'
          )
          commit('mantenedor_SET_ACCION_AGRUPACION', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getAccionAgrupacionById ({ commit }, id) {
      try {
        const request = await apiRGP.get(
          `/mantenedor/causa/accion-agrupacion/${id}`
        )
        commit('mantenedor_SET_ACCION_AGRUPACION', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getEstadoAgrupacion ({ commit, state }) {
      if (!state.estadoAgrupacion.length) {
        try {
          const request = await apiRGP.get(
            '/mantenedor/causa/estado-agrupacion'
          )
          commit('mantenedor_SET_ESTADO_AGRUPACION', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getEstadoAgrupacionById ({ commit }, id) {
      try {
        const request = await apiRGP.get(
          `/mantenedor/causa/estado-agrupacion/${id}`
        )
        commit('mantenedor_SET_ESTADO_AGRUPACION', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getDetalleEstadoAgrupacion ({ commit, state }) {
      if (!state.detalleEstadoAgrupacion.length) {
        try {
          const request = await apiRGP.get(
            '/mantenedor/causa/detalle-estado-agrupacion'
          )
          commit('mantenedor_SET_DETALLE_ESTADO_AGRUPACION', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getDetalleEstadoAgrupacionById ({ commit }, id) {
      try {
        const request = await apiRGP.get(
          `/mantenedor/causa/detalle-estado-agrupacion/${id}`
        )
        commit('mantenedor_SET_DETALLE_ESTADO_AGRUPACION', request.data)
        return request.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getMotivosDesestimacion ({ commit, state }) {
      if (!state.motivosDesestimacion.length) {
        try {
          const { data } = await apiRGP.get(
            '/mantenedor/causa/motivo-desestimacion'
          )
          commit('mantenedor_SET_MOTIVOS_DESESTIMACION', data)
          return Promise.resolve(data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTiposTermino ({ commit, state }) {
      if (!state.tiposTermino.length) {
        try {
          const { data } = await apiRGP.get('/mantenedor/causa/termino')
          commit('mantenedor_SET_TIPOS_TERMINO', data)
          return Promise.resolve(data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getSubTiposTerminoByIdTermino ({ commit }, payload) {
      const { id } = payload
      if (!id) return
      try {
        const { data } = await apiRGP.get(
          `/mantenedor/causa/termino/subtipo/${id}`
        )

        commit('mantenedor_SET_SUBTIPOS_TERMINO', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getResultadosConsulta ({ commit, state }) {
      if (!state.resultadosConsultaTermino.length) {
        try {
          const { data } = await apiRGP.get(
            `/mantenedor/causa/termino/resultado-consulta`
          )

          commit('mantenedor_SET_RESULTADOS_CONSULTA_TERMINO', data)

          return Promise.resolve(data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTiposSuspension ({ commit, state }) {
      if (!state.tiposSuspension.length) {
        try {
          const { data } = await apiRGP.get('/mantenedor/causa/suspension')
          commit('mantenedor_SET_TIPOS_SUSPENSION', data)
          return Promise.resolve(data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getSubTiposSuspensionByIdSuspension ({ commit }, payload) {
      const { id } = payload

      try {
        const { data } = await apiRGP.get(
          `/mantenedor/causa/suspension/subtipo/${id}`
        )

        commit('mantenedor_SET_SUBTIPOS_SUSPENSION', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTiposAccionCierre ({ commit, state }) {
      if (!state.tiposAccionCierre.length) {
        try {
          return apiRGP.get('/mantenedor/causa/accion-cierre').then((res) => {
            commit('mantenedor_SET_TIPOS_ACCION_CIERRE', res.data)
          })
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getCondicionesAR ({ commit, state }) {
      if (!state.condicionesAR.length) {
        try {
          return apiRGP
            .get('/mantenedor/causa/termino/control-condicion')
            .then((res) => {
              commit('mantenedor_SET_CONDICIONES_AR', res.data)
            })
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getMotivosSobreseimiento ({ commit, state }) {
      if (!state.motivosSobreseimiento.length) {
        try {
          return apiRGP
            .get('/mantenedor/causa/termino/motivo-sobreseimiento')
            .then((res) => {
              commit('mantenedor_SET_MOTIVOS_SOBRESEIMIENTO', res.data)
            })
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    // #endregion

    // #region ACTIONS DELITO
    async mantenedor_getFamiliasDelito ({ state, commit }) {
      if (!state.familiasDelito.length) {
        return apiRGP
          .get('mantenedor/denuncia/familia-delitos/')
          .then((res) => {
            commit('mantenedor_SET_FAMILIAS_DELITO', res.data)
          })
      }
    },

    async mantenedor_getTiposDelito ({ state, commit }) {
      if (!state.tiposDelito.length) {
        return apiRGP.get('mantenedor/denuncia/delitos/').then((res) => {
          commit('mantenedor_SET_TIPOS_DELITO', res.data)
        })
      }
    },

    async mantenedor_getTiposMediosComisionDelito ({ state, commit }) {
      if (!state.mediosComisionDelitos.length) {
        return apiRGP.get('mantenedor/denuncia/tipo-medio/').then((res) => {
          commit('mantenedor_SET_TIPOS_MEDIO_COMISION_DELITO', res.data)
        })
      }
    },
    async mantenedor_getTiposDenuncia ({ state, commit }) {
      if (!state.tiposDenuncia.length) {
        return apiRGP.get('mantenedor/denuncia/tipo/').then((res) => {
          commit('mantenedor_SET_TIPOS_DENUNCIA', res.data)
        })
      }
    },

    async mantenedor_getInstitucionesDenuncia ({ state, commit }) {
      if (!state.institucionesDenuncia.length) {
        try {
          const request = await apiRGP.get(
            'mantenedor/denuncia/instituciones/'
          )
          commit('mantenedor_SET_INSTITUCIONES_DENUNCIA', request.data)
          return request.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoHallazgo ({ state, commit }) {
      if (!state.tipoHallazgo.length) {
        try {
          const tipoHallazgo = await apiRGP.get(
            'mantenedor/denuncia/tipo-hallazgo/'
          )
          commit('mantenedor_SET_TIPO_HALLAZGO', tipoHallazgo.data)
          return tipoHallazgo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoHallazgoById ({ commit }, idTipoHallazgo) {
      try {
        const tipoHallazgo = await apiRGP.get(
          `mantenedor/denuncia/tipo-hallazgo/${idTipoHallazgo}`
        )
        commit('mantenedor_SET_TIPO_HALLAZGO', tipoHallazgo.data)
        return tipoHallazgo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoElementoUsado ({ commit, state }) {
      if (!state.tipoElementoUsado.length) {
        try {
          const tipoElementoUsado = await apiRGP.get(
            'mantenedor/denuncia/tipos-arma/'
          )
          commit('mantenedor_SET_TIPO_ELEMENTO_USADO', tipoElementoUsado.data)
          return tipoElementoUsado.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoElementoUsadoById ({ commit }, idTipoElementoUsado) {
      try {
        const tipoElementoUsado = await apiRGP.get(
          `mantenedor/denuncia/tipos-arma/${idTipoElementoUsado}`
        )
        commit('mantenedor_SET_TIPO_ELEMENTO_USADO', tipoElementoUsado.data)
        return tipoElementoUsado.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTiposElementosUsadoByIdPadre (
      { commit },
      idPadreTipoElementoUsado
    ) {
      try {
        const { params } = idPadreTipoElementoUsado
        const tipoElementoUsado = await apiRGP.get(
          `mantenedor/denuncia/elementos-usados/`,
          { params }
        )
        commit('mantenedor_SET_TIPO_ELEMENTO_USADO', tipoElementoUsado.data)
        return tipoElementoUsado.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoTransporte ({ commit, state }) {
      if (!state.tipoTransporte.length) {
        try {
          const tipoTransporte = await apiRGP.get(
            'mantenedor/denuncia/medios-transporte-utilizados/'
          )
          commit('mantenedor_SET_TIPO_TRANSPORTE', tipoTransporte.data)
          return tipoTransporte.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoTransporteById ({ commit }, idTipoTransporte) {
      try {
        const tipoTransporte = await apiRGP.get(
          `mantenedor/denuncia/medios-transporte-utilizados/${idTipoTransporte}`
        )
        commit('mantenedor_SET_TIPO_TRANSPORTE', tipoTransporte.data)
        return tipoTransporte.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getTipoVigilancia ({ commit, state }) {
      if (!state.tipoVigilancia.length) {
        try {
          const tipoVigilancia = await apiRGP.get(
            'mantenedor/denuncia/tipo-vigilancia/'
          )
          commit('mantenedor_SET_TIPO_VIGILANCIA', tipoVigilancia.data)
          return tipoVigilancia.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoVigilanciaById ({ commit }, idTipovigilancia) {
      try {
        const tipoVigilancia = await apiRGP.get(
          `mantenedor/denuncia/tipo-vigilancia/${idTipovigilancia}`
        )
        commit('mantenedor_SET_TIPO_VIGILANCIA', tipoVigilancia.data)
        return tipoVigilancia.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getFuenteInformacionTestigo ({ commit, state }) {
      if (!state.fuenteInfoTestigo.length) {
        try {
          const fuenteInfoTestigo = await apiRGP.get(
            'mantenedor/denuncia/fuente-informacion-testigo/'
          )
          commit('mantenedor_SET_FUENTE_INFO_TESTIGO', fuenteInfoTestigo.data)
          return fuenteInfoTestigo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getFuenteInformacionTestigoById ({ commit }, idFIT) {
      try {
        const fuenteInfoTestigo = await apiRGP.get(
          `mantenedor/denuncia/fuente-informacion-testigo/${idFIT}`
        )
        commit('mantenedor_SET_FUENTE_INFO_TESTIGO', fuenteInfoTestigo.data)
        return fuenteInfoTestigo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoTestigo ({ commit, state }) {
      if (!state.tipoTestigo.length) {
        try {
          const tipoTestigo = await apiRGP.get(
            'mantenedor/denuncia/tipo-testigo/'
          )
          commit('mantenedor_SET_TIPO_TESTIGO', tipoTestigo.data)
          return tipoTestigo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoTestigoById ({ commit }, idTipoTestigo) {
      try {
        const tipoTestigo = await apiRGP.get(
          `mantenedor/denuncia/tipo-testigo/${idTipoTestigo}`
        )
        commit('mantenedor_SET_TIPO_TESTIGO', tipoTestigo.data)
        return tipoTestigo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getRolHechoDelictual ({ commit, state }) {
      if (!state.rolHechoDelictual.length) {
        try {
          const rolHechoDelictual = await apiRGP.get(
            'mantenedor/denuncia/rol-hecho-delictual/'
          )
          commit('mantenedor_SET_ROL_HECHO_DELICTUAL', rolHechoDelictual.data)
          return rolHechoDelictual.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getRolHechoDelictualById ({ commit }, idRHD) {
      try {
        const rolHechoDelictual = await apiRGP.get(
          `mantenedor/denuncia/rol-hecho-delictual/${idRHD}`
        )
        commit('mantenedor_SET_ROL_HECHO_DELICTUAL', rolHechoDelictual.data)
        return rolHechoDelictual.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getPerfilImputado ({ commit, state }) {
      if (!state.perfilImputado.length) {
        try {
          const perfilImputado = await apiRGP.get(
            'mantenedor/denuncia/perfil-imputado/'
          )
          commit('mantenedor_SET_PERFIL_IMPUTADO', perfilImputado.data)
          return perfilImputado.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getPerfilImputadoById ({ commit }, idPerfilImputado) {
      try {
        const perfilImputado = await apiRGP.get(
          `mantenedor/denuncia/perfil-imputado/${idPerfilImputado}`
        )
        commit('mantenedor_SET_PERFIL_IMPUTADO', perfilImputado.data)
        return perfilImputado.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoFuncionario ({ commit, state }) {
      if (!state.tipoFuncionario.length) {
        try {
          const tipoFuncionario = await apiRGP.get(
            'mantenedor/denuncia/rol-funcionario-participante/'
          )
          commit('mantenedor_SET_TIPO_FUNCIONARIO', tipoFuncionario.data)
          return tipoFuncionario.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoFuncionarioById ({ commit }, idTipoFuncionario) {
      try {
        const tipoFuncionario = await apiRGP.get(
          `mantenedor/denuncia/rol-funcionario-participante/${idTipoFuncionario}`
        )
        commit('mantenedor_SET_TIPO_FUNCIONARIO', tipoFuncionario.data)
        return tipoFuncionario.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getMedidasSeguridad ({ commit, state }) {
      if (!state.medidaSeguridad.length) {
        try {
          const medidaSeguridad = await apiRGP.get(
            `mantenedor/denuncia/medidas-seguridad/`
          )
          commit('mantenedor_SET_MEDIDA_SEGURIDAD', medidaSeguridad.data)
          return medidaSeguridad.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getMedidasSeguridadById ({ commit }, idMedidaSeguridad) {
      try {
        const medidaSeguridad = await apiRGP.get(
          `mantenedor/denuncia/medidas-seguridad/${idMedidaSeguridad}`
        )
        commit('mantenedor_SET_MEDIDA_SEGURIDAD', medidaSeguridad.data)
        return medidaSeguridad.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getModalidadGrupo ({ commit, state }) {
      if (!state.modalidadGrupo.length) {
        try {
          const modalidadGrupo = await apiRGP.get(
            `mantenedor/denuncia/modalidad-grupo/`
          )
          commit('mantenedor_SET_MODALIDAD_GRUPO', modalidadGrupo.data)
          return modalidadGrupo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getModalidadGrupoById ({ commit }, idModalidadGrupo) {
      try {
        const modalidadGrupo = await apiRGP.get(
          `mantenedor/denuncia/modalidad-grupo/${idModalidadGrupo}`
        )
        commit('mantenedor_SET_MODALIDAD_GRUPO', modalidadGrupo.data)
        return modalidadGrupo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getCantidadSujetos ({ commit, state }) {
      if (!state.cantidadSujetos.length) {
        try {
          const cantidadSujetos = await apiRGP.get(
            `mantenedor/denuncia/cantidad-sujetos/`
          )
          commit('mantenedor_SET_CANTIDAD_SUJETOS', cantidadSujetos.data)
          return cantidadSujetos.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getCantidadSujetosById ({ commit }, idCantidadSujetos) {
      try {
        const cantidadSujetos = await apiRGP.get(
          `mantenedor/denuncia/cantidad-sujetos/${idCantidadSujetos}`
        )
        commit('mantenedor_SET_CANTIDAD_SUJETOS', cantidadSujetos.data)
        return cantidadSujetos.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region ACTIONS SUJETOS INTERVINIENTES
    async mantenedor_getTiposSujetos ({ commit, state }) {
      if (!state.tiposSujeto.length) {
        try {
          const tiposSujetos = await apiRGP.get(
            'mantenedor/persona/tipo-sujeto/'
          )
          commit('mantenedor_SET_TIPOS_SUJETOS', tiposSujetos.data)
          return tiposSujetos.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoVictima ({ commit, state }) {
      if (!state.tipoVictima.length) {
        try {
          const tipoVictima = await apiRGP.get(
            'mantenedor/persona/tipo-victima/'
          )
          commit('mantenedor_SET_TIPO_VICTIMA', tipoVictima.data)
          return tipoVictima.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoVictimaById ({ commit }, idTipoVictima) {
      try {
        const tipoVictima = await apiRGP.get(
          `mantenedor/persona/tipo-victima/${idTipoVictima}`
        )
        commit('mantenedor_SET_TIPO_VICTIMA', tipoVictima.data)
        return tipoVictima.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getEscolaridad ({ commit, state }) {
      if (!state.escolaridad.length) {
        try {
          const escolaridad = await apiRGP.get(
            'mantenedor/persona/escolaridad/'
          )
          commit('mantenedor_SET_ESCOLARIDAD', escolaridad.data)
          return escolaridad.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getEscolaridadById ({ commit }, idEscolaridad) {
      try {
        const escolaridad = await apiRGP.get(
          `mantenedor/persona/escolaridad/${idEscolaridad}`
        )
        commit('mantenedor_SET_ESCOLARIDAD', escolaridad.data)
        return escolaridad.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoSexo ({ commit, state }) {
      if (!state.tipoSexo.length) {
        try {
          const tipoSexo = await apiRGP.get('mantenedor/persona/tipo-sexo/')
          commit('mantenedor_SET_TIPO_SEXO', tipoSexo.data)
          return tipoSexo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoSexoById ({ commit }, idTipoSexo) {
      try {
        const tipoSexo = await apiRGP.get(
          `mantenedor/persona/tipo-sexo/${idTipoSexo}`
        )
        commit('mantenedor_SET_TIPO_SEXO', tipoSexo.data)
        return tipoSexo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoNnaResponsable ({ commit, state }) {
      if (!state.tipoNnaResponsable.length) {
        try {
          const tipoNnaResponsable = await apiRGP.get(
            'mantenedor/persona/tipo-nna-responsable/'
          )
          commit(
            'mantenedor_SET_TIPO_NNA_RESPONSABLE',
            tipoNnaResponsable.data ? tipoNnaResponsable.data : []
          )
          return tipoNnaResponsable.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoNnaResponsableById ({ commit }, idTNR) {
      try {
        const tipoNnaResponsable = await apiRGP.get(
          `mantenedor/persona/tipo-nna-responsable/${idTNR}`
        )
        commit('mantenedor_SET_TIPO_NNA_RESPONSABLE', tipoNnaResponsable.data)
        return tipoNnaResponsable.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoRepresentado ({ commit, state }) {
      if (!state.tipoRepresentado.length) {
        try {
          const tipoRepresentado = await apiRGP.get(
            'mantenedor/persona/tipo-representado/'
          )
          commit('mantenedor_SET_TIPO_REPRESENTADO', tipoRepresentado.data)
          return tipoRepresentado.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoRepresentadoById ({ commit }, idTipoRepresentado) {
      try {
        const tipoRepresentado = await apiRGP.get(
          `mantenedor/persona/tipo-representado/${idTipoRepresentado}`
        )
        commit('mantenedor_SET_TIPO_REPRESENTADO', tipoRepresentado.data)
        return tipoRepresentado.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoInstitucionPerteneciente ({ commit, state }) {
      if (!state.tipoInstitucionPerteneciente.length) {
        try {
          const tipoinstitucionPerteneciente = await apiRGP.get(
            'mantenedor/persona/tipo-institucion-perteneciente/'
          )
          commit(
            'mantenedor_SET_TIPO_INSTITUCION_PERTENECIENTE',
            tipoinstitucionPerteneciente.data
          )
          return tipoinstitucionPerteneciente.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoInstitucionPertenecienteById ({ commit }, idTIP) {
      try {
        const tipoinstitucionPerteneciente = await apiRGP.get(
          `mantenedor/persona/tipo-institucion-perteneciente/${idTIP}`
        )
        commit(
          'mantenedor_SET_TIPO_INSTITUCION_PERTENECIENTE',
          tipoinstitucionPerteneciente.data
        )
        return tipoinstitucionPerteneciente.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoAcreditacion ({ commit, state }) {
      if (!state.tipoAcreditacion.length) {
        try {
          const tipoAcreditacion = await apiRGP.get(
            'mantenedor/persona/tipo-acreditacion/'
          )
          commit('mantenedor_SET_TIPO_ACREDITACION', tipoAcreditacion.data)
          return tipoAcreditacion.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoAcreditacionById ({ commit }, idTipoAcreditacion) {
      try {
        const tipoAcreditacion = await apiRGP.get(
          `mantenedor/persona/tipo-acreditacion/${idTipoAcreditacion}`
        )
        commit('mantenedor_SET_TIPO_ACREDITACION', tipoAcreditacion.data)
        return tipoAcreditacion.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoLugarOcurrencia ({ commit, state }) {
      if (!state.tipoLugarOcurrencia.length) {
        try {
          const tipoLugarOcurrencia = await apiRGP.get(
            'mantenedor/denuncia/lugar-ocurrencia/'
          )
          commit(
            'mantenedor_SET_TIPO_LUGAR_OCURRENCIA',
            tipoLugarOcurrencia.data
          )
          return tipoLugarOcurrencia.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoLugarOcurrenciaById ({ commit }, idTLO) {
      try {
        const tipoLugarOcurrencia = await apiRGP.get(
          `mantenedor/denuncia/lugar-ocurrencia/${idTLO}`
        )
        commit(
          'mantenedor_SET_TIPO_LUGAR_OCURRENCIA',
          tipoLugarOcurrencia.data
        )
        return tipoLugarOcurrencia.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getViaIngreso ({ commit, state }) {
      if (!state.viaIngreso.length) {
        try {
          const viaIngreso = await apiRGP.get(
            'mantenedor/denuncia/via-ingreso/'
          )
          commit('mantenedor_SET_VIA_INGRESO', viaIngreso.data)
          return viaIngreso.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getViaIngresoById ({ commit }, idViaIngreso) {
      try {
        const viaIngreso = await apiRGP.get(
          `mantenedor/denuncia/via-ingreso/${idViaIngreso}`
        )
        commit('mantenedor_SET_VIA_INGRESO', viaIngreso.data)
        return viaIngreso.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getUnidadPolicial ({ commit, state }) {
      if (!state.unidadPolicial.length) {
        try {
          const unidadPolicial = await apiRGP.get(
            'mantenedor/denuncia/unidad-policial/'
          )
          commit('mantenedor_SET_UNIDAD_POLICIAL', unidadPolicial.data)
          return unidadPolicial.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getUnidadPolicialById ({ commit }, idUnidadPolicial) {
      try {
        const unidadPolicial = await apiRGP.get(
          `mantenedor/denuncia/unidad-policial/${idUnidadPolicial}`
        )
        commit('mantenedor_SET_UNIDAD_POLICIAL', unidadPolicial.data)
        return unidadPolicial.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getZonaDelito ({ commit, state }) {
      if (!state.zonaDelito.length) {
        try {
          const zonaDelito = await apiRGP.get(
            'mantenedor/direccion/zona-delito/'
          )
          commit('mantenedor_SET_ZONA_DELITO', zonaDelito.data)
          return zonaDelito.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getZonaDelitoById ({ commit }, idZonaDelito) {
      try {
        const zonaDelito = await apiRGP.get(
          `mantenedor/direccion/zona-delito/${idZonaDelito}`
        )
        commit('mantenedor_SET_ZONA_DELITO', zonaDelito.data)
        return zonaDelito.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getCausaDetencion ({ commit, state }) {
      if (!state.causaDetencion.length) {
        try {
          const causaDetencion = await apiRGP.get(
            'mantenedor/causa/causal-detencion/'
          )
          commit('mantenedor_SET_CAUSA_DETENCION', causaDetencion.data)
          return causaDetencion.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getCausaDetencionById ({ commit }, idCausaDetencion) {
      try {
        const causaDetencion = await apiRGP.get(
          `mantenedor/causa/causal-detencion/${idCausaDetencion}`
        )
        commit('mantenedor_SET_CAUSA_DETENCION', causaDetencion.data)
        return causaDetencion.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getProfesiones ({ commit, state }) {
      if (!state.profesiones.length) {
        try {
          const tiposSujetos = await apiRGP.get(
            'mantenedor/persona/profesion/'
          )
          commit('mantenedor_SET_PROFESIONES', tiposSujetos.data)
          return tiposSujetos.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getTiposDocumento ({ commit, state }) {
      if (!state.tiposDocumento.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/persona/tipo-documento-identificacion/'
          )
          commit('mantenedor_SET_TIPOS_DOCUMENTO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getTiposPersona ({ commit, state }) {
      if (!state.tiposPersona.length) {
        try {
          const res = await apiRGP.get('/mantenedor/persona/tipo/')
          commit('mantenedor_SET_TIPOS_PERSONA', res.data.slice(0, 2))
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getEstadoCivil ({ commit, state }) {
      if (!state.estadoCivil.length) {
        try {
          const res = await apiRGP.get('/mantenedor/persona/estado-civil/')
          commit('mantenedor_SET_ESTADO_CIVIL', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getEstadoCivilById ({ commit }, idEstadoCivil) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/estado-civil/${idEstadoCivil}`
        )
        commit('mantenedor_SET_ESTADO_CIVIL', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getEstadoMigratorio ({ commit, state }) {
      if (!state.estadoMigratorio.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/persona/estado-migratorio/'
          )
          commit('mantenedor_SET_ESTADO_MIGRATORIO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getEstadoMigratorioById ({ commit }, idEstadoMigratorio) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/estado-migratorio/${idEstadoMigratorio}`
        )
        commit('mantenedor_SET_ESTADO_MIGRATORIO', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getIdentidadGenero ({ commit, state }) {
      if (!state.identidadGenero.length) {
        try {
          const res = await apiRGP.get('/mantenedor/persona/identidad-genero/')
          commit('mantenedor_SET_IDENTIDAD_GENERO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getIdentidadGeneroById ({ commit }, idIdentidadGenero) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/identidad-genero/${idIdentidadGenero}`
        )
        commit('mantenedor_SET_IDENTIDAD_GENERO', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getPueblosOriginarios ({ commit, state }) {
      if (!state.pueblosOriginarios.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/persona/pueblo-originario/'
          )
          commit('mantenedor_SET_PUEBLOS_ORIGINARIOS', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getPueblosOriginariosById ({ commit }, idPuebloOriginario) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/pueblo-originario/${idPuebloOriginario}`
        )
        commit('mantenedor_SET_PUEBLOS_ORIGINARIOS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getTipoContacto ({ commit, state }) {
      if (!state.tipoContacto.length) {
        try {
          const res = await apiRGP.get('/mantenedor/persona/tipo-contacto/')
          commit('mantenedor_SET_TIPO_CONTACTO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoContactoById ({ commit }, idTipoContacto) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/tipo-contacto/${idTipoContacto}`
        )
        commit('mantenedor_SET_TIPO_CONTACTO', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getEstadoTemperancia ({ commit, state }) {
      if (!state.estadoTemperancia.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/persona/estado-temperancia/'
          )
          commit('mantenedor_SET_ESTADO_TEMPERANCIA', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getEstadoTemperanciaById ({ commit }, idEstadoTempe) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/estado-temperancia/${idEstadoTempe}`
        )
        commit('mantenedor_SET_ESTADO_TEMPERANCIA', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getParentesco ({ commit, state }) {
      if (!state.parentesco.length) {
        try {
          const res = await apiRGP.get('/mantenedor/persona/parentesco/')
          commit('mantenedor_SET_PARENTESCO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getParentescoById ({ commit }, idParentesco) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/parentesco/${idParentesco}`
        )
        commit('mantenedor_SET_PARENTESCO', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getDiscapacidad ({ commit, state }) {
      if (!state.discapacidad.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/persona/situacion-discapacidad/'
          )
          commit('mantenedor_SET_DISCAPACIDAD', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getDiscapacidadById ({ commit }, idDiscapacidad) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/situacion-discapacidad/${idDiscapacidad}`
        )
        commit('mantenedor_SET_DISCAPACIDAD', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getValidacionIdentidad ({ commit, state }) {
      if (!state.validacionIdentidad.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/persona/validacion-identidad/'
          )
          commit('mantenedor_SET_VALIDACION_IDENTIDAD', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getValidacionIdentidadById (
      { commit },
      idValidacionIdentidad
    ) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/persona/validacion-identidad/${idValidacionIdentidad}`
        )
        commit('mantenedor_SET_VALIDACION_IDENTIDAD', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getPaises ({ commit, state }) {
      if (!state.paises.length) {
        try {
          const res = await apiRGP.get('/mantenedor/geografia/pais/')
          commit('mantenedor_SET_PAISES', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getMedidasProteccion ({ commit, state }) {
      if (!state.medidasProteccion.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/fiscalia/medidas-proteccion/'
          )
          commit('mantenedor_SET_MEDIDAS_PROTECCION', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getOrganismoRol ({ commit, state }) {
      if (!state.organismoRol.length) {
        try {
          const res = await apiRGP.get('/mantenedor/fiscalia/organismo-rol')
          commit('mantenedor_SET_ORGANISMO_ROL', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getOrganismoRolById ({ _ }, { idOrganismoRol }) {
      try {
        const res = await apiRGP.get(
          `/mantenedor/fiscalia/organismo-rol/${idOrganismoRol}`
        )
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getRelacionesSujetos ({ commit, state }) {
      if (!state.relacionesSujetos.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/denuncia/relacion-sujeto-denunciado/'
          )
          commit('mantenedor_SET_RELACIONES_SUJETOS', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getMedidasProteccionPersona ({ commit, state }) {
      if (!state.medidasProteccionPersona.length) {
        try {
          const medidasProteccionPersona = await apiRGP.get(
            'mantenedor/denuncia/medidas-proteccion/'
          )
          commit(
            'mantenedor_SET_MEDIDAS_PROTECCION_PERSONA',
            medidasProteccionPersona.data
          )
          return medidasProteccionPersona.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getMedidasProteccionPersonaById ({ commit }, payload) {
      try {
        const { idMedidaProteccion } = payload
        const medidasProteccionPersona = await apiRGP.get(
          `mantenedor/persona/medidas-proteccion/${idMedidaProteccion}`
        )
        commit(
          'mantenedor_SET_MEDIDAS_PROTECCION_PERSONA',
          medidasProteccionPersona.data
        )
        return Promise.resolve(medidasProteccionPersona.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region ACTIONS DIRECCION
    async mantenedor_getTiposDireccion ({ commit, state }) {
      if (!state.tiposDireccion.length) {
        try {
          const res = await apiRGP.get('/mantenedor/direccion/tipo/')
          commit('mantenedor_SET_TIPOS_DIRECCION', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoMedioContacto ({ commit, state }) {
      if (!state.tiposMedioContacto.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/direccion/tipo-medio-contacto/'
          )
          commit('mantenedor_SET_TIPO_MEDIO_CONTACTO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoContactoDueno ({ commit, state }) {
      if (!state.tiposContactoDueno.length) {
        try {
          const res = await apiRGP.get(
            '/mantenedor/direccion/tipo-contacto-dueno/'
          )
          commit('mantenedor_SET_TIPO_CONTACTO_DUENO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    // #endregion

    // #region ACTIONS ESPECIES
    async mantenedor_getTiposEspecies ({ _state, commit }, payload) {
      let te = []
      if (payload?.id) {
        try {
          const res = await apiRGP.get(
            `/mantenedor/especie/familia/${payload.id}/tipo/`
          )
          te = res.data
          commit('mantenedor_SET_TIPOS_ESPECIES', res.data)
        } catch (error) {
          Promise.reject(error)
        }
      } else if (payload?.familiaEspecie) {
        try {
          const res = await apiRGP.get(
            `/mantenedor/especie/familia/${payload.familiaEspecie}/tipo/`
          )
          te = res.data
          commit('mantenedor_SET_TIPOS_ESPECIES_PARA_TABLA', res.data)
        } catch (error) {
          Promise.reject(error)
        }
      } else {
        commit('mantenedor_SET_TIPOS_ESPECIES', [
          { descripcion: 'Sin tipo Especie', id: 'sin-tipox' }
        ])
      }
      if (te.length > 0) {
        return te
      }
    },

    async mantenedor_getTipoEspecieByIdTipo ({ _commit }, payload) {
      if (payload) {
        try {
          return apiRGP.get(`/mantenedor/especie/tipo/${payload}`).data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getFamiliaEspecies ({ commit, state }) {
      if (!state.familiaEspecies.length) {
        try {
          const { data } = await apiRGP.get('/mantenedor/especie/familia/')
          commit('mantenedor_SET_FAMILIA_ESPECIE', data)
          return Promise.resolve(data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    async mantenedor_getAmbitoEspecie ({ state, commit }) {
      if (!state.ambitoEspecie.length) {
        try {
          const ambitoEspecie = await apiRGP.get(
            'mantenedor/especie/ambito-especie/'
          )
          commit('mantenedor_SET_AMBITO_ESPECIE', ambitoEspecie.data)
          return ambitoEspecie.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getAmbitoEspecieById ({ commit }, idAmbitoEspecie) {
      try {
        const ambitoEspecie = await apiRGP.get(
          `mantenedor/especie/ambito-especie/${idAmbitoEspecie}`
        )
        commit('mantenedor_SET_AMBITO_ESPECIE', ambitoEspecie.data)
        return ambitoEspecie.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getRazonMovimientoEspecie ({ state, commit }) {
      if (!state.razonMovimientoEspecie.length) {
        return apiRGP
          .get('/mantenedor/especie/razon-movimiento/')
          .then((res) => {
            commit('mantenedor_SET_RAZON_MOVIMIENTO_ESPECIE', res.data)
          })
      }
    },
    async mantenedor_getRazonMovimientoEspecieById (
      { _state, commit },
      payload
    ) {
      if (payload) {
        try {
          await apiRGP
            .get(`/mantenedor/especie/razon-movimiento/${payload}`)
            .then((res) => {
              commit('mantenedor_SET_RAZON_MOVIMIENTO_ESPECIE', res.data)
            })
        } catch (error) {
          Promise.reject(error)
        }
      }
    },
    async mantenedor_getUnidadMedidaEspecie ({ state, commit }) {
      if (!state.unidadMedidaEspecie.length) {
        let medidas = {}
        try {
          await apiRGP.get('/mantenedor/especie/unidad-medida/').then((res) => {
            medidas = res.data
            commit('mantenedor_SET_UNIDAD_MEDIDA_ESPECIE', medidas)
          })
        } catch (error) {
          Promise.reject(error)
        }
      }
    },
    async mantenedor_getClasePeligroEspecie ({ state, commit }) {
      try {
        await apiRGP
          .get('/mantenedor/especie/clase-peligro-especie/')
          .then((res) => {
            const clasesPeligro = res.data
            commit('mantenedor_SET_CLASES_ESPECIE_PELIGROSA', clasesPeligro)
          })
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedor_getClaseEspecie ({ commit }) {
      try {
        commit('mantenedor_SET_CLASE_ESPECIE', listClaseEspecie)
        return listClaseEspecie
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedor_getEstadoConservacionEspecie ({ commit }) {
      try {
        commit(
          'mantenedor_SET_ESTADO_CONSERVACION_ESPECIE',
          listEstadoConservacionEspecie
        )
        return listEstadoConservacionEspecie
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedor_geTipoMoneda ({ commit, state }) {
      if (!state.tipoMoneda.length) {
        try {
          const tipoMoneda = await apiRGP.get(
            'mantenedor/especie/tipo-moneda/'
          )
          commit('mantenedor_SET_TIPO_MONEDA', tipoMoneda.data)
          return tipoMoneda.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_geTipoMonedaById ({ commit }, idTipoMoneda) {
      try {
        const tipoMoneda = await apiRGP.get(
          `mantenedor/especie/tipo-moneda/${idTipoMoneda}`
        )
        commit('mantenedor_SET_TIPO_MONEDA', tipoMoneda.data)
        return tipoMoneda.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoDinero ({ commit }) {
      try {
        commit('mantenedor_SET_TIPO_DINERO', listTipoDinero)
        return listTipoDinero
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedor_getDenominacionDinero ({ commit }) {
      try {
        commit('mantenedor_SET_DENOMINACION_DINERO', listDenominacionDinero)
        return listDenominacionDinero
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedor_getPronunciamientoFiscalEspecie ({ commit }) {
      try {
        commit(
          'mantenedor_SET_PRONUNCIAMIENTO_FISCAL',
          listPronunciamientoFiscalEspecie
        )
        return listPronunciamientoFiscalEspecie
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedor_getMarcaOreja ({ commit, state }) {
      if (!state.marcaOreja.length) {
        try {
          const marcaOreja = await apiRGP.get(
            'mantenedor/especie/animal/marca-oreja/'
          )
          commit('mantenedor_SET_MARCA_OREJA', marcaOreja.data)
          return marcaOreja.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getMarcaOrejaById ({ commit }, idMarcaOreja) {
      try {
        const marcaOreja = await apiRGP.get(
          `mantenedor/especie/animal/marca-oreja/${idMarcaOreja}`
        )
        commit('mantenedor_SET_MARCA_OREJA', marcaOreja.data)
        return marcaOreja.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getTipoTusa ({ commit, state }) {
      if (!state.tipoTusa.length) {
        try {
          const tipoTusa = await apiRGP.get(
            'mantenedor/especie/animal/tipo-tusa/'
          )
          commit('mantenedor_SET_TIPO_TUSA', tipoTusa.data)
          return tipoTusa.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoTusaById ({ commit }, idTipoTusa) {
      try {
        const tipoTusa = await apiRGP.get(
          `mantenedor/especie/animal/tipo-tusa/${idTipoTusa}`
        )
        commit('mantenedor_SET_TIPO_TUSA', tipoTusa.data)
        return tipoTusa.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getTipoCola ({ commit, state }) {
      if (!state.tipoCola.length) {
        try {
          const tipoCola = await apiRGP.get(
            'mantenedor/especie/animal/tipo-cola/'
          )
          commit('mantenedor_SET_TIPO_COLA', tipoCola.data)
          return tipoCola.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoColaById ({ commit }, idTipoCola) {
      try {
        const tipoCola = await apiRGP.get(
          `mantenedor/especie/animal/tipo-cola/${idTipoCola}`
        )
        commit('mantenedor_SET_TIPO_COLA', tipoCola.data)
        return tipoCola.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getTipoSenal ({ commit, state }) {
      if (!state.tipoSenal.length) {
        try {
          const tipoSenal = await apiRGP.get(
            'mantenedor/especie/animal/tipo-senal/'
          )
          commit('mantenedor_SET_TIPO_SENAL', tipoSenal.data)
          return tipoSenal.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoSenalById ({ commit }, idTipoSenal) {
      try {
        const tipoSenal = await apiRGP.get(
          `mantenedor/especie/animal/tipo-senal/${idTipoSenal}`
        )
        commit('mantenedor_SET_TIPO_SENAL', tipoSenal.data)
        return tipoSenal.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getOrigenAnimal ({ commit, state }) {
      if (!state.origenAnimal.length) {
        try {
          const origenAnimal = await apiRGP.get(
            'mantenedor/especie/animal/origen-animal/'
          )
          commit('mantenedor_SET_ORIGEN_ANIMAL', origenAnimal.data)
          return origenAnimal.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getOrigenAnimalById ({ commit }, idOrigenAnimal) {
      try {
        const origenAnimal = await apiRGP.get(
          `mantenedor/especie/animal/origen-animal/${idOrigenAnimal}`
        )
        commit('mantenedor_SET_ORIGEN_ANIMAL', origenAnimal.data)
        return origenAnimal.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getTipoDocumentacionAnimal ({ commit, state }) {
      if (!state.tipoDocumentacionAnimal.length) {
        try {
          const tipoDI = await apiRGP.get(
            'mantenedor/especie/animal/tipo-documentacion-animal/'
          )
          commit('mantenedor_SET_TIPO_DOC_ANIMAL', tipoDI.data)
          return tipoDI.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoDocumentacionAnimalById ({ commit }, idTDA) {
      try {
        const tipoDI = await apiRGP.get(
          `mantenedor/especie/animal/tipo-documentacion-animal/${idTDA}`
        )
        commit('mantenedor_SET_TIPO_DOC_ANIMAL', tipoDI.data)
        return tipoDI.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getCausaMuerteAnimal ({ commit, state }) {
      if (!state.causaMuerteAnimal.length) {
        try {
          const causaMuerteAnimal = await apiRGP.get(
            'mantenedor/especie/animal/causa-muerte-animal/'
          )
          commit('mantenedor_SET_CAUSA_MUERTE_ANIMAL', causaMuerteAnimal.data)
          return causaMuerteAnimal.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getCausaMuerteAnimalById ({ commit }, idCMA) {
      try {
        const causaMuerteAnimal = await apiRGP.get(
          `mantenedor/especie/animal/causa-muerte-animal/${idCMA}`
        )
        commit('mantenedor_SET_CAUSA_MUERTE_ANIMAL', causaMuerteAnimal.data)
        return causaMuerteAnimal.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getSignosFuerzaVehiculo ({ commit, state }) {
      if (!state.signoFuerzaVehiculo.length) {
        try {
          const signoFuerzaVehiculo = await apiRGP.get(
            'mantenedor/especie/signos-fuerza-vehiculo/'
          )
          commit(
            'mantenedor_SET_SIGNO_FUERZA_VEHICULO',
            signoFuerzaVehiculo.data
          )
          return signoFuerzaVehiculo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getSignosFuerzaVehiculoById ({ commit }, idSFV) {
      try {
        const signoFuerzaVehiculo = await apiRGP.get(
          `mantenedor/especie/signos-fuerza-vehiculo/${idSFV}`
        )
        commit(
          'mantenedor_SET_SIGNO_FUERZA_VEHICULO',
          signoFuerzaVehiculo.data
        )
        return signoFuerzaVehiculo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTieneHerramientasDentro ({ commit, state }) {
      if (!state.tieneHerramientasDentro.length) {
        try {
          const tieneHerramientasDentro = await apiRGP.get(
            'mantenedor/especie/tiene-herramientas-dentro/'
          )
          commit(
            'mantenedor_SET_TIENE_HERRAMIENTAS_DENTRO',
            tieneHerramientasDentro.data
          )
          return tieneHerramientasDentro.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTieneHerramientasDentroById ({ commit }, idTHD) {
      try {
        const tieneHerramientasDentro = await apiRGP.get(
          `mantenedor/especie/tiene-herramientas-dentro/${idTHD}`
        )
        commit(
          'mantenedor_SET_TIENE_HERRAMIENTAS_DENTRO',
          tieneHerramientasDentro.data
        )
        return tieneHerramientasDentro.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getEstadoVehiculo ({ commit, state }) {
      if (!state.estadoVehiculo.length) {
        try {
          const estadoVehiculo = await apiRGP.get(
            'mantenedor/especie/estado-vehiculo/'
          )
          commit('mantenedor_SET_ESTADO_VEHICULO', estadoVehiculo.data)
          return estadoVehiculo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getEstadoVehiculoById ({ commit }, idEstadoVehiculo) {
      try {
        const estadoVehiculo = await apiRGP.get(
          `mantenedor/especie/estado-vehiculo/${idEstadoVehiculo}`
        )
        commit('mantenedor_SET_ESTADO_VEHICULO', estadoVehiculo.data)
        return estadoVehiculo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoProcedencia ({ commit, state }) {
      if (!state.tipoProcedencia.length) {
        try {
          const tipoProcedencia = await apiRGP.get(
            'mantenedor/especie/tipo-procedencia/'
          )
          commit('mantenedor_SET_TIPO_PROCEDENCIA', tipoProcedencia.data)
          return tipoProcedencia.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoProcedenciaById ({ commit }, idTipoProcedencia) {
      try {
        const tipoProcedencia = await apiRGP.get(
          `mantenedor/especie/tipo-procedencia/${idTipoProcedencia}`
        )
        commit('mantenedor_SET_TIPO_PROCEDENCIA', tipoProcedencia.data)
        return tipoProcedencia.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getQuienRealizaAvaluo ({ commit, state }) {
      if (!state.avaluadorEspecie.length) {
        try {
          const avaluadorEspecie = await apiRGP.get(
            'mantenedor/especie/avaluador-especie/'
          )
          commit('mantenedor_SET_QUIEN_REALIZA_AVALUO', avaluadorEspecie.data)
          return avaluadorEspecie.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getQuienRealizaAvaluoById ({ commit }, idAvaluadorEspecie) {
      try {
        const avaluadorEspecie = await apiRGP.get(
          `mantenedor/especie/avaluador-especie/${idAvaluadorEspecie}`
        )
        commit('mantenedor_SET_QUIEN_REALIZA_AVALUO', avaluadorEspecie.data)
        return avaluadorEspecie.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoVehiculos ({ commit, state }) {
      if (!state.tipoVehiculos.length) {
        try {
          const tipoVehiculos = await apiRGP.get(
            'mantenedor/especie/tipo-vehiculos/'
          )
          commit('mantenedor_SET_TIPO_VEHICULO', tipoVehiculos.data)
          return tipoVehiculos.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoVehiculosById ({ commit }, idTipoVehiculo) {
      try {
        const tipoVehiculos = await apiRGP.get(
          `mantenedor/especie/tipo-vehiculos/${idTipoVehiculo}`
        )
        commit('mantenedor_SET_TIPO_VEHICULO', tipoVehiculos.data)
        return tipoVehiculos.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoMarcaVehiculo ({ commit, state }) {
      if (!state.tipoMarcaVehiculo.length) {
        try {
          const tipoMarcaVehiculo = await apiRGP.get(
            'mantenedor/especie/marcas-vehiculos/'
          )
          commit('mantenedor_SET_TIPO_MARCA_VEHICULO', tipoMarcaVehiculo.data)
          return tipoMarcaVehiculo.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoMarcaVehiculoById ({ commit }, idMarcaVehiculo) {
      try {
        const tipoMarcaVehiculo = await apiRGP.get(
          `mantenedor/especie/marcas-vehiculos/${idMarcaVehiculo}`
        )
        commit('mantenedor_SET_TIPO_MARCA_VEHICULO', tipoMarcaVehiculo.data)
        return tipoMarcaVehiculo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoModeloVehiculo ({ commit }, payload) {
      const { idMarcaVehiculo } = payload
      try {
        const tipoModeloVehiculo = await apiRGP.get(
          `mantenedor/especie/marcas-vehiculos/${idMarcaVehiculo}/modelos-vehiculos`
        )
        commit('mantenedor_SET_TIPO_MODELO_VEHICULO', tipoModeloVehiculo.data)
        return tipoModeloVehiculo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getTipoModeloVehiculoById ({ commit }, payload) {
      const { idModeloVehiculo } = payload
      try {
        const tipoModeloVehiculo = await apiRGP.get(
          `mantenedor/especie/modelos-vehiculos/${idModeloVehiculo}`
        )
        commit('mantenedor_SET_TIPO_MODELO_VEHICULO', tipoModeloVehiculo.data)
        return tipoModeloVehiculo.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getEstacionaEn ({ commit, state }) {
      if (!state.estacionaEn.length) {
        try {
          const estacionaEn = await apiRGP.get(
            'mantenedor/especie/estaciona-en/'
          )
          commit('mantenedor_SET_ESTACIONA_EN', estacionaEn.data)
          return estacionaEn.data
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getEstacionaEnById ({ commit }, idEstacionaEn) {
      try {
        const estacionaEn = await apiRGP.get(
          `mantenedor/especie/estaciona-en/${idEstacionaEn}`
        )
        commit('mantenedor_SET_ESTACIONA_EN', estacionaEn.data)
        return estacionaEn.data
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getTipoDocumentoEspecie ({ commit }) {
      // FALTA MANTENEDOR
      try {
        commit(
          'mantenedor_SET_TIPO_DOCUMENTO_ESPECIE',
          listTipoDocumentoEspecie
        )
        return listTipoDocumentoEspecie
      } catch (error) {
        Promise.reject(error)
      }
    },
    async mantenedor_getAllTiposEspecie ({ commit, state }) {
      if (!state.allTiposEspecie.length) {
        try {
          return apiRGP.get('/mantenedor/especie/tipo').then((res) => {
            commit('mantenedor_SET_ALL_TIPOS_ESPECIE', res.data)
          })
        } catch (error) {
          Promise.reject(error)
        }
      }
    },
    // #endregion

    // #region ACTIONS POLICIAS
    async mantenedor_getPrefecturas ({ commit, state }) {
      if (!state.prefecturas.length) {
        try {
          const res = await apiRGP.get('/mantenedor/policia/prefectura')
          commit('mantenedor_SET_PREFECTURAS', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getComisarias ({ commit }) {
      try {
        const res = await apiRGP.get('/mantenedor/policia/comisaria')
        commit('mantenedor_SET_COMISARIAS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getDestacamentos ({ commit }) {
      try {
        const res = await apiRGP.get('/mantenedor/policia/destacamento')
        commit('mantenedor_SET_DESTACAMENTOS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getComisariasByIdPrefectura ({ commit }, payload) {
      const { idPrefectura } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/policia/prefectura/${idPrefectura}/comisaria`
        )
        commit('mantenedor_SET_COMISARIAS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getComisariasByIdPrefecturaCodigoInstitucion (
      { commit },
      payload
    ) {
      const { idPrefectura, codigoInstitucion } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/policia/prefectura/${idPrefectura}/${codigoInstitucion}/comisaria`
        )
        commit('mantenedor_SET_COMISARIAS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getDestacamentosByIdComisaria ({ commit }, payload) {
      const { idComisaria } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/policia/comisaria/${idComisaria}/destacamento`
        )
        commit('mantenedor_SET_DESTACAMENTOS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region ACTIONS FISCALIAS
    async mantenedor_getEspecialidadesFiscalia ({ commit, state }) {
      if (!state.especialidadesFiscalia.length) {
        return apiRGP.get('/mantenedor/fiscalia/especialidad').then((res) => {
          commit('mantenedor_SET_ESPECIALIDADES_FISCALIA', res.data)
        })
      }
    },
    async mantenedor_getFiscalias ({ commit }, payload) {
      const { params } = payload
      return apiRGP
        .get('/mantenedor/fiscalia/fiscalia', { params })
        .then(({ data }) => {
          commit('mantenedor_SET_FISCALIAS', data)
          return data // NO QUITAR SE NECESITA PARA OBTENER EL DATO EN EL RESOLVE
        })
    },
    async mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad (
      { commit },
      payload
    ) {
      const { idFiscalia, idEspecialidad } = payload
      return apiRGP
        .get(`/general/fiscales/${idFiscalia}/${idEspecialidad}`)
        .then(({ data }) => {
          commit('mantenedor_SET_FISCALES', data)
        })
    },
    async mantenedor_getFiscalById (_, payload) {
      const { idFiscal } = payload
      return apiRGP.get(`/general/fiscales/${idFiscal}`).then(({ data }) => {
        return data // NO QUITAR SE NECESITA PARA OBTENER EL DATO EN EL RESOLVE
      })
    },

    async mantenedor_getAllFiscales ({ commit }) {
      try {
        const { data } = await apiRGP.get('/fiscalia/fiscales')

        commit('mantenedor_SET_ALL_FISCALES', data)

        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region 'Medidas'
    async mantenedor_getEstadoMedidaHito ({ commit, state }, payload) {
      if (!state.estadoMedidaHito.length) {
        try {
          const res = await apiRGP.get(
            `/mantenedor/actividad/estado-medida-hito`
          )
          commit('mantenedor_SET_ESTADO_MEDIDA_HITO', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTipoMedida ({ commit, state }) {
      if (!state.tipoMedida.length) {
        try {
          const res = await apiRGP.get(`/mantenedor/actividad/tipo-medida`)
          commit('mantenedor_SET_TIPO_MEDIDA', res.data)
          return Promise.resolve(res.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getListadoMedidasCautelares ({ commit, state }) {
      if (!state.medidasCautelares.length) {
        return apiRGP
          .get(`/mantenedor/causa/medida-cautelar`)
          .then(({ data }) => {
            commit('mantenedor_SET_MEDIDAS_CAUTELARES', data)
            return data // NO QUITAR SE NECESITA PARA OBTENER EL DATO EN EL RESOLVE
          })
      }
    },
    async mantenedor_getListadoMedidasIntrusivas ({ commit, state }) {
      if (!state.medidasIntrusivas.length) {
        return apiRGP
          .get(`/mantenedor/persona/medidas-intrusivas`)
          .then(({ data }) => {
            commit('mantenedor_SET_MEDIDAS_INTRUSIVAS', data)
            return data
          })
      }
    },
    async mantenedor_getEstadoRelacionById ({ commit }, payload) {
      const { idEstadoRelacion } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/relacion/estado/${idEstadoRelacion}`
        )
        commit('mantenedor_SET_ESTADO_RELACION', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async mantenedor_getAllEstadoRelacion ({ commit }, payload) {
      try {
        const res = await apiRGP.get(`/mantenedor/relacion/estado`)
        commit('mantenedor_SET_ESTADO_RELACION', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region Documentos Adjuntos

    async mantenedor_getTiposDocumentosAdjuntos ({ commit }) {
      try {
        const res = await apiRGP.get(`/mantenedor/denuncia/tipo-documento`)
        commit('mantenedor_SET_TIPOS_DOCUMENTOS_ADJUNTOS', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getNombresTipoDocumento ({ commit }, payload) {
      const { idTipoDocumento } = payload
      try {
        const res = await apiRGP.get(
          `/mantenedor/denuncia/documentos/${idTipoDocumento}`
        )
        commit('mantenedor_SET_NOMBRES_TIPO_DOCUMENTO', res.data)
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async mantenedor_getCategoriasDocumento ({ commit }) {
      try {
        const response = await apiRGP.get(`/mantenedor/documento/categoria-documento`)
        commit('documento_SET_SECCIONES_FUD', response.data)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // #endregion

    // #region COSAS QUE TENGO QUE HACER PORQUE ME DA PAJA ARREGLAR LA LOGICA DE LOS MANTENEDORES DE ACTIVIDAD
    async mantenedor_getTiposActividad ({ commit, state }) {
      if (state.tiposActividad.length) return

      try {
        const { data } = await apiRGP.get('/mantenedor/actividad/tipo')

        commit('mantenedor_SET_TIPOS_ACTIVIDAD', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getSubtiposActividadList ({ commit, state }) {
      if (state.subtipoActividadList.length) return

      try {
        const { data } = await apiRGP.get('/mantenedor/actividad/sub-tipo')

        commit('mantenedor_SET_SUBTIPOS_ACTIVIDAD_LIST', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getSubSubtiposActividadList ({ commit, state }) {
      if (state.subSubtipoActividadList.length) return

      try {
        const { data } = await apiRGP.get('/mantenedor/actividad/sub-subtipo')

        commit('mantenedor_SET_SUB_SUBTIPOS_ACTIVIDAD_LIST', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getListadoResultadoAutorizacion ({ commit, state }) {
      if (!state.resultadosAutorizacion.length) {
        return apiRGP
          .get(`/mantenedor/actividad/tipo-resultado-autorizacion`)
          .then(({ data }) => {
            commit('mantenedor_SET_RESULTADO_AUTORIZACION', data)
            return data
          })
      }
    },
    // #endregion

    async mantenedor_getTiposAutorizacionDiligencia ({ commit }) {
      try {
        const { data } = await apiRGP.get(
          '/mantenedor/actividad/autorizacion-diligencia'
        )

        commit('mantenedor_SET_TIPOS_AUTORIZACION_DILIGENCIA', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },

    async mantenedor_getDecisionesRelaciones ({ commit, state }) {
      if (!state.decisionesRelaciones.length) {
        try {
          const request = await apiRGP.get(
            '/mantenedor/causa/decision-relacion'
          )
          commit('mantenedor_SET_DECISIONES_RELACIONES', request.data)
          return Promise.resolve(request.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getDecisionesCausa ({ commit, state }) {
      if (!state.decisionesCausa.length) {
        try {
          const request = await apiRGP.get('/mantenedor/causa/decision-causa')
          commit('mantenedor_SET_DECISIONES_CAUSA', request.data)
          return Promise.resolve(request.data)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    async mantenedor_getTiposPericia ({ commit }) {
      try {
        const { data } = await apiRGP.get(
          '/mantenedor/actividad/tipo-peritaje'
        )

        commit('mantenedor_SET_TIPOS_PERICIA', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getTiposAutopsia ({ commit }) {
      try {
        const { data } = await apiRGP.get(
          '/mantenedor/actividad/tipo-autopsia'
        )

        commit('mantenedor_SET_TIPOS_AUTOPSIA', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getTiposExamenMedico ({ commit }) {
      console.log(
        '🚀 ~ file: mantenedor.js:2798 ~ mantenedor_getTiposExamenMedico ~ mantenedor_getTiposExamenMedico'
      )
      try {
        const { data } = await apiRGP.get(
          '/mantenedor/actividad/tipo-examen-medico'
        )

        commit('mantenedor_SET_TIPOS_EXAMEN_MEDICO', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getTiposPruebaMedica ({ commit }) {
      try {
        const { data } = await apiRGP.get('/mantenedor/actividad/tipo-prueba')

        commit('mantenedor_SET_TIPOS_PRUEBA_MEDICA', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getTiposEvaluacionCumplimientos ({ commit, state }) {
      if (state.evaluacionCumplimientos.length) return
      try {
        const { data } = await apiRGP.get(
          '/mantenedor/causa/termino/evaluacion-cumplimiento'
        )

        commit('mantenedor_SET_TIPOS_EVALUACION_CUMPLIMIENTOS', data)

        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getTiposAudiencias ({ commit, state }) {
      try {
        const { data } = await apiRGP.get('/mantenedor/actividad/tipo-audiencia')
        commit('mantenedor_SET_TIPOS_AUDIENCIAS', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    },
    async mantenedor_getTipoAudienciaById ({ commit }, payload) {
      try {
        const { data } = await apiRGP.get(`/mantenedor/actividad/tipo-audiencia/${payload.id}`)
        commit('mantenedor_SET_TIPO_AUDIENCIA', data)
        return Promise.resolve(data)
      } catch ({ response }) {
        return Promise.reject(response.data)
      }
    }
  },

  mutations: {
    mantenedor_SET_TIPOS_PERICIA (state, payload) {
      state.tiposPericia = payload
    },
    mantenedor_SET_TIPOS_AUTOPSIA (state, payload) {
      state.tiposAutopsia = payload
    },
    mantenedor_SET_TIPOS_EXAMEN_MEDICO (state, payload) {
      state.tiposExamenMedico = payload
    },
    mantenedor_SET_TIPOS_PRUEBA_MEDICA (state, payload) {
      state.tiposPruebaMedica = payload
    },
    mantenedor_SET_TIPOS_AUDIENCIAS (state, payload) {
      state.tiposAudiencias = payload
    },
    mantenedor_SET_TIPO_AUDIENCIA (state, payload) {
      state.tipoAudiencia = payload
    },
    mantenedor_SET_RESPUESTA_BASICO (state, payload) {
      state.tipoRespuestaBasica = payload
    },

    mantenedor_SET_ACTIVIDADES_SUBTIPO (state, payload) {
      state.actividadesSubtipo = payload
    },
    mantenedor_SET_ACTIVIDADES_SUBSUBTIPO (state, payload) {
      state.actividadesSubSubtipo = payload
    },
    mantenedor_SET_ACTIVIDADES_SUBTIPO_DEFAULT (state, payload) {
      state.actividadesSubSubtipo = []
    },
    mantenedor_SET_ATRIBUTOS (state, payload) {
      state.atributos = payload
    },
    mantenedor_RESET_ATRIBUTOS (state) {
      state.atributos = []
    },
    mantenedor_SET_JUZGADOS (state, payload) {
      state.juzgados = payload
    },
    // #region Mutations Diligencias
    mantenedor_SET_SUBTIPOS_ACTIVIDAD (state, payload) {
      state.subtiposActividad = payload
    },
    mantenedor_SET_SUB_SUBTIPOS_ACTIVIDAD (state, payload) {
      if (payload.length) {
        state.subsubTiposActividad = payload
      } else {
        state.subsubTiposActividad = []
      }
    },
    mantenedor_SET_ALL_SUB_SUBTIPOS_ACTIVIDAD (state, payload) {
      state.allSubSubTiposActividad = payload
    },
    mantenedor_RESET_SUB_SUBTIPOS_ACTIVIDAD (state) {
      state.subsubTiposActividad = []
    },
    mantenedor_SET_TIPO_ACTIVIDAD (state, data) {
      // manejar respuesta del endpoint si es tipo array, antes era objeto WIP refinar
      let payload
      if (Array.isArray(data)) {
        payload = { ...data[0] }
      } else {
        payload = data
      }
      state.tipoActividad = payload
    },
    mantenedor_SET_TIPO_ACTIVIDAD_BY_CODIGO (state, data) {
      // manejar respuesta del endpoint si es tipo array, antes era objeto WIP refinar
      let payload
      if (Array.isArray(data)) {
        payload = { ...data[0] }
      } else {
        payload = data
      }
      state.tipoActividadByCodigo = payload
    },
    mantenedor_SET_TIPO_ORIGEN (state, payload) {
      state.tipoOrigen = payload
    },
    mantenedor_SET_ESTADOS_DILIGENCIA (state, payload) {
      state.estadosDiligencia = payload
    },
    mantenedor_SET_AMBITOS_DILIGENCIA (state, payload) {
      state.ambitosDiligencia = payload
    },
    mantenedor_SET_REFERENCIAS (state, payload) {
      state.referencias = payload
    },
    mantenedor_SET_INSTITUCIONES (state, payload) {
      state.instituciones = payload
    },
    mantenedor_SET_JUSTIFICACIONES (state, payload) {
      state.justificaciones = payload
    },
    mantenedor_SET_PLAZOS_DILIGENCIA (state, payload) {
      state.plazosDiligencia = payload
    },
    mantenedor_SET_PLANTILLAS_DILIGENCIA (state, payload) {
      state.plantillasDiligencia = payload
    },
    // #endregion

    // #region Mutations Causa
    mantenedor_SET_PROCESO_HITO (state, payload) {
      state.procesoHito = payload
    },
    mantenedor_SET_TIPOS_ANTECEDENTES (state, payload) {
      state.tiposAntecedentes = payload
      state.tiposAntecedentes = payload
    },
    mantenedor_SET_ESTADOS_CAUSAS (state, payload) {
      state.estadosCausa = payload
    },
    mantenedor_SET_TIPOS_ORIGEN_ANTECEDENTES (state, payload) {
      state.tiposOrigenAntecedentes = payload
    },
    mantenedor_SET_TIPOS_AMBITO_ANTECEDENTES (state, payload) {
      state.tiposAmbitoAntecedentes = payload
    },
    mantenedor_SET_TIPOS_COMPLEJIDAD (state, payload) {
      state.tiposComplejidad = payload
    },
    mantenedor_SET_TIPOS_IMPACTO (state, payload) {
      state.tiposImpacto = payload
    },
    mantenedor_SET_MOTIVO_TRANSFERENCIA (state, payload) {
      state.motivoTransferencia = payload
    },
    mantenedor_SET_DECISION_ASIGNACION (state, payload) {
      state.decisionAsignacion = payload
    },
    mantenedor_SET_TIPO_ASIGNACION (state, payload) {
      state.tipoAsignacion = payload
    },
    mantenedor_SET_MOTIVO_AGRUPACION (state, payload) {
      state.motivoAgrupacion = payload
    },
    mantenedor_SET_ACCION_AGRUPACION (state, payload) {
      state.accionAgrupacion = payload
    },
    mantenedor_SET_ESTADO_AGRUPACION (state, payload) {
      state.estadoAgrupacion = payload
    },
    mantenedor_SET_DETALLE_ESTADO_AGRUPACION (state, payload) {
      state.detalleEstadoAgrupacion = payload
    },
    mantenedor_SET_MOTIVOS_DESESTIMACION (state, payload) {
      state.motivosDesestimacion = payload
    },
    mantenedor_SET_TIPOS_TERMINO (state, payload) {
      state.tiposTermino = payload
    },
    mantenedor_SET_SUBTIPOS_TERMINO (state, payload) {
      state.subtiposTermino = payload
    },
    mantenedor_SET_RESULTADOS_CONSULTA_TERMINO (state, payload) {
      state.resultadosConsultaTermino = payload
    },
    mantenedor_SET_TIPOS_SUSPENSION (state, payload) {
      state.tiposSuspension = payload
    },
    mantenedor_SET_SUBTIPOS_SUSPENSION (state, payload) {
      state.subtiposSuspension = payload
    },
    mantenedor_SET_TIPOS_ACCION_CIERRE (state, payload) {
      state.tiposAccionCierre = payload
    },
    mantenedor_SET_CONDICIONES_AR (state, payload) {
      state.condicionesAR = payload
    },
    mantenedor_SET_MOTIVOS_SOBRESEIMIENTO (state, payload) {
      state.motivosSobreseimiento = payload
    },
    mantenedor_SET_TIPOS_EVALUACION_CUMPLIMIENTOS (state, payload) {
      state.evaluacionCumplimientos = payload
    },

    // #endregion

    // #region Mutations Delitos
    mantenedor_SET_FAMILIAS_DELITO (state, payload) {
      state.familiasDelito = payload
    },
    mantenedor_SET_TIPOS_DELITO (state, payload) {
      state.tiposDelito = payload
    },
    mantenedor_SET_TIPOS_MEDIO_COMISION_DELITO (state, payload) {
      state.mediosComisionDelitos = payload
    },
    mantenedor_SET_TIPOS_DENUNCIA (state, payload) {
      state.tiposDenuncia = payload
      state.tiposDenuncia.push({ descripcion: 'ELECTRONICA', id: 5 })
    },
    mantenedor_SET_INSTITUCIONES_DENUNCIA (state, payload) {
      state.institucionesDenuncia = payload
    },
    mantenedor_SET_TIPO_LUGAR_OCURRENCIA (state, payload) {
      state.tipoLugarOcurrencia = payload
    },
    mantenedor_SET_VIA_INGRESO (state, payload) {
      state.viaIngreso = payload
    },
    mantenedor_SET_UNIDAD_POLICIAL (state, payload) {
      state.unidadPolicial = payload
    },
    mantenedor_SET_ZONA_DELITO (state, payload) {
      state.zonaDelito = payload
    },
    mantenedor_SET_CAUSA_DETENCION (state, payload) {
      state.causaDetencion = payload
    },
    mantenedor_SET_TIPO_HALLAZGO (state, payload) {
      state.tipoHallazgo = payload
    },
    mantenedor_SET_TIPO_ELEMENTO_USADO (state, payload) {
      state.tipoElementoUsado = payload
    },
    mantenedor_SET_TIPO_TRANSPORTE (state, payload) {
      state.tipoTransporte = payload
    },
    mantenedor_SET_TIPO_VIGILANCIA (state, payload) {
      state.tipoVigilancia = payload
    },
    mantenedor_SET_FUENTE_INFO_TESTIGO (state, payload) {
      state.fuenteInfoTestigo = payload
    },
    mantenedor_SET_TIPO_TESTIGO (state, payload) {
      state.tipoTestigo = payload
    },
    mantenedor_SET_ROL_HECHO_DELICTUAL (state, payload) {
      state.rolHechoDelictual = payload
    },
    mantenedor_SET_PERFIL_IMPUTADO (state, payload) {
      state.perfilImputado = payload
    },
    mantenedor_SET_TIPO_FUNCIONARIO (state, payload) {
      state.tipoFuncionario = payload
    },
    mantenedor_SET_MEDIDA_SEGURIDAD (state, payload) {
      state.medidaSeguridad = payload
    },
    mantenedor_SET_MODALIDAD_GRUPO (state, payload) {
      state.modalidadGrupo = payload
    },
    mantenedor_SET_CANTIDAD_SUJETOS (state, payload) {
      state.cantidadSujetos = payload
    },

    // #endregion

    // #region Mutations Sujetos Intervinientes
    mantenedor_SET_TIPOS_SUJETOS (state, payload) {
      state.tiposSujeto = payload.filter(
        (s) =>
          s.codigo === '1' ||
          s.codigo === '3' ||
          s.codigo === '6' ||
          s.codigo === '15' ||
          s.codigo === '21'
      )
    },
    mantenedor_SET_TIPO_VICTIMA (state, payload) {
      state.tipoVictima = payload
    },
    mantenedor_SET_ESCOLARIDAD (state, payload) {
      state.escolaridad = payload
    },
    mantenedor_SET_TIPO_SEXO (state, payload) {
      state.tipoSexo = payload
    },
    mantenedor_SET_TIPO_NNA_RESPONSABLE (state, payload) {
      state.tipoNnaResponsable = payload
    },
    mantenedor_SET_TIPO_REPRESENTADO (state, payload) {
      state.tipoRepresentado = payload
    },
    mantenedor_SET_TIPO_INSTITUCION_PERTENECIENTE (state, payload) {
      state.tipoInstitucionPerteneciente = payload
    },
    mantenedor_SET_TIPO_ACREDITACION (state, payload) {
      state.tipoAcreditacion = payload
    },
    mantenedor_SET_PROFESIONES (state, payload) {
      state.profesiones = payload || []
    },
    mantenedor_SET_TIPOS_DOCUMENTO (state, payload) {
      state.tiposDocumento = payload || []
    },
    mantenedor_SET_TIPOS_PERSONA (state, payload) {
      state.tiposPersona = payload
    },
    mantenedor_SET_ESTADO_CIVIL (state, payload) {
      state.estadoCivil = payload
    },
    mantenedor_SET_ESTADO_MIGRATORIO (state, payload) {
      state.estadoMigratorio = payload
    },
    mantenedor_SET_IDENTIDAD_GENERO (state, payload) {
      state.identidadGenero = payload
    },
    mantenedor_SET_PUEBLOS_ORIGINARIOS (state, payload) {
      state.pueblosOriginarios = payload
    },
    mantenedor_SET_TIPO_CONTACTO (state, payload) {
      state.tipoContacto = payload
    },
    mantenedor_SET_ESTADO_TEMPERANCIA (state, payload) {
      state.estadoTemperancia = payload
    },
    mantenedor_SET_PARENTESCO (state, payload) {
      state.parentesco = payload
    },
    mantenedor_SET_DISCAPACIDAD (state, payload) {
      state.discapacidad = payload
    },
    mantenedor_SET_VALIDACION_IDENTIDAD (state, payload) {
      state.validacionIdentidad = payload
    },
    mantenedor_SET_PAISES (state, payload) {
      state.paises = payload
    },
    mantenedor_SET_MEDIDAS_PROTECCION (state, payload) {
      state.medidasProteccion = payload
    },
    mantenedor_SET_ORGANISMO_ROL (state, payload) {
      state.organismoRol = payload
    },
    mantenedor_SET_RELACIONES_SUJETOS (state, payload) {
      state.relacionesSujetos = payload
    },
    mantenedor_SET_MEDIDAS_PROTECCION_PERSONA (state, payload) {
      state.medidasProteccionPersona = payload
    },
    // #endregion

    // #region Mutations Direccion
    mantenedor_SET_TIPOS_DIRECCION (state, payload) {
      state.tiposDireccion = payload
    },
    mantenedor_SET_TIPO_MEDIO_CONTACTO (state, payload) {
      state.tiposMedioContacto = payload
    },
    mantenedor_SET_TIPO_CONTACTO_DUENO (state, payload) {
      state.tiposContactoDueno = payload
    },
    // #endregion

    // #region Mutations Especies/Dinero
    mantenedor_SET_TIPOS_ESPECIES (state, payload) {
      state.tipoEspecies = payload
    },
    mantenedor_SET_TIPOS_ESPECIES_PARA_TABLA (state, payload) {
      if (payload) {
        payload?.forEach((t) => {
          state.tipoEspecies.push(t)
        })
      }
    },
    mantenedor_SET_FAMILIA_ESPECIE (state, payload) {
      state.familiaEspecies = payload
    },
    mantenedor_SET_AMBITO_ESPECIE (state, payload) {
      state.ambitoEspecie = payload
    },
    mantenedor_SET_RAZON_MOVIMIENTO_ESPECIE (state, payload) {
      state.razonMovimientoEspecie = payload
    },
    mantenedor_SET_UNIDAD_MEDIDA_ESPECIE (state, payload) {
      state.unidadMedidaEspecie = payload
    },
    mantenedor_SET_CLASES_ESPECIE_PELIGROSA (state, payload) {
      state.clasesPeligro = payload
    },
    mantenedor_SET_CLASE_ESPECIE (state, payload) {
      state.claseEspecie = payload
    },
    mantenedor_SET_ESTADO_CONSERVACION_ESPECIE (state, payload) {
      state.estadoConservacionEspecie = payload
    },
    mantenedor_SET_TIPO_MONEDA (state, payload) {
      state.tipoMoneda = payload
    },
    mantenedor_SET_TIPO_DINERO (state, payload) {
      state.tipoDinero = payload
    },
    mantenedor_SET_DENOMINACION_DINERO (state, payload) {
      state.denominacionDinero = payload
    },
    mantenedor_SET_QUIEN_REALIZA_AVALUO (state, payload) {
      state.quienRealizaAvaluo = payload
    },
    mantenedor_SET_PRONUNCIAMIENTO_FISCAL (state, payload) {
      state.pronunciamientoFiscalEspecie = payload
    },
    mantenedor_SET_MARCA_OREJA (state, payload) {
      state.marcaOreja = payload
    },
    mantenedor_SET_TIPO_TUSA (state, payload) {
      state.tipoTusa = payload
    },
    mantenedor_SET_TIPO_COLA (state, payload) {
      state.tipoCola = payload
    },
    mantenedor_SET_TIPO_SENAL (state, payload) {
      state.tipoSenal = payload
    },
    mantenedor_SET_ORIGEN_ANIMAL (state, payload) {
      state.origenAnimal = payload
    },
    mantenedor_SET_TIPO_DOC_ANIMAL (state, payload) {
      state.tipoDocumentacionAnimal = payload
    },
    mantenedor_SET_CAUSA_MUERTE_ANIMAL (state, payload) {
      state.causaMuerteAnimal = payload
    },
    mantenedor_SET_SIGNO_FUERZA_VEHICULO (state, payload) {
      state.signoFuerzaVehiculo = payload
    },
    mantenedor_SET_TIENE_HERRAMIENTAS_DENTRO (state, payload) {
      state.tieneHerramientasDentro = payload
    },
    mantenedor_SET_ESTADO_VEHICULO (state, payload) {
      state.estadoVehiculo = payload
    },
    mantenedor_SET_TIPO_PROCEDENCIA (state, payload) {
      state.tipoProcedencia = payload
    },
    mantenedor_SET_AVALUADOR_ESPECIE (state, payload) {
      state.avaluadorEspecie = payload
    },
    mantenedor_SET_TIPO_VEHICULO (state, payload) {
      state.tipoVehiculos = payload
    },
    mantenedor_SET_TIPO_MARCA_VEHICULO (state, payload) {
      state.tipoMarcaVehiculo = payload
    },
    mantenedor_SET_TIPO_MODELO_VEHICULO (state, payload) {
      state.tipoModeloVehiculo = payload
    },
    mantenedor_SET_DEFAULT_STATE_TIPO_MODELO_VEHICULO (state) {
      state.tipoModeloVehiculo = []
    },
    mantenedor_SET_ESTACIONA_EN (state, payload) {
      state.estacionaEn = payload
    },
    mantenedor_SET_TIPO_DOCUMENTO_ESPECIE (state, payload) {
      state.tipoDocumentoEspecie = payload
    },
    mantenedor_SET_ALL_TIPOS_ESPECIE (state, payload) {
      state.allTiposEspecie = payload
    },
    // #endregion

    // #region Mutations Policias
    mantenedor_SET_PREFECTURAS (state, payload) {
      state.prefecturas = payload
    },
    mantenedor_SET_COMISARIAS (state, payload) {
      if (payload.length) {
        state.comisarias = payload
      } else {
        state.comisarias = []
      }
    },
    mantenedor_SET_DESTACAMENTOS (state, payload) {
      if (payload.length) {
        state.destacamentos = payload
      } else {
        state.destacamentos = []
      }
    },
    // #endregion

    // #region MUTATIONS FISCALIAS
    mantenedor_SET_TIPOS_FISCALIA (state, payload) {
      state.tiposFiscalia = payload
    },
    mantenedor_SET_NOMBRES_FISCALIA (state, payload) {
      state.nombresFiscalia = payload
    },
    mantenedor_SET_REGIONES (state, payload) {
      state.regiones = payload
    },
    mantenedor_SET_COMUNA (state, payload) {
      state.comuna = payload
    },
    mantenedor_SET_ESPECIALIDADES_FISCALIA (state, payload) {
      state.especialidadesFiscalia = payload
    },
    mantenedor_SET_FISCALIAS (state, payload) {
      state.fiscalias = payload
    },
    mantenedor_SET_FISCALES (state, payload) {
      state.fiscales = payload
    },

    mantenedor_SET_ALL_FISCALES (state, payload) {
      state.allFiscales = payload
    },
    // #endregion

    mantenedor_SET_ESTADO_MEDIDA_HITO (state, payload) {
      state.estadoMedidaHito = payload
    },
    mantenedor_SET_TIPO_MEDIDA (state, payload) {
      state.tipoMedida = payload
      state.tipoMedida = payload
    },
    mantenedor_SET_MEDIDAS_CAUTELARES (state, payload) {
      state.medidasCautelares = payload
    },
    mantenedor_SET_MEDIDAS_INTRUSIVAS (state, payload) {
      state.medidasIntrusivas = payload
    },
    mantenedor_SET_ESTADO_RELACION (state, payload) {
      state.estadoRelacion = payload
    },

    // #region MUTATIONS DOCUMENTOS ADJUNTOS

    mantenedor_SET_TIPOS_DOCUMENTOS_ADJUNTOS (state, payload) {
      state.tiposDocumentosAdjuntos = payload
    },

    mantenedor_SET_NOMBRES_TIPO_DOCUMENTO (state, payload) {
      state.nombresTipoDocumento = payload
    },

    documento_SET_SECCIONES_FUD (state, payload) {
      state.seccionesFUD = payload
    },
    // #endregion
    // #region COSAS QUE TENGO QUE HACER PORQUE ME DA PAJA ARREGLAR LA LOGICA DE LOS MANTENEDORES DE ACTIVIDAD
    mantenedor_SET_TIPOS_ACTIVIDAD (state, payload) {
      state.tiposActividad = payload
    },
    mantenedor_SET_SUBTIPOS_ACTIVIDAD_LIST (state, payload) {
      state.subtipoActividadList = payload
    },
    mantenedor_SET_SUB_SUBTIPOS_ACTIVIDAD_LIST (state, payload) {
      state.subSubtipoActividadList = payload
    },
    mantenedor_SET_RESULTADO_AUTORIZACION (state, payload) {
      state.resultadosAutorizacion = payload
    },
    // #endregion

    mantenedor_SET_TIPOS_AUTORIZACION_DILIGENCIA (state, payload) {
      state.tiposAutorizacionDiligencia = payload
    },

    // #region TOMA DECISION DIRIGIR INVESTIGACION
    mantenedor_SET_DECISIONES_RELACIONES (state, payload) {
      state.decisionesRelaciones = payload
    },
    mantenedor_SET_DECISIONES_CAUSA (state, payload) {
      state.decisionesCausa = payload
    }
    // #endregion
  },

  getters: {
    // #region COSAS QUE TENGO QUE HACER PORQUE ME DA PAJA ARREGLAR LA LOGICA DE LOS MANTENEDORES DE ACTIVIDAD
    mantenedor_getIdTipoOrigenActividadByCodigo: (state) => (codigo) => {
      const tipoOrigen = state.tipoOrigen.find(
        (tipo) => tipo.codigo === codigo
      )
      return tipoOrigen?.id
    },
    mantenedor_getNombreTipoActividadById: (state) => (idTipoActividad) => {
      const actividadFound = state.tiposActividad.find(
        (actividad) => actividad.id === idTipoActividad
      )
      return actividadFound?.descripcion
    },
    mantenedor_getNombreSubtipoActividadById:
      (state) => (idSubtipoActividad) => {
        const actividadFound = state.subtipoActividadList.find(
          (actividad) => actividad.id === idSubtipoActividad
        )
        return actividadFound?.descripcion
      },
    mantenedor_getNombreSubSubtipoActividadById:
      (state) => (idSubSubtipoActividad) => {
        const actividadFound = state.subSubtipoActividadList.find(
          (actividad) => actividad.id === idSubSubtipoActividad
        )
        return actividadFound?.descripcion
      },
    // #endregion
    mantenedor_getIdTipoRespuestaBasicaByDescripcion:
      (state) => (descripcion) => {
        return state.tipoRespuestaBasica?.find(
          (respuesta) => respuesta.descripcion === descripcion
        ).id
      },
    mantenedor_getDescripcionTipoRespuestaBasicaById:
      (state) => (idRespuesta) => {
        return state.tipoRespuestaBasica?.find(
          (respuesta) => respuesta.id === idRespuesta
        ).descripcion
      },
    mantenedor_getCodigoTipoRespuestaBasicaById: (state) => (idRespuesta) => {
      return state.tipoRespuestaBasica?.find(
        (respuesta) => respuesta.id === idRespuesta
      )?.codigo
    },
    mantenedor_getIdTipoRespuestaBasicaByCodigo: (state) => (codigo) => {
      return state.tipoRespuestaBasica?.find(
        (respuesta) => respuesta.codigo === codigo
      )?.id
    },
    mantenedor_getCodigoActividad: (state) => (idActividad) => {
      const actividad = state.tipoActividad?.find(
        (tipo) => tipo.id === idActividad
      )
      return actividad?.codigo
    },
    mantenedor_getCodigoActividadHijo: (state) => (idActividadHijo) => {
      const actividad = state.actividadesSubtipo?.find(
        (tipo) => tipo.id === idActividadHijo
      )
      return actividad?.codigo
    },
    mantenedor_getDescripcionActividadHijo: (state) => (idActividadHijo) => {
      const actividad = state.actividadesSubtipo?.find(
        (tipo) => tipo.id === idActividadHijo
      )
      return actividad?.descripcion
    },
    mantenedor_getNombreJuzgado: (state) => (idJuzgado) => {
      const juzgadoFound = state.juzgados?.find(
        (tipo) => tipo.id === idJuzgado?.toUpperCase()
      )
      return juzgadoFound?.descripcion
    },
    // #region Getters Diligencias
    mantenedor_getNombreTipoDiligencia: (state) => (idTipoDiligencia) => {
      const diligenciaFound = state.subtiposActividad?.find(
        (tipo) => tipo.id === idTipoDiligencia
      )
      return diligenciaFound?.descripcion
    },
    mantenedor_getCodigoTipoDiligencia: (state) => (idTipoDiligencia) => {
      const diligenciaFound = state.subtiposActividad?.find(
        (tipo) => tipo.id === idTipoDiligencia
      )
      return diligenciaFound?.codigo
    },
    mantenedor_getNombreSubtipoDiligencia: (state) => (idSubtipoDiligencia) => {
      const subDiligenciaFound = state.allSubSubTiposActividad?.find(
        (subtipo) => subtipo.id === idSubtipoDiligencia
      )
      return subDiligenciaFound?.descripcion
    },
    mantenedor_getNombreEstadoDiligencia: (state) => (idEstado) => {
      const estadoFound = state.estadosDiligencia?.find(
        (e) => e.id === idEstado
      )
      return estadoFound?.descripcion
    },
    mantenedor_getIdEstadoDiligenciaByCodigo: (state) => (codigo) => {
      const estadoFound = state.estadosDiligencia?.find(
        (e) => e.codigo === codigo
      )
      return estadoFound?.id
    },
    mantenedor_getNombreAmbitoDiligencia: (state) => (idAmbito) => {
      const ambitoFound = state.ambitosDiligencia?.find(
        (diligencia) => diligencia.id === idAmbito
      )
      return ambitoFound?.descripcion
    },
    mantenedor_getNombreInstitucion: (state) => (idInstitucion) => {
      const institucionFound = state.instituciones?.find(
        (i) => i.id === idInstitucion
      )
      return institucionFound?.descripcion
    },
    mantenedor_getCodigoInstitucionDiligencia: (state) => (idInstitucion) => {
      const institucionFound = state.instituciones?.find(
        (i) => i.id === idInstitucion
      )
      return institucionFound?.codigo
    },
    // #endregion

    // #region Getters Antecedentes Causa
    mantenedor_getDescripcionOrigenAntecedente:
      (state) => (idTipoAntecedente) => {
        const antecedenteFound = state.tiposOrigenAntecedentes?.find((tipo) => {
          return tipo.id === idTipoAntecedente
        })
        return antecedenteFound?.descripcion
      },
    mantenedor_getDescripcionEstadoCausaById: (state) => (id) => {
      console.log('id', id)
      return state.estadosCausa?.find((estado) => {
        return estado.id?.toUpperCase() === id.toUpperCase()
      })?.descripcion
    },
    mantenedor_getNombreMotivoTransferenciaById:
      (state) => (idMotivoTransferencia) => {
        return state.motivoTransferencia?.find(
          (motivo) => motivo.id === idMotivoTransferencia
        )?.descripcion
      },
    mantenedor_getNombreDecisionAsignacionByCodigo:
      (state) => (codigoDecision) => {
        return state.decisionAsignacion?.find(
          (decision) => decision.codigo === codigoDecision
        )?.descripcion
      },
    mantenedor_getNombreTipoAsignacionById: (state) => (idTipoAsignacion) => {
      return state.tipoAsignacion?.find((tipo) => tipo.id === idTipoAsignacion)
        ?.descripcion
    },
    mantenedor_getNombreMotivoAgrupacionById:
      (state) => (idMotivoAgrupacion) => {
        return state.motivoAgrupacion?.find(
          (motivo) => motivo.id === idMotivoAgrupacion
        )?.descripcion
      },
    mantenedor_getDescripcionTipoTerminoById: (state) => (idTipoTermino) => {
      return (
        state.tiposTermino?.find(
          (termino) => termino.id === idTipoTermino?.toUpperCase()
        )?.descripcion ?? 'Sin Tipo Término'
      )
    },
    mantenedor_getDescripcionTipoSubterminoById:
      (state) => (idTipoSubtermino) => {
        console.log('subtiposTermino', state.subtiposTermino)
        console.log('idTipoSubtermino', idTipoSubtermino)
        return state.subtiposTermino.length > 0
          ? state.subtiposTermino?.find(
            (subtermino) => subtermino.id === idTipoSubtermino?.toUpperCase()
          )?.descripcion ?? 'Sin Tipo Subtérmino'
          : 'Sin Tipo Subtérmino'
      },
    mantenedor_getResultadoConsultaTerminoById:
      (state) => (idResultadoConsulta) => {
        return (
          state.resultadosConsultaTermino?.find(
            (resultadoConsulta) =>
              resultadoConsulta.id === idResultadoConsulta?.toUpperCase()
          )?.descripcion ?? 'Sin Ressultado Consulta'
        )
      },
    mantenedor_getDescripcionTipoSuspensionById:
      (state) => (idTipoSuspension) => {
        return (
          state.tiposSuspension?.find(
            (suspension) =>
              suspension.id.toUpperCase() === idTipoSuspension?.toUpperCase()
          )?.descripcion ?? 'Sin Tipo Suspension'
        )
      },
    mantenedor_getDescripcionSubtipoSuspensionById:
      (state) => (idsubtipoSuspension) => {
        return (
          state.subtiposSuspension?.find(
            (suspension) =>
              suspension.id.toUpperCase() === idsubtipoSuspension?.toUpperCase()
          )?.descripcion ?? 'Sin Subtipo Suspension'
        )
      },
    mantenedor_getDescripcionCondicionById: (state) => (idCondicion) => {
      return (
        state.condicionesAR?.find(
          (condicion) =>
            condicion.id.toUpperCase() === idCondicion?.toUpperCase()
        )?.descripcion ?? 'Sin Subtipo Suspension'
      )
    },
    mantenedor_getCodigoCondicionById: (state) => (idCondicion) => {
      return (
        state.condicionesAR?.find(
          (condicion) =>
            condicion.id.toUpperCase() === idCondicion?.toUpperCase()
        )?.codigo ?? null
      )
    },
    mantenedor_getDescripcionEvaluacionCumplimientosById:
      (state) => (idCumplimiento) => {
        return (
          state.evaluacionCumplimientos?.find(
            (cumplimiento) =>
              cumplimiento.id.toUpperCase() === idCumplimiento?.toUpperCase()
          )?.descripcion ?? 'Sin Subtipo Suspension'
        )
      },
    mantenedor_getCodigoEvaluacionCumplimientosById:
      (state) => (idCumplimiento) => {
        return (
          state.evaluacionCumplimientos?.find(
            (cumplimiento) =>
              cumplimiento.id.toUpperCase() === idCumplimiento?.toUpperCase()
          )?.codigo ?? null
        )
      },

    mantenedor_getDescripcionMotivoDesestimacionById: (state) => (idMotivo) => {
      return state.motivosDesestimacion?.find(
        (motivo) => motivo.id === idMotivo
      )?.descripcion
    },
    mantenedor_getCodigoMotivoTransferenciaById: (state) => (idMotivo) => {
      const motivo = state.motivoTransferencia.find((m) => m.id === idMotivo)
      return motivo?.codigo
    },
    // #endregion

    // Getters Delitos
    mantenedor_getNombreFamiliaDelito: (state) => (idFamilia) => {
      const familia = state.familiasDelito?.find((f) => f.id === idFamilia)
      return familia?.descripcion
    },
    mantenedor_getIdFamiliaDelitoByIdPadreTipoDelito: (state) => (idPadre) => {
      const familia = state.familiasDelito?.find((f) => f.id === idPadre)
      return familia?.id
    },
    mantenedor_getNombreTipoDelito: (state) => (idTipoDelito) => {
      const delito = state.tiposDelito?.find((d) => d.id === idTipoDelito)
      return delito?.descripcion
    },
    mantenedor_getIdFamiliaDelitoByIdTipoDelito: (state) => (idTipoDelito) => {
      const familia = state.tiposDelito?.find((f) => f.id === idTipoDelito)
      return familia?.id
    },
    mantenedor_getNombreTipoTransporteById: (state) => (idTipoTransporte) => {
      const transporte = state.tipoTransporte?.find(
        (f) => f.id === idTipoTransporte
      )
      return transporte?.descripcion
    },
    mantenedor_getIdTipoFuncionarioByCodigo: (state) => (codigo) => {
      return state.tipoFuncionario?.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getNombreTipoFuncionarioById: (state) => (id) => {
      return state.tipoFuncionario?.find((tipo) => tipo.id === id)?.descripcion
    },
    mantenedor_getCodigoMediosComisionDelitosById: (state) => (id) => {
      return state.mediosComisionDelitos?.find((tipo) => tipo.id === id)
        ?.codigo
    },
    mantenedor_getDescripcionTipoLugarOcurrenciaById: (state) => (id) => {
      return state.tipoLugarOcurrencia?.find((tipo) => tipo.id === id)
        ?.descripcion
    },

    // #region Getters Especies/Dinero
    mantenedor_getNombreFamiliaEspecie: (state) => (idFamiliaEspecie) => {
      const familiaEspecie = state.familiaEspecies?.find(
        (f) => f.id === idFamiliaEspecie
      )
      return familiaEspecie?.descripcion
    },
    mantenedor_getCodigoFamiliaEspecieById: (state) => (idFamiliaEspecie) => {
      const familiaEspecie = state.familiaEspecies?.find(
        (f) => f.id === idFamiliaEspecie
      )
      return familiaEspecie?.codigo
    },
    mantenedor_getNombreTipoEspecie: (state) => (idTipoEspecie) => {
      const tipoEspecie = state.allTiposEspecie?.find(
        (e) => e.id === idTipoEspecie
      )
      return tipoEspecie?.descripcion
    },
    mantenedor_getNombreMoneda: (state) => (idTipoMoneda) => {
      const tipoMoneda = state.tipoMoneda?.find((m) => m.id === idTipoMoneda)
      return tipoMoneda?.descripcion
    },
    mantenedor_getNombreDenominacionDinero: (state) => (idDenominacion) => {
      const denominacion = state.denominacionDinero?.find(
        (d) => d.id === parseInt(idDenominacion)
      )
      return denominacion?.descripcion
    },
    mantenedor_getNombreTipoDinero: (state) => (idTipoDinero) => {
      const tipoDinero = state.tipoDinero?.find(
        (d) => d.id === parseInt(idTipoDinero)
      )
      return tipoDinero?.descripcion
    },

    mantenedor_getNombreAmbitoEspecie: (state) => (idAmbito) => {
      const ambitoEspecie = state.ambitoEspecie?.find(
        (ambito) => ambito.id === idAmbito
      )
      return ambitoEspecie?.descripcion
    },
    mantenedor_getCodigoAmbitoEspecieById: (state) => (id) => {
      const ambitoEspecie = state.ambitoEspecie?.find(
        (ambito) => ambito.id === id
      )
      return ambitoEspecie?.codigo
    },
    mantenedor_getDescripcionTipoEspecie: (state) => (idTipoEspecie) => {
      const tipoEspecie = state.allTiposEspecie?.find(
        (tipo) => tipo.id === idTipoEspecie
      )
      return tipoEspecie?.descripcion
    },
    mantenedor_getCodigoFamiliaEspecie: (state) => (idFamiliaEspecie) => {
      const familiaEspecie = state.familiaEspecies?.find(
        (familia) => familia.id === idFamiliaEspecie
      )
      return familiaEspecie?.codigo
    },
    // #endregion

    // Getters Sujetos Intervinientes
    mantenedor_getCodigoTipoDocumentoIdentidad:
      (state) => (idDocumentacion) => {
        return state.tiposDocumento?.find((d) => d.id === idDocumentacion)
          ?.codigo
      },
    mantenedor_getIdTipoDocumentoIdentidadByCodigo: (state) => (codigo) => {
      return state.tiposDocumento?.find((d) => d.codigo === codigo)?.id
    },
    mantenedor_getNombreTipoSujeto: (state) => (id) => {
      if (id?.length > 2) {
        return state.tiposSujeto?.find((sujeto) => sujeto.id === id)
          ?.descripcion
      } else {
        return state.tiposSujeto?.find((sujeto) => sujeto.codigo === id)
          ?.descripcion
      }
    },
    mantenedor_getCodigoTipoContactoById: (state) => (id) => {
      return state.tipoContacto.find((tipo) => tipo.id === id)?.codigo
    },
    mantenedor_getIdTipoContactoByCodigo: (state) => (codigo) => {
      return state.tipoContacto.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getIdTipoSujetoByCodigo: (state) => (codigo) => {
      return state.tiposSujeto?.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getCodigoTipoSujeto: (state) => (id) => {
      return state.tiposSujeto?.find((tipo) => tipo.id === id)?.codigo
    },

    mantenedor_getTipoPersonaById: (state) => (id) => {
      return state.tiposPersona?.find((tipo) => tipo.id === id)?.codigo
    },

    mantenedor_getTipoPersonaIdByCodigo: (state) => (codigo) => {
      return state.tiposPersona?.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getIdentidadDeGeneroNombreById: (state) => (id) => {
      return state.identidadGenero?.find((sujeto) => sujeto.id === id)
        ?.descripcion
    },
    mantenedor_getIdTipoSexoByDescripcion: (state) => (descripcion) => {
      return state.tipoSexo.find(
        (sex) => sex.descripcion.toUpperCase() === descripcion.toUpperCase()
      )?.id
    },
    mantenedor_getIdTipoSexoByCodigo: (state) => (codigo) => {
      return state.tipoSexo.find((sex) => sex.codigo === codigo)?.id
    },
    mantenedor_getDescripcionTipoSexoById: (state) => (id) => {
      return state.tipoSexo.find((sex) => sex.id === id)?.descripcion
    },
    mantenedor_getTipoDireccionById: (state) => (id) => {
      return state.tiposDireccion.find((tipo) => tipo.id === id)?.descripcion
    },
    mantenedor_getIdTipoDireccionByCodigo: (state) => (codigo) => {
      return state.tiposDireccion.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getIdTipoDireccionByDescripcion: (state) => (descripcion) => {
      return state.tiposDireccion.find(
        (tipo) => tipo.descripcion === descripcion
      )?.id
    },
    mantenedor_getIdRegionByNombre: (state) => (nombre) => {
      let searchName = nombre

      switch (nombre) {
        case 'O\'Higgins':
          searchName = 'LIBERTADOR GRAL. BERNARDO O HIGGINS'
          break
        case 'Magallanes y la Antártica Chilena':
          searchName = 'MAGALLANES Y DE LA ANTARTICA CHILENA'
          break

        default:
          break
      }

      return state.regiones.find((region) =>
        appUtil.includeWord(region.descripcion, searchName)
      )?.id
    },
    mantenedor_getIdComunaByNombre: (state) => (nombre) => {
      const opciones = {
        'Padre Las Casas': 'PADRE DE LAS CASAS'
      }
      const searchName = opciones[nombre] || nombre

      return state.comuna.find((comunaE) =>
        appUtil.includeWord(comunaE.descripcion, searchName)
      )?.id
    },
    mantenedor_getEstadoCivilDescripcionById: (state) => (id) => {
      return state.estadoCivil.find((tipo) => tipo.id === id)?.descripcion
    },
    mantenedor_getIdPaisByCodigo: (state) => (codigo) => {
      return state.paises?.find((pais) => pais.codigo === codigo)?.id
    },
    mantenedor_getTipoDenunciaId: (state) => (tipoDenuncia) => {
      return state.tiposDenuncia?.find(
        (tipo) => tipo.descripcion === tipoDenuncia
      )?.id
    },
    mantenedor_getTipoDenunciaNombreById: (state) => (id) => {
      return state.tiposDenuncia?.find((tipo) => tipo.id === id)?.descripcion
    },
    mantenedor_getTipoDenunciaIdByCodigo: (state) => (codigo) => {
      return state.tiposDenuncia?.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getCodigoTipoDenunciaByNombre: (state) => (descripcion) => {
      return state.tiposDenuncia?.find(
        (tipo) => tipo.descripcion === descripcion
      )?.codigo
    },
    mantenedor_getTipoDenunciaByCodigo: (state) => (codigo) => {
      return state.tiposDenuncia?.find((tipo) => tipo.codigo === codigo)
        ?.descripcion
    },
    mantenedor_getTipoNnaResponsableByCodigo: (state) => (codigo) => {
      return state.tipoNnaResponsable?.find((tipo) => tipo.codigo === codigo)
        ?.id
    },
    mantenedor_getIdParentescoByCodigo: (state) => (codigo) => {
      return state.parentesco?.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getIdTipoInstitucionPertenecienteByCodigo:
      (state) => (codigo) => {
        return state.tipoInstitucionPerteneciente?.find(
          (tipo) => tipo.codigo === codigo
        )?.id
      },
    mantenedor_getCodigoDiscapacidadById: (state) => (id) => {
      return state.discapacidad?.find((tipo) => tipo.id === id)?.codigo
    },
    mantenedor_getIdDiscapacidadByCodigo: (state) => (codigo) => {
      return state.discapacidad?.find((tipo) => tipo.codigo === codigo)?.id
    },
    mantenedor_getDescripcionRelacionSujetosById: (state) => (id) => {
      return state.relacionesSujetos?.find((tipo) => tipo.id === id)
        ?.descripcion
    },
    mantenedor_getDescripcionCausaDetencionById: (state) => (id) => {
      return state.causaDetencion?.find((tipo) => tipo.id === id)?.descripcion
    },

    // #region Fiscalia
    mantenedor_getTiposFiscaliaById: (state) => (id) => {
      const fiscalia = state.nombresFiscalia?.find((f) => {
        return f.id === id
      })
      return fiscalia?.idPadre
    },
    mantenedor_getIdTiposFiscaliaByCodigoFiscalia: (state) => (codigo) => {
      const idPadreTipoFiscalia = state.nombresFiscalia?.find((f) => {
        return f.codigo === codigo
      })?.idPadre
      const tipoFiscalia = state.tiposFiscalia?.find((tf) => {
        return tf.id === idPadreTipoFiscalia
      })
      return tipoFiscalia?.id
    },
    mantenedor_getCodigoTiposFiscaliaById: (state) => (id) => {
      const fiscalia = state.tiposFiscalia?.find((f) => {
        return f.id === id
      })
      return fiscalia?.codigo
    },
    mantenedor_getIdTiposFiscaliaByDescripcion: (state) => (descripcion) => {
      const fiscalia = state.tiposFiscalia?.find((f) => {
        return f.descripcion === descripcion
      })
      return fiscalia?.id
    },
    mantenedor_getCodigoRegionById: (state) => (id) => {
      const region = state.regiones?.find((f) => {
        return f.id === id
      })
      return region?.codigo
    },
    mantenedor_getDescripcionRegionById: (state) => (id) => {
      const region = state.regiones?.find((f) => {
        return f.id === id
      })
      return region?.descripcion
    },
    mantenedor_getIdRegionByCodigo: (state) => (codigo) => {
      return state.regiones?.find((f) => f.codigo === codigo)?.id
    },
    mantenedor_getNombreFiscaliaById: (state) => (id) => {
      const fiscalia = state.nombresFiscalia?.find((f) => {
        return f.id === id
      })
      return fiscalia?.descripcion
    },
    mantenedor_getNombreFiscaliaByCodigo: (state) => (codigo) => {
      return state.nombresFiscalia?.find((f) => f.codigo === codigo)
        ?.descripcion
    },
    mantenedor_getIdFiscaliaByCodigo: (state) => (codigo) => {
      return state.nombresFiscalia?.find((f) => f.codigo === codigo)?.id
    },
    mantenedor_getCodigoFiscaliaById: (state) => (id) => {
      return state.nombresFiscalia?.find((f) => f.id === id)?.codigo
    },
    mantenedor_getDescripcionEspecialidadFiscalia: (state) => (id) => {
      return state.especialidadesFiscalia?.find((f) => f.id === id)
        ?.descripcion
    },
    // #endregion
    mantenedor_getCodigoInstitucionesDenunciaById: (state) => (id) => {
      return state.institucionesDenuncia?.find((i) => i.id === id)?.codigo
    },
    mantenedor_getNombreInstitucionesDenunciaById: (state) => (id) => {
      return state.institucionesDenuncia?.find((i) => i.id === id)?.descripcion
    },
    mantenedor_getDescripcionComunasById: (state) => (id) => {
      return state.comuna?.find((c) => c.id === id)?.descripcion
    },
    mantenedor_getCodigoUnidadPolicialById: (state) => (id) => {
      return state.unidadPolicial?.find((i) => i.id === id)?.codigo
    },
    mantenedor_getDescripcionUnidadPolicialById: (state) => (id) => {
      return state.unidadPolicial?.find((i) => i.id === id)?.descripcion
    },
    mantenedor_getDescripcionClasesPeligroEspeciesById: (state) => (id) => {
      return (
        state.clasesPeligro?.find((i) => i.id === id)?.descripcion ??
        'Clase no definida'
      )
    },

    // #region getters documentos adjuntos

    mantenedor_getDescripciontiposDocumentosAdjuntosById: (state) => (id) => {
      return state.tiposDocumentosAdjuntos?.find((i) => i.id === id)
        ?.descripcion
    },
    mantenedor_getDescripcionNombresTipoDocumentoById: (state) => (id) => {
      return state.nombresTipoDocumento?.find((i) => i.id === id)?.descripcion
    },

    // #region getters medidas

    mantenedor_getIdEstadoRelacionByCodigo: (state) => (codigo) => {
      return state.estadoMedidaHito?.find((i) => i?.codigo === codigo)?.id
    },
    mantenedor_getDescripcionMedidasCautelaresById: (state) => (id) => {
      return state.medidasCautelares?.find((i) => i?.id === id.toUpperCase())
        ?.descripcion
    },
    mantenedor_getDescripcionEstadoRelacionById: (state) => (id) => {
      return state.estadoRelacion?.find((i) => i?.id === id)?.descripcion
    }
    // #endregion
  }
}
