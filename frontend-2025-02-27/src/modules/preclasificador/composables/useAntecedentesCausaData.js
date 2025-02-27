import { reactive } from 'vue'
const antecedentesDefault = {
  idTipoDenuncia: '',
  ruc: '',
  rit: null,
  folio: null,
  identificadorUnicoDenuncia: '',
  tipoDenuncia: '',
  numeroParteDenuncia: null,
  fechaHoraDenuncia: null,
  fechaHoraRecepcion: null,
  formaEnvio: '',
  estado: '',
  nombreCausa: '',
  medioRecepcion: '',
  nombreDigitador: '',
  funcionarioCargoProcedimiento: '',
  fiscalAsignado: '',
  idOrganismoColaborador: '',
  idFiscalia: ''
}
const antecedentes = reactive({ ...antecedentesDefault })

const fiscaliaLocalDefault = {
  tipoFiscalia: '',
  region: '',
  nombreFiscalia: '',
  codigoFiscalia: '',
  rutAtendedor: '',
  nombreAtendedor: '',
  comuna: '',
  calle: '',
  numero: '',
  telefonoContacto: '',
  correoElectronicoContacto: ''
}
const fiscaliaLocal = reactive({ ...fiscaliaLocalDefault })

const institucionDenuncianteDefault = {
  unidadPoliciaOrganismo: '',
  prefecturaDependenciaUP: '',
  comisaria: '',
  destacamento: '',
  region: '',
  comuna: '',
  calle: '',
  numero: '',
  telefonoContacto: '',
  correoElectronicoContacto: ''
}
const institucionDenunciante = reactive({ ...institucionDenuncianteDefault })

export const useAntecedentesCausaData = () => {
  function resetAntecedentesCausaData () {
    Object.assign(antecedentes, antecedentesDefault)
    Object.assign(fiscaliaLocal, fiscaliaLocalDefault)
    Object.assign(institucionDenunciante, institucionDenuncianteDefault)
  }

  return {
    antecedentes,
    fiscaliaLocal,
    institucionDenunciante,
    resetAntecedentesCausaData
  }
}
