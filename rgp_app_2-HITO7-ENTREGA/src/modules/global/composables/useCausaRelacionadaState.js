import { reactive, ref } from 'vue'
const consultaDefault = {
  nombreVictima: '',
  idTipoDocumentoVictima: '',
  numeroDocumentoVictima: '',
  nombreImputado: '',
  idTipoDocumentoImputado: '',
  numeroDocumentoImputado: '',
  nombreDenunciante: '',
  idTipoDocumentoDenunciante: '',
  numeroDocumentoDenunciante: '',
  fechaDelito: null,
  idFamiliaDelito: '',
  idTipoDelito: '',
  fechaHoraDelitoDesde: '',
  fechaHoraDelitoHasta: '',
  numeroDenuncia: '',
  idUnidadPolicial: '',
  direccion: '',
  palabraClaveRelato: '',
  esCombinada: false
}
const consulta = reactive({ ...consultaDefault })
const refDireccion = ref(null)

export const useCausaRelacionadaState = () => {
  function resetCausaRelacionadaState () {
    Object.assign(consulta, consultaDefault)
    refDireccion.value?.resetModel()
  }

  return {
    consulta,
    refDireccion,
    resetCausaRelacionadaState
  }
}
