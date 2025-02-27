/* eslint-disable no-unused-vars */
import { requestUtil } from '@/utils'
import { reactive, ref, computed } from 'vue'
import { useMantenedorStore } from './useMantenedorStore'

const atributosList = ref([])

const formData = reactive({
  idOrigenActividad: null, // envio del idCausa
  idTipoOrigenActividad: null, // llamar al mantenedor /actividad/tipo-origen/1, envio del id del tipo origen CAUSA
  idTipoActividad: '', // el id al dato del mantenedor /actividad/tipo?codigo=26
  tipoDiligencia: null,
  idSubtipoActividad: null, // el idSubtipo seleccionado
  subtipoDiligencia: null,
  idSubSubtipoActividad: null, //  el idSubSubtipo seleccionado
  idJustificacion: null,
  idUnidadOrigen: null, // valor idFiscalia
  idInstitucionEjecutora: null,
  idPrefectura: null,
  idComisaria: null,
  idDestacamento: null,
  idUnidadDestino: null, // id del ultimo nivel de la institucion seleccionado, ejemplo: para carabinero, enviar el idDestacamento
  idUnidadEjecutora: null, // id del ultimo nivel de la institucion seleccionado, ejemplo: para carabinero, enviar el idDestacamento
  instruccionFiscal: null, // si en caso se muestra el campo instrucciones del fiscal, guardar aqui
  idFiscalia: null, // valor idFiscalia
  seDerivaEquipoJuridico: null, // valor de la seleccion de deriva equipo juridico
  seRevisaEscrito: false, // valor de la seleccion de revisar escrito, en caso seDerivaEquipoJuridico es false, este campo tambn es false
  idPlantilla: null, // aun no operativo, enviar null
  textoHito: null, // en caso se escribe el texto, se envia en string el html ingresado
  observacion: null, // lo escrito en el campo observacion
  esUrgente: null, // el valor seleccionado
  esReservada: null, // el valor seleccionado
  idsDocumento: [], // documentos seleccionados o sino enviar null
  plazoDias: null,
  /* DEPENDEN DEL AMBITO */
  idsRelacionDelito: [], // en caso de ser ambito relacion, envio de idsRelacionDelito seleccioandos, codigo 5
  idRelacionSujeto: null, // en caso de ser ambito sujeto, envio de idRelacionSujeto del sujeto seleccioando, codigo 14
  idAmbitoCausa: null, // en caso de ser ambito causa, envio de idCausa de la causa, codigo 15
  fechaInstruccionesParticulares: null, // enviar cuando se seleccione diligencia 'Instruccioens particulares', atributo 16
  plazoInstruccionesParticulares: null, // enviar cuando se seleccione diligencia 'Instrucciones particulares', atributo = 17
  idInformePericial: null, // enviar cuando se seleccione diligencia 'Informe pericial', atributo = 20
  fechaHoraExamen: null, // enviar cuando se seleccione diligencia 'Sevicio medico legal - solicitud de examen', atributo 16
  idTipoPrueba: null, // enviar cuando se seleccione diligencia 'Sevicio medico legal - solicitud de examen', atributo 21
  idTipoExamen: null, // enviar cuando se seleccione diligencia 'Sevicio medico legal - solicitud de examen', atributo 23
  idTipoElementoAutopsia: null, // enviar cuando se seleccione diligencia 'Sevicio medico legal - solicitud de autposia', atributo 22
  quienRetiraCadaver: null, // enviar cuando se seleccione diligencia 'Sevicio medico legal - entrega de cadaver', atributo 18
  lugarHallazgoCadaver: null, // enviar cuando se seleccione diligencia 'Sevicio medico legal - entrega de cadaver', atributo 19
  /* HELPER */
  codigoAtributo: null
})

const atributos = reactive({
  /* Ambitos */
  isAmbitoRelacion: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '5')),
  isAmbitoSujeto: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '14')),
  isAmbitoCausa: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '15')),
  /* Inputs Dinamicos */
  hasUrgente: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '6')),
  hasReservada: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '7')),
  hasFechaHoraExamen: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '16')),
  hasQuienRetira: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '18')),
  hasLugarHallazgo: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '19')),
  hasTipoPericia: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '20')),
  hasTipoPrueba: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '21')),
  hasTipoAutopsia: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '22')),
  hasTipoExamen: computed(() => atributosList.value.some(atributo => atributo.codigoAtributo === '23'))
})

export function useInstruirDiligencia () {
  const { mantenedor_getAtributos } = useMantenedorStore()

  function resetAtributosList () {
    atributosList.value = []
  }

  function resetAtributosAmbito () {
    formData.codigoAtributo = null
    formData.idsRelacionDelito = []
    formData.idRelacionSujeto = null
    formData.idAmbitoCausa = null
    formData.fechaInstruccionesParticulares = null
    formData.plazoInstruccionesParticulares = null
    formData.plazoDias = null
    formData.idInformePericial = null
    formData.fechaHoraExamen = null
    formData.idTipoPrueba = null
    formData.idTipoExamen = null
    formData.idTipoElementoAutopsia = null
    formData.quienRetiraCadaver = null
    formData.lugarHallazgoCadaver = null
  }

  function setAmbitoDiligencia ({ idActividad, loader, resolve }) {
    requestUtil({
      action: mantenedor_getAtributos,
      payload: {
        idActividad: idActividad
      },
      loader,
      resolve: (response) => {
        atributosList.value = response

        if (atributos.isAmbitoRelacion) formData.codigoAtributo = '5'
        if (atributos.isAmbitoSujeto) formData.codigoAtributo = '14'
        if (atributos.isAmbitoCausa) formData.codigoAtributo = '15'

        if (!atributosList.value.length) {
          formData.codigoAtributo = '0'
        }

        resolve()
      }
    })
  }

  return {
    formData,
    atributos,
    atributosList,
    resetAtributosList,
    resetAtributosAmbito,
    setAmbitoDiligencia
  }
}
