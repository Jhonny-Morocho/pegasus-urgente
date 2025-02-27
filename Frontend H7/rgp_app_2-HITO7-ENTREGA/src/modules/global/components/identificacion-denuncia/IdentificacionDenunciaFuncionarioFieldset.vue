<template>
<AppForm
  id="registro-contacto-funcionarios"
  :form-submitted="formSubmitted"
  validation-scope="formRegistroContactoFuncionario"
>
  <AppFieldset legend="Funcionarios">
    <AppDropdown
      id="tipo"
      v-model="formData.tipo"
      class="col-12 md:col-6 lg:col-3"
      label="Tipo Funcionario"
      option-label="descripcion"
      option-value="id"
      :options="tipoFuncionario"
      placeholder
      :retrieve-data-action="mantenedor_getTipoFuncionario"
      :rules="{
        required
      }"
      show-clear
      @change="formData.esTestigo = true /*Cuando se selecciona un valor el select button del Testigo se marca en Si*/"
    />

    <RutInput
      id="rut"
      v-model="formData.rut"
      class="col-12 md:col-6 lg:col-3"
      label="RUT"
    />

    <AppInput
      id="nombre"
      v-model="formData.nombre"
      class="col-12 md:col-6 lg:col-3"
      label="Nombre"
      :rules="{
        required,
        alfabetico
      }"
    />

    <AppInput
      id="apellidoPaterno"
      v-model="formData.apellidoPaterno"
      class="col-12 md:col-6 lg:col-3"
      label="Apellido Paterno"
      :rules="{
        required,
        alfabetico
      }"
    />

    <AppInput
      id="apellidoMaterno"
      v-model="formData.apellidoMaterno"
      class="col-12 md:col-6 lg:col-3 my-auto"
      label="Apellido Materno"
      :rules="{
        alfabetico
      }"
    />

    <AppInput
      id="grado"
      v-model="formData.grado"
      class="col-12 md:col-6 lg:col-3 my-auto"
      label="Grado"
      :rules="{
        required
      }"
    />

    <AppInput
      id="numeroPlaca"
      v-model="formData.numeroPlaca"
      class="col-12 md:col-6 lg:col-3 my-auto"
      label="Número de Placa"
      :rules="{
        required,
        numeric
      }"
    />

    <div class="col-12 p-0">
      <div class="col-12 md:col-6 lg:col-3">
        <p class="pl-2">
          Es Testigo
        </p>
        <AppSelectButton
          id="esTestigo"
          v-model="formData.esTestigo"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
        />
      </div>
    </div>

    <template #bottom>
      <div class="flex justify-content-center">
        <Button
          v-if="!updating"
          class="btn-form mb-5 px-5"
          icon="pi pi-user-plus"
          icon-pos="right"
          label="Agregar Funcionario"
          style="width: auto"
          @click.prevent="handleAgregarFuncionario"
        />

        <div
          v-else
          class="flex"
        >
          <div class="mr-4">
            <Button
              class="p-button-outlined p-button-warning"
              icon="pi pi-times"
              label="Cancelar"
              @click="handleCancelarEdicion"
            />
          </div>
          <div>
            <Button
              class="p-button-warning"
              icon="pi pi-pencil"
              label="Modificar Funcionario"
              @click.prevent="handleEditarFuncionario"
            />
          </div>
        </div>
      </div>
      <TablaFuncionarios
        class="mt-4 px-3"
        :loading="loaderTabla || loading"
        @funcionario:actualizar-tabla="handleActualizarTabla"
        @funcionario:rellenar="handleRellenarFuncionario"
      />
    </template>
  </AppFieldset>
</AppForm>
</template>

<script setup>
import { reactive, ref, defineProps } from 'vue'

import TablaFuncionarios from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaTablaFuncionarios.vue'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'

import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesStore, useFuncionarios, useMantenedorStore, usePamStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { identificacionDenuncia } = useIdentificacionDenunciaStore()

const { funcionarios_getFuncionarioIdDenuncia, funcionarios_addFuncionario, funcionarios_updateFuncionario, funcionario } = useFuncionarios()

const { sujetosIntervinientes_addSujeto } = useSujetosIntervinientesStore()

const {
  mantenedor_getTiposSujetos, mantenedor_getTiposDocumento,
  mantenedor_getTipoFuncionario, tipoFuncionario, mantenedor_getIdPaisByCodigo,
  mantenedor_getIdTipoFuncionarioByCodigo, mantenedor_getPaises,
  mantenedor_getIdTipoSujetoByCodigo, mantenedor_getIdTipoDocumentoIdentidadByCodigo,
  mantenedor_getIdTipoContactoByCodigo, mantenedor_getTipoContacto
} = useMantenedorStore()

const { procesoPam } = usePamStore()

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const formData = reactive({
  id: '',
  tipo: '',
  rut: '',
  esTestigo: null,
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  grado: '',
  numeroPlaca: ''
})

const { isFormValid, formSubmitted, required, resetFormData, alfabetico, numeric } = useFormValidation({
  formData,
  validationScope: 'formRegistroContactoFuncionario'
})

const getMantenedor = () => {
  requestUtil({ action: mantenedor_getPaises })
  requestUtil({ action: mantenedor_getTipoContacto })
}
getMantenedor()

const updating = ref(false)
const indexFuncionarioAEditar = ref(null)

const loaderTabla = ref(false)

function handleActualizarTabla () {
  loaderTabla.value = true
  requestUtil({
    action: funcionarios_getFuncionarioIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value?.idDenuncia
    },
    loader: (v) => setTimeout(() => {
      loaderTabla.value = v
    }, 2000),
    reject: (e) => {
      toastError('Ocurrió un error.')
    }

  })
}

function handleAgregarFuncionario () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  requestUtil({
    action: mantenedor_getTiposSujetos
  })
  requestUtil({
    action: mantenedor_getTiposDocumento
  })

  const formularioProcesado = procesarFormulario()

  if (!formularioProcesado) {
    return
  }
  loaderTabla.value = true
  formData.rut = formData.rut.replaceAll('.', '')
  const payload = {
    ...formData,
    idDenuncia: identificacionDenuncia.value.idDenuncia,
    idPersonaSujeto: '',
    idOrganismoColaborador: ''
  }
  requestUtil({
    action: funcionarios_addFuncionario,
    payload: payload,
    resolve: (data) => {
      console.log(data)
      formData.idDenuncia = payload.idDenuncia
      handleActualizarTabla()
      addSujetoTestigo(formData)
      // resetea el formulario
      toastSuccess(`El funcionario ${data.nombre} ${data.apellidoMaterno} ${data.apellidoPaterno} ha sido agregado con éxito`)
      handleCancelarEdicion()
    },
    reject: (e) => {
      console.error(e.data?.mensaje ?? e)
      loaderTabla.value = false
      toastError('Ocurrió un error.')
    }
  })
}

// rellena los datos del funcionario a modificar
function handleRellenarFuncionario ({ index, funcionarioData }) {
  updating.value = true
  indexFuncionarioAEditar.value = index
  Object.keys(formData).forEach((key) => {
    formData[key] = funcionarioData[key]
  })
  formData.id = funcionarioData.idFuncionario
}

function handleEditarFuncionario () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const formularioProcesado = procesarFormulario()
  if (!formularioProcesado) {
    return
  }
  console.log('formularioProcesado', formularioProcesado)
  loaderTabla.value = true
  const payload = {
    idFuncionario: formularioProcesado.id,
    dataFuncionario: {
      ...formularioProcesado,
      rut: formularioProcesado.rut.replaceAll('.', '')
    }
  }
  requestUtil({
    action: funcionarios_updateFuncionario,
    payload,
    resolve: () => {
      handleActualizarTabla()
      toastSuccess('El funcionario ha sido actualizado con éxito')
      handleCancelarEdicion()
    },
    reject: () => {
      loaderTabla.value = false
      toastError('El funcionario no ha sido actualizado con éxito')
    }
  })
}

function handleCancelarEdicion () {
  updating.value = false
  resetFormData()
  formSubmitted.value = false
  indexFuncionarioAEditar.value = null
}

function procesarFormulario () {
  // verifica si existe tipo
  const existeTipoACargo = funcionario.value.filter((f) => f.tipo === mantenedor_getIdTipoFuncionarioByCodigo('2') && f.rut !== formData.rut)

  // solo puede haber un funcionario tipo 'A Cargo del Procedimiento'
  if (existeTipoACargo.length > 0 && formData.tipo === mantenedor_getIdTipoFuncionarioByCodigo('2') && indexFuncionarioAEditar.value === null
  ) {
    toastError('Tipo de funcionario ya registrado, debe seleccionar otra opción')

    return
  }

  const existeRut = funcionario.value.filter((f) => f.rut === formData.rut)

  if (existeRut.length > 0 && indexFuncionarioAEditar.value === null) {
    formData.rut = ''
    toastError('RUT ya registrado')

    return
  }

  return {
    ...formData,
    idFuncionario: null,
    idPersona: null,
    idRut: null,
    idNombre: null,
    idFuncionarioOrganismo: null
  }
}

function addSujetoTestigo (dataTestigo) {
  const idTipoSujetoTestigo = mantenedor_getIdTipoSujetoByCodigo('15')
  const idTipoDocumento = mantenedor_getIdTipoDocumentoIdentidadByCodigo('1')
  if (dataTestigo.esTestigo) {
    const payload = {
      idDenuncia: dataTestigo.idDenuncia,
      tipoSujeto: idTipoSujetoTestigo,
      representaInstitucion: false,
      interviniente: {
        idRelacionSujeto: '',
        persona: {
          tieneOrdenDetencionVigente: dataTestigo.tieneOrdenDetencionVigente || '',
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
          tipoDocumento: idTipoDocumento,
          paisEmisorDocumento: mantenedor_getIdPaisByCodigo('15'),
          numeroDocumento: dataTestigo.rut,
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
    requestUtil({
      action: sujetosIntervinientes_addSujeto,
      payload: payload
    })
  }
}
</script>
