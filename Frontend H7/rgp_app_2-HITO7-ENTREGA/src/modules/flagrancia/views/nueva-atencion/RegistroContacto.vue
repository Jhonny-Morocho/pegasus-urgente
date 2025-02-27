<template>
<div v-if="loader">
  <LoaderSkeleton />
</div>
<AppForm
  v-show="!loader"
  id="registro-contacto"
  :form-submitted="formSubmitted"
  validation-scope="formRegistroContacto"
>
  <div
    v-if="$hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`]) && !esNuevaAtencionFiscal"
    class="flex justify-content-center my-4  "
  >
    <div v-if="!isEditando">
      <Button
        class=" btn-form"
        :disabled="estadoFolio === 'Cerrado'"
        icon="pi pi-pencil"
        icon-pos="right"
        label="Modificar Registro"
        @click="handleModificarRegistro"
      />
    </div>
  </div>
  <RegistroContactoRegistroContacto
    ref="refRegistroContactoRegistroContacto"
    :solo-lectura="soloLectura"
  />

  <IdentificacionDenunciaInformacionInstitucion
    ref="refRegistroContactoInformacionInstitucion"
    :solo-lectura="soloLectura"
    validation-scope="formRegistroContacto"
  />

  <RegistroContactoFuncionarios
    ref="refRegistroContactoFuncionarios"
    :hay-data="refRegistroContactoInformacionInstitucion"
    :solo-lectura="soloLectura"
  />

  <div
    v-if="$hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`]) && !esNuevaAtencionFiscal"
    class="flex justify-content-center my-4  "
  >
    <div v-if="isEditando">
      <Button
        id="handleGuardarRegistro"
        class="p-button-warning mx-3"
        icon="pi pi-save"
        icon-pos="right"
        label="Guardar Registro"
        style="width: auto"
        type="button"
        @click="handleGuardarRegistro"
      />
      <Button
        id="handleCancelar"
        class="p-button-outlined p-button-warning"
        icon="pi pi-times"
        icon-pos="right"
        label="Cancelar"
        style="width: auto"
        type="button"
        @click="handleCancelarModificarRegistro"
      />
    </div>
  </div>

  <AppBtnNextTeleported
    v-if="$hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_equipo_turnoif_TIN`]) || esNuevaAtencionFiscal"
    label="Sujetos Intervinientes"
    :loading="isLoadingNextStep"
    @click="handleSubmitForm"
  />
</AppForm>
</template>

<script setup>
import { ref, defineEmits, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  useFormValidation,
  useAppToast,
  useAppGlobalProperties
} from '@/modules/common/composables'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import IdentificacionDenunciaInformacionInstitucion from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaInformacionInstitucion.vue'
import RegistroContactoRegistroContacto from '@/modules/flagrancia/components/registro-contacto/RegistroContactoRegistroContacto.vue'
import RegistroContactoFuncionarios from '@/modules/flagrancia/components/registro-contacto/RegistroContactoFuncionarios.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import {
  useProcedimientosBandejaStore,
  useStepRegistroContactoStore
} from '@/modules/flagrancia/composables'
import { useSessionStore } from '@/modules/session/composables'

import { dateTimeUtil, requestUtil, appUtil } from '@/utils'
import {
  usePamStore,
  useSujetosIntervinientesStore,
  useMantenedorStore,
  useFuncionarios
} from '@/modules/global/composables'

const router = useRouter()

const { procesoPam } = usePamStore()
const { folioProcedimientoData, esNuevaAtencionFiscal } = useProcedimientosBandejaStore()

const {
  mantenedor_getIdFiscaliaByCodigo,
  mantenedor_getIdTiposFiscaliaByCodigoFiscalia,
  mantenedor_getTiposDocumento,
  mantenedor_getIdTipoSujetoByCodigo,
  mantenedor_getIdTipoDocumentoIdentidadByCodigo,
  mantenedor_getIdPaisByCodigo, mantenedor_getIdRegionByCodigo,
  mantenedor_getNombreFiscalia, mantenedor_getTipoFiscalia,
  mantenedor_getRegiones, mantenedor_getTiposSujetos, mantenedor_getIdTipoContactoByCodigo,
  mantenedor_getTipoContacto
} = useMantenedorStore()

const { sujetosIntervinientes_addSujeto, sujetosIntervinientes } =
  useSujetosIntervinientesStore()

const emit = defineEmits(['next-step'])

const { user } = useSessionStore()

const {
  stepRegistroContacto_updateRegistroContacto,
  stepRegistroContacto_SET_DEFAULT_STATE,
  stepRegistroContacto_setRegistroContacto,
  stepRegistroContacto_getRegistroContacto,
  stepRegistroContacto_SET_REGISTRO_CONTACTO_BANDEJA,
  registroContacto, stepRegistroContacto_SET_MODO_EDICION,
  stepRegistroContacto_SET_DEFAULT_MODO_EDICION, isEditando
} = useStepRegistroContactoStore()

const { funcionarios_getFuncionarioIdProcedimiento, funcionario } =
  useFuncionarios()

const {
  procedimientos, esDenunciaDirectaFlagrante,
  procedimientosBandeja_SET_LOADER, loader, estadoFolio
} = useProcedimientosBandejaStore()

const { isFormValid, formSubmitted } = useFormValidation({
  formData: {},
  validationScope: 'formRegistroContacto'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const { $userSub, $userFiscaliaActual, $userPrincipalRole, $hasSomeRoles } =
  useAppGlobalProperties()

const $route = useRoute()

const refRegistroContactoRegistroContacto = ref(null)
const refRegistroContactoInformacionInstitucion = ref(null)
const isLoadingNextStep = ref(false)
const soloLectura = ref(false)

onMounted(() => {
  stepRegistroContacto_SET_DEFAULT_STATE()
  getDataRegistroContacto()
  if ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) && !esNuevaAtencionFiscal.value) soloLectura.value = true
})

function handleModificarRegistro () {
  stepRegistroContacto_SET_MODO_EDICION(true)
  soloLectura.value = false
  appUtil.scrollTo(0)
}
function handleCancelarModificarRegistro () {
  appUtil.scrollTo(0)
  soloLectura.value = true
  stepRegistroContacto_SET_MODO_EDICION(false)
}

function handleGuardarRegistro () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  handleSubmitForm()
  stepRegistroContacto_SET_MODO_EDICION(false)
  soloLectura.value = true
  appUtil.scrollTo(0)
}

function handleSubmitForm () {
  const payloadRegistroContacto = {
    procesoPam: {
      ...procesoPam.value
    },
    data: {
      ...registroContacto.value,
      // FISCALIA
      nombreFiscalia: mantenedor_getIdFiscaliaByCodigo($userFiscaliaActual.value.fiscalia.toString()),
      tipoFiscalia: mantenedor_getIdTiposFiscaliaByCodigoFiscalia($userFiscaliaActual.value.fiscalia.toString()),
      numeroFiscalia: $userFiscaliaActual.value.fiscalia,
      nombreFiscalTurno: user.value.preferred_username,
      region: mantenedor_getIdRegionByCodigo($userFiscaliaActual.value.region.toString()),
      correoElectronicoContacto: user.value.email,

      // refRegistroContactoInformacionInstitucion
      idOrganismoColaboradorUnidadDireccion: registroContacto.value?.idOrganismoColaboradorUnidadDireccion,
      ...refRegistroContactoInformacionInstitucion.value.formData,
      prefecturaDependencia: refRegistroContactoInformacionInstitucion.value.formData.prefecturaDependencia
        ? refRegistroContactoInformacionInstitucion.value.formData.prefecturaDependencia
        : 0, // el back pide obligatorio prefecturaDependencia,
      nombreContacto: refRegistroContactoInformacionInstitucion.value.formData.nombreContactoInstitucion,
      // refRegistroContactoRegistroContacto
      idRegistroContacto:
        refRegistroContactoRegistroContacto.value.formData.idRegistroContacto,
      folioProcedimiento:
        refRegistroContactoRegistroContacto.value.formData.folioProcedimiento,
      fechaHoraContacto:
        dateTimeUtil.formatToBackendWithTime(
          refRegistroContactoRegistroContacto.value.formData.fechaHoraContacto
        ) === 'Fecha inválida'
          ? registroContacto.value?.fechaHoraContacto
          : dateTimeUtil.formatToBackendWithTime(
            refRegistroContactoRegistroContacto.value.formData
              .fechaHoraContacto
          ),
      glosaContacto:
        refRegistroContactoRegistroContacto.value.formData.glosaContacto,
      tipoComunicacion:
        refRegistroContactoRegistroContacto.value.formData.tipoComunicacion,
      canalComunicacion:
        refRegistroContactoRegistroContacto.value.formData.canalComunicacion,
      idProcedimiento: procesoPam.value.idProcedimiento,
      idFiscalia: mantenedor_getIdFiscaliaByCodigo($userFiscaliaActual.value.fiscalia.toString()),
      funcionarios: funcionario.value,
      esDenunciaDirectaFlagrante: esDenunciaDirectaFlagrante.value,
      idDenuncia: folioProcedimientoData.value?.idDenuncia ?? procesoPam.value?.idDenuncia

    },
    user: {
      userSub: $userSub.value,
      region: $userFiscaliaActual.value.region.toString(),
      fiscalia: $userFiscaliaActual.value.fiscalia.toString(),
      rol: $userPrincipalRole.value
    }
  }
  delete payloadRegistroContacto.data.nombreContactoInstitucion
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  if (registroContacto?.value?.unidadPolicialOrganismo) {
    payloadRegistroContacto.data.idDenuncia = procesoPam.value.idDenuncia
    stepRegistroContacto_SET_DEFAULT_MODO_EDICION()
    soloLectura.value = false
    requestUtil({
      action: stepRegistroContacto_updateRegistroContacto,
      payload: payloadRegistroContacto.data,
      loader: (isLoading) => {
        isLoadingNextStep.value = isLoading
      },
      resolve: (v) => {
        setTimeout(() => {
          if ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.value.fiscalia}_fiscal_turno_TIN`]) && !esNuevaAtencionFiscal.value) {
            emit('next-step', 'FlagranciaNuevaAtencionDiligenciasEInstruccionesFiscal')
            procedimientosBandeja_SET_LOADER(false)
          } else {
            router.push({ name: 'FlagranciaNuevaAtencionSujetoIntervinientes' })
            procedimientosBandeja_SET_LOADER(false)
          }
        }, 1000)
      },
      reject: (r) => {
        console.log('error: ', r)
        toastError('Ocurrió un error inesperado')
      }
    })
  } else {
    requestUtil({
      action: stepRegistroContacto_setRegistroContacto,
      payload: payloadRegistroContacto,
      loader: (isLoading) => {
        isLoadingNextStep.value = isLoading
      },
      resolve: (v) => {
        addFuncionariosIntervinientesTestigos(funcionario.value)
        procedimientosBandeja_SET_LOADER(false)
      }
    })
  }
}

function createContract (dataTestigo) {
  return {
    idDenuncia: procesoPam.value.idDenuncia,
    tipoSujeto: mantenedor_getIdTipoSujetoByCodigo('15'),
    representaInstitucion: false,
    interviniente: {
      idRelacionSujeto: '',
      persona: {
        tieneOrdenDetencionVigente:
          dataTestigo.tieneOrdenDetencionVigente || '',
        idPersona: dataTestigo?.idPersona ? dataTestigo.idPersona : undefined,
        reservaTestigo: false,
        ciudadNacimiento: '',
        fechaNacimiento: '',
        estadoMigratorio: '',
        esNN: false,
        esIdentidadValidada: true,
        esNecesitaInterprete: false,
        esReservaDeDatos: false,
        esMenorDeEdad: false,
        esFuncionarioPublico: true
      },
      identificacion: {
        tipoDocumento: mantenedor_getIdTipoDocumentoIdentidadByCodigo('1'),
        paisEmisorDocumento: mantenedor_getIdPaisByCodigo('15'),
        numeroDocumento: dataTestigo.rut.replaceAll('.', ''),
        fotografia: '',
        firma: '',
        huella: ''
      },
      nombre: {
        nombres: dataTestigo.nombre,
        primerApellido: dataTestigo.apellidoPaterno,
        segundoApellido: dataTestigo.apellidoMaterno,
        aliasApelativo: '',
        nombreSocial: ''
      },
      esConfidencial: false,
      nacionalidad: mantenedor_getIdPaisByCodigo('15'),
      idioma: '',
      sexo: {
        sexoDeclarado: '',
        sexoBiologico: ''
      },
      pueblosOriginarios: '',
      profesionOficioOcupacion: '',
      estadoCivil: '',
      escolaridad: '',
      tipoDiscapacidad: [],
      conQuienVive: {
        idTipoConviviente: '',
        especificacion: ''
      },
      esRPA: null,
      documentoOrdenDetencion: '',
      cargoFuncionarioPublico: '',
      institucionFuncionarioPublico: '',
      conoceImputado: null,
      conoceTestigo: null,
      estadoSalud: {
        estadoTemperancia: '',
        esLesionado: false,
        dau: '',
        descripcionLesion: '',
        origenLesion: '',
        quedaHospitalizado: false,
        idOrganismoSalud: '',
        indicadorConsumoDrogas: '',
        nombreCompletoMedico: '',
        rutMedico: ''
      },
      declaracion: '',
      tipoVictima: '',
      fueRestringidoDeLibertad: false,
      seInformoAlTribunalFamilia: false,
      esVictima: false,
      nnaEsAdultoProtector: '',
      idNnaParentesco: '',
      nnaAQuienContoHechos: '',
      nnaComoSupoHechos: '',
      esNNA: false,
      requiereFormularioRiesgoNNA: false,
      formularioRiesgoNNA: false,
      requierePautaVIF: false,
      medidasProteccion: {
        idsMedidas: ''
      },
      detencion: {
        destinoImputado: '',
        estaDetenido: false,
        causaDetencion: '',
        fechaHoraDetencion: '',
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
        pasaControlDetencion: false
      },
      rolHechoDelictual: '',
      perfilImputado: '',
      muertesBajoCustodia: false,
      quienAplicoFuerza: dataTestigo?.seAplicoFuerza
        ? {
          idOrganismoPertenecienteRol: dataTestigo.idOrganismoPertenecienteRol,
          rutQuienUtilizoFuerza: dataTestigo.rutQuienUtilizoFuerza,
          nombreCompleto: dataTestigo.nombresQuienAplicoFuerza,
          descripcionQuienAplico: dataTestigo.descripcionQuienAplico,
          tipoTelefono: dataTestigo.tipoTelefono,
          telefono: dataTestigo.telefonoQuienAplicoFuerza,
          correoElectronico: dataTestigo.correoElectronicoQuienAplicoFuerza
        }
        : null,
      fuenteInformacion: '',
      tipoTestigo: '',
      descripcionImputado: '',
      representante:
        dataTestigo.tipoSujeto === 'Defensor'
          ? {
            tipoSujetoQueRepresenta: dataTestigo.tipoSujetoQueRepresenta,
            tipoInstitucion: dataTestigo.tipoInstitucionQuePertenece,
            nombreInstitucion: dataTestigo.nombreInstitucionQuePertenece,
            acreditacion: dataTestigo.comoAcreditaRepresentacion,
            nombreRepresentado: dataTestigo.nombreDelRepresentado,
            apellidoRepresentado: dataTestigo.apellidoDelRepresentado
          }
          : null,
      tipoContacto: mantenedor_getIdTipoContactoByCodigo('0'),
      telefonoFijoContacto: '',
      telefonoMovilContacto: '',
      correoElectronicoContacto: 'funcionario@gmail.com',
      indicadorDireccionNotificacion: false,
      redSocial: {
        operador: '',
        identificador: ''
      },
      aquienEntrego: ''
    },
    intervinienteJuridico: {
      idPersonaJuridica: '',
      rutPersonaJuridica: '',
      razonSocial: '',
      direccionPersonaJuridica: {
        idRegion: '',
        idComuna: '',
        calle: '',
        numeroCalle: ''
      },
      telefonoFijoPersonaJuridica: '',
      correoElectronicoPersonaJuridica: ''
    }
  }
}

function getDataMantenedores () {
  requestUtil({ action: mantenedor_getTiposSujetos })
  requestUtil({ action: mantenedor_getTiposDocumento })
  requestUtil({ action: mantenedor_getTipoFiscalia })
  requestUtil({ action: mantenedor_getRegiones })
  requestUtil({ action: mantenedor_getNombreFiscalia })
  requestUtil({ action: mantenedor_getTipoContacto })
}
getDataMantenedores()

function addFuncionariosIntervinientesTestigos (funcionariosTestigos) {
  const testigosIntervinientes = funcionariosTestigos.filter(
    (f) => !sujetosIntervinientes.value.some((s) => s.numeroDocumento === f.rut)
  )

  if (testigosIntervinientes.length > 0) {
    testigosIntervinientes.forEach((dataTestigo) => {
      if (dataTestigo.esTestigo) {
        const sujeto = createContract(dataTestigo)
        addSujeto(sujeto)
      } else {
        if ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`])) {
          stepRegistroContacto_SET_DEFAULT_MODO_EDICION()
        } else router.push({ name: 'FlagranciaNuevaAtencionSujetoIntervinientes' })
      }
    })
  } else {
    if ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`])) {
      stepRegistroContacto_SET_DEFAULT_MODO_EDICION()
    }
    router.push({ name: 'FlagranciaNuevaAtencionSujetoIntervinientes' })
  }
}

function addSujeto (payload) {
  requestUtil({
    action: sujetosIntervinientes_addSujeto,
    payload: payload,
    resolve: () => {
      if ($hasSomeRoles([`zona_2_fiscalia_${$userFiscaliaActual.fiscalia}_fiscal_turno_TIN`])) {
        stepRegistroContacto_SET_DEFAULT_MODO_EDICION()
      }
      router.push({ name: 'FlagranciaNuevaAtencionSujetoIntervinientes' })
    }
  })
}

function getDataRegistroContacto () {
  procedimientosBandeja_SET_LOADER(true)
  requestUtil({
    action: stepRegistroContacto_getRegistroContacto,
    payload: {
      'id-procedimiento': procesoPam.value.idProcedimiento,
      'id-denuncia': procesoPam.value.idDenuncia
    },
    resolve: () => {
      setData()
      getDataFuncionario()
    }
  })
}

async function getDataFuncionario () {
  requestUtil({
    action: funcionarios_getFuncionarioIdProcedimiento,
    payload: {
      idProcedimiento: procesoPam.value.idProcedimiento
    },
    resolve: async () => {
      await nextTick()
      setData()
    }
  })
}

function setData () {
  if (registroContacto.value.nombreFiscalTurno) {
    // refRegistroContactoRegistroContacto
    refRegistroContactoRegistroContacto.value?.populateData({
      ...registroContacto.value,
      fechaHoraContacto: dateTimeUtil.formatToFrontendWithTime(
        registroContacto.value?.fechaHoraContacto
      )
    })

    // refRegistroContactoInformacionInstitucion
    refRegistroContactoInformacionInstitucion.value?.populateData({
      ...registroContacto.value,
      region: registroContacto?.value.region?.toUpperCase(),
      comuna: registroContacto?.value.comuna?.toUpperCase()
    })
  }
  procedimientosBandeja_SET_LOADER(false)
}

// MODO LECTURA
if ($route.params?.idProcedimiento) {
  requestUtil({
    action: stepRegistroContacto_getRegistroContacto,
    payload: {
      idProcedimiento: $route.params?.idProcedimiento
    },
    resolve: (data) => {
      // remove eventually
      const procedimiento = procedimientos.value.filter(
        (elem) => elem.idProcedimiento === data
      )
      stepRegistroContacto_SET_REGISTRO_CONTACTO_BANDEJA(procedimiento[0])
    }
  })
}
</script>
