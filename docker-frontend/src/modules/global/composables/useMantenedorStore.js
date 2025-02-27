import { computed } from 'vue'
import { useStore } from 'vuex'

export const useMantenedorStore = () => {
  const { state, dispatch, getters, commit } = useStore()

  return {
    // #region COSAS QUE TENGO QUE HACER PORQUE ME DA PAJA ARREGLAR LA LOGICA DE LOS MANTENEDORES DE ACTIVIDAD
    tiposActividad: computed(() => state.mantenedor.tiposActividad),
    subtipoActividadList: computed(() => state.mantenedor.subtipoActividadList),
    subSubtipoActividadList: computed(
      () => state.mantenedor.subSubtipoActividadList
    ),
    resultadosAutorizacion: computed(() => state.mantenedor.resultadosAutorizacion),
    // #endregion

    tiposAutorizacionDiligencia: computed(
      () => state.mantenedor.tiposAutorizacionDiligencia
    ),

    // COMPUTED PROPERTIES
    tipoRespuestaBasica: computed(() => state.mantenedor.tipoRespuestaBasica),

    tipoActividad: computed(() => state.mantenedor.tipoActividad),
    actividadesSubtipo: computed(() => state.mantenedor.actividadesSubtipo),
    actividadesSubSubtipo: computed(
      () => state.mantenedor.actividadesSubSubtipo
    ),
    atributos: computed(() => state.mantenedor.atributos),
    juzgados: computed(() => state.mantenedor.juzgados),
    // #region Diligencias
    tipoActividadByCodigo: computed(
      () => state.mantenedor.tipoActividadByCodigo
    ),
    tipoOrigen: computed(() => state.mantenedor.tipoOrigen),
    subtiposActividad: computed(() => state.mantenedor.subtiposActividad),
    subsubTiposActividad: computed(() => state.mantenedor.subsubTiposActividad),
    allSubSubTiposActividad: computed(
      () => state.mantenedor.allSubSubTiposActividad
    ),
    estadosDiligencia: computed(() => state.mantenedor.estadosDiligencia),
    ambitosDiligencia: computed(() => state.mantenedor.ambitosDiligencia),
    referencias: computed(() => state.mantenedor.referencias),
    instituciones: computed(() => state.mantenedor.instituciones),
    justificaciones: computed(() => state.mantenedor.justificaciones),
    plazosDiligencia: computed(() => state.mantenedor.plazosDiligencia),
    plantillasDiligencia: computed(() => state.mantenedor.plantillasDiligencia),
    // #endregion

    // #region Causa
    procesoHito: computed(() => state.mantenedor.procesoHito),
    tiposAntecedentes: computed(() => state.mantenedor.tiposAntecedentes),
    tiposOrigenAntecedentes: computed(
      () => state.mantenedor.tiposOrigenAntecedentes
    ),
    tiposAmbitoAntecedentes: computed(
      () => state.mantenedor.tiposAmbitoAntecedentes
    ),
    tiposComplejidad: computed(() => state.mantenedor.tiposComplejidad),
    tiposImpacto: computed(() => state.mantenedor.tiposImpacto),
    motivoTransferencia: computed(() => state.mantenedor.motivoTransferencia),
    decisionAsignacion: computed(() => state.mantenedor.decisionAsignacion),
    tipoAsignacion: computed(() => state.mantenedor.tipoAsignacion),
    motivoAgrupacion: computed(() => state.mantenedor.motivoAgrupacion),
    accionAgrupacion: computed(() => state.mantenedor.accionAgrupacion),
    estadoAgrupacion: computed(() => state.mantenedor.estadoAgrupacion),
    detalleEstadoAgrupacion: computed(
      () => state.mantenedor.detalleEstadoAgrupacion
    ),
    estadosCausa: computed(() => state.mantenedor.estadosCausa),
    motivosDesestimacion: computed(() => state.mantenedor.motivosDesestimacion),
    tiposTermino: computed(() => state.mantenedor.tiposTermino),
    subtiposTermino: computed(() => state.mantenedor.subtiposTermino),
    resultadosConsultaTermino: computed(
      () => state.mantenedor.resultadosConsultaTermino
    ),
    tiposSuspension: computed(() => state.mantenedor.tiposSuspension),
    subtiposSuspension: computed(() => state.mantenedor.subtiposSuspension),
    tiposAccionCierre: computed(() => state.mantenedor.tiposAccionCierre),
    decisionesRelaciones: computed(() => state.mantenedor.decisionesRelaciones),
    decisionesCausa: computed(() => state.mantenedor.decisionesCausa),
    condicionesAR: computed(() => state.mantenedor.condicionesAR),
    motivosSobreseimiento: computed(
      () => state.mantenedor.motivosSobreseimiento
    ),
    evaluacionCumplimientos: computed(
      () => state.mantenedor.evaluacionCumplimientos
    ),
    // #endregion

    // #region Delitos
    familiasDelito: computed(() => state.mantenedor.familiasDelito),
    tiposDelito: computed(() => state.mantenedor.tiposDelito),
    tiposDenuncia: computed(() => state.mantenedor.tiposDenuncia),
    institucionesDenuncia: computed(
      () => state.mantenedor.institucionesDenuncia
    ),
    mediosComisionDelitos: computed(
      () => state.mantenedor.mediosComisionDelitos
    ),
    zonaDelito: computed(() => state.mantenedor.zonaDelito),
    tipoLugarOcurrencia: computed(() => state.mantenedor.tipoLugarOcurrencia),
    viaIngreso: computed(() => state.mantenedor.viaIngreso),
    zonaUrbanizacionDelito: computed(
      () => state.mantenedor.zonaUrbanizacionDelito
    ),
    tipoHallazgo: computed(() => state.mantenedor.tipoHallazgo),
    tipoElementoUsado: computed(() => state.mantenedor.tipoElementoUsado),
    tipoTransporte: computed(() => state.mantenedor.tipoTransporte),
    tipoVigilancia: computed(() => state.mantenedor.tipoVigilancia),
    fuenteInfoTestigo: computed(() => state.mantenedor.fuenteInfoTestigo),
    tipoTestigo: computed(() => state.mantenedor.tipoTestigo),
    rolHechoDelictual: computed(() => state.mantenedor.rolHechoDelictual),
    perfilImputado: computed(() => state.mantenedor.perfilImputado),
    tipoFuncionario: computed(() => state.mantenedor.tipoFuncionario),
    medidaSeguridad: computed(() => state.mantenedor.medidaSeguridad),
    modalidadGrupo: computed(() => state.mantenedor.modalidadGrupo),
    cantidadSujetos: computed(() => state.mantenedor.cantidadSujetos),

    // #endregion

    // #region Sujetos Internivientes
    tiposSujeto: computed(() => state.mantenedor.tiposSujeto),
    tipoVictima: computed(() => state.mantenedor.tipoVictima),
    escolaridad: computed(() => state.mantenedor.escolaridad),
    tipoSexo: computed(() => state.mantenedor.tipoSexo),
    unidadPolicial: computed(() => state.mantenedor.unidadPolicial),
    tipoNnaResponsable: computed(() => state.mantenedor.tipoNnaResponsable),
    tipoRepresentado: computed(() => state.mantenedor.tipoRepresentado),
    tipoInstitucionPerteneciente: computed(
      () => state.mantenedor.tipoInstitucionPerteneciente
    ),
    tipoAcreditacion: computed(() => state.mantenedor.tipoAcreditacion),
    tiposDocumento: computed(() => state.mantenedor.tiposDocumento),
    tiposPersona: computed(() => state.mantenedor.tiposPersona),
    paises: computed(() => state.mantenedor.paises),
    organismoRol: computed(() => state.mantenedor.organismoRol),
    medidasProteccion: computed(() => state.mantenedor.medidasProteccion),
    medidasProteccionPersona: computed(
      () => state.mantenedor.medidasProteccionPersona
    ),
    relacionesSujetos: computed(() => state.mantenedor.relacionesSujetos),
    estadoCivil: computed(() => state.mantenedor.estadoCivil),
    estadoMigratorio: computed(() => state.mantenedor.estadoMigratorio),
    identidadGenero: computed(() => state.mantenedor.identidadGenero),
    pueblosOriginarios: computed(() => state.mantenedor.pueblosOriginarios),
    tipoContacto: computed(() => state.mantenedor.tipoContacto),
    estadoTemperancia: computed(() => state.mantenedor.estadoTemperancia),
    parentesco: computed(() => state.mantenedor.parentesco),
    discapacidad: computed(() => state.mantenedor.discapacidad),
    validacionIdentidad: computed(() => state.mantenedor.validacionIdentidad),
    tipoDocumento: computed(() => state.mantenedor.tipoDocumento),
    profesiones: computed(() => state.mantenedor.profesiones),
    causaDetencion: computed(() => state.mantenedor.causaDetencion),
    // #endregion

    // #region Direccion
    tiposDireccion: computed(() => state.mantenedor.tiposDireccion),
    tiposMedioContacto: computed(() => state.mantenedor.tiposMedioContacto),
    tiposContactoDueno: computed(() => state.mantenedor.tiposContactoDueno),

    // #endregion

    // #region Especies/Dinero
    tipoEspecies: computed(() => state.mantenedor.tipoEspecies),
    familiaEspecies: computed(() => state.mantenedor.familiaEspecies),
    ambitoEspecie: computed(() => state.mantenedor.ambitoEspecie),
    razonMovimientoEspecie: computed(
      () => state.mantenedor.razonMovimientoEspecie
    ),
    unidadMedidaEspecie: computed(() => state.mantenedor.unidadMedidaEspecie),
    claseEspecie: computed(() => state.mantenedor.claseEspecie),
    clasesPeligro: computed(() => state.mantenedor.clasesPeligro),
    estadoConservacionEspecie: computed(
      () => state.mantenedor.estadoConservacionEspecie
    ),
    tipoMoneda: computed(() => state.mantenedor.tipoMoneda),
    tipoDinero: computed(() => state.mantenedor.tipoDinero),
    denominacionDinero: computed(() => state.mantenedor.denominacionDinero),
    quienRealizaAvaluo: computed(() => state.mantenedor.quienRealizaAvaluo),
    pronunciamientoFiscalEspecie: computed(
      () => state.mantenedor.pronunciamientoFiscalEspecie
    ),
    marcaOreja: computed(() => state.mantenedor.marcaOreja),
    tipoTusa: computed(() => state.mantenedor.tipoTusa),
    tipoCola: computed(() => state.mantenedor.tipoCola),
    tipoSenal: computed(() => state.mantenedor.tipoSenal),
    origenAnimal: computed(() => state.mantenedor.origenAnimal),
    tipoDocumentacionAnimal: computed(
      () => state.mantenedor.tipoDocumentacionAnimal
    ),
    causaMuerteAnimal: computed(() => state.mantenedor.causaMuerteAnimal),
    tipoDocumentoEspecie: computed(() => state.mantenedor.tipoDocumentoEspecie),
    allTiposEspecie: computed(() => state.mantenedor.allTiposEspecie),
    signoFuerzaVehiculo: computed(() => state.mantenedor.signoFuerzaVehiculo),
    estadoVehiculo: computed(() => state.mantenedor.estadoVehiculo),
    tieneHerramientasDentro: computed(
      () => state.mantenedor.tieneHerramientasDentro
    ),
    tipoProcedencia: computed(() => state.mantenedor.tipoProcedencia),
    tipoVehiculos: computed(() => state.mantenedor.tipoVehiculos),
    estacionaEn: computed(() => state.mantenedor.estacionaEn),
    tipoMarcaVehiculo: computed(() => state.mantenedor.tipoMarcaVehiculo),
    tipoModeloVehiculo: computed(() => state.mantenedor.tipoModeloVehiculo),
    // #endregion

    // #region Policia
    prefecturas: computed(() => state.mantenedor.prefecturas),
    comisarias: computed(() => state.mantenedor.comisarias),
    destacamentos: computed(() => state.mantenedor.destacamentos),
    // #endregion

    // #region Fiscalias
    tiposFiscalia: computed(() => state.mantenedor.tiposFiscalia),
    regiones: computed(() => state.mantenedor.regiones),
    comuna: computed(() => state.mantenedor.comuna),
    nombresFiscalia: computed(() => state.mantenedor.nombresFiscalia),
    especialidadesFiscalia: computed(
      () => state.mantenedor.especialidadesFiscalia
    ),
    fiscalias: computed(() => state.mantenedor.fiscalias),
    fiscales: computed(() => state.mantenedor.fiscales),
    allFiscales: computed(() => state.mantenedor.allFiscales),
    // #endregion

    // #region Mantenedor
    estadoMedidaHito: computed(() => state.mantenedor.estadoMedidaHito),
    tipoMedida: computed(() => state.mantenedor.tipoMedida),
    medidasCautelares: computed(() => state.mantenedor.medidasCautelares),
    medidasIntrusivas: computed(() => state.mantenedor.medidasIntrusivas),
    estadoRelacion: computed(() => state.mantenedor.estadoRelacion),
    // #endregion

    // #region Documentos Adjuntos
    tiposDocumentosAdjuntos: computed(
      () => state.mantenedor.tiposDocumentosAdjuntos
    ),
    nombresTipoDocumento: computed(() => state.mantenedor.nombresTipoDocumento),
    seccionesFUD: computed(() => state.mantenedor.seccionesFUD),

    // #endregion

    tiposPericia: computed(() => state.mantenedor.tiposPericia),
    tiposAutopsia: computed(() => state.mantenedor.tiposAutopsia),
    tiposExamenMedico: computed(() => state.mantenedor.tiposExamenMedico),
    tiposPruebaMedica: computed(() => state.mantenedor.tiposPruebaMedica),
    tiposAudiencias: computed(() => state.mantenedor.tiposAudiencias),
    tipoAudiencia: computed(() => state.mantenedor.tipoAudiencia),

    // ACTIONS

    mantenedor_getRespuestaBasico: (payload) =>
      dispatch('mantenedor/mantenedor_getRespuestaBasico', payload),

    mantenedor_getActividad: (payload) =>
      dispatch('mantenedor/mantenedor_getActividad', payload),
    mantenedor_getActividadHijo: (payload) =>
      dispatch('mantenedor/mantenedor_getActividadHijo', payload),
    mantenedor_getAtributos: (payload) =>
      dispatch('mantenedor/mantenedor_getAtributos', payload),
    // Actions Diligencias
    mantenedor_getTiposDiligencias: () =>
      dispatch('mantenedor/mantenedor_getTiposDiligencias'),
    mantenedor_getSubTiposDiligenciasByIdTipo: (payload) =>
      dispatch('mantenedor/mantenedor_getSubTiposDiligenciasByIdTipo', payload),
    mantenedor_getAllTiposDiligencias: () =>
      dispatch('mantenedor/mantenedor_getAllTiposDiligencias'),
    mantenedor_getAllSubTiposDiligencias: () =>
      dispatch('mantenedor/mantenedor_getAllSubTiposDiligencias'),
    mantenedor_getEstadosDiligencia: () =>
      dispatch('mantenedor/mantenedor_getEstadosDiligencia'),
    mantenedor_getAmbitosDiligencia: () =>
      dispatch('mantenedor/mantenedor_getAmbitosDiligencia'),
    mantenedor_getReferencias: () =>
      dispatch('mantenedor/mantenedor_getReferencias'),
    mantenedor_getInstituciones: () =>
      dispatch('mantenedor/mantenedor_getInstituciones'),
    mantenedor_getJustificaciones: () =>
      dispatch('mantenedor/mantenedor_getJustificaciones'),
    mantenedor_getPlazosDiligencia: () =>
      dispatch('mantenedor/mantenedor_getPlazosDiligencia'),
    mantenedor_getPlantillasDiligencia: () =>
      dispatch('mantenedor/mantenedor_getPlantillasDiligencia'),

    // NUEVOS MANTENEDORES ACTIVIDAD PARA DILIGENCIAS WIP REEMPLAZAR LOS VIEJOS
    mantenedor_getTipoActividad: (payload) =>
      dispatch('mantenedor/mantenedor_getTipoActividad', payload),
    mantenedor_getTipoActividadByCodigoActividad: (payload) =>
      dispatch(
        'mantenedor/mantenedor_getTipoActividadByCodigoActividad',
        payload
      ),
    mantenedor_getTipoOrigenActividad: () =>
      dispatch('mantenedor/mantenedor_getTipoOrigenActividad'),
    mantenedor_getTipoOrigenByCodigoActividad: (payload) =>
      dispatch('mantenedor/mantenedor_getTipoOrigenByCodigoActividad', payload),
    mantenedor_getAllSubTiposActividad: () =>
      dispatch('mantenedor/mantenedor_getAllSubTiposActividad'),
    mantenedor_getSubTiposActividadByIdPadreTipoActividad: (payload) =>
      dispatch(
        'mantenedor/mantenedor_getSubTiposActividadByIdPadreTipoActividad',
        payload
      ),
    mantenedor_getAllSubSubTiposActividad: () =>
      dispatch('mantenedor/mantenedor_getAllSubSubTiposActividad'),
    mantenedor_getSubSubTiposActividadByIdPadre: (payload) =>
      dispatch(
        'mantenedor/mantenedor_getSubSubTiposActividadByIdPadre',
        payload
      ),

    // Actions Causa
    mantenedor_getProcesoHito: (payload) =>
      dispatch('mantenedor/mantenedor_getProcesoHito', payload),
    mantenedor_getTiposAntecedentes: () =>
      dispatch('mantenedor/mantenedor_getTiposAntecedentes'),
    mantenedor_getEstadosCausa: () =>
      dispatch('mantenedor/mantenedor_getEstadosCausa'),
    mantenedor_getEstadoCausaById: (payload) =>
      dispatch('mantenedor/mantenedor_getEstadoCausaById', payload), 
    mantenedor_getTiposAntecedentesByOrigen: (payload) =>
      dispatch('mantenedor/mantenedor_getTiposAntecedentesByOrigen', payload),
    mantenedor_getTiposOrigenAntecedentes: () =>
      dispatch('mantenedor/mantenedor_getTiposOrigenAntecedentes'),
    mantenedor_getTiposAmbitoAntecedentes: () =>
      dispatch('mantenedor/mantenedor_getTiposAmbitoAntecedentes'),
    mantenedor_getTiposComplejidad: () =>
      dispatch('mantenedor/mantenedor_getTiposComplejidad'),
    mantenedor_getTiposImpacto: () =>
      dispatch('mantenedor/mantenedor_getTiposImpacto'),
    mantenedor_getMotivosTransferencia: () =>
      dispatch('mantenedor/mantenedor_getMotivosTransferencia'),
    mantenedor_getDecisionAsignacion: () =>
      dispatch('mantenedor/mantenedor_getDecisionAsignacion'),
    mantenedor_getDecisionAsignacionById: (payload) =>
      dispatch('mantenedor/mantenedor_getDecisionAsignacionById', payload),
    mantenedor_getTipoAsignacion: () =>
      dispatch('mantenedor/mantenedor_getTipoAsignacion'),
    mantenedor_getTipoAsignacionById: (payload) =>
      dispatch('mantenedor/mantenedor_getTipoAsignacionById', payload),
    mantenedor_getMotivoAgrupacion: () =>
      dispatch('mantenedor/mantenedor_getMotivoAgrupacion'),
    mantenedor_getMotivoAgrupacionById: (payload) =>
      dispatch('mantenedor/mantenedor_getMotivoAgrupacionById', payload),
    mantenedor_getAccionAgrupacion: () =>
      dispatch('mantenedor/mantenedor_getAccionAgrupacion'),
    mantenedor_getAccionAgrupacionById: (payload) =>
      dispatch('mantenedor/mantenedor_getAccionAgrupacionById', payload),
    mantenedor_getEstadoAgrupacion: () =>
      dispatch('mantenedor/mantenedor_getEstadoAgrupacion'),
    mantenedor_getEstadoAgrupacionById: (payload) =>
      dispatch('mantenedor/mantenedor_getEstadoAgrupacionById', payload),
    mantenedor_getDetalleEstadoAgrupacion: () =>
      dispatch('mantenedor/mantenedor_getDetalleEstadoAgrupacion'),
    mantenedor_getDetalleEstadoAgrupacionById: (payload) =>
      dispatch('mantenedor/mantenedor_getDetalleEstadoAgrupacionById', payload),
    mantenedor_getMotivosDesestimacion: () =>
      dispatch('mantenedor/mantenedor_getMotivosDesestimacion'),
    mantenedor_getTiposTermino: () =>
      dispatch('mantenedor/mantenedor_getTiposTermino'),
    mantenedor_getSubTiposTerminoByIdTermino: (payload) =>
      dispatch('mantenedor/mantenedor_getSubTiposTerminoByIdTermino', payload),
    mantenedor_getResultadosConsulta: () =>
      dispatch('mantenedor/mantenedor_getResultadosConsulta'),
    mantenedor_getTiposSuspension: () =>
      dispatch('mantenedor/mantenedor_getTiposSuspension'),
    mantenedor_getSubTiposSuspensionByIdSuspension: (payload) =>
      dispatch(
        'mantenedor/mantenedor_getSubTiposSuspensionByIdSuspension',
        payload
      ),
    mantenedor_getTiposAccionCierre: () =>
      dispatch('mantenedor/mantenedor_getTiposAccionCierre'),
    mantenedor_getDecisionesRelaciones: () =>
      dispatch('mantenedor/mantenedor_getDecisionesRelaciones'),
    mantenedor_getDecisionesCausa: () =>
      dispatch('mantenedor/mantenedor_getDecisionesCausa'),
    mantenedor_getCondicionesAR: () =>
      dispatch('mantenedor/mantenedor_getCondicionesAR'),
    mantenedor_getMotivosSobreseimiento: () =>
      dispatch('mantenedor/mantenedor_getMotivosSobreseimiento'),
    mantenedor_getTiposEvaluacionCumplimientos: () =>
      dispatch('mantenedor/mantenedor_getTiposEvaluacionCumplimientos'),

    // Actions Delitos
    mantenedor_getFamiliasDelito: (payload) =>
      dispatch('mantenedor/mantenedor_getFamiliasDelito', payload),
    mantenedor_getTiposDelito: (payload) =>
      dispatch('mantenedor/mantenedor_getTiposDelito', payload),
    mantenedor_getTiposMediosComisionDelito: (payload) =>
      dispatch('mantenedor/mantenedor_getTiposMediosComisionDelito', payload),
    mantenedor_getTiposDenuncia: (payload) =>
      dispatch('mantenedor/mantenedor_getTiposDenuncia', payload),
    mantenedor_getInstitucionesDenuncia: (payload) =>
      dispatch('mantenedor/mantenedor_getInstitucionesDenuncia', payload),
    mantenedor_getTipoLugarOcurrencia: (payload) =>
      dispatch('mantenedor/mantenedor_getTipoLugarOcurrencia', payload),
    mantenedor_getTipoLugarOcurrenciaById: (payload) =>
      dispatch('mantenedor/mantenedor_getTipoLugarOcurrenciaById', payload),
    mantenedor_getViaIngreso: (payload) =>
      dispatch('mantenedor/mantenedor_getViaIngreso', payload),
    mantenedor_getViaIngresoById: (payload) =>
      dispatch('mantenedor/mantenedor_getViaIngresoById', payload),
    mantenedor_getUnidadPolicial: (payload) =>
      dispatch('mantenedor/mantenedor_getUnidadPolicial', payload),
    mantenedor_getUnidadPolicialById: (payload) =>
      dispatch('mantenedor/mantenedor_getUnidadPolicialById', payload),
    mantenedor_getZonaDelito: (payload) =>
      dispatch('mantenedor/mantenedor_getZonaDelito', payload),
    mantenedor_getZonaDelitoById: (payload) =>
      dispatch('mantenedor/mantenedor_getZonaDelitoById', payload),
    mantenedor_getCausaDetencion: (payload) =>
      dispatch('mantenedor/mantenedor_getCausaDetencion', payload),
    mantenedor_getCausaDetencionById: (payload) =>
      dispatch('mantenedor/mantenedor_getCausaDetencionById', payload),
    mantenedor_getTipoHallazgo: () =>
      dispatch('mantenedor/mantenedor_getTipoHallazgo'),
    mantenedor_getTipoHallazgoById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoHallazgoById', id),
    mantenedor_getTipoElementoUsado: () =>
      dispatch('mantenedor/mantenedor_getTipoElementoUsado'),
    mantenedor_getTipoElementoUsadoById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoElementoUsadoById', id),
    mantenedor_getTiposElementosUsadoByIdPadre: (id) =>
      dispatch('mantenedor/mantenedor_getTiposElementosUsadoByIdPadre', id),
    mantenedor_getTipoTransporte: () =>
      dispatch('mantenedor/mantenedor_getTipoTransporte'),
    mantenedor_getTipoTransporteById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoTransporteById', id),
    mantenedor_getTipoVigilancia: () =>
      dispatch('mantenedor/mantenedor_getTipoVigilancia'),
    mantenedor_getTipoVigilanciaById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoVigilanciaById', id),
    mantenedor_getFuenteInformacionTestigo: () =>
      dispatch('mantenedor/mantenedor_getFuenteInformacionTestigo'),
    mantenedor_getFuenteInformacionTestigoById: (id) =>
      dispatch('mantenedor/mantenedor_getFuenteInformacionTestigoById', id),
    mantenedor_getTipoTestigo: () =>
      dispatch('mantenedor/mantenedor_getTipoTestigo'),
    mantenedor_getTipoTestigoById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoTestigoById', id),
    mantenedor_getRolHechoDelictual: () =>
      dispatch('mantenedor/mantenedor_getRolHechoDelictual'),
    mantenedor_getRolHechoDelictualById: (id) =>
      dispatch('mantenedor/mantenedor_getRolHechoDelictualById', id),
    mantenedor_getPerfilImputado: () =>
      dispatch('mantenedor/mantenedor_getPerfilImputado'),
    mantenedor_getPerfilImputadoById: (id) =>
      dispatch('mantenedor/mantenedor_getPerfilImputadoById', id),
    mantenedor_getTipoFuncionario: () =>
      dispatch('mantenedor/mantenedor_getTipoFuncionario'),
    mantenedor_getTipoFuncionarioById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoFuncionarioById', id),
    mantenedor_getMedidasSeguridad: () =>
      dispatch('mantenedor/mantenedor_getMedidasSeguridad'),
    mantenedor_getMedidasSeguridadById: (id) =>
      dispatch('mantenedor/mantenedor_getMedidasSeguridadById', id),
    mantenedor_getModalidadGrupo: () =>
      dispatch('mantenedor/mantenedor_getModalidadGrupo'),
    mantenedor_getModalidadGrupoById: (id) =>
      dispatch('mantenedor/mantenedor_getModalidadGrupoById', id),
    mantenedor_getCantidadSujetos: () =>
      dispatch('mantenedor/mantenedor_getCantidadSujetos'),
    mantenedor_getCantidadSujetosById: (id) =>
      dispatch('mantenedor/mantenedor_getCantidadSujetosById', id),

    // Actions Sujetos Intervinientes
    mantenedor_getTiposSujetos: () =>
      dispatch('mantenedor/mantenedor_getTiposSujetos'),
    mantenedor_getTipoVictima: () =>
      dispatch('mantenedor/mantenedor_getTipoVictima'),
    mantenedor_getTipoVictimaById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoVictimaById', id),
    mantenedor_getEscolaridad: () =>
      dispatch('mantenedor/mantenedor_getEscolaridad'),
    mantenedor_getEscolaridadById: (id) =>
      dispatch('mantenedor/mantenedor_getEscolaridadById', id),
    mantenedor_getTipoSexo: () => dispatch('mantenedor/mantenedor_getTipoSexo'),
    mantenedor_getTipoSexoById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoSexoById', id),
    mantenedor_getTipoNnaResponsable: () =>
      dispatch('mantenedor/mantenedor_getTipoNnaResponsable'),
    mantenedor_getTipoNnaResponsableById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoNnaResponsableById', id),
    mantenedor_getTipoRepresentado: () =>
      dispatch('mantenedor/mantenedor_getTipoRepresentado'),
    mantenedor_getTipoRepresentadoById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoRepresentadoById', id),
    mantenedor_getTipoInstitucionPerteneciente: () =>
      dispatch('mantenedor/mantenedor_getTipoInstitucionPerteneciente'),
    mantenedor_getTipoInstitucionPertenecienteById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoInstitucionPertenecienteById', id),
    mantenedor_getTipoAcreditacion: () =>
      dispatch('mantenedor/mantenedor_getTipoAcreditacion'),
    mantenedor_getTipoAcreditacionById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoAcreditacionById', id),
    mantenedor_getProfesiones: () =>
      dispatch('mantenedor/mantenedor_getProfesiones'),
    mantenedor_getTiposDocumento: () =>
      dispatch('mantenedor/mantenedor_getTiposDocumento'),
    mantenedor_getTiposPersona: () =>
      dispatch('mantenedor/mantenedor_getTiposPersona'),
    mantenedor_getEstadoCivil: () =>
      dispatch('mantenedor/mantenedor_getEstadoCivil'),
    mantenedor_getEstadoCivilById: (payload) =>
      dispatch('mantenedor/mantenedor_getEstadoCivilById', payload),
    mantenedor_getEstadoMigratorio: () =>
      dispatch('mantenedor/mantenedor_getEstadoMigratorio'),
    mantenedor_getEstadoMigratorioById: (payload) =>
      dispatch('mantenedor/mantenedor_getEstadoMigratorioById', payload),
    mantenedor_getIdentidadGenero: () =>
      dispatch('mantenedor/mantenedor_getIdentidadGenero'),
    mantenedor_getIdentidadGeneroById: (payload) =>
      dispatch('mantenedor/mantenedor_getIdentidadGeneroById', payload),
    mantenedor_getPueblosOriginarios: () =>
      dispatch('mantenedor/mantenedor_getPueblosOriginarios'),
    mantenedor_getPueblosOriginariosById: (payload) =>
      dispatch('mantenedor/mantenedor_getPueblosOriginariosById', payload),
    mantenedor_getTipoContacto: () =>
      dispatch('mantenedor/mantenedor_getTipoContacto'),
    mantenedor_getTipoContactoById: (payload) =>
      dispatch('mantenedor/mantenedor_getTipoContactoById', payload),
    mantenedor_getEstadoTemperancia: () =>
      dispatch('mantenedor/mantenedor_getEstadoTemperancia'),
    mantenedor_getEstadoTemperanciaById: (payload) =>
      dispatch('mantenedor/mantenedor_getEstadoTemperanciaById', payload),
    mantenedor_getParentesco: () =>
      dispatch('mantenedor/mantenedor_getParentesco'),
    mantenedor_getParentescoById: (payload) =>
      dispatch('mantenedor/mantenedor_getParentescoById', payload),
    mantenedor_getDiscapacidad: () =>
      dispatch('mantenedor/mantenedor_getDiscapacidad'),
    mantenedor_getDiscapacidadById: (payload) =>
      dispatch('mantenedor/mantenedor_getDiscapacidadById', payload),
    mantenedor_getValidacionIdentidad: () =>
      dispatch('mantenedor/mantenedor_getValidacionIdentidad'),
    mantenedor_getValidacionIdentidadById: (payload) =>
      dispatch('mantenedor/mantenedor_getValidacionIdentidadById', payload),
    mantenedor_getPaises: () => dispatch('mantenedor/mantenedor_getPaises'),
    mantenedor_getMedidasProteccion: () =>
      dispatch('mantenedor/mantenedor_getMedidasProteccion'),
    mantenedor_getOrganismoRol: () =>
      dispatch('mantenedor/mantenedor_getOrganismoRol'),
    mantenedor_getOrganismoRolById: (payload) =>
      dispatch('mantenedor/mantenedor_getOrganismoRolById', payload),
    mantenedor_getRelacionesSujetos: () =>
      dispatch('mantenedor/mantenedor_getRelacionesSujetos'),
    mantenedor_getMedidasProteccionPersona: () =>
      dispatch('mantenedor/mantenedor_getMedidasProteccionPersona'),
    mantenedor_getMedidasProteccionPersonaById: (payload) =>
      dispatch(
        'mantenedor/mantenedor_getMedidasProteccionPersonaById',
        payload
      ),

    // Actions Direccion
    mantenedor_getTiposDireccion: () =>
      dispatch('mantenedor/mantenedor_getTiposDireccion'),
    mantenedor_getTipoMedioContacto: () =>
      dispatch('mantenedor/mantenedor_getTipoMedioContacto'),
    mantenedor_getTipoContactoDueno: () =>
      dispatch('mantenedor/mantenedor_getTipoContactoDueno'),

    // Actions Especies/Dinero
    mantenedor_getTiposEspecies: (payload) =>
      dispatch('mantenedor/mantenedor_getTiposEspecies', payload),
    mantenedor_getTipoEspecieByIdTipo: (payload) =>
      dispatch('mantenedor/mantenedor_getTipoEspecieByIdTipo', payload),
    mantenedor_getFamiliaEspecies: (payload) =>
      dispatch('mantenedor/mantenedor_getFamiliaEspecies', payload),
    mantenedor_getAmbitoEspecie: () =>
      dispatch('mantenedor/mantenedor_getAmbitoEspecie'),
    mantenedor_getAmbitoEspecieById: (id) =>
      dispatch('mantenedor/mantenedor_getAmbitoEspecieById', id),
    mantenedor_getRazonMovimientoEspecie: () =>
      dispatch('mantenedor/mantenedor_getRazonMovimientoEspecie'),
    mantenedor_getUnidadMedidaEspecie: () =>
      dispatch('mantenedor/mantenedor_getUnidadMedidaEspecie'),
    mantenedor_getClasePeligroEspecie: () =>
      dispatch('mantenedor/mantenedor_getClasePeligroEspecie'),
    mantenedor_getClaseEspecie: () =>
      dispatch('mantenedor/mantenedor_getClaseEspecie'),
    mantenedor_getEstadoConservacionEspecie: () =>
      dispatch('mantenedor/mantenedor_getEstadoConservacionEspecie'),
    mantenedor_geTipoMoneda: () =>
      dispatch('mantenedor/mantenedor_geTipoMoneda'),
    mantenedor_geTipoMonedaById: (id) =>
      dispatch('mantenedor/mantenedor_geTipoMonedaById', id),
    mantenedor_getTipoDinero: () =>
      dispatch('mantenedor/mantenedor_getTipoDinero'),
    mantenedor_getDenominacionDinero: () =>
      dispatch('mantenedor/mantenedor_getDenominacionDinero'),
    mantenedor_getPronunciamientoFiscalEspecie: () =>
      dispatch('mantenedor/mantenedor_getPronunciamientoFiscalEspecie'),
    mantenedor_getMarcaOreja: () =>
      dispatch('mantenedor/mantenedor_getMarcaOreja'),
    mantenedor_getMarcaOrejaById: (id) =>
      dispatch('mantenedor/mantenedor_getMarcaOrejaById', id),
    mantenedor_getTipoTusa: () => dispatch('mantenedor/mantenedor_getTipoTusa'),
    mantenedor_getTipoTusaById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoTusaById', id),
    mantenedor_getTipoCola: () => dispatch('mantenedor/mantenedor_getTipoCola'),
    mantenedor_getTipoColaById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoColaById', id),
    mantenedor_getTipoSenal: () =>
      dispatch('mantenedor/mantenedor_getTipoSenal'),
    mantenedor_getTipoSenalById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoSenalById', id),
    mantenedor_getOrigenAnimal: () =>
      dispatch('mantenedor/mantenedor_getOrigenAnimal'),
    mantenedor_getOrigenAnimalById: (id) =>
      dispatch('mantenedor/mantenedor_getOrigenAnimalById', id),
    mantenedor_getTipoDocumentacionAnimal: () =>
      dispatch('mantenedor/mantenedor_getTipoDocumentacionAnimal'),
    mantenedor_getTipoDocumentacionAnimalById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoDocumentacionAnimalById', id),
    mantenedor_getCausaMuerteAnimal: () =>
      dispatch('mantenedor/mantenedor_getCausaMuerteAnimal'),
    mantenedor_getCausaMuerteAnimalById: (id) =>
      dispatch('mantenedor/mantenedor_getCausaMuerteAnimalById', id),
    mantenedor_getSignosFuerzaVehiculo: () =>
      dispatch('mantenedor/mantenedor_getSignosFuerzaVehiculo'),
    mantenedor_getSignosFuerzaVehiculoById: (id) =>
      dispatch('mantenedor/mantenedor_getSignosFuerzaVehiculoById', id),
    mantenedor_getTieneHerramientasDentro: () =>
      dispatch('mantenedor/mantenedor_getTieneHerramientasDentro'),
    mantenedor_getTieneHerramientasDentroById: (id) =>
      dispatch('mantenedor/mantenedor_getTieneHerramientasDentroById', id),
    mantenedor_getEstadoVehiculo: () =>
      dispatch('mantenedor/mantenedor_getEstadoVehiculo'),
    mantenedor_getEstadoVehiculoById: (id) =>
      dispatch('mantenedor/mantenedor_getEstadoVehiculoById', id),
    mantenedor_getTipoProcedencia: () =>
      dispatch('mantenedor/mantenedor_getTipoProcedencia'),
    mantenedor_getTipoProcedenciaById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoProcedenciaById', id),
    mantenedor_getQuienRealizaAvaluo: () =>
      dispatch('mantenedor/mantenedor_getQuienRealizaAvaluo'),
    mantenedor_getQuienRealizaAvaluoById: (id) =>
      dispatch('mantenedor/mantenedor_getQuienRealizaAvaluoById', id),
    mantenedor_getTipoVehiculos: () =>
      dispatch('mantenedor/mantenedor_getTipoVehiculos'),
    mantenedor_getTipoVehiculosById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoVehiculosById', id),
    mantenedor_getTipoMarcaVehiculo: () =>
      dispatch('mantenedor/mantenedor_getTipoMarcaVehiculo'),
    mantenedor_getTipoMarcaVehiculoById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoMarcaVehiculoById', id),
    mantenedor_getTipoModeloVehiculo: (id) =>
      dispatch('mantenedor/mantenedor_getTipoModeloVehiculo', id),
    mantenedor_getTipoModeloVehiculoById: (id) =>
      dispatch('mantenedor/mantenedor_getTipoModeloVehiculoById', id),
    mantenedor_getEstacionaEn: () =>
      dispatch('mantenedor/mantenedor_getEstacionaEn'),
    mantenedor_getEstacionaEnById: (id) =>
      dispatch('mantenedor/mantenedor_getEstacionaEnById', id),
    mantenedor_getTipoDocumentoEspecie: () =>
      dispatch('mantenedor/mantenedor_getTipoDocumentoEspecie'),
    mantenedor_getAllTiposEspecie: () =>
      dispatch('mantenedor/mantenedor_getAllTiposEspecie'),

    // #region Actions Policia
    mantenedor_getPrefecturas: () =>
      dispatch('mantenedor/mantenedor_getPrefecturas'),
    mantenedor_getComisarias: () =>
      dispatch('mantenedor/mantenedor_getComisarias'),
    mantenedor_getDestacamentos: () =>
      dispatch('mantenedor/mantenedor_getDestacamentos'),
    mantenedor_getComisariasByIdPrefectura: (payload) =>
      dispatch('mantenedor/mantenedor_getComisariasByIdPrefectura', payload),
    mantenedor_getDestacamentosByIdComisaria: (payload) =>
      dispatch('mantenedor/mantenedor_getDestacamentosByIdComisaria', payload),
    mantenedor_getComisariasByIdPrefecturaCodigoInstitucion: (payload) =>
      dispatch(
        'mantenedor/mantenedor_getComisariasByIdPrefecturaCodigoInstitucion',
        payload
      ),

    // #region ACTIONS FISCALIAS
    mantenedor_getTipoFiscalia: () =>
      dispatch('mantenedor/mantenedor_getTipoFiscalia'),
    mantenedor_getRegiones: () => dispatch('mantenedor/mantenedor_getRegiones'),
    mantenedor_getComunas: () => dispatch('mantenedor/mantenedor_getComunas'),
    mantenedor_getComunasByIdRegion: (payload) =>
      dispatch('mantenedor/mantenedor_getComunasByIdRegion', payload),
    mantenedor_getNombreFiscalia: () =>
      dispatch('mantenedor/mantenedor_getNombreFiscalia'),
    mantenedor_getFiscaliaBycodigoTipoYRegion: (payload) =>
      dispatch('mantenedor/mantenedor_getFiscaliaBycodigoTipoYRegion', payload),
    mantenedor_getFiscaliaByIDFiscalia: (payload) =>
      dispatch('mantenedor/mantenedor_getFiscaliaByIDFiscalia', payload),
    mantenedor_getEspecialidadesFiscalia: () =>
      dispatch('mantenedor/mantenedor_getEspecialidadesFiscalia'),
    mantenedor_getFiscalias: (payload) =>
      dispatch('mantenedor/mantenedor_getFiscalias', payload),
    mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad: (payload) =>
      dispatch(
        'mantenedor/mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad',
        payload
      ),
    mantenedor_getFiscalById: (payload) =>
      dispatch('mantenedor/mantenedor_getFiscalById', payload),
    mantenedor_getjuzgados: () => dispatch('mantenedor/mantenedor_getjuzgados'),
    mantenedor_getAllFiscales: () =>
      dispatch('mantenedor/mantenedor_getAllFiscales'),
    // #endregion

    // #region Mantenedor Acciones
    mantenedor_getEstadoMedidaHito: () =>
      dispatch('mantenedor/mantenedor_getEstadoMedidaHito'),
    mantenedor_getTipoMedida: () =>
      dispatch('mantenedor/mantenedor_getTipoMedida'),
    mantenedor_getListadoMedidasCautelares: () =>
      dispatch('mantenedor/mantenedor_getListadoMedidasCautelares'),
    mantenedor_getListadoMedidasIntrusivas: () =>
      dispatch('mantenedor/mantenedor_getListadoMedidasIntrusivas'),
    mantenedor_getEstadoRelacionById: (payload) =>
      dispatch('mantenedor/mantenedor_getEstadoRelacionById', payload),
    mantenedor_getAllEstadoRelacion: () =>
      dispatch('mantenedor/mantenedor_getAllEstadoRelacion'),
    // #endregion

    // #region Documentos Adjuntos

    mantenedor_getTiposDocumentosAdjuntos: () => dispatch('mantenedor/mantenedor_getTiposDocumentosAdjuntos'),
    mantenedor_getNombresTipoDocumento: (payload) => dispatch('mantenedor/mantenedor_getNombresTipoDocumento', payload),
    mantenedor_getCategoriasDocumento: () => dispatch('mantenedor/mantenedor_getCategoriasDocumento'),

    // #endregion

    // #region COSAS QUE TENGO QUE HACER PORQUE ME DA PAJA ARREGLAR LA LOGICA DE LOS MANTENEDORES DE ACTIVIDAD
    mantenedor_getTiposActividad: () =>
      dispatch('mantenedor/mantenedor_getTiposActividad'),
    mantenedor_getSubtiposActividadList: () =>
      dispatch('mantenedor/mantenedor_getSubtiposActividadList'),
    mantenedor_getSubSubtiposActividadList: () =>
      dispatch('mantenedor/mantenedor_getSubSubtiposActividadList'),
    mantenedor_getListadoResultadoAutorizacion: () =>
      dispatch('mantenedor/mantenedor_getListadoResultadoAutorizacion'),
    // #endregion

    mantenedor_getTiposAutorizacionDiligencia: () =>
      dispatch('mantenedor/mantenedor_getTiposAutorizacionDiligencia'),

    mantenedor_getTiposPericia: () =>
      dispatch('mantenedor/mantenedor_getTiposPericia'),
    mantenedor_getTiposAutopsia: () =>
      dispatch('mantenedor/mantenedor_getTiposAutopsia'),
    mantenedor_getTiposExamenMedico: () =>
      dispatch('mantenedor/mantenedor_getTiposExamenMedico'),
    mantenedor_getTiposPruebaMedica: () =>
      dispatch('mantenedor/mantenedor_getTiposPruebaMedica'),
    mantenedor_getTiposAudiencias: () =>
      dispatch('mantenedor/mantenedor_getTiposAudiencias'),
    mantenedor_getTipoAudienciaById: (payload) => 
      dispatch('mantenedor/mantenedor_getTipoAudienciaById', payload),

    // GETTERS

    mantenedor_getIdTipoRespuestaBasicaByDescripcion: (descripcion) =>
      getters['mantenedor/mantenedor_getIdTipoRespuestaBasicaByDescripcion'](
        descripcion
      ),
    mantenedor_getDescripcionTipoRespuestaBasicaById: (idRespuesta) =>
      getters['mantenedor/mantenedor_getDescripcionTipoRespuestaBasicaById'](
        idRespuesta
      ),
    mantenedor_getCodigoTipoRespuestaBasicaById: (idRespuesta) =>
      getters['mantenedor/mantenedor_getCodigoTipoRespuestaBasicaById'](
        idRespuesta
      ),
    mantenedor_getIdTipoRespuestaBasicaByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdTipoRespuestaBasicaByCodigo'](codigo),
    mantenedor_getCodigoActividad: (idActividad) =>
      getters['mantenedor/mantenedor_getCodigoActividad'](idActividad),
    mantenedor_getCodigoActividadHijo: (idActividadHijo) =>
      getters['mantenedor/mantenedor_getCodigoActividadHijo'](idActividadHijo),
    mantenedor_getDescripcionActividadHijo: (idActividadHijo) =>
      getters['mantenedor/mantenedor_getDescripcionActividadHijo'](
        idActividadHijo
      ),
    mantenedor_getTipoDenunciaId: (tipoDenuncia) =>
      getters['mantenedor/mantenedor_getTipoDenunciaId'](tipoDenuncia),
    mantenedor_getTipoDenunciaNombreById: (idTipoDenuncia) =>
      getters['mantenedor/mantenedor_getTipoDenunciaNombreById'](
        idTipoDenuncia
      ),
    mantenedor_getTipoDenunciaByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getTipoDenunciaByCodigo'](codigo),
    mantenedor_getCodigoTipoDenunciaByNombre: (nombre) =>
      getters['mantenedor/mantenedor_getCodigoTipoDenunciaByNombre'](nombre),
    mantenedor_getTipoDenunciaIdByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getTipoDenunciaIdByCodigo'](codigo),

    // #region Getters Diligencias
    mantenedor_getNombreTipoDiligencia: (idTipoDiligencia) =>
      getters['mantenedor/mantenedor_getNombreTipoDiligencia'](
        idTipoDiligencia
      ),
    mantenedor_getCodigoTipoDiligencia: (idTipoDiligencia) =>
      getters['mantenedor/mantenedor_getCodigoTipoDiligencia'](
        idTipoDiligencia
      ),
    mantenedor_getNombreSubtipoDiligencia: (idSubtipoDiligencia) =>
      getters['mantenedor/mantenedor_getNombreSubtipoDiligencia'](
        idSubtipoDiligencia
      ),
    mantenedor_getNombreEstadoDiligencia: (idEstado) =>
      getters['mantenedor/mantenedor_getNombreEstadoDiligencia'](idEstado),
    mantenedor_getIdEstadoDiligenciaByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdEstadoDiligenciaByCodigo'](codigo),
    mantenedor_getNombreAmbitoDiligencia: (idAmbito) =>
      getters['mantenedor/mantenedor_getNombreAmbitoDiligencia'](idAmbito),
    mantenedor_getNombreInstitucion: (idInstitucion) =>
      getters['mantenedor/mantenedor_getNombreInstitucion'](idInstitucion),
    mantenedor_getCodigoInstitucionDiligencia: (idInstitucion) =>
      getters['mantenedor/mantenedor_getCodigoInstitucionDiligencia'](
        idInstitucion
      ),
    // #endregion

    // Getter Antecedentes Causa
    mantenedor_getDescripcionOrigenAntecedente: (idTipoAntecedente) =>
      getters['mantenedor/mantenedor_getDescripcionOrigenAntecedente'](
        idTipoAntecedente
      ),
    mantenedor_getNombreMotivoTransferenciaById: (idMotivoTransferencia) =>
      getters['mantenedor/mantenedor_getNombreMotivoTransferenciaById'](
        idMotivoTransferencia
      ),
    mantenedor_getCodigoMotivoTransferenciaById: (idMotivo) =>
      getters['mantenedor/mantenedor_getCodigoMotivoTransferenciaById'](
        idMotivo
      ),
    mantenedor_getNombreDecisionAsignacionByCodigo: (codigoDecision) =>
      getters['mantenedor/mantenedor_getNombreDecisionAsignacionByCodigo'](
        codigoDecision
      ),
    mantenedor_getNombreTipoAsignacionById: (idTipoAsignacion) =>
      getters['mantenedor/mantenedor_getNombreTipoAsignacionById'](
        idTipoAsignacion
      ),
    mantenedor_getNombreMotivoAgrupacionById: (idMotivoAgrupacion) =>
      getters['mantenedor/mantenedor_getNombreMotivoAgrupacionById'](
        idMotivoAgrupacion
      ),
    mantenedor_getDescripcionEstadoCausaById: (idEstadoCausa) =>
      getters['mantenedor/mantenedor_getDescripcionEstadoCausaById'](
        idEstadoCausa
      ),
    mantenedor_getDescripcionTipoTerminoById: (idTipoTermino) =>
      getters['mantenedor/mantenedor_getDescripcionTipoTerminoById'](
        idTipoTermino
      ),
    mantenedor_getDescripcionTipoSubterminoById: (idSubtipoTermino) =>
      getters['mantenedor/mantenedor_getDescripcionTipoSubterminoById'](
        idSubtipoTermino
      ),
    mantenedor_getResultadoConsultaTerminoById: (idResultadoConsulta) =>
      getters['mantenedor/mantenedor_getResultadoConsultaTerminoById'](
        idResultadoConsulta
      ),
    mantenedor_getDescripcionTipoSuspensionById: (idTipoSuspension) =>
      getters['mantenedor/mantenedor_getDescripcionTipoSuspensionById'](
        idTipoSuspension
      ),
    mantenedor_getDescripcionSubtipoSuspensionById: (idSubtipoSuspension) =>
      getters['mantenedor/mantenedor_getDescripcionSubtipoSuspensionById'](
        idSubtipoSuspension
      ),
    mantenedor_getDescripcionCondicionById: (idCondicion) =>
      getters['mantenedor/mantenedor_getDescripcionCondicionById'](idCondicion),

    mantenedor_getCodigoCondicionById: (idCondicion) =>
      getters['mantenedor/mantenedor_getCodigoCondicionById'](idCondicion),

    mantenedor_getDescripcionEvaluacionCumplimientosById: (idCumplimiento) =>
      getters[
        'mantenedor/mantenedor_getDescripcionEvaluacionCumplimientosById'
      ](idCumplimiento),

    mantenedor_getCodigoEvaluacionCumplimientosById: (idCumplimiento) =>
      getters['mantenedor/mantenedor_getCodigoEvaluacionCumplimientosById'](
        idCumplimiento
      ),

    mantenedor_getDescripcionMotivoDesestimacionById: (idMotivo) =>
      getters['mantenedor/mantenedor_getDescripcionMotivoDesestimacionById'](
        idMotivo
      ),

    // Getters Delitos
    mantenedor_getNombreFamiliaDelito: (idFamilia) =>
      getters['mantenedor/mantenedor_getNombreFamiliaDelito'](idFamilia),
    mantenedor_getIdFamiliaDelitoByIdPadreTipoDelito: (idPadre) =>
      getters['mantenedor/mantenedor_getIdFamiliaDelitoByIdPadreTipoDelito'](
        idPadre
      ),
    mantenedor_getNombreTipoDelito: (idTipoDelito) =>
      getters['mantenedor/mantenedor_getNombreTipoDelito'](idTipoDelito),
    mantenedor_getIdFamiliaDelitoByIdTipoDelito: (idTipoDelito) =>
      getters['mantenedor/mantenedor_getIdFamiliaDelitoByIdTipoDelito'](
        idTipoDelito
      ),
    mantenedor_getNombreTipoTransporteById: (idTipoTransporte) =>
      getters['mantenedor/mantenedor_getNombreTipoTransporteById'](
        idTipoTransporte
      ),
    mantenedor_getIdTipoFuncionarioByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdTipoFuncionarioByCodigo'](codigo),
    mantenedor_getNombreTipoFuncionarioById: (id) =>
      getters['mantenedor/mantenedor_getNombreTipoFuncionarioById'](id),
    mantenedor_getCodigoMediosComisionDelitosById: (id) =>
      getters['mantenedor/mantenedor_getCodigoMediosComisionDelitosById'](id),
    mantenedor_getDescripcionTipoLugarOcurrenciaById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionTipoLugarOcurrenciaById'](
        id
      ),
    // Getters Especies/Dinero
    mantenedor_getNombreFamiliaEspecie: (idFamiliaEspecie) =>
      getters['mantenedor/mantenedor_getNombreFamiliaEspecie'](
        idFamiliaEspecie
      ),
    mantenedor_getCodigoFamiliaEspecieById: (idFamiliaEspecie) =>
      getters['mantenedor/mantenedor_getCodigoFamiliaEspecieById'](
        idFamiliaEspecie
      ),
    mantenedor_getNombreTipoEspecie: (idTipoEspecie) =>
      getters['mantenedor/mantenedor_getNombreTipoEspecie'](idTipoEspecie),
    mantenedor_getNombreMoneda: (idTipoMoneda) =>
      getters['mantenedor/mantenedor_getNombreMoneda'](idTipoMoneda),
    mantenedor_getNombreDenominacionDinero: (idDenominacion) =>
      getters['mantenedor/mantenedor_getNombreDenominacionDinero'](
        idDenominacion
      ),
    mantenedor_getNombreTipoDinero: (idTipoDinero) =>
      getters['mantenedor/mantenedor_getNombreTipoDinero'](idTipoDinero),
    mantenedor_getNombreAmbitoEspecie: (idAmbito) =>
      getters['mantenedor/mantenedor_getNombreAmbitoEspecie'](idAmbito),
    mantenedor_getCodigoAmbitoEspecieById: (idAmbito) =>
      getters['mantenedor/mantenedor_getCodigoAmbitoEspecieById'](idAmbito),
    mantenedor_getDescripcionTipoEspecie: (idTipoEspecie) =>
      getters['mantenedor/mantenedor_getDescripcionTipoEspecie'](idTipoEspecie),
    mantenedor_getCodigoFamiliaEspecie: (idFamiliaEspecie) =>
      getters['mantenedor/mantenedor_getCodigoFamiliaEspecie'](
        idFamiliaEspecie
      ),
    mantenedor_getDescripcionClasesPeligroEspeciesById: (idClasePeligrosa) =>
      getters['mantenedor/mantenedor_getDescripcionClasesPeligroEspeciesById'](
        idClasePeligrosa
      ),

    // Getters Sujetos Intervinientes
    mantenedor_getCodigoTipoDocumentoIdentidad: (idDocumentacion) =>
      getters['mantenedor/mantenedor_getCodigoTipoDocumentoIdentidad'](
        idDocumentacion
      ),
    mantenedor_getNombreTipoSujeto: (codigo) =>
      getters['mantenedor/mantenedor_getNombreTipoSujeto'](codigo),
    mantenedor_getCodigoTipoContactoById: (codigo) =>
      getters['mantenedor/mantenedor_getCodigoTipoContactoById'](codigo),
    mantenedor_getIdTipoContactoByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdTipoContactoByCodigo'](codigo),
    mantenedor_getCodigoTipoSujeto: (id) =>
      getters['mantenedor/mantenedor_getCodigoTipoSujeto'](id),
    mantenedor_getIdTipoSujetoByCodigo: (id) =>
      getters['mantenedor/mantenedor_getIdTipoSujetoByCodigo'](id),
    mantenedor_getTipoPersonaById: (id) =>
      getters['mantenedor/mantenedor_getTipoPersonaById'](id),
    mantenedor_getTipoPersonaIdByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getTipoPersonaIdByCodigo'](codigo),
    mantenedor_getIdPaisByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdPaisByCodigo'](codigo),
    mantenedor_getIdTipoDocumentoIdentidadByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdTipoDocumentoIdentidadByCodigo'](
        codigo
      ),
    mantenedor_getIdentidadDeGeneroNombreById: (id) =>
      getters['mantenedor/mantenedor_getIdentidadDeGeneroNombreById'](id),
    mantenedor_getIdTipoSexoByDescripcion: (descripcion) =>
      getters['mantenedor/mantenedor_getIdTipoSexoByDescripcion'](descripcion),
    mantenedor_getIdTipoSexoByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdTipoSexoByCodigo'](codigo),
    mantenedor_getDescripcionTipoSexoById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionTipoSexoById'](id),
    mantenedor_getTipoDireccionById: (id) =>
      getters['mantenedor/mantenedor_getTipoDireccionById'](id),
    mantenedor_getIdTipoDireccionByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdTipoDireccionByCodigo'](codigo),
    mantenedor_getIdTipoDireccionByDescripcion: (descripcion) =>
      getters['mantenedor/mantenedor_getIdTipoDireccionByDescripcion'](
        descripcion
      ),
    mantenedor_getIdRegionByNombre: (nombre) =>
      getters['mantenedor/mantenedor_getIdRegionByNombre'](nombre),
    mantenedor_getIdComunaByNombre: (nombre) =>
      getters['mantenedor/mantenedor_getIdComunaByNombre'](nombre),
    mantenedor_getEstadoCivilDescripcionById: (id) =>
      getters['mantenedor/mantenedor_getEstadoCivilDescripcionById'](id),
    mantenedor_getTipoNnaResponsableByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getTipoNnaResponsableByCodigo'](codigo),
    mantenedor_getIdParentescoByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdParentescoByCodigo'](codigo),
    mantenedor_getIdTipoInstitucionPertenecienteByCodigo: (codigo) =>
      getters[
        'mantenedor/mantenedor_getIdTipoInstitucionPertenecienteByCodigo'
      ](codigo),
    mantenedor_getCodigoDiscapacidadById: (id) =>
      getters['mantenedor/mantenedor_getCodigoDiscapacidadById'](id),
    mantenedor_getIdDiscapacidadByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdDiscapacidadByCodigo'](codigo),
    mantenedor_getDescripcionRelacionSujetosById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionRelacionSujetosById'](id),
    mantenedor_getDescripcionCausaDetencionById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionCausaDetencionById'](id),
    // Getters Fiscalia
    mantenedor_getNombreJuzgado: (id) =>
      getters['mantenedor/mantenedor_getNombreJuzgado'](id),

    mantenedor_getTiposFiscaliaById: (codigo) =>
      getters['mantenedor/mantenedor_getTiposFiscaliaById'](codigo),
    mantenedor_getIdTiposFiscaliaByCodigoFiscalia: (codigo) =>
      getters['mantenedor/mantenedor_getIdTiposFiscaliaByCodigoFiscalia'](
        codigo
      ),
    mantenedor_getCodigoTiposFiscaliaById: (id) =>
      getters['mantenedor/mantenedor_getCodigoTiposFiscaliaById'](id),
    mantenedor_getIdTiposFiscaliaByDescripcion: (descripcion) =>
      getters['mantenedor/mantenedor_getIdTiposFiscaliaByDescripcion'](
        descripcion
      ),
    mantenedor_getCodigoRegionById: (id) =>
      getters['mantenedor/mantenedor_getCodigoRegionById'](id),
    mantenedor_getIdRegionByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdRegionByCodigo'](codigo),
    mantenedor_getDescripcionRegionById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionRegionById'](id),
    mantenedor_getNombreFiscaliaById: (id) =>
      getters['mantenedor/mantenedor_getNombreFiscaliaById'](id),
    mantenedor_getNombreFiscaliaByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getNombreFiscaliaByCodigo'](codigo),
    mantenedor_getIdFiscaliaByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdFiscaliaByCodigo'](codigo),
    mantenedor_getCodigoFiscaliaById: (id) =>
      getters['mantenedor/mantenedor_getCodigoFiscaliaById'](id),

    mantenedor_getCodigoInstitucionesDenunciaById: (id) =>
      getters['mantenedor/mantenedor_getCodigoInstitucionesDenunciaById'](id),
    mantenedor_getNombreInstitucionesDenunciaById: (id) =>
      getters['mantenedor/mantenedor_getNombreInstitucionesDenunciaById'](id),
    mantenedor_getCodigoUnidadPolicialById: (id) =>
      getters['mantenedor/mantenedor_getCodigoUnidadPolicialById'](id),
    mantenedor_getDescripcionUnidadPolicialById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionUnidadPolicialById'](id),
    mantenedor_getDescripcionComunasById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionComunasById'](id),
    mantenedor_getDescripcionEspecialidadFiscalia: (id) =>
      getters['mantenedor/mantenedor_getDescripcionEspecialidadFiscalia'](id),

    // #end-region

    // Getters Documentos Adjuntos
    mantenedor_getDescripciontiposDocumentosAdjuntosById: (id) =>
      getters[
        'mantenedor/mantenedor_getDescripciontiposDocumentosAdjuntosById'
      ](id),
    mantenedor_getDescripcionNombresTipoDocumentoById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionNombresTipoDocumentoById'](
        id
      ),

    // Getters Medidas
    mantenedor_getIdEstadoRelacionByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdEstadoRelacionByCodigo'](codigo),
    mantenedor_getDescripcionMedidasCautelaresById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionMedidasCautelaresById'](id),
    mantenedor_getDescripcionEstadoRelacionById: (id) =>
      getters['mantenedor/mantenedor_getDescripcionEstadoRelacionById'](id),
    // #region COSAS QUE TENGO QUE HACER PORQUE ME DA PAJA ARREGLAR LA LOGICA DE LOS MANTENEDORES DE ACTIVIDAD
    mantenedor_getIdTipoOrigenActividadByCodigo: (codigo) =>
      getters['mantenedor/mantenedor_getIdTipoOrigenActividadByCodigo'](codigo),
    mantenedor_getNombreTipoActividadById: (idTipoActividad) =>
      getters['mantenedor/mantenedor_getNombreTipoActividadById'](
        idTipoActividad
      ),
    mantenedor_getNombreSubtipoActividadById: (idSubtipoActividad) =>
      getters['mantenedor/mantenedor_getNombreSubtipoActividadById'](
        idSubtipoActividad
      ),
    mantenedor_getNombreSubSubtipoActividadById: (idSubSubtipoActividad) =>
      getters['mantenedor/mantenedor_getNombreSubSubtipoActividadById'](
        idSubSubtipoActividad
      ),
    // #endregion

    // #end-region

    // MUTATIONS DILIGENCIAS
    mantenedor_RESET_SUB_SUBTIPOS_ACTIVIDAD: () => {
      commit('mantenedor/mantenedor_RESET_SUB_SUBTIPOS_ACTIVIDAD')
    },

    // MUTATIONS DILIGENCIAS
    mantenedor_SET_ACTIVIDADES_SUBTIPO_DEFAULT: () => {
      commit('mantenedor/mantenedor_SET_ACTIVIDADES_SUBTIPO_DEFAULT')
    },
    // MUTATIONS EyD
    mantenedor_SET_DEFAULT_STATE_TIPO_MODELO_VEHICULO: () => {
      commit('mantenedor/mantenedor_SET_DEFAULT_STATE_TIPO_MODELO_VEHICULO')
    },

    // MUTATIONS PARA NOMBRE TIPOSESPECIES EN TABLA
    mantenedor_SET_TIPOS_ESPECIES: (_tiposEspecies) => {
      commit('mantenedor/mantenedor_SET_TIPOS_ESPECIES')
    },

    mantenedor_RESET_ATRIBUTOS: () => {
      commit('mantenedor/mantenedor_RESET_ATRIBUTOS')
    }
  }
}
