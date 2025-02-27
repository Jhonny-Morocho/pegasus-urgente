<template>
<AppFieldset legend="Identificación Representante Legal">
  <div class="col-12 p-0">
    <div class="grid">
      <div class="field col-12 md:col-6 lg:col-3">
        <span class="p-float-label">
          <AppDropdown
            id="tipoDocumentoPersonaJuridica"
            v-model="form.tipoDocumentoIdentificacion"
            label="Tipo Documento"
            option-label="descripcion"
            option-value="id"
            :options="tiposDocumento"
            :rules="{ required }"
            show-clear
            @change="setTipoDocumentoIdentificacion"
          />
        </span>
      </div>
      <div class="col-11 md:col-3 flex px-2 py-0">
        <AppInput
          v-if="
            mantenedor_getCodigoTipoDocumentoIdentidad(
              form.tipoDocumentoIdentificacion
            ) !== '1'
          "
          id="numeroidentificacion"
          v-model="form.numeroDocumentoIdentificacion"
          class="pr-0 mt-2 w-full"
          :disabled="!form.tipoDocumentoIdentificacion"
          label="Número Identificación"
          :rules="{ required }"
          style="border-radius: 4px 0px 0px 4px"
        />
        <RutInput
          v-else
          id="rut"
          v-model="form.numeroDocumentoIdentificacion"
          class="pr-0 mt-2 w-full"
          :disabled="!form.tipoDocumentoIdentificacion"
          label="RUT"
          :rules="{ required }"
          style="border-radius: 4px 0px 0px 4px"
        />
        <Button
          class="btn-primary mt-2 buttonSearch flex-end"
          :disabled="!form.numeroDocumentoIdentificacion || form.readonly"
          icon="pi pi-search"
          @click="srcel"
        />
      </div>

      <div class="field col-12 md:col-6 lg:col-3">
        <span class="p-float-label">
          <AppDropdown
            id="paisDocumentoIdentificacion"
            v-model="form.paisDocumentoIdentificacion"
            :disabled="
              (hasSrceiData && form.tipoDocumentoIdentificacion !== '') ||
                tipoDocumento == '1' ||
                tipoDocumento == '0'
            "
            label="País del Documento"
            option-label="descripcion"
            option-value="id"
            :options="paises"
            :rules="
              tipoDocumento !== '0' && tipoDocumento !== '1'
                ? { required }
                : undefined
            "
            show-clear
          />
        </span>
      </div>
      <AppCheckbox
        id="esIdentidadValidadaPersonaJuridica"
        v-model="form.esIdentidadValidada"
        class="field-checkbox col-12 lg:col-2 md:col-6"
        :disabled="(hasSrceiData && tipoDocumento !== '0') || form.readonly"
        label="Identidad Validada"
      />
      <AppInput
        id="nombresPersonaJuridica"
        v-model="form.nombres"
        class="col-12 md:col-6 lg:col-3"
        :disabled="hasSrceiData && tipoDocumento !== '0'"
        label="Nombres"
        :rules="{ required, alfabetico }"
      />
      <AppInput
        id="apellidoPaternoPersonaJuridica"
        v-model="form.apellidoPaterno"
        class="col-12 md:col-6 lg:col-3"
        :disabled="hasSrceiData && tipoDocumento !== '0'"
        label="Apellido Paterno"
        :rules="{ required, alfabetico }"
      />
      <AppInput
        id="apellidoMaternoPersonaJuridica"
        v-model="form.apellidoMaterno"
        class="col-12 md:col-6 lg:col-3"
        :disabled="hasSrceiData && tipoDocumento !== '0'"
        label="Apellido Materno"
        :rules="{ required, alfabetico }"
      />
      <AppInput
        id="ciudadNacimientoPersonaJuridica"
        v-model="form.ciudadNacimiento"
        class="col-12 md:col-3"
        label="Ciudad de Nacimiento"
        :rules="{ required, alfabetico }"
      />
      <AppDropdown
        id="nacionalidadPersonaJuridica"
        v-model="form.nacionalidad"
        class="col-12 md:col-6 lg:col-3"
        label="Nacionalidad"
        option-label="descripcion"
        option-value="id"
        :options="paises"
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        id="estadoMigratorioPersonaJuridica"
        v-model="form.estadoMigratorio"
        class="col-12 md:col-3"
        :disabled="form.nacionalidad === mantenedor_getIdPaisByCodigo('15')"
        label="Estado Migratorio"
        option-label="descripcion"
        option-value="id"
        :options="estadoMigratorio"
        :rules="
          form.nacionalidad !== mantenedor_getIdPaisByCodigo('15') && form.nacionalidad !== ''
            ? { required }
            : undefined
        "
        show-clear
      />
      <AppDropdown
        id="pueblosOriginariosPersonaJuridica"
        v-model="form.pueblosOriginarios"
        class="col-12 md:col-6 lg:col-3"
        :disabled="form.nacionalidad !== mantenedor_getIdPaisByCodigo('15')"
        label="Pueblos Originarios"
        option-label="descripcion"
        option-value="id"
        :options="pueblosOriginarios"
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
          id="idiomaPersonaJuridica"
          v-model="form.idioma"
          class="col-12 lg:col-6"
          :disabled="hasSrceiData && codigoTipoDocumento !== '0'"
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
        id="nombreSocialPersonaJuridica"
        v-model="form.nombreSocial"
        class="col-12 md:col-6 lg:col-3"
        label="Nombre Social"
      />
      <AppInput
        id="aliasApelativoPersonaJuridica"
        v-model="form.aliasApelativo"
        class="col-12 md:col-6 lg:col-3"
        label="Alias o Apelativo"
      />
      <AppCheckbox
        id="esNecesidadInterpretePersonaJuridica"
        v-model="form.esNecesidadInterprete"
        binary
        class="field-checkbox col-12 md:col-6 lg:col-3 mt-3 mb-4"
        label="Necesidad de Interprete"
      />
      <AppDropdown
        id="sexoRegistralPersonaJuridica"
        v-model="form.sexoRegistral"
        class="col-12 md:col-6 lg:col-3"
        label="Sexo Registral"
        option-label="descripcion"
        option-value="id"
        :options="tipoSexo"
        :rules="{ required }"
        show-clear
      />
      <AppDropdown
        id="identidadGeneroPersonaJuridica"
        v-model="form.identidadGenero"
        class="col-12 md:col-6 lg:col-3"
        label="Identidad de Género"
        option-label="descripcion"
        option-value="id"
        :options="identidadGenero"
        show-clear
      />
      <AppDropdown
        id="estadoCivilPersonaJuridica"
        v-model="form.estadoCivil"
        class="col-12 md:col-6 lg:col-3"
        label="Estado Civil"
        option-label="descripcion"
        option-value="id"
        :options="estadoCivil"
        show-clear
      />
      <AppCalendar
        id="fechaNacimientoPersonaJuridica"
        v-model="form.fechaNacimiento"
        class="col-12 md:col-6 lg:col-3"
        date-format="dd-mm-yy"
        label="Fecha de Nacimiento"
        :min-date="form.esMenorDeEdad ? menorDeEdad() : null"
        month-navigator
        :rules="{ required }"
        year-navigator
        year-range="1921:2030"
      />
      <div class="col-12 grid align-items-baseline lg:gap-1">
        <AppCheckbox
          id="condicionDiscapacidadPersonaJuridica"
          v-model="form.condicionDiscapacidad"
          binary
          class="col-12 md:col-6 lg:col-3 my-auto"
          label="Condición de Discapacidad"
        />
        <MultiSelect
          v-if="form.condicionDiscapacidad"
          id="tipoDiscapacidadPersonaJuridica"
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

      <AppCheckbox
        id="esReservaDeDatosPersonaJuridica"
        v-model="form.esReservaDeDatos"
        binary
        class="col-12 md:col-6 lg:col-3 my-auto"
        label="Marca de Reserva de Datos"
      />
      <div class="col-12">
        <div class="grid">
          <AppDropdown
            v-if="tipoSujeto !== '12'"
            id="escolaridadPersonaJuridica"
            v-model="form.escolaridad"
            class="col-12 md:col-6 lg:col-3"
            label="Escolaridad"
            option-label="descripcion"
            option-value="id"
            :options="escolaridad"
            show-clear
          />
          <AppDropdown
            v-if="tipoSujeto !== '12'"
            id="profesionOficioPersonaJuridica"
            v-model="form.profesionOficioOcupacion"
            class="col-12 md:col-6 lg:col-3"
            label="Profesión u Oficio"
            option-label="descripcion"
            option-value="id"
            :options="profesiones"
            show-clear
          />
        </div>
      </div>
    </div>
  </div>
</AppFieldset>
</template>

<script setup>
import { computed, ref, watch, defineProps } from 'vue'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

import {
  useMantenedorStore,
  useSujetosIntervinientesStore,
  useSujetosIntervinientesInject
} from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'

const { toastSuccess, toastError } = useAppToast()

const { required, isRutValid, alfabetico } = useFormValidation()

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const {
  sujetosInvervinientes_getInformacionSrcel,
  sujetosInvervinientes_getPoseeOrdenesDetencion
} = useSujetosIntervinientesStore()

const {
  tiposDocumento,
  paises, estadoMigratorio, mantenedor_getIdPaisByCodigo,
  tipoSexo, identidadGenero, estadoCivil, discapacidad,
  escolaridad, profesiones, mantenedor_getIdDiscapacidadByCodigo,
  mantenedor_getCodigoTipoDocumentoIdentidad,
  mantenedor_getCodigoTipoSujeto, pueblosOriginarios,
  mantenedor_getIdTipoSexoByDescripcion,
  mantenedor_getIdTipoSexoByCodigo
} = useMantenedorStore()

const form = sujetosIntervinientesInject

const hasSrceiData = ref(false)

const props = defineProps({
  tipoSujeto: propTypes.string
})
const tipoSujeto = computed(() => mantenedor_getCodigoTipoSujeto(props.tipoSujeto))
const tipoDocumento = computed(() =>
  mantenedor_getCodigoTipoDocumentoIdentidad(tipoDocumento)
)
const fotoPerfil = ref(false)
const firmaPerfil = ref(false)

function rellenarDatos (data) {
  Object.assign(form, data)
  if (data.sexoRegistral === 'F') {
    form.sexoRegistral = mantenedor_getIdTipoSexoByDescripcion('femenino')
  } else if (data.sexoRegistral === 'M') {
    form.sexoRegistral = mantenedor_getIdTipoSexoByDescripcion('masculino')
  } else form.sexoRegistral = mantenedor_getIdTipoSexoByCodigo('0') // No Definido
  form.esIdentidadValidada = true
  firmaPerfil.value = true
  fotoPerfil.value = true
  form.fechaNacimiento = data.fechaNacimiento
  form.profesionOficioOcupacion = data.profesion
  form.nacionalidad = data.nacionalidad
  form.identidadGenero = data.identidadGenero === 'string' ? null : data.identidadGenero
}

function tieneOrdenesDetencion (data) {
  form.tieneOrdenDetencionVigente = data.tieneOrdenDetencionVigente
}

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
  const otroPayload = {
    tipoDocumento: form.tipoDocumentoIdentificacion,
    numero: form.numeroDocumentoIdentificacion
  }
  requestUtil({
    action: sujetosInvervinientes_getInformacionSrcel,
    payload: payload,
    resolve: (v) => {
      form.foto = v.fotografia.base64Data
      form.firma = v.firma.base64Data
      if (v.origenInformacion === 'SRCEI') {
        hasSrceiData.value = true
        toastSuccess('Se obtuvieron datos desde SRCel')
      } else {
        hasSrceiData.value = false
        toastSuccess(`Se obtuvieron datos desde ${v.origenInformacion}`)
      }
      rellenarDatos(v)
    },
    reject: (e) => {
      console.log('reject', e)
      toastError('Ha ocurrido un problema con SRCel/PDI')
    }
  })
  requestUtil({
    action: sujetosInvervinientes_getPoseeOrdenesDetencion,
    payload: otroPayload,
    resolve: (v) => {
      tieneOrdenesDetencion(v)
    },
    reject: (e) => {
      console.log('reject', e)
      toastError('No se pudo verificar si posee ordenes de detención')
    }
  })
}

const codigoTipoDocumento = computed(() =>
  mantenedor_getCodigoTipoDocumentoIdentidad(form.tipoDocumentoIdentificacion)
)

function setTipoDocumentoIdentificacion () {
  if (codigoTipoDocumento.value !== 0) {
    form.numeroDocumentoIdentificacion = ''
  }

  form.codigoTipoDocumento = codigoTipoDocumento.value
  if (codigoTipoDocumento.value === '1') {
    form.nacionalidad = mantenedor_getIdPaisByCodigo('15')
    form.paisDocumentoIdentificacion = mantenedor_getIdPaisByCodigo('15')
  } else if (codigoTipoDocumento.value === '0') {
    form.numeroDocumentoIdentificacion = 'Sin Información'
    form.paisDocumentoIdentificacion = mantenedor_getIdPaisByCodigo('0')
  }
}

const menorDeEdad = function () {
  const date18YrsAgo = new Date()
  date18YrsAgo.setFullYear(date18YrsAgo.getFullYear() - 18)
  return date18YrsAgo
}
const esOtraDiscapacidad = ref()
function findIdOtra () {
  esOtraDiscapacidad.value = [...form?.tipoDiscapacidad].includes(mantenedor_getIdDiscapacidadByCodigo('99'))
}
function resetDiscapacidad () {
  form.tipoDiscapacidad = []
  form.tipoDiscapacidadOtra = ''
  esOtraDiscapacidad.value = false
}
watch(
  () => form.condicionDiscapacidad,
  () => { if (!form.condicionDiscapacidad) resetDiscapacidad() }
)
function resetIdiomaOtro () {
  form.idiomaOtro = ''
}

</script>
<style scoped>
.buttonSearch {
  width: 34px;
  height: 34px;
  border-radius: 0px 4px 4px 0px;
}
.p-multiselect {
  height: 33.5px;
}
</style>
