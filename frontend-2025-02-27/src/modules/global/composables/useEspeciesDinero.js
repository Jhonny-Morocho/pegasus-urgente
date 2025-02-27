import { inject, reactive } from 'vue'
//
import { appUtil } from '@/utils'

// scope de formulario
const especiesDineroValidationScope = 'especiesDinero'

export const useEspeciesDineroProvide = () => {
  // provider ----- Especies Dinero -----

  const especieStates = {
    isReadOnly: false
  }

  const idEspecies = {
    idProcedimiento: '',
    idEspecie: '',
    idDenuncia: '',
    idEspecieDinero: '',
    clasificacion: ''
  }

  const especiesDinero = {
    esEspecieGenerico: false,
    ambitoEspecie: null,
    familiaEspecie: null,
    idTipoEspecie: null,
    nue: '',
    rue: appUtil.cadenaAleatoria(12),
    descripcion: ''
  }

  const especie = {
    unidadMedidaCuantitativa: '',
    cantidadEspecie: 1,
    pesoBruto: null,
    perecibleIdNumeroSerie: '',
    estadoConservacionEnvase: '',
    tipoElemento: '',
    perecible: false,
    especiePeligrosa: false,
    idNivelPeligro: null,
    esDinero: false,
    esDigital: false,
    especieDigital: false,
    especieDigitalTipoEspecie: null
  }

  const especieAnimal = {
    existeAnimalInvolucrado: false,
    esAnimal: false,
    idEspecieDinero: '',
    tipoAnimal: '',
    razaAnimal: '',
    edad: 0,
    peso: 0,
    chipNumeroIdentificatorio: '',
    numeroArete: '',
    bancoADNBobino: '',
    marcaOreja: '',
    colorAnimal: '',
    colorDeFrenteAnimal: '',
    tipoTusa: '',
    colorTusa: '',
    tipoCicatriz: '',
    formaCicatriz: '',
    tipoHerradura: '',
    tipoCola: '',
    colorCola: '',
    tipoSenal: '',
    formaSenal: '',
    origenAnimal: '',
    inscripcion: '',
    tipoDocumentacionAnimal: '',
    causaMuerteAnimal: '',
    observaciones: '',
    lugarCustodia: ''
  }

  const especieDocumento = {
    esDocumentoValor: false,
    tipoDocumento: '',
    numero: 0,
    serie: '',
    institucion: '',
    fecha: '',
    valor: 0,
    observacionDocumento: ''
  }

  const vehiculo = {
    esVehiculo: false,
    idEspecieDinero: '',
    tieneDocumentacionVehiculo: null,
    estabaCerradoVehiculo: null,
    signosFuerza: '',
    estadoVehiculo: '',
    herramientasAdentro: '',
    lugarCustodia: '',
    tieneCamara: null,
    accesoriosAdicionales: null,
    tieneDispositivoGeolocalizacion: null,
    archivoGeolocalizacion: null,
    lugarEstacionaComunmente: ''
  }

  const datoVehiculo = {
    tipoVehiculo: '',
    patente: '',
    marca: '',
    modelo: '',
    color: '',
    vin: '',
    numeroMotor: '',
    tieneSeguro: null,
    estaEncargadoPorRobo: null,
    numeroEncargo: '',
    informacionAutopista: null,
    informacionPeajes: '',
    tieneTag: null,
    clonado: null,
    portaPlacaPatente: null,
    puedeRodar: null
  }

  const latitudLongitudGeolocalizacion = {
    lat: 0,
    lon: 0
  }

  const observacion = {
    observacion: '',
    indicadorArma: null,
    indicadorEvidencia: null,
    indicadorMedioUsadoCometerDelito: null,
    avaluoEstimado: null,
    quienRealizaAvaluo: null,
    rutTenedorEspecie: '',
    nombreTenedorEspecie: '',
    pronunciamientoFiscal: '',
    nombreArchivoVideoOFotografia: '',
    descArchivoVideoOFotografia: ''
  }

  const relacionSujetoEspecie = {
    sujetosEspecie: [],
    observacionRelacionSujeto: ''
  }

  const antecedentesForm = {
    tipoAntecedente: '',
    nombreArchivo: '',
    descripcionArchivo: '',
    tipoArchivo: '',
    extensionArchivo: '',
    tamanoArchivo: '',
    ubicacionArchivo: '',
    origen: '',
    formatoActual: '',
    relacionFront: '',
    version: '',
    fotografiasVideos: '',
    idRelacion: '',
    idTipoRelacion: ''
  }

  const especiesFormData = reactive({
    ...especieStates,
    ...idEspecies,
    ...especiesDinero,
    ...especie,
    ...especieAnimal,
    ...especieDocumento,
    ...vehiculo,
    ...datoVehiculo,
    ...latitudLongitudGeolocalizacion,
    ...observacion,
    ...antecedentesForm,
    ...relacionSujetoEspecie
  })

  return {
    especiesDineroValidationScope,
    especiesFormData
  }
}

export const useEspeciesDineroInject = () => ({
  especiesDineroInject: inject(especiesDineroValidationScope),
  // instancia de la injección
  especiesDineroValidationScope
})
