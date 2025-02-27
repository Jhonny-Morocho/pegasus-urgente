<template>
<section>
  <AppForm
    id="enviarsolicitud"
    :form-submitted="formSubmitted"
    validation-scope="enviarsolicitud"
  >
    <div class="my-2 col-12 md:col-6 lg:col-4">
      <p class="text-center">
        ¿Desea derivar la Materialización al Equipo Jurídico?
      </p>
      <AppSelectButton
        id="deriva-a-juridico"
        v-model="formData.derivaMaterializacionEquipoJuridico"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>

    <AppFieldset
      class="w-full"
      :collapsed="formData.derivaMaterializacionEquipoJuridico === null"
      legend="Materializa Fiscal"
    >
      <p class="col-12 md:col-4">
        <span style="font-weight: bold">Fiscalía:</span>
        {{ resumenCausa?.nombreFiscaliaLocal }}
      </p>
      <p class="col-12 md:col-4">
        <span style="font-weight: bold">Fiscal Asignado:</span>
        {{ resumenCausa?.nombreFiscalAsignado }}
      </p>
      <div class="col-12 p-0 my-2">
        <AppDropdown
          id="medida-cautelar"
          v-model="formData.nombreTribunal"
          class="col-12 md:col-4"
          label="Tribunales"
          option-label="descripcion"
          option-value="id"
          :options="juzgados"
          :rules="{
            required
          }"
          show-clear
        />
      </div>

      <EscritoMaterializaFiscal
        v-if="!formData.derivaMaterializacionEquipoJuridico"
        v-model="formData"
        :institucion-options="null"
        :plantilla-diligencias-options="plantillasDiligencia"
        :unidad-policial-options="null"
        @get-plantilla-instruccion="getPlantilla"
      />
      <InstruccionEquipoJuridico
        v-else
        v-model="formData"
        :has-revisa-escrito="true"
        :institucion-options="null"
        :unidad-policial-options="null"
      />
    </AppFieldset>

    <AppFieldset
      class="w-full mt-6"
      collapsed
      legend="¿Desea agregar un documento a la solicitud?"
      :toggleable="false"
    >
      <h3 class="text-center w-full my-6">
        Agregar un documento 😅
      </h3>
    </AppFieldset>

    <AppBtnNextTeleported
      class="mr-2"
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar Solicitud"
      :loading="isLoadingBtnEnviarSolicitud"
      @click="handleEnviarSolicitud()"
    />
  </AppForm>
</section>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import { useAppToast, useAppDialog, useFormValidation, useAppGlobalProperties, useConfirmDialog } from '@/modules/common/composables'
import { useDelitoStore, useMantenedorStore, usePamStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import EscritoMaterializaFiscal from '@/modules/dirigir-investigacion/components/EscritoMaterializaFiscal.vue'
import InstruccionEquipoJuridico from '@/modules/dirigir-investigacion/components/InstruccionEquipoJuridico.vue'
import ModalSolicitudRespuestaPJUD from '@/modules/dirigir-investigacion/components/modals/solicitudes-audiencia/ModalSolicitudRespuestaPJUD.vue'

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { toastError, TOAST_MESSAGES } = useAppToast()
const { procesoPam } = usePamStore()

const { $userFiscaliaActual, $userName } = useAppGlobalProperties()

const router = useRouter()

const {
  resumenCausa,
  causa,
  ruc: rucCausa,
  medidasCautelaresSolicitudes,
  dirigirInvestigacion_completarSolicitarAudienciaFormalizacion,
  dirigirInvestigacion_postEnviarSolicitudAudienciaFormalizacion
} = useDirigirInvestigacionStore()
const {
  plantillasDiligencia,
  tipoActividad,
  tipoOrigen,
  mantenedor_getTipoOrigenByCodigoActividad,
  mantenedor_getTipoActividadByCodigoActividad,
  mantenedor_getPlantillasDiligencia,
  mantenedor_getjuzgados,
  mantenedor_getInstituciones,
  juzgados
} = useMantenedorStore()
const { delitos } = useDelitoStore()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()

const formData = ref({
  derivaMaterializacionEquipoJuridico: null, // inicia en null siempre - bool
  idTribunal: 'uuid', // tribunal - uuid,
  nombreTribunal: null, // tribunal - string,
  agregaUnidadPolicial: null, // bool
  idPlantilla: null, // plantilla - uuid,
  materializacionTextoFiscal: null, // plantilla - string
  instruccionesEquipoJuridico: null, // plantilla - string
  idInstitucion: 'uuid', // institucion - uuid,
  institucion: null, // institucion - string,
  idUnidadPolicial: 'uuid', // unidad policial - uuid,
  unidadPolicial: null, // unidad policial - string,
  archivoProvisionalConConsulta: null,
  listaDocumentos: [], // array de documentos
  deseaAdjuntarCDD: false // bool
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'enviarsolicitud'
})

const isLoadingBtnEnviarSolicitud = ref(false)

onMounted(async () => {
  requestUtil({ action: mantenedor_getPlantillasDiligencia })
  requestUtil({ action: mantenedor_getInstituciones })
  requestUtil({ action: mantenedor_getjuzgados })
})

const listaImputados = inject('listaImputados')

function handleEnviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  launchConfirmDialog({
    header: 'Solicitar Audiencia de Formalización',
    message: '¿Está seguro de enviar la Solicitud de Audiencia?',
    acceptLabel: 'Aceptar',
    accept: async () => {
      postCrearSolicitudAudiencia()
    }
  })
}

async function postCrearSolicitudAudiencia () {
  isLoadingBtnEnviarSolicitud.value = true
  await obtenerDataMantenedorTipoOrigen()
  const { idCausa } = causa.value?.data?.causa
  const textoMaterializar = formData.value.derivaMaterializacionEquipoJuridico ? formData.value.instruccionesEquipoJuridico : formData.value.materializacionTextoFiscal
  const idsRelacionesDelitos = listaImputados.value.map((el) => el.idRelacionDelito)
  let medidasCautelaresAEnviar = medidasCautelaresSolicitudes.value.map((el) => {
    return {
      relacionSujetoId: el?.imputado?.idRelacion,
      medidaCodigo: 0,
      medidaId: el?.medidaCautelar?.id,
      descripcion: el?.medidaCautelar?.descripcion
    }
  })
  // control cuando medidasCautelares no tiene datos el arreglo
  if (medidasCautelaresAEnviar.length <= 0) {
    medidasCautelaresAEnviar = null
  }

  const payloadParse = {
    idTipo: tipoActividad.value?.id, // consultar mantenedor por codigo "24"
    idOrigenTarea: idCausa, // idCausa
    idTipoOrigen: tipoOrigen.value?.id, // consultar mantenedor por codigo "1"
    idSubtipo: '0E4A1246-B3A9-4497-97F7-C5A991011623', // "0E4A1246-B3A9-4497-97F7-C5A991011623"
    idSubSubtipo: null, // null
    plantillaId: null, // enviar null por el momento
    texto: textoMaterializar, // editor de texto
    juzgadoId: formData.value?.nombreTribunal, // el select del tribunal
    instruccionFiscal: textoMaterializar, // ???
    fiscalia: $userFiscaliaActual.value?.fiscalia, // codigo de fiscalia
    nombreFiscal: $userName.value, // nombre del usuario conectado ??
    idInstitucionEjecutora: 'Poder Judicial', // "Poder Judicial"
    idResponsableMaterializar: 'Equipo Juridico', // "Equipo Juridico"
    seDerivaEquipoJuridico: formData.value?.derivaMaterializacionEquipoJuridico, // de acuerdo al toggle derivar
    seRevisaEscrito: formData.value?.revisarEscrito || false, // de acuerdo al toggle revisa escrito
    idsDocumentos: [], // Se envia vacio por ahora
    idsRelacionDelito: idsRelacionesDelitos,
    medidas: medidasCautelaresAEnviar
  }

  requestUtil({
    action: dirigirInvestigacion_postEnviarSolicitudAudienciaFormalizacion,
    payload: {
      ...procesoPam.value,
      idTarea: null,
      ...payloadParse
    },
    resolve: async (data) => {
      const { responsePJUD } = data

      // eslint-disable-next-line no-unused-vars, prefer-const
      let err = {
        codigoError: null,
        codigoInterconexionError: null,
        descripcionError: '',
        estadoProceso: ''
      }

      // errores ya no se manejan con responsePJUD, ya no viene el objeto
      if (responsePJUD === null || !responsePJUD) {
        // Si materializa el equipo juridico
        launchDialog({
          component: ModalSolicitudRespuestaPJUD,
          header: 'Información de Solicitud',
          confirmLabel: 'Continuar',
          closable: false,
          cancelLabel: 'hideCancelLabel',
          props: {
            data: {
              ...err,
              codigoInterconexionError: 0,
              isWithError: false
            }
          },
          accept: async () => {
            console.log(data)
            await postCompletarTareaEnviarSolicitudFormalizacion(data)
            isLoadingBtnEnviarSolicitud.value = false
            // router.push({ name: 'DIDesarrolloInvestigacion' })
          }
        })
      } else if (!responsePJUD.codError && !responsePJUD.crrIdInteconexion && !responsePJUD.descError) {
        // manejar error de nuestro backend
        // este error se lanza si se genera algun error al crear(back lo hace) el payload que se envia al pjud
        launchConfirmDialog({
          header: 'Error de Servicio - RGP',
          message: 'Se ha producido un error de servicio',
          acceptLabel: 'Aceptar',
          accept: () => (isLoadingBtnEnviarSolicitud.value = false),
          onHide: () => (isLoadingBtnEnviarSolicitud.value = false),
          rejectClass: 'hidden'
        })
      } else if (responsePJUD?.codError !== 0) {
        err = {
          codigoError: responsePJUD?.codError,
          codigoInterconexionError: responsePJUD?.crrIdInteconexion,
          descripcionError: responsePJUD?.descError,
          estadoProceso: responsePJUD?.estadoProceso
        }

        // error que se genera cuando es error del pjud
        launchDialog({
          component: ModalSolicitudRespuestaPJUD,
          header: 'Información de Solicitud',
          confirmLabel: 'Aceptar',
          closable: false,
          cancelLabel: 'hideCancelLabel',
          props: {
            data: {
              ...err,
              isWithError: true
            }
          },
          accept: async () => {
            isLoadingBtnEnviarSolicitud.value = false
          }
        })
      } else if (responsePJUD?.codError === 0) {
        // si el codError es 0, quiere decir que no hubo ningun error al hacer la solicitud
        err = {
          codigoError: responsePJUD?.codError,
          codigoInterconexionError: responsePJUD?.crrIdInteconexion,
          descripcionError: responsePJUD?.descError,
          estadoProceso: responsePJUD?.estadoProceso
        }

        launchDialog({
          component: ModalSolicitudRespuestaPJUD,
          header: 'Información de Solicitud',
          confirmLabel: 'Continuar',
          closable: false,
          cancelLabel: 'hideCancelLabel',
          props: {
            data: {
              ...err,
              isWithError: false
            }
          },
          accept: async () => {
            await postCompletarTareaEnviarSolicitudFormalizacion(data)
            isLoadingBtnEnviarSolicitud.value = false
          }
        })
      }
    },
    reject: () => {
      isLoadingBtnEnviarSolicitud.value = false
    }
  })
}

async function postCompletarTareaEnviarSolicitudFormalizacion ({ solicitud }) {
  // Si se envia correctamente, hacer la llamada para terminar la tarea y router.push a panel DI
  // eslint-disable-next-line no-unreachable
  const payloadCompletarParse = {
    idTarea: solicitud?.idTarea,
    idTipo: solicitud?.idTipo,
    idSubTipo: solicitud?.idSubtipo,
    idSubSubTipo: solicitud?.idSubSubtipo,
    idInstitucionEjecutora: solicitud?.idInstitucionEjecutora,
    idResponsableMaterializar: solicitud?.idResponsableMaterializar,
    requiereApoyo: false, // siempre
    materializarSolicitud: solicitud?.seDerivaEquipoJuridico, // el mismo valor que seDerivaEquipoJuridico
    revisarSolicitud: solicitud?.seRevisaEscrito, // mismo valor que seRevisaEscrito
    decisionCausa: 'string'
  }
  await requestUtil({
    action: dirigirInvestigacion_completarSolicitarAudienciaFormalizacion,
    payload: {
      taskId: procesoPam.value?.taskId,
      ...payloadCompletarParse
    },
    resolve: () => {
      isLoadingBtnEnviarSolicitud.value = false
      router.push({ name: 'DIDesarrolloInvestigacion' })
    },
    reject: () => {
      console.log(procesoPam.value)
      console.log('err al completar tarea pam')
    }
  })
}

async function obtenerDataMantenedorTipoOrigen (_codTipo = 24, _codTipoOrigen = 1) {
  requestUtil({
    action: mantenedor_getTipoActividadByCodigoActividad,
    payload: { params: { codigo: _codTipo } }
  })
  requestUtil({
    action: mantenedor_getTipoOrigenByCodigoActividad,
    payload: { codigo: _codTipoOrigen }
  })
}

async function getPlantilla (idPlantilla) {
  // mock para obtener el escrito mediante una plantilla (mock)
  const escritoSolicitud = getEscrito()
  formData.value.materializacionTextoFiscal = escritoSolicitud
}

// MOCK para crear una solicitud basado en una plantilla
/* eslint-disable max-len  */
function createEscritoSolicitud ({ nombreFiscal, ruc, imputado1, imputado2, delito }) {
  const { tipoDelito, direccionDelito, fechaDelito } = delito

  return `
  <h2 class="ql-align-center">Sr. Juez de Garantía</h2>
  <br></br>
  <p class="ql-align-justify">
  <strong>${nombreFiscal}</strong>, Fiscal Adjunta de la UNIDAD DE ÁNALISIS CRIMINAL Y FOCOS INVESTIGATIVOS, domiciliada en Bilbao N° 780 de la comuna de Temuco, en la causa RUC N° ${ruc}, a US. respetuosamente digo:
  </p>
  <br></br>
  <p class="ql-align-justify">Solicito a UD. se sirva a disponer de la realización de una audiencia en fecha próxima, a objeto de formalizar la presente investigación en contra de don <strong>${imputado1.nombreCompleto}</strong>, cédula de identidad N° ${imputado1.rut}, ignoro profesión u oficio, domiciliado en ${imputado1.direccion}, correo electrónico, ${imputado1.correo}, y de don <strong>${imputado2.nombreCompleto}</strong>, cédula de identidad N° ${imputado2.rut}, ignoro profesión u oficio, domiciliado en ${imputado2.direccion}, correo electrónico,${imputado2.correo}, por la participación y responsabilidad que les cabe en el siguiente delito:
  </p>
  <br></br>
  <ul>
  <li class="ql-align-justify"><strong>Delito: </strong>${tipoDelito}</li>
  <li class="ql-align-justify"><strong>Lugar de Comisión: </strong>${direccionDelito}</li>
  <li class="ql-align-justify"><strong>Fecha de Comisión: </strong>${fechaDelito}</li>
  <li class="ql-align-justify"><strong>Grado de Participación: </strong>Autor</li>
  </ul>
  <br></br>
  <p class="ql-align-justify">
  <strong>POR TANTO, </strong>atendiendo a lo dispuesto en el artículo 231 del Código Procesal Penal, <strong>RUEGO A UD.: </strong>se sirva acceder a lo solicitado fijando audiencia con fecha próxima.
  </p>
  `
}

function getEscrito () {
  const nombreFiscal = $userName.value || 'Achifelle'
  const ruc = rucCausa.value

  // desestructurar sujetos
  const imputados = sujetosIntervinientes.value.filter((sf) => sf.tipoSujeto === '06D276D1-4F17-4F10-AD53-80F54D67F7B2')

  let delito = {
    tipoDelito: 'NOMBRE_DELITO',
    direccionDelito: 'DIRECCION_DELITO',
    fechaDelito: '01-01-1960'
  }
  // desestructurar delitos
  const infoDelito = delitos.value.map((d) => {
    return {
      tipoDelito: d?.delito?.tipoDelito,
      direccionDelito: `${d?.direccionDelito.calle} ${d?.direccionDelito.numero}`,
      fechaDelito: dateTimeUtil.formatToFrontendWithTime(d?.fechaOcurrencia)
    }
  })

  const imputado1 = {
    nombreCompleto: 'NOMBRE_PRIMER_IMPUTADO',
    rut: '11.111.111-1',
    direccion: 'DIRECCION_PRIMER_IMPUTADO',
    correo: 'CORREO1@IMPUTADO.CL'
  }
  if (imputados[0]) {
    imputado1.nombreCompleto = getNombreCompletoSujeto(imputados[0])
    imputado1.rut = imputados[0]?.numeroDocumento
  }
  const imputado2 = {
    nombreCompleto: 'NOMBRE_SEGUNDO_IMPUTADO',
    rut: '22.222.222-2',
    direccion: 'DIRECCION_SEGUNDO_IMPUTADO',
    correo: 'CORREO2@IMPUTADO.CL'
  }
  if (imputados[1]) {
    imputado2.nombreCompleto = getNombreCompletoSujeto(imputados[1])
    imputado2.rut = imputados[1]?.numeroDocumento
  }

  if (infoDelito.length > 0) {
    delito = infoDelito[0]
  }

  return createEscritoSolicitud({
    nombreFiscal,
    ruc,
    imputado1,
    imputado2,
    delito
  })
}

// funcion momentanea mientras plantilla se genere en frontend (eliminar cuando exista servicio)
function getNombreCompletoSujeto (sujeto) {
  let nombreCompleto = ''
  if (sujeto !== null && sujeto !== undefined) {
    if (sujeto.nombres !== '' && sujeto.nombres !== undefined) {
      nombreCompleto += sujeto.nombres + ' '
    }
    if (sujeto.apellidoPaterno !== '' && sujeto.apellidoPaterno !== undefined) {
      nombreCompleto += sujeto.apellidoPaterno + ' '
    }
    if (sujeto.apellidoMaterno !== '' && sujeto.apellidoMaterno !== undefined) {
      nombreCompleto += sujeto.apellidoMaterno
    }
  }
  return nombreCompleto
}
</script>
