<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-sujetos"
  class="w-full"
>
  <Column
    v-if="!isDenunciante"
    header="Tipo Sujeto"
  >
    <template #body="{ data }">
      {{ tipoSujeto(data?.tipoSujeto) }}
    </template>
  </Column>
  <Column
    body-class="uppercase"
    header="N° Documento"
  >
    <template #body="{ data }">
      {{ setNumeroDocumento(data?.numeroDocumento, data?.tipoDocumento) }}
    </template>
  </Column>
  <Column header="Nombre Completo">
    <template #body="{ data }">
      {{ nombreCompleto(data) }}
    </template>
  </Column>
  <Column
    v-if="isDenunciante || isRepresentados"
    header="Tipo Persona"
  >
    <template #body="{ data }">
      {{ data?.representaInstitucion === true ? "Persona Jurídica" : "Persona Natural" }}
    </template>
  </Column>
  <Column header="Nacionalidad">
    <template #body="{ data }">
      {{ nacionalidad(data?.idNacionalidad) || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha de Nacimiento">
    <template #body="{ data }">
      {{ data?.fechaNacimiento ? formatDate(data?.fechaNacimiento) : 'N/A' }}
    </template>
  </Column>
  <Column header="Edad">
    <template #body="{ data }">
      {{ getEdad(data?.fechaNacimiento) }}
    </template>
  </Column>
  <Column header="Género">
    <template #body="{ data }">
      <p v-if="data.sexoBiologico">
        {{ genero(data?.sexoBiologico) }}
      </p>
      <p v-else>
        N/D
      </p>
    </template>
  </Column>
  <Column
    v-if="!isRepresentados"
    header="Acciones"
  >
    <template #body="slotProps">
      <AppMenuOptions
        v-model="selected"
        :menu-options="menuOptions"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { format } from '@fiquu/cl-rut'

defineProps({
  isDenunciante: Boolean,
  isRepresentados: Boolean
})

const emit = defineEmits(['ver-ficha-sujeto', 'ver-representados'])

const {
  paises, mantenedor_getNombreTipoSujeto, mantenedor_getDescripcionTipoSexoById,
  mantenedor_getIdTipoSujetoByCodigo, mantenedor_getIdTipoDocumentoIdentidadByCodigo
} = useMantenedorStore()

const selected = ref()

function setNumeroDocumento (numero, tipo) {
  if (tipo === mantenedor_getIdTipoDocumentoIdentidadByCodigo('1')) return format(numero)
  else return numero
}

function nombreCompleto (data) {
  return `${data?.nombres} ${data?.apellidoPaterno} ${data?.apellidoMaterno}`.trim()
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}

function getEdad (date) {
  return dateTimeUtil.getEdad(date) || 'N/A'
}

function tipoSujeto (idTipoSujeto) {
  return mantenedor_getNombreTipoSujeto(idTipoSujeto)
}

function nacionalidad (idNacionalidad) {
  const pais = paises.value.find((n) => n.id === idNacionalidad)
  return pais?.descripcion
}

function genero (idGenero) {
  return mantenedor_getDescripcionTipoSexoById(idGenero)
}

// eslint-disable-next-line no-unused-vars
function isAbogado (idTipoSujeto) {
  const idTipoAbogado = mantenedor_getIdTipoSujetoByCodigo('21') // CODIGO 21: ABOGADO
  return idTipoSujeto === idTipoAbogado
}

const menuOptions = ref([
  {
    label: 'Ver Ficha Sujeto',
    command: () => emit('ver-ficha-sujeto', selected.value)
  },
  {
    label: 'Ver Representados',
    command: () => emit('ver-representados', selected.value),
    visible: () => isAbogado(selected.value?.tipoSujeto),
    disabled: () => true
  }
])
</script>
