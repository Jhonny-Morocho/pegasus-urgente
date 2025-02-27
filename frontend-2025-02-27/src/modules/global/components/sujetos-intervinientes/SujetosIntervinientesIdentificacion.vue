<template>
<div class="col-12">
  <div class="grid">
    <div class="col-12 md:col-9 grid">
      <AppSelectButton
        id="representaInstitucion"
        v-model="form.idRepresentaInstitucion"
        class="col-12 md:col-5"
        :disabled="form.esNn"
        option-label="descripcion"
        option-value="id"
        :options="tiposPersona"
        :rules="{ required }"
      />
      <div class="col-12 md:col-7 p-0">
        <div v-if="false">
          <Message
            v-if="form.tieneOrdenDetencionVigente"
            class="m-1"
            severity="error"
          >
            <strong>Atención: </strong>Posee órdenes de detención vigente
          </Message>
          <Message
            v-else
            class="m-1"
            severity="success"
          >
            <strong>No posee órdenes de detención</strong>
          </Message>
        </div>
      </div>
      <AppDropdown
        id="tipo"
        v-model="form.tipoSujeto"
        class="col-12 md:col-6 lg:col-4"
        label="Tipo Sujeto / Interviniente"
        option-label="descripcion"
        option-value="id"
        :options="tiposSujeto"
        placeholder
        :retrieve-data-action="mantenedor_getTiposSujetos"
        :rules="{
          required,
        }"
        show-clear
        @change="emit('change-tipo-sujeto')"
      />
      <AppDropdown
        v-if="tipoSujeto == '6' || (tipoSujeto == '1' && form.esVictima)"
        id="tipoVictima"
        v-model="form.tipoVictima"
        class="col-12 md:col-4"
        label="Tipo Víctima"
        option-label="descripcion"
        option-value="id"
        :options="tipoVictima"
        :retrieve-data-action="mantenedor_getTipoVictima"
        :rules="{
          required,
        }"
        show-clear
      />
      <div
        v-if="tipoSujeto === '1'"
        class="flex align-items-center col-12 md:col-3 field-checkbox"
      >
        <AppCheckbox
          id="esVictima"
          v-model="form.esVictima"
          binary
          class="mb-0"
        />
        <label for="esVictima">Es Víctima</label>
      </div>
    </div>
    <div
      class="col-12 md:col-3 flex justify-content-space-between perfil-firma m-0"
    >
      <img
        v-if="!form.foto"
        id="imagen-perfil"
        alt="img-perfil"
        src="@/assets/images/foto-perfil.png"
        style="width: 45%; margin: auto"
      >
      <img
        v-else
        id="imagen-perfil-encontrada"
        alt="img-perfil-encontrada"
        :src="`data:image/jpg;base64,${form.foto?.base64Data}`"
        style="width: 45%; margin: auto"
      >
      <Divider layout="vertical" />
      <img
        v-if="!form.firma"
        id="imagen-firma-encontrada"
        alt="img-firma-encontrada"
        src="@/assets/images/firma.png"
        style="width: 45%; margin: auto"
      >
      <img
        v-else
        id="imagen-firma"
        alt="img-firma"
        :src="`data:image/jpg;base64,${form.firma?.base64Data}`"
        style="width: 45%; margin: auto"
      >
    </div>
    <div
      v-if="
        !form.representaInstitucion ||
          mantenedor_getTipoPersonaById(form.idRepresentaInstitucion) !== '1'
      "
    >
      <div class="col-12">
        <div class="grid">
          <div class="col-12 grid">
            <AppCheckbox
              v-if="showNn"
              id="esNn"
              v-model="form.esNn"
              v-tooltip.top="'Nombre Desconocido'"
              binary
              class="field-checkbox pl-2 col-12 md:col-3"
              :disabled="
                (form.hasSrceiData &&
                  mantenedor_getCodigoTipoDocumentoIdentidad(
                    form.tipoDocumentoIdentificacion
                  ) !== '0') ||
                  form.readonly
              "
              label="NN"
              placeholder="Top"
              @change="setDataNN"
            />
            <AppCheckbox
              id="esconfidencial"
              v-model="form.esConfidencial"
              binary
              class="field-checkbox pl-2 col-12 md:col-3"
              label="Confidencial"
            />
          </div>
          <AppDropdown
            v-if="!form.esNn"
            id="tipoDocumento"
            v-model="form.tipoDocumentoIdentificacion"
            class="field col-12 md:col-6 lg:col-3"
            :disabled="false"
            label="Tipo Documento"
            option-label="descripcion"
            option-value="id"
            :options="tiposDocumento"
            :retrieve-data-action="mantenedor_getTiposDocumento"
            :rules="{ required }"
            show-clear
            @change="setTipoDocumentoIdentificacion"
          />

          <div
            v-if="!form.esNn"
            class="col-12 md:col-6 lg:col-3 flex px-2 py-0"
          >
            <AppInput
              v-if="codigoTipoDocumento !== '1'"
              id="numeroidentificacion"
              v-model="form.numeroDocumentoIdentificacion"
              class="pr-0 mt-2 w-full"
              :disabled="
                !form.tipoDocumentoIdentificacion ||
                  codigoTipoDocumento === '0'
              "
              label="Número Identificación"
              :rules="codigoTipoDocumento === '0' ? undefined : { required }"
              style="border-radius: 4px 0px 0px 4px"
            />
            <RutInput
              v-else
              id="rut"
              v-model="form.numeroDocumentoIdentificacion"
              class="pr-0 mt-2 w-full"
              :disabled="!form.tipoDocumentoIdentificacion"
              label="RUT"
              style="border-radius: 4px 0px 0px 4px"
            />
            <Button
              class="btn-primary mt-2 buttonSearch flex-end"
              :disabled="
                !form.tipoDocumentoIdentificacion ||
                  codigoTipoDocumento !== '1' ||
                  form.readonly
              "
              icon="pi pi-search"
              :loading="srceiLoading"
              @click="srcel"
            />
          </div>
          <div
            v-if="!form.esNn"
            class="field col-12 md:col-6 lg:col-3"
          >
            <AppDropdown
              id="paisDocumentoIdentificacion"
              v-model="form.paisDocumentoIdentificacion"
              :disabled="
                (form.hasSrceiData &&
                  form.tipoDocumentoIdentificacion !== '') ||
                  codigoTipoDocumento === '0'
              "
              label="País del Documento"
              option-label="descripcion"
              option-value="id"
              :options="paises"
              :retrieve-data-action="mantenedor_getPaises"
              :rules="
                codigoTipoDocumento !== '0' && codigoTipoDocumento !== '1'
                  ? { required }
                  : undefined
              "
              show-clear
            />
          </div>
          <div class="col-12 md:col-6 lg:col-3 pt-3">
            <AppCheckbox
              v-if="!form.esNn"
              id="esIdentidadValidada"
              v-model="form.esIdentidadValidada"
              class="field-checkbox"
              :disabled="
                (form.hasSrceiData && codigoTipoDocumento !== '0') ||
                  form.readonly
              "
              label="Identidad Validada"
            />
          </div>
          <AppInput
            id="nombres"
            v-model="form.nombres"
            class="col-12 md:col-6 lg:col-3"
            :disabled="form.hasSrceiData && codigoTipoDocumento !== '0'"
            label="Nombres"
            :rules="{ required, alfabetico, allowSpaces: true }"
          />
          <AppInput
            id="apellidoPaterno"
            v-model="form.apellidoPaterno"
            class="col-12 md:col-6 lg:col-3"
            :disabled="
              (form.hasSrceiData && codigoTipoDocumento !== '0') ||
                form.readonly
            "
            label="Apellido Paterno"
            :rules="{ required, alfabetico, allowSpaces: true }"
          />
          <AppInput
            id="apellidoMaterno"
            v-model="form.apellidoMaterno"
            class="col-12 md:col-6 lg:col-3"
            :disabled="
              (form.hasSrceiData && codigoTipoDocumento !== '0') ||
                form.readonly
            "
            label="Apellido Materno"
            :rules="{ alfabetico, allowSpaces: true }"
          />
          <AppInput
            id="ciudadNacimiento"
            v-model="form.ciudadNacimiento"
            class="col-12 md:col-6 lg:col-3"
            :disabled="form.hasSrceiData"
            label="Ciudad de Nacimiento"
            :rules="{ required }"
          />
          <AppDropdown
            id="nacionalidad"
            v-model="form.nacionalidad"
            class="col-12 md:col-6 lg:col-3"
            label="Nacionalidad"
            option-label="descripcion"
            option-value="id"
            :options="paises"
            :retrieve-data-action="mantenedor_getPaises"
            :rules="{ required }"
            show-clear
          />
          <AppDropdown
            id="estadoMigratorio"
            v-model="form.estadoMigratorio"
            class="col-12 md:col-6 lg:col-3"
            :disabled="
              form.nacionalidad === mantenedor_getIdPaisByCodigo('15')
            "
            label="Estado Migratorio"
            option-label="descripcion"
            option-value="id"
            :options="estadoMigratorio"
            :retrieve-data-action="mantenedor_getEstadoMigratorio"
            :rules="
              form.nacionalidad !== mantenedor_getIdPaisByCodigo('15') &&
                form.nacionalidad !== ''
                ? { required }
                : undefined
            "
            show-clear
          />
          <AppDropdown
            id="pueblosOriginarios"
            v-model="form.pueblosOriginarios"
            class="col-12 md:col-6 lg:col-3"
            :disabled="
              form.nacionalidad !== mantenedor_getIdPaisByCodigo('15')
            "
            label="Pueblos Originarios"
            option-label="descripcion"
            option-value="id"
            :options="pueblosOriginarios"
            :retrieve-data-action="mantenedor_getPueblosOriginarios"
            show-clear
          />
          <AppDropdown
            v-if="form.idioma !== mantenedor_getIdPaisByCodigo('0')"
            id="idioma"
            v-model="form.idioma"
            class="col-12 md:col-6 lg:col-3"
            label="Idioma"
            option-label="descripcion"
            option-value="id"
            :options="paises"
            show-clear
          />
          <div
            v-else
            class="flex p-0 col-12 md:col-6 lg:col-3"
          >
            <AppDropdown
              id="idioma"
              v-model="form.idioma"
              class="col-12 lg:col-6"
              label="Idioma"
              option-label="descripcion"
              option-value="id"
              :options="paises"
              show-clear
              @change="resetIdiomaOtro"
            />
            <AppInput
              id="idiomaNombre"
              v-model="form.idiomaOtro"
              class="col-12 lg:col-6"
              label="Especifique"
            />
          </div>
          <AppInput
            id="nombreSocial"
            v-model="form.nombreSocial"
            class="col-12 md:col-6 lg:col-3"
            label="Nombre Social"
          />
          <AppInput
            id="aliasApelativo"
            v-model="form.aliasApelativo"
            class="col-12 md:col-6 lg:col-3"
            :disabled="false"
            label="Alias o Apelativo"
          />
          <AppDropdown
            id="sexoRegistral"
            v-model="form.sexoRegistral"
            class="col-12 md:col-6 lg:col-3"
            :disabled="form.hasSrceiData"
            label="Sexo Registral"
            option-label="descripcion"
            option-value="id"
            :options="tipoSexo"
            :retrieve-data-action="mantenedor_getTipoSexo"
            :rules="{ required }"
            show-clear
          />
          <AppCheckbox
            id="esNecesidadInterprete"
            v-model="form.esNecesidadInterprete"
            binary
            class="col-12 md:col-6 lg:col-3"
            label="Necesidad de Interprete"
          />
          <AppDropdown
            id="identidadGenero"
            v-model="form.identidadGenero"
            class="col-12 md:col-6 lg:col-3"
            label="Identidad de Género"
            option-label="descripcion"
            option-value="id"
            :options="identidadGenero"
            :retrieve-data-action="mantenedor_getIdentidadGenero"
            show-clear
          />
          <AppDropdown
            id="estadoCivil"
            v-model="form.estadoCivil"
            class="col-12 md:col-6 lg:col-3"
            label="Estado Civil"
            option-label="descripcion"
            option-value="id"
            :options="estadoCivil"
            :retrieve-data-action="mantenedor_getEstadoCivil"
            :rules="{ required }"
            show-clear
          />
          <AppCalendar
            id="fechaNacimiento"
            v-model="form.fechaNacimiento"
            class="col-12 md:col-6 lg:col-3"
            date-format="dd-mm-yy"
            :disabled="
              (form.hasSrceiData && codigoTipoDocumento !== '0') ||
                form.readonly
            "
            label="Fecha de Nacimiento"
            :min-date="form.esMenorDeEdad ? menorDeEdad() : null"
            month-navigator
            :rules="{ required }"
            year-navigator
            year-range="1921:2030"
          />
          <AppCheckbox
            id="esMenorDeEdad"
            v-model="form.esMenorDeEdad"
            binary
            class="col-12 md:col-6 lg:col-3 my-auto"
            label="Es menor de edad"
          />
          <div class="col-12 grid align-items-baseline lg:gap-1">
            <AppCheckbox
              id="condicionDiscapacidad"
              v-model="form.condicionDiscapacidad"
              binary
              class="col-12 md:col-6 lg:col-3 px-2 py-0 my-auto"
              label="Condición de Discapacidad"
            />
            <MultiSelect
              v-if="form.condicionDiscapacidad"
              id="tipoDiscapacidad"
              v-model="form.tipoDiscapacidad"
              class="col-12 md:col-6 lg:col-3 align-items-center"
              filter
              :max-selected-labels="2"
              option-label="descripcion"
              option-value="id"
              :options="discapacidad"
              placeholder="Tipo de discapacidad"
              selected-items-label="{0} Condición(es) de discapacidad selecionada(s)"
              show-clear
              @change="findIdOtra"
            />
            <AppInput
              v-if="esOtraDiscapacidad && form.condicionDiscapacidad"
              id="tipoDiscapacidadOtra"
              v-model="form.tipoDiscapacidadOtra"
              class="col-12 lg:col-3"
              label="Especifique"
            />
          </div>
          <div class="col-12">
            <div class="grid">
              <AppDropdown
                v-if="tipoSujeto !== 'Fiscal' && tipoSujeto !== '12'"
                id="escolaridad"
                v-model="form.escolaridad"
                class="col-12 md:col-6 lg:col-3"
                label="Escolaridad"
                option-label="descripcion"
                option-value="id"
                :options="escolaridad"
                :retrieve-data-action="mantenedor_getEscolaridad"
                show-clear
              />
              <AppDropdown
                v-if="tipoSujeto !== 'Fiscal' && tipoSujeto !== '12'"
                id="profesionOficio"
                v-model="form.profesionOficioOcupacion"
                class="col-12 md:col-6 lg:col-5"
                :disabled="form.hasSrceiData && codigoTipoDocumento !== '0'"
                label="Profesión u Oficio"
                option-label="descripcion"
                option-value="id"
                :options="profesiones"
                :retrieve-data-action="mantenedor_getProfesiones"
                show-clear
                :virtual-scroller-options="{ itemSize: 40 }"
              />
              <AppCheckbox
                id="esReservaDeDatos"
                v-model="form.esReservaDeDatos"
                binary
                class="col-12 md:col-6 lg:col-3 my-auto"
                label="Marca de Reserva de Datos"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <IdentificacionPersonaJuridica />
      <DireccionYDatosDeContactoPersonaJuridica />
      <IdentificacionRepresentanteLegal :tipo-sujeto="tipoSujeto" />
    </div>
  </div>
</div>
</template>

<script setup>
// DR - TO-DO:
// Re-ordenar la vista y reducir su complejidad
import { computed, ref, watch, defineEmits } from 'vue'
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import IdentificacionPersonaJuridica from '@/modules/global/components/sujetos-intervinientes/IdentificacionPersonaJuridica.vue'
import DireccionYDatosDeContactoPersonaJuridica from '@/modules/global/components/sujetos-intervinientes/DireccionYDatosDeContactoPersonaJuridica.vue'
import IdentificacionRepresentanteLegal from '@/modules/global/components/sujetos-intervinientes/IdentificacionRepresentanteLegal.vue'
import { requestUtil } from '@/utils'

// services
import { menorDeEdad } from '@/services/methods/services'

// componentes
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import {
  useSujetosIntervinientesInject,
  useSujetosIntervinientesStore,
  useMantenedorStore
} from '@/modules/global/composables'

const { toastSuccess, toastError, toastWarning } = useAppToast()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const form = sujetosIntervinientesInject

const { required, alfabetico, isRutValid } = useFormValidation()

const {
  tiposSujeto,
  paises,
  tiposPersona,
  tiposDocumento,
  estadoCivil,
  estadoMigratorio,
  identidadGenero,
  pueblosOriginarios,
  discapacidad,
  profesiones,
  mantenedor_getPaises,
  mantenedor_getProfesiones,
  mantenedor_getEstadoCivil,
  mantenedor_getTiposSujetos,
  mantenedor_getTiposPersona,
  mantenedor_getTipoPersonaById,
  mantenedor_getDiscapacidad,
  mantenedor_getTiposDocumento,
  mantenedor_getIdPaisByCodigo,
  mantenedor_getIdentidadGenero,
  mantenedor_getEstadoMigratorio,
  mantenedor_getCodigoTipoSujeto,
  mantenedor_getPueblosOriginarios,
  mantenedor_getValidacionIdentidad,
  mantenedor_getTipoPersonaIdByCodigo,
  mantenedor_getCodigoTipoDocumentoIdentidad,
  mantenedor_getIdTipoDocumentoIdentidadByCodigo,
  mantenedor_getTipoVictima,
  tipoVictima,
  mantenedor_getEscolaridad,
  escolaridad,
  mantenedor_getIdTipoSexoByDescripcion,
  mantenedor_getIdTipoSexoByCodigo,
  mantenedor_getTipoSexo,
  tipoSexo,
  mantenedor_getIdDiscapacidadByCodigo,
  mantenedor_getIdTipoRespuestaBasicaByDescripcion,
  mantenedor_getIdTipoContactoByCodigo
} = useMantenedorStore()

const codigoTipoDocumento = computed(() =>
  mantenedor_getCodigoTipoDocumentoIdentidad(form.tipoDocumentoIdentificacion)
)

const emit = defineEmits(['change-tipo-sujeto'])

watch(
  () => form.idRepresentaInstitucion,
  () => {
    if (mantenedor_getTipoPersonaById(form.idRepresentaInstitucion) === '1') {
      form.representaInstitucion = true
    } else {
      form.representaInstitucion = false
    }
  }
)
watch(
  () => form.representaInstitucion,
  () => {
    if (form.representaInstitucion) {
      form.idRepresentaInstitucion = mantenedor_getTipoPersonaIdByCodigo('1')
    } else {
      form.idRepresentaInstitucion = mantenedor_getTipoPersonaIdByCodigo('0')
    }
  }
)
watch(
  () => form.nacionalidad,
  () => {
    if (form.nacionalidad === mantenedor_getIdPaisByCodigo('15')) {
      form.estadoMigratorio = null
    } else if (!form.nacionalidad) {
      form.estadoMigratorio = null
      form.pueblosOriginarios = null
    }
  }
)
const tipoSujeto = computed(() =>
  mantenedor_getCodigoTipoSujeto(form.tipoSujeto)
)

const showNn = computed(
  () =>
    tipoSujeto.value === '6' || // VICTIMA
    tipoSujeto.value === '3' || // IMPUTADO
    tipoSujeto.value === '1' // DENUNCIANTE
)

const esOtraDiscapacidad = ref()
function findIdOtra () {
  esOtraDiscapacidad.value = [...form?.tipoDiscapacidad].includes(
    mantenedor_getIdDiscapacidadByCodigo('99')
  )
}
function resetDiscapacidad () {
  form.tipoDiscapacidad = []
  form.tipoDiscapacidadOtra = ''
  esOtraDiscapacidad.value = false
}
watch(
  () => form.condicionDiscapacidad,
  () => {
    if (!form.condicionDiscapacidad) resetDiscapacidad()
  }
)

function mantenedores () {
  requestUtil({ action: mantenedor_getDiscapacidad })
  requestUtil({ action: mantenedor_getValidacionIdentidad })
  requestUtil({
    action: mantenedor_getTiposPersona
  })
}

mantenedores()

function resetIdiomaOtro () {
  form.idiomaOtro = ''
}

watch(
  () => tipoSujeto,
  () => {
    if (!showNn.value) {
      form.esNn = false
      resetDataNn()
    }

    if (form.tipoSujeto === '6') {
      form.esVictima = true
    } else {
      form.esVictima = false
    }
  }
)

function setTipoDocumentoIdentificacion () {
  if (
    codigoTipoDocumento.value !== '0' &&
    codigoTipoDocumento.value !== undefined
  ) {
    form.numeroDocumentoIdentificacion = ''
  }

  form.codigoTipoDocumento = codigoTipoDocumento.value
  if (codigoTipoDocumento.value === '0') {
    form.numeroDocumentoIdentificacion = 'Sin Información'
    form.paisDocumentoIdentificacion = mantenedor_getIdPaisByCodigo('0')
  }
}

watch(
  () => form.esNn,
  () => {
    setDataNN()
  }
)

function resetDataNn () {
  form.tipoDocumentoIdentificacion = ''
  form.numeroDocumentoIdentificacion = ''
  form.paisDocumentoIdentificacion = ''
  form.nombres = ''
  form.apellidoPaterno = ''
  form.apellidoMaterno = ''
  form.codigoTipoDocumento = ''
}

function setDataNN () {
  if (form.esNn) {
    form.tipoDocumentoIdentificacion =
      mantenedor_getIdTipoDocumentoIdentidadByCodigo('0')
    form.numeroDocumentoIdentificacion = 'Sin documento'
    form.paisDocumentoIdentificacion = mantenedor_getIdPaisByCodigo('0')
    form.nombres = 'NN'
    form.apellidoPaterno = 'NN'
    form.apellidoMaterno = 'NN'
    form.codigoTipoDocumento = '0'
  } else {
    resetDataNn()
  }
}

const {
  sujetosInvervinientes_getInformacionSrcel,
  sujetosInvervinientes_getPoseeOrdenesDetencion
} = useSujetosIntervinientesStore()

function rellenarDatos (data) {
  Object.assign(form, data)
  if (data.sexoRegistral === 'F') {
    form.sexoRegistral = mantenedor_getIdTipoSexoByDescripcion('femenino')
  } else if (data.sexoRegistral === 'M') {
    form.sexoRegistral = mantenedor_getIdTipoSexoByDescripcion('masculino')
  } else form.sexoRegistral = mantenedor_getIdTipoSexoByCodigo('0') // No Definido
  form.esIdentidadValidada = true
  form.fechaNacimiento = data.fechaNacimiento
  form.profesionOficioOcupacion = data.profesion
  form.nacionalidad = data.nacionalidad
  form.identidadGenero =
    data.identidadGenero === 'string' ? null : data.identidadGenero
  form.paisDocumentoIdentificacion = mantenedor_getIdPaisByCodigo('15')
  form.infoTipoContacto = data?.infoTipoContacto
    ? data.infoTipoContacto
    : mantenedor_getIdTipoContactoByCodigo('0')
}

const srceiLoading = ref(false)

const srcel = async () => {
  if (
    mantenedor_getCodigoTipoDocumentoIdentidad(
      form.tipoDocumentoIdentificacion
    ) === '1' &&
    !isRutValid(form.numeroDocumentoIdentificacion)
  ) {
    toastError('El Rut no es válido')
    return
  }

  const payload = {
    tipoId: form.tipoDocumentoIdentificacion,
    numeroId: form.numeroDocumentoIdentificacion
  }

  requestUtil({
    action: sujetosInvervinientes_getInformacionSrcel,
    payload: payload,
    loader: (l) => {
      srceiLoading.value = l
    },
    resolve: (v) => {
      form.foto = v.fotografia
      form.firma = v.firma
      if (v.origenInformacion) {
        form.hasSrceiData = false
        if (v.origenInformacion === 'SRCEI') {
          form.hasSrceiData = true
          toastSuccess('Se obtuvieron datos desde SRCeI')
        } else {
          toastSuccess(`Se obtuvieron datos desde ${v?.origenInformacion}`)
        }
        rellenarDatos(v)
        getPoseeOrdenesDetencion()
      } else {
        toastWarning(`No se obtuvieron datos`)
      }
    },
    reject: () => {
      toastError('Ha ocurrido un problema con SRCeI/PDI')
    }
  })
}

function getPoseeOrdenesDetencion () {
  const payload = {
    tipoDocumento: form.tipoDocumentoIdentificacion,
    numero: form.numeroDocumentoIdentificacion
  }
  requestUtil({
    action: sujetosInvervinientes_getPoseeOrdenesDetencion,
    payload: payload,
    resolve: (v) => {
      setOrdenDetencion(v.tieneOrdenDetencionVigente)
    },
    reject: () => {
      toastError('No se pudo verificar si posee ordenes de detención')
    }
  })
}

function setOrdenDetencion (responseURL) {
  switch (responseURL) {
    case true:
      form.tieneOrdenDetencionVigente =
        mantenedor_getIdTipoRespuestaBasicaByDescripcion('Si')
      break
    case false:
      form.tieneOrdenDetencionVigente =
        mantenedor_getIdTipoRespuestaBasicaByDescripcion('No')
      break
    default:
      form.tieneOrdenDetencionVigente =
        mantenedor_getIdTipoRespuestaBasicaByDescripcion(
          'No Consultado/No Informado'
        )
      break
  }
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>
<style scoped>
.buttonSearch {
  width: 34px;
  height: 34px;
  border-radius: 0px 4px 4px 0px;
  border-color: rgb(214, 214, 214);
}
.perfil-firma {
  border-style: solid;
  border-color: rgb(158, 158, 158);
  border-width: 1px;
  border-radius: 4px;
  padding: 10px;
}
.p-multiselect {
  height: 33.5px;
}
</style>
