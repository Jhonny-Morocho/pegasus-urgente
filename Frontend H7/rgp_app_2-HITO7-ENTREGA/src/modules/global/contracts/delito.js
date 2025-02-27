import { dateTimeUtil } from '@/utils'

/**
 * @param {Object} data formData que contiene los datos del v-model
 * @returns {Object} payload para utilizar en requestUtil (contrato)
 *
 * toma la data del formData y rellena el contrato, retornándolo
 */
export const generateDelitoContract = (data) => {
  return {
    idProcedimiento: data.idProcedimiento,
    idDenunciaHechoDelictual: data.idDenunciaHechoDelictual,
    idDetalleDenunciaHechoDelictualDireccion: data.idDetalleDenunciaHechoDelictualDireccion,
    idTipoDenuncia: data.idTipoDenuncia,
    idOrigen: data.idOrigen,
    idOrganismoColaboradorUnidad: data.idOrganismoColaboradorUnidad,
    idDenuncia: data.idDenuncia,
    idDetalleHechoDelictual: data.idDetalleHechoDelictual,
    idFiscalia: data.idFiscalia,
    numeroDenuncia: data.numeroDenuncia,
    idTipo: data.idTipo,
    idEstado: data.idEstado,
    delito: {
      idDenuncia: data.idDenunciaDelito,
      familiaDelito: data.familiaDelito,
      idFamiliaDelito: data.idFamiliaDelito,
      tipoDelito: data.delitoDenunciado,
      idTipoDelito: data.idTipoDelito,
      delitoDenunciado: data.delitoDenunciado,
      idDelitoDenunciado: data.idTipoDelito,
      descripcionDelito: data.descripcionDelito
    },
    informacionAnonima: {
      idDenuncia: data.idDenunciaInfoAnonima,
      esInformacionAnonima: data.esInformacionAnonima,
      programaRazonAnonimato: data.programaRazonAnonimato,
      viaInformacionAportada: data.viaInformacionAportada
    },
    lugarDelito: {
      idDelito: data.idDelito,
      zonaDelito: data.zonaDelito,
      tipoLugarOcurrencia: data.tipoLugarOcurrencia,
      viaIngreso: data.viaIngreso,
      lugarOcurrencia: data.lugarOcurrencia,
      lugarEspecificoOcurrencia: data.lugarEspecificoOcurrencia
    },
    clasificacionDelito: {
      idDenuncia: data.idDenunciaClasificacion,
      gradoEjecucionDelito: data.gradoEjecucionDelito,
      problemaDelictualFenomenoCriminal: data.problemaDelictualFenomenoCriminal,
      patronCriminal: data.patronCriminal,
      modusOperandi: data.modusOperandi,
      subModusOperandi: data.subModusOperandi
    },
    fechaHoraRango: data.fechaHoraRango,
    fechaOcurrencia: data.fechaHoraRango
      ? data.fechaOcurrencia
      : dateTimeUtil.formatToBackendWithTime(data.fechaOcurrencia),
    fechaHoraDelitoInicio: data.fechaHoraRango
      ? dateTimeUtil.formatToBackendWithTime(data.fechaHoraDelitoInicio)
      : data.fechaHoraDelitoInicio,
    fechaHoraDelitoFin: data.fechaHoraRango
      ? dateTimeUtil.formatToBackendWithTime(data.fechaHoraDelitoFin)
      : data.fechaHoraDelitoFin,
    esFlagrante: data.esFlagrante,
    elementoUsado: {
      idDenuncia: data.idDenunciaElemento,
      tipoElementoUsado: data.tipoElementoUsado,
      elementoUsado: data.elementoUsado
    },
    esHallazgo: data.esHallazgo,
    tipoHallazgo: data.tipoHallazgo,
    mediosTransportes: data.mediosTransporte,
    existenLesionados: data.existenLesionados,
    existenMuertos: data.existenMuertos,
    existenDetenidos: data.existenDetenidos,
    informacionCamara: {
      idDenuncia: data.idDenunciaInfoCamara,
      existeCamara: data.existeCamara,
      incautaronImagenes: data.incautaronImagenes,
      lugarCamara: data.lugarCamara,
      contenidoCamara: data.contenidoCamara,
      observacionAdicionalCamara: data.observacionAdicionalCamara
    },
    vigilancia: {
      idDenuncia: data.idDenunciaVigilancia,
      tipoVigilancia: data.tipoVigilancia,
      medidasSeguridad: data.medidasSeguridad
    },
    sujeto: {
      idDenuncia: data.idDenunciaSujeto,
      cantidadSujetosCometieronHechoDelictual: data.cantidadSujetosCometieronHechoDelictual,
      modalidadGrupo: data.modalidadGrupo
    },
    ambitoNNA: {
      idDenuncia: data.idDenunciaAmbitoNna,
      nnaSeNiegaSepararAdulto: data.nnaSeNiegaSepararAdulto,
      describirConductasNNA: data.describirConductasNNA
    },
    entregaDetenidosPorCiviles: data.entregaDetenidosPorCiviles,
    esAccidenteTransito: data.esAccidenteTransito,
    esIncendio: data.esIncendio,
    vif: data.vif,
    direccionDelito: {
      idDireccion: data.idDireccion,
      idDenuncia: data.idDenunciaDireccion,
      idDetalleDenunciaHechoDelictualDireccion: data.idDetalleDenunciaHechoDelictualDireccion,
      calle: data.calle,
      numero: data.numero,
      departamentoOficina: data.departamentoOficina,
      block: data.block,
      poblacionVilla: data.poblacionVilla,
      sector: data.sector,
      ciudad: data.ciudad,
      comuna: data.comuna,
      region: data.region,
      interseccion: data.interseccion,
      cuadrante: data.cuadrante,
      observacionReferencia: data.observacionReferencia,
      lugarEspecifico: data.lugarEspecifico,
      latitud: data.latitud !== '' ? data.latitud : '-33.443476',
      longitud: data.longitud !== '' ? data.longitud : '-70.681056',
      esPrincipal: data.esPrincipal,
      ubicacionRural: data.ubicacionRural,
      idTipoDireccion: data.idTipoDireccion,
      idContactoDueno: data?.idContactoDueno
    },
    relacionSujeto: {
      idDenuncia: data.idDenuncia,
      idTipoSujetoDenunciante: data.idTipoSujetoDenunciante,
      idTipoSujetoVictima: data.idTipoSujetoVictima,
      idTipoSujetoImputado: data.idTipoSujetoImputado
    },
    antecedentesForm: {
      tipoAntecedente: data.tipoAntecedente,
      nombreArchivo: data.nombreArchivo,
      descripcionArchivo: data.descripcionArchivo,
      tipoArchivo: data.tipoArchivo,
      extensionArchivo: data.extensionArchivo,
      tamanoArchivo: data.tamanoArchivo,
      ubicacionArchivo: data.ubicacionArchivo,
      origen: data.origen,
      formatoActual: data.formatoActual,
      relacionFront: data.relacionFront,
      version: data.version,
      fotografiasVideos: data.fotografiasVideos,
      idRelacion: data.idRelacion,
      idTipoRelacion: data.idTipoRelacion
    }
  }
}

/**
 * @param {Object} contract Contrato de backend
 * @param {Object} target formData con v-model a llenar
 *
 *
 * Descripcion:
 * Toma el contrato de backend y asigna los datos correspondientes al v-model del formData.
 */
export const populateDelito = (contract, target) => {
  const { clasificacionDelito, informacionAnonima, delito, direccionDelito, elementoUsado, informacionCamara, lugarDelito, sujeto, vigilancia, ambitoNNA, relacionSujeto, antecedentesForm } = contract

  const formData = {
    idProcedimiento: contract.idProcedimiento,
    idDenunciaHechoDelictual: contract.idDenunciaHechoDelictual,
    idDetalleDenunciaHechoDelictualDireccion: contract.idDetalleDenunciaHechoDelictualDireccion,
    idTipoDenuncia: contract.idTipoDenuncia,
    idOrigen: contract.idOrigen,
    idOrganismoColaboradorUnidad: contract.idOrganismoColaboradorUnidad,
    idDenuncia: contract.idDenuncia,
    idDetalleHechoDelictual: contract.idDetalleHechoDelictual,
    idFiscalia: contract.idFiscalia,
    numeroDenuncia: contract.numeroDenuncia,
    gradoEjecucionDelito: clasificacionDelito?.gradoEjecucionDelito,
    problemaDelictualFenomenoCriminal: clasificacionDelito?.problemaDelictualFenomenoCriminal,
    idDenunciaClasificacion: clasificacionDelito?.idDenuncia,
    patronCriminal: clasificacionDelito?.patronCriminal,
    modusOperandi: clasificacionDelito?.modusOperandi,
    subModusOperandi: clasificacionDelito?.subModusOperandi,
    idDenunciaInfoAnonima: informacionAnonima?.idDenuncia,
    esInformacionAnonima: informacionAnonima?.esInformacionAnonima,
    programaRazonAnonimato: informacionAnonima?.programaRazonAnonimato,
    viaInformacionAportada: informacionAnonima?.viaInformacionAportada,
    fechaHoraRango: contract.fechaHoraRango,
    fechaOcurrencia: contract.fechaHoraRango
      ? contract.fechaOcurrencia
      : dateTimeUtil.formatFromBackendToModel(contract.fechaOcurrencia),
    fechaHoraDelitoInicio: contract.fechaHoraRango
      ? dateTimeUtil.formatFromBackendToModel(contract.fechaHoraDelitoInicio)
      : contract.fechaHoraDelitoInicio,
    fechaHoraDelitoFin: contract.fechaHoraRango
      ? dateTimeUtil.formatFromBackendToModel(contract.fechaHoraDelitoFin)
      : contract.fechaHoraDelitoFin,
    esFlagrante: contract.esFlagrante,
    idDenunciaDelito: delito.idDenuncia,
    idFamiliaDelito: delito.idFamiliaDelito,
    familiaDelito: delito.familiaDelito,
    idTipoDelito: delito.idTipoDelito || delito?.idDelitoDenunciado,
    tipoDelito: delito?.tipoDelito || delito?.delitoDenunciado,
    idDelitoDenunciado: delito?.idDelitoDenunciado || delito?.idTipoDelito,
    delitoDenunciado: delito?.delitoDenunciado || delito?.tipoDelito,
    descripcionDelito: delito.descripcionDelito,
    // codigoDelitoCarabineros: delito.codigoDelitoCarabineros,
    idDireccion: direccionDelito?.idDireccion,
    idTipoDireccion: direccionDelito?.idTipoDireccion,
    idContactoDueno: direccionDelito?.idContactoDueno,
    idDenunciaDireccion: direccionDelito?.idDenuncia,
    calle: direccionDelito?.calle,
    numero: direccionDelito?.numero,
    departamentoOficina: direccionDelito?.departamentoOficina,
    block: direccionDelito?.block,
    poblacionVilla: direccionDelito?.poblacionVilla,
    sector: direccionDelito?.sector,
    ciudad: direccionDelito?.ciudad,
    comuna: direccionDelito?.comuna,
    region: direccionDelito?.region,
    interseccion: direccionDelito?.interseccion,
    cuadrante: direccionDelito?.cuadrante,
    observacionReferencia: direccionDelito?.observacionReferencia,
    lugarEspecifico: direccionDelito?.lugarEspecifico,
    latitud: direccionDelito?.latitud,
    longitud: direccionDelito?.longitud,
    esPrincipal: direccionDelito?.esPrincipal,
    ubicacionRural: direccionDelito?.ubicacionRural,
    idDenunciaElemento: elementoUsado?.idDenuncia,
    tipoElementoUsado: elementoUsado?.tipoElementoUsado,
    elementoUsado: elementoUsado?.elementoUsado,
    esHallazgo: contract.esHallazgo,
    tipoHallazgo: contract.tipoHallazgo,
    idDenunciaInfoCamara: informacionCamara.idDenuncia,
    existeCamara: informacionCamara.existeCamara,
    incautaronImagenes: informacionCamara.incautaronImagenes,
    lugarCamara: informacionCamara.lugarCamara,
    contenidoCamara: informacionCamara.contenidoCamara,
    observacionAdicionalCamara: informacionCamara.observacionAdicionalCamara,
    idDelito: lugarDelito.idDelito,
    zonaDelito: lugarDelito.zonaDelito,
    tipoLugarOcurrencia: lugarDelito.tipoLugarOcurrencia,
    viaIngreso: lugarDelito.viaIngreso,
    lugarOcurrencia: lugarDelito.lugarOcurrencia,
    lugarEspecificoOcurrencia: lugarDelito.lugarEspecificoOcurrencia,
    idDenunciaSujeto: sujeto.idDenuncia,
    cantidadSujetosCometieronHechoDelictual: sujeto.cantidadSujetosCometieronHechoDelictual,
    modalidadGrupo: sujeto.modalidadGrupo,
    idDenunciaVigilancia: vigilancia?.idDenuncia,
    tipoVigilancia: vigilancia?.tipoVigilancia,
    medidasSeguridad: vigilancia?.medidasSeguridad,
    idDenunciaAmbitoNna: ambitoNNA.idDenuncia,
    nnaSeNiegaSepararAdulto: ambitoNNA.nnaSeNiegaSepararAdulto,
    describirConductasNNA: ambitoNNA.describirConductasNNA,
    entregaDetenidosPorCiviles: contract.entregaDetenidosPorCiviles,
    esAccidenteTransito: contract.esAccidenteTransito,
    esIncendio: contract.esIncendio,
    vif: contract.vif,
    existenLesionados: contract.existenLesionados,
    existenMuertos: contract.existenMuertos,
    existenDetenidos: contract.existenDetenidos,
    idTipo: contract.idTipo,
    idEstado: contract.idEstado,
    idTipoSujetoDenunciante: relacionSujeto?.idTipoSujetoDenunciante,
    idTipoSujetoVictima: relacionSujeto?.idTipoSujetoVictima,
    idTipoSujetoImputado: relacionSujeto?.idTipoSujetoImputado,
    tipoAntecedente: antecedentesForm?.tipoAntecedente,
    nombreArchivo: antecedentesForm?.nombreArchivo,
    descripcionArchivo: antecedentesForm?.descripcionArchivo,
    tipoArchivo: antecedentesForm?.tipoArchivo,
    extensionArchivo: antecedentesForm?.extensionArchivo,
    tamanoArchivo: antecedentesForm?.tamanoArchivo,
    ubicacionArchivo: antecedentesForm?.ubicacionArchivo,
    origen: antecedentesForm?.origen,
    formatoActual: antecedentesForm?.formatoActual,
    relacionFront: antecedentesForm?.relacionFront,
    version: antecedentesForm?.version,
    fotografiasVideos: antecedentesForm?.fotografiasVideos,
    idRelacion: antecedentesForm?.idRelacion,
    idTipoRelacion: antecedentesForm?.idTipoRelacion
  }

  Object.assign(target, formData)
}

export const populateDelitoDFisica = (contract, target) => {
  console.log(contract)
  const { delito, direccionDelito, clasificacionDelito, elementoUsado, sujeto, vigilancia, ambitoNNA } = contract
  const formData = {
    idTipoDenuncia: contract.idTipoDenuncia,
    idOrigen: contract.idOrigen,
    fechaOcurrencia: contract.fechaHoraRango
      ? contract.fechaOcurrencia
      : dateTimeUtil.formatFromBackendToModel(contract.fechaOcurrencia),
    idDenunciaHechoDelictual: contract.idDenunciaHechoDelictual,
    idDenuncia: contract.idDenuncia,
    idDetalleHechoDelictual: contract.idDetalleHechoDelictual,
    idFamiliaDelito: delito?.idFamiliaDelito,
    idTipoDelito: delito?.idTipoDelito || delito?.idDelitoDenunciado,
    idTipo: contract.idTipo,
    idEstado: contract.idEstado,
    idDenunciaDelito: delito?.idDenuncia,
    idDenunciaDireccion: direccionDelito?.idDenuncia,
    idDenunciaClasificacion: clasificacionDelito?.idDenuncia,
    idDenunciaElemento: elementoUsado?.idDenuncia,
    idDenunciaSujeto: sujeto?.idDenuncia,
    idDenunciaVigilancia: vigilancia?.idDenuncia,
    idDenunciaAmbitoNna: ambitoNNA?.idDenuncia
  }

  Object.assign(target, formData)
}
