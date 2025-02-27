import { inject, reactive } from 'vue'

// scope de formulario
const delitoValidationScope = 'delito'

export const useDelitoProvide = () => {
  // provider ----- Especies Dinero -----
  const delitoIds = reactive({
    idProcedimiento: '',
    idDenunciaHechoDelictual: '',
    idDetalleDenunciaHechoDelictualDireccion: '',
    idTipoDenuncia: '',
    idOrigen: '',
    idOrganismoColaboradorUnidad: '',
    idDenuncia: '',
    idDetalleHechoDelictual: '',
    idFiscalia: '',
    numeroDenuncia: '',
    idCausa: '',
    idTipo: '',
    idEstado: ''
  })

  const clasificacion = reactive({
    idDenunciaClasificacion: '',
    gradoEjecucionDelito: '',
    problemaDelictualFenomenoCriminal: '',
    patronCriminal: '',
    modusOperandi: '',
    subModusOperandi: ''
  })

  const informacionAnonima = reactive({
    idDenunciaInfoAnonima: '',
    esInformacionAnonima: false,
    programaRazonAnonimato: '',
    viaInformacionAportada: ''
  })

  const fechaHoraDelito = reactive({
    fechaHoraRango: false,
    fechaOcurrencia: '',
    fechaHoraDelitoInicio: '1900-01-01T00:00:00.000',
    fechaHoraDelitoFin: '1900-01-01T00:00:00.000',
    esFlagrante: false
  })

  const delitos = reactive({
    idDenunciaDelito: '',
    familiaDelito: '',
    idFamiliaDelito: '',
    tipoDelito: '',
    idTipoDelito: null,
    descripcionDelito: '',
    codigoDelitoCarabineros: ''
  })

  const direccion = reactive({
    idDireccion: '',
    idDenunciaDireccion: '',
    idDetalleDenunciaHechoDelictualDireccion: '',
    calle: '',
    numero: '',
    departamentoOficina: '',
    block: '',
    poblacionVilla: '',
    sector: '',
    ciudad: '',
    comuna: '',
    region: '',
    interseccion: '',
    cuadrante: '',
    observacionReferencia: '',
    lugarEspecifico: '',
    latitud: '',
    longitud: '',
    esPrincipal: false,
    ubicacionRural: false,
    idTipoDireccion: ''
  })

  const elementosUsados = reactive({
    idDenunciaElemento: '',
    tipoElementoUsado: '',
    elementoUsado: ''
  })

  const hallazgo = reactive({
    esHallazgo: false,
    tipoHallazgo: ''
  })

  const infoCamara = reactive({
    idDenunciaInfoCamara: '',
    existeCamara: '',
    incautaronImagenes: '',
    lugarCamara: '',
    contenidoCamara: '',
    observacionAdicionalCamara: ''
  })

  const lugarDelito = reactive({
    idDelito: '',
    zonaDelito: '',
    tipoLugarOcurrencia: '',
    viaIngreso: '',
    lugarOcurrencia: '',
    lugarEspecificoOcurrencia: ''
  })

  const existenLesionados = reactive({
    existenLesionados: '',
    existenMuertos: '',
    existenDetenidos: ''
  })

  const delitoSujeto = reactive({
    idDenunciaSujeto: '',
    cantidadSujetosCometieronHechoDelictual: '',
    modalidadGrupo: ''
  })

  const infoAdicional = reactive({
    entregaDetenidosPorCiviles: null,
    esAccidenteTransito: null,
    esIncendio: null,
    vif: null
  })

  const vigilancia = reactive({
    idDenunciaVigilancia: '',
    tipoVigilancia: '',
    medidasSeguridad: ''
  })

  const ambitoNna = reactive({
    idDenunciaAmbitoNna: '',
    nnaSeNiegaSepararAdulto: null,
    describirConductasNNA: ''
  })

  const formData = reactive({
    ...delitoIds,
    ...clasificacion,
    ...informacionAnonima,
    ...fechaHoraDelito,
    ...delitos,
    ...direccion,
    ...elementosUsados,
    ...hallazgo,
    ...infoCamara,
    ...lugarDelito,
    ...delitoSujeto,
    ...vigilancia,
    ...ambitoNna,
    ...infoAdicional,
    ...existenLesionados
  })

  return {
    delitoValidationScope,
    formData
  }
}

export const useDelitoInject = () => ({
  delitoInject: inject(delitoValidationScope),
  // instancia de la injección
  delitoValidationScope
})
