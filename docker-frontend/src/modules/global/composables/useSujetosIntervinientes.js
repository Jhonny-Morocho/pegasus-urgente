import { inject, reactive } from 'vue'

// scope de formulario
const sujetosIntervinientesValidationScope = 'SujetosIntervinientes'

// provider ----- Identificacion Interviniente -----

export const useSujetosIntervinientesProvide = () => {
  const sujetosStates = {
    readonly: false
  }

  const sujetosIds = {
    idProcedimiento: '',
    idCausa: '',
    idDenuncia: '',
    idCodigoRelacion: 'string',
    idPersona: '',
    idRelacionSujeto: '',
    idPersonaJuridica: 'string',
    clase: 'string',
    idRelacionClase: 'string',
    idDetalleHechoDelictual: 'string',
    idCodigoRelacionRepresentanteLegal: 'string'
  }

  const identificacionInterviniente = {
    idIdentificacion: '',
    tipoSujeto: '',
    foto: null,
    firma: null,
    esVictima: false,
    tipoVictima: null,
    representaInstitucion: false,
    idRepresentaInstitucion: '',
    esNn: false,
    esConfidencial: false,
    tipoDocumentoIdentificacion: '',
    codigoTipoDocumentoIdentificacion: '',
    numeroDocumentoIdentificacion: '',
    idNombre: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    idNacionalidad: '',
    nacionalidad: '',
    idEstadoCivil: '',
    estadoCivil: '',
    fechaNacimiento: '',
    idProfesionOcupacion: '',
    profesionOficioOcupacion: '',
    esIdentidadValidada: false,
    tieneOrdenDetencionVigente: '',
    paisDocumentoIdentificacion: '',
    ciudadNacimiento: '',
    idPueblosOriginarios: '',
    pueblosOriginarios: '',
    idEstadoMigratorio: '',
    estadoMigratorio: '',
    idIdioma: '',
    idioma: '',
    nombreSocial: '',
    aliasApelativo: '',
    esNecesidadInterprete: false,
    idIdentidadGenero: '',
    identidadGenero: '',
    sexoRegistral: '',
    idEscolaridad: '',
    escolaridad: '',
    esReservaDeDatos: false,
    condicionDiscapacidad: false,
    idTipoDiscapacidad: '',
    tipoDiscapacidad: [],
    direcciones: [],
    esMenorDeEdad: false,
    direccion: ''
  }

  // provider ----- Informacion Persona Juridica -----
  const identificacionPersonaJuridica = {
    rutPersonaJuridica: '',
    razonSocial: '',
    regionPersonaJuridica: '',
    comunaPersonaJuridica: '',
    callePersonaJuridica: '',
    numeroCallePersonaJuridica: '',
    telefonoFijoPersonaJuridica: '',
    correoPersonaJuridica: '',
    idDireccionPersonaJuridica: '',
    idTelefonoFijoPersonaJuridica: '',
    idCorreoElectronicoPersonaJuridica: '',
    idIdentificacionPersonaJuridica: '',
    idNombrePersonaJuridica: ''
  }

  // provider ----- Informacion Contacto -----

  const informacionContacto = {
    infoTipoContacto: '',
    telefonoFijoContacto: '',
    telefonoMovilContacto: '',
    correoElectronicoContacto: '',
    indicadorDireccionNotificacion: false,
    redesSociales: '',
    cualesRedesSociales: ''
  }

  // provider ----- Datos Complementarios -----
  const datosComplementarios = {
    esNNA: '',
    conQuienVive: '',
    especifiqueConQuienVive: '',
    requiereFormularioRiesgoNNA: false,
    requierePautaVIF: false,
    declaracionTestigoDeclaracion: '',
    presentaLesiones: false,
    descripcionLesion: '',
    origenLesiones: '',
    estadoTemperancia: '',
    dau: '',
    indicadorConsumoDrogas: '',
    quedoHospitalizado: false,
    idOrganismoSalud: '',
    nombresMedico: '',
    rutMedicoTratante: '',
    pidioMedidasDeProteccion: '',
    declaracion: '',
    medidasProteccion: {
      idsMedidas: null
    },
    conoceTestigo: null,
    conoceTestigoId: '',
    conoceTestigoNombre: '',
    conoceTestigoDescripcion: '',
    conoceImputado: null,
    relacionConImputado: '',
    conoceImputadoId: null,
    conoceImputadoNombre: '',
    conoceImputadoDescripcion: '',
    esRPA: '',
    estaDetenido: false,
    // region, comuna, calle, numero es lugarDetencion
    regionDeDetencion: '',
    comunaDeDetencion: '',
    calleDetencion: '',
    numeroCalledetencion: '',
    poblacionDetencion: '',
    tipoViviendaDetencion: '',
    cuadranteDetencion: '',
    sectorDetencion: '',
    blockDetencion: '',
    interseccionDetencion: '',
    referenciaDetencion: '',
    lugarDetencion: '',
    // region, comuna, calle, numero es lugarDetencion
    causaDetencion: '',
    fechaHoraDetencion: '',
    pasaControlDetencion: false,
    destinoImputado: '',
    muertesBajoCustodia: false,
    tipoSujetoQueRepresenta: '',
    nombreDelRepresentado: '',
    apellidoDelRepresentado: '',
    tipoInstitucionQuePertenece: '',
    nombreInstitucionQuePertenece: '',
    otraInstitucion: '',
    comoAcreditaRepresentacion: '',
    esAbogado: false,
    reservaTestigo: false,
    fuenteInformacion: '',
    tipoTestigo: '',
    nnaAQuienContoHechos: '',
    esEldenuncianteVictima: '',
    nnaEsAdultoProtector: '',
    idNnaParentesco: '',
    nnaComoSupoHechos: '',
    rolHechoDelictual: '',
    perfilImputado: '',
    fueRestringidoDeLibertad: false,
    aQuienEntrego: '',
    seInformoAlTribunalFamilia: false,
    seAplicoFuerza: '',
    quienAplicoLaFuerza: null,
    descripcionQuienAplico: '',
    rutQuienUtilizoFuerza: '',
    nombresQuienAplicoFuerza: '',
    telefonoQuienAplicoFuerza: '',
    correoElectronicoQuienAplicoFuerza: '',
    idOrganismoPertenecienteRol: '',
    tipoTelefono: '',
    esFuncionarioPublico: false,
    cargoFuncionarioPublico: '',
    institucionFuncionarioPublico: ''
  }

  const formData = reactive({
    ...sujetosStates,
    ...sujetosIds,
    ...identificacionInterviniente,
    ...identificacionPersonaJuridica,
    ...informacionContacto,
    ...datosComplementarios
  })

  return {
    sujetosIntervinientesValidationScope,
    datosComplementarios,
    formData
  }
}

export const useSujetosIntervinientesInject = () => ({
  sujetosIntervinientesInject: inject(sujetosIntervinientesValidationScope),
  // instancia de la injección
  sujetosIntervinientesValidationScope
})
