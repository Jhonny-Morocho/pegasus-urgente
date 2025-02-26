import { format } from '@fiquu/cl-rut'
import { appUtil } from '@/utils'

/**
 * @param {Object} data formData que contiene los datos del v-model
 * @returns {Object} payload para utilizar en requestUtil (contrato)
 *
 * toma la data del formData y rellena el contrato, retornÃ¡ndolo
 */

export const generateSujetoContract = (data) => {
  let numeroDocumentoRut
  if (
    data.codigoTipoDocumentoIdentificacion === '1' ||
    data.codigoTipoDocumento === '1'
  ) {
    numeroDocumentoRut = appUtil.rutFormatToBack(
      data?.numeroDocumentoIdentificacion
    )
  }

  return {
    idDenuncia: data?.idDenuncia,
    tipoSujeto: data?.tipoSujeto,
    representaInstitucion: data?.representaInstitucion,
    interviniente: {
      idRelacionSujeto: data?.idRelacionSujeto,
      estadoMigratorio: data?.estadoMigratorio,
      persona: {
        tieneOrdenDetencionVigente: data?.tieneOrdenDetencionVigente,
        idPersona: data?.idPersona ? data?.idPersona : undefined,
        esReservado: data?.reservaTestigo,
        ciudadNacimiento: data?.ciudadNacimiento,
        fechaNacimiento: data?.fechaNacimiento,
        esNN: data?.esNn,
        esIdentidadValidada: data?.esIdentidadValidada,
        esNecesitaInterprete: data?.esNecesidadInterprete,
        esReservaDeDatos: data?.esReservaDeDatos,
        esMenorDeEdad: data?.esMenorDeEdad,
        esFuncionarioPublico: data?.esFuncionarioPublico
      },
      identificacion: {
        tipoDocumento: data?.tipoDocumentoIdentificacion,
        paisEmisorDocumento: data?.paisDocumentoIdentificacion,
        numeroDocumento:
          numeroDocumentoRut ||
          data?.numeroDocumentoIdentificacion.replaceAll('.', ''),
        huella: 'string' // data.huella rompen el endpoint
      },
      nombre: {
        nombres: data?.nombres,
        primerApellido: data?.apellidoPaterno,
        segundoApellido: data?.apellidoMaterno,
        aliasApelativo: data?.aliasApelativo,
        nombreSocial: data?.nombreSocial
      },
      esConfidencial: data?.esConfidencial,
      nacionalidad: data?.nacionalidad,
      idioma: data?.idioma,
      sexo: {
        sexoDeclarado: data?.identidadGenero,
        sexoBiologico: data?.sexoRegistral
      },
      pueblosOriginarios: data?.pueblosOriginarios,
      profesionOficioOcupacion: data?.profesionOficioOcupacion || '',
      estadoCivil: data?.estadoCivil,
      escolaridad: data?.escolaridad,
      tipoDiscapacidad: data?.tipoDiscapacidad,
      conQuienVive: data.conQuienVive
        ? {
          idTipoConviviente: data?.conQuienVive,
          especificacion: data?.especifiqueConQuienVive
        }
        : null,
      esRPA: data?.esRPA,

      documentoOrdenDetencion: 'dfgdf',
      cargoFuncionarioPublico: data?.cargoFuncionarioPublico,
      institucionFuncionarioPublico: data?.institucionFuncionarioPublico,
      conoceImputado: data.conoceImputado,
      // No eliminar
      /*         ? {
          idRelacionDescrito: data?.relacionConImputado,
          descripcion: data?.conoceImputadoDescripcion
        }
        : null, */
      conoceTestigo: data.conoceTestigo,
      // No eliminar
      /*  ? {
          nombreDescrito: data?.conoceTestigoNombre
        }
        : null, */
      estadoSalud: {
        estadoTemperancia: data?.estadoTemperancia,
        esLesionado: data?.presentaLesiones,
        dau: data?.dau,
        descripcionLesion: data?.descripcionLesion,
        origenLesion: data?.origenLesiones,
        quedaHospitalizado: data?.quedoHospitalizado,
        idOrganismoSalud: data?.idOrganismoSalud,
        indicadorConsumoDrogas: data?.indicadorConsumoDrogas,
        nombreCompletoMedico: data?.nombresMedico,
        rutMedico: appUtil.rutFormatToBack(data.rutMedicoTratante) || ''
      },
      declaracion: data?.declaracion,
      tipoVictima: data?.tipoVictima || '',
      fueRestringidoDeLibertad: data?.fueRestringidoDeLibertad,
      seInformoAlTribunalFamilia: data?.seInformoAlTribunalFamilia,
      esVictima: data?.esVictima,
      nnaEsAdultoProtector: data?.nnaEsAdultoProtector,
      idNnaParentesco: data?.idNnaParentesco,
      nnaAQuienContoHechos: data?.nnaAQuienContoHechos,
      nnaComoSupoHechos: data?.nnaComoSupoHechos,
      esNNA: data?.esNNA,
      requiereFormularioRiesgoNNA: data?.requiereFormularioRiesgoNNA,
      formularioRiesgoNNA: data?.requiereFormularioRiesgoNNA,
      requierePautaVIF: data?.requierePautaVIF,
      medidasProteccion: data.pidioMedidasDeProteccion
        ? {
          idsMedidas: data?.medidasProteccion?.idsMedidas.join(',') // TEMPORAL PARA SIEMPRE?
        }
        : null,
      detencion: {
        lugarDetencion: data?.lugarDetencion,
        destinoImputado: data?.destinoImputado,
        estaDetenido: data?.estaDetenido,
        causaDetencion: data?.causaDetencion,
        fechaHoraDetencion: data?.fechaHoraDetencion,
        regionDeDetencion: data?.regionDeDetencion,
        comunaDeDetencion: data?.comunaDeDetencion,
        calleDetencion: data?.calleDetencion,
        numeroCalledetencion: data?.numeroCalledetencion,
        poblacionDetencion: data?.poblacionDetencion,
        tipoViviendaDetencion: data?.tipoViviendaDetencion,
        cuadranteDetencion: data?.cuadranteDetencion,
        sectorDetencion: data?.sectorDetencion,
        blockDetencion: data?.blockDetencion,
        interseccionDetencion: data?.interseccionDetencion,
        referenciaDetencion: data?.referenciaDetencion,
        pasaControlDetencion: data?.pasaControlDetencion
      },
      rolHechoDelictual: data?.rolHechoDelictual,
      perfilImputado: data?.perfilImputado,
      muertesBajoCustodia: data?.muertesBajoCustodia,
      quienAplicoFuerza: data?.seAplicoFuerza
        ? {
          idOrganismoPertenecienteRol: data?.idOrganismoPertenecienteRol,
          rutQuienUtilizoFuerza:
              appUtil.rutFormatToBack(data?.rutQuienUtilizoFuerza) || '',
          nombreCompleto: data?.nombresQuienAplicoFuerza,
          descripcionQuienAplico: data?.descripcionQuienAplico,
          tipoTelefono: data?.tipoTelefono,
          telefono: data?.telefonoQuienAplicoFuerza,
          correoElectronico: data?.correoElectronicoQuienAplicoFuerza
        }
        : null,
      fuenteInformacion: data?.fuenteInformacion,
      tipoTestigo: data?.tipoTestigo,
      representante: data?.esAbogado
        ? {
          tipoSujetoQueRepresenta: data?.tipoSujetoQueRepresenta,
          tipoInstitucion: data?.tipoInstitucionQuePertenece,
          nombreInstitucion: data?.nombreInstitucionQuePertenece,
          acreditacion: data?.comoAcreditaRepresentacion,
          nombreRepresentado: data?.nombreDelRepresentado,
          apellidoRepresentado: data?.apellidoDelRepresentado
        }
        : null,
      tipoContacto: data?.infoTipoContacto,
      telefonoFijoContacto: data?.telefonoFijoContacto,
      telefonoMovilContacto: data?.telefonoMovilContacto,
      correoElectronicoContacto: data?.correoElectronicoContacto,
      indicadorDireccionNotificacion: data?.indicadorDireccionNotificacion,
      redSocial: {
        operador: data?.redesSociales,
        identificador: data?.cualesRedesSociales
      },
      aquienEntrego: data?.aQuienEntrego
    },
    intervinienteJuridico: {
      idPersonaJuridica: data?.idPersonaJuridica,
      rutPersonaJuridica: appUtil.rutFormatToBack(data?.rutPersonaJuridica),
      razonSocial: data?.razonSocial,
      direccionPersonaJuridica: {
        idRegion: data?.regionPersonaJuridica,
        idComuna: data?.comunaPersonaJuridica,
        calle: data?.callePersonaJuridica,
        numeroCalle: data?.numeroCallePersonaJuridica
      },
      telefonoFijoPersonaJuridica: data?.telefonoFijoPersonaJuridica,
      correoElectronicoPersonaJuridica: data?.correoPersonaJuridica
    }
  }
}

/**
 * @param {Object} contract Contrato de backend
 * @param {Object} target formData con v-model a llenar
 *
 * Descripcion:
 * Toma el contrato de backend y asigna los datos correspondientes al v-model del formData.
 */
export function populateInterviniente (contract, target) {
  const { interviniente, intervinienteJuridico } = contract
  const {
    identificacion,
    nombre,
    persona,
    sexo,
    conQuienVive,
    estadoSalud,
    conoceTestigo,
    conoceImputado,
    quienAplicoFuerza,
    detencion,
    idRelacionSujeto,
    redSocial,
    firma,
    foto
  } = interviniente
  let direccionPersonaJuridica
  if (intervinienteJuridico) {
    direccionPersonaJuridica = intervinienteJuridico?.direccionPersonaJuridica
  }

  const formData = {
    idRelacionSujeto: idRelacionSujeto,
    idPersona: persona.idPersona,
    idPersonaJuridica: intervinienteJuridico?.idPeidPersonaJuridica,
    tipoSujeto: contract.tipoSujeto,
    idRepresentaInstitucion: contract.idRepresentaInstitucion,
    tipoVictima: interviniente.tipoVictima,
    idIdentificacion: identificacion?.idIdentificacion,
    esVictima: interviniente.esVictima,
    esFuncionarioPublico: persona.esFuncionarioPublico,
    cargoFuncionarioPublico: interviniente.cargoFuncionarioPublico,
    institucionFuncionarioPublico: interviniente.institucionFuncionarioPublico,
    esNn: persona.esNN,
    esConfidencial: persona.esConfidencial, // falta en bd
    tipoDocumentoIdentificacion: identificacion?.tipoDocumento,
    numeroDocumentoIdentificacion:
      format(identificacion?.numeroDocumento) ??
      identificacion?.numeroDocumento,
    nombres: nombre?.nombres?.trim(), // EN LAS CAUSAS DE MP EL NOMBRE TIENE ESPACIOS AL FINAL 🙄
    apellidoPaterno: nombre?.primerApellido?.trim(), // EN LAS CAUSAS DE MP EL NOMBRE TIENE ESPACIOS AL FINAL 🙄
    apellidoMaterno: nombre?.segundoApellido?.trim(), // EN LAS CAUSAS DE MP EL NOMBRE TIENE ESPACIOS AL FINAL 🙄
    foto: foto,
    firma: firma,
    nacionalidad: interviniente.nacionalidad,
    estadoCivil: interviniente.estadoCivil,
    fechaNacimiento: persona.fechaNacimiento,
    profesionOficioOcupacion: interviniente.profesionOficioOcupacion,
    esIdentidadValidada: persona.esIdentidadValidada,
    tieneOrdenDetencionVigente: persona.tieneOrdenDetencionVigente,
    paisDocumentoIdentificacion: identificacion?.paisEmisorDocumento,
    ciudadNacimiento: persona.ciudadNacimiento,
    pueblosOriginarios: interviniente.pueblosOriginarios,
    estadoMigratorio: interviniente.estadoMigratorio,
    idioma: interviniente.idioma,
    nombreSocial: nombre.nombreSocial,
    aliasApelativo: nombre.aliasApelativo,
    esNecesidadInterprete: persona.esNecesitaInterprete,
    identidadGenero: sexo?.sexoDeclarado,
    sexoRegistral: sexo?.sexoBiologico,
    escolaridad: interviniente.escolaridad,
    esReservaDeDatos: persona.esReservaDeDatos,
    condicionDiscapacidad: interviniente.tipoDiscapacidad.length > 0,
    tipoDiscapacidad: interviniente.tipoDiscapacidad,
    direcciones: [],
    esMenorDeEdad: persona.esMenorDeEdad,
    rutPersonaJuridica: format(intervinienteJuridico?.rutPersonaJuridica),
    razonSocial: intervinienteJuridico?.razonSocial,
    regionPersonaJuridica: direccionPersonaJuridica?.idRegion,
    comunaPersonaJuridica: direccionPersonaJuridica?.idComuna,
    callePersonaJuridica: direccionPersonaJuridica?.calle,
    numeroCallePersonaJuridica: direccionPersonaJuridica?.numeroCalle,
    telefonoFijoPersonaJuridica:
      intervinienteJuridico?.telefonoFijoPersonaJuridica,
    correoPersonaJuridica:
      intervinienteJuridico?.correoElectronicoPersonaJuridica,
    infoTipoContacto: interviniente.tipoContacto,
    telefonoFijoContacto: interviniente.telefonoFijoContacto,
    telefonoMovilContacto: interviniente.telefonoMovilContacto,
    correoElectronicoContacto: interviniente.correoElectronicoContacto,
    indicadorDireccionNotificacion:
      interviniente.indicadorDireccionNotificacion,
    redesSociales: redSocial?.operador,
    cualesRedesSociales: redSocial?.identificador,
    esNNA: interviniente.esNNA,
    conQuienVive: conQuienVive?.idTipoConviviente,
    especifiqueConQuienVive: conQuienVive?.especificacion,
    requiereFormularioRiesgoNNA: interviniente.requiereFormularioRiesgoNNA,
    requierePautaVIF: interviniente.requierePautaVIF,
    declaracionTestigoDeclaracion: '', // no en bd
    presentaLesiones: estadoSalud?.esLesionado,
    descripcionLesion: estadoSalud?.descripcionLesion,
    origenLesiones: estadoSalud?.origenLesion,
    estadoTemperancia: estadoSalud?.estadoTemperancia,
    dau: estadoSalud?.dau,
    indicadorConsumoDrogas: estadoSalud?.indicadorConsumoDrogas,
    quedoHospitalizado: estadoSalud?.quedaHospitalizado,
    idOrganismoSalud: estadoSalud?.idOrganismoSalud,
    nombresMedico: estadoSalud?.nombreCompletoMedico,
    rutMedicoTratante: format(estadoSalud?.rutMedico),
    pidioMedidasDeProteccion: !!interviniente?.medidasProteccion?.idsMedidas,
    medidasProteccion: {
      idsMedidas: interviniente?.medidasProteccion?.idsMedidas?.split(',') // TEMPORAL PARA SIEMPRE?
    },
    declaracion: interviniente.declaracion,
    conoceTestigoNombre: conoceTestigo?.nombreDescrito,
    conoceTestigo: conoceTestigo,
    relacionConImputado: conoceImputado?.idRelacionDescrito,
    conoceImputado: conoceImputado,
    conoceImputadoNombre: conoceImputado?.nombre,
    conoceImputadoDescripcion: conoceImputado?.descripcion,
    esRPA: interviniente.esRPA,
    estaDetenido: detencion?.estaDetenido,
    // region, comuna, calle, numero es lugarDetencion
    regionDeDetencion: detencion?.regionDeDetencion,
    comunaDeDetencion: detencion?.comunaDeDetencion,
    calleDetencion: detencion?.calleDetencion,
    numeroCalledetencion: detencion?.numeroCalledetencion,
    poblacionDetencion: detencion?.poblacionDetencion,
    tipoViviendaDetencion: detencion?.tipoViviendaDetencion,
    cuadranteDetencion: detencion?.cuadranteDetencion,
    sectorDetencion: detencion?.sectorDetencion,
    blockDetencion: detencion?.blockDetencion,
    interseccionDetencion: detencion?.interseccionDetencion,
    referenciaDetencion: detencion?.referenciaDetencion,
    lugarDetencion: detencion?.lugarDetencion,
    // region, comuna, calle, numero es lugarDetencion
    causaDetencion: detencion?.causaDetencion,
    fechaHoraDetencion: detencion?.fechaHoraDetencion,
    pasaControlDetencion: detencion?.pasaControlDetencion,
    destinoImputado: detencion?.destinoImputado,
    muertesBajoCustodia: interviniente.muertesBajoCustodia,
    tipoSujetoQueRepresenta:
      interviniente.representante?.tipoSujetoQueRepresenta,
    nombreDelRepresentado: interviniente.representante?.nombreRepresentado,
    apellidoDelRepresentado: interviniente.representante?.apellidoRepresentado,
    tipoInstitucionQuePertenece: interviniente.representante?.tipoInstitucion,
    nombreInstitucionQuePertenece:
      interviniente.representante?.nombreInstitucion,
    comoAcreditaRepresentacion: interviniente.representante?.acreditacion,
    reservaTestigo: persona.esReservado,
    fuenteInformacion: interviniente.fuenteInformacion,
    tipoTestigo: interviniente.tipoTestigo,
    nnaAQuienContoHechos: interviniente.nnaAQuienContoHechos,
    esEldenuncianteVictima: '',
    nnaEsAdultoProtector: interviniente.nnaEsAdultoProtector,
    idNnaParentesco: interviniente.idNnaParentesco,
    nnaComoSupoHechos: interviniente.nnaComoSupoHechos,
    rolHechoDelictual: interviniente.rolHechoDelictual,
    perfilImputado: interviniente.perfilImputado,
    fueRestringidoDeLibertad: interviniente.fueRestringidoDeLibertad,
    aQuienEntrego: interviniente.aquienEntrego, // no en bd
    seInformoAlTribunalFamilia: interviniente.seInformoAlTribunalFamilia,
    seAplicoFuerza: !!interviniente.quienAplicoFuerza,
    descripcionQuienAplico: quienAplicoFuerza?.descripcionQuienAplico,
    idOrganismoPertenecienteRol: quienAplicoFuerza?.idOrganismoPertenecienteRol,
    rutQuienUtilizoFuerza: format(quienAplicoFuerza?.rutQuienUtilizoFuerza),
    nombresQuienAplicoFuerza: quienAplicoFuerza?.nombreCompleto,
    tipoTelefono: quienAplicoFuerza?.tipoTelefono,
    telefonoQuienAplicoFuerza: quienAplicoFuerza?.telefono,
    correoElectronicoQuienAplicoFuerza: quienAplicoFuerza?.correoElectronico
  }

  Object.assign(target, formData)
}
