<template>
<AppFieldset legend="Información de la Institución">
  <AppDropdown
    id="unidad-policial"
    v-model="institucionDenunciante.unidadPoliciaOrganismo"
    class="col-12 md:col-6"
    disabled
    label="Unidad Policial u Organismo"
    option-label="descripcion"
    option-value="id"
    :options="institucionesDenuncia"
    :retrieve-data-action="mantenedor_getInstitucionesDenuncia"
    show-clear
  />

  <AppDropdown
    v-if="escondeCamposInstitucion"
    id="prefectura-dependencia"
    v-model="institucionDenunciante.prefecturaDependenciaUP"
    class="col-12 md:col-6"
    disabled
    label="Prefectura/Dependencia U.P."
    option-label="descripcion"
    option-value="id"
    :options="prefecturas"
    placeholder
    :retrieve-data-action="mantenedor_getPrefecturas"
    show-clear
  />

  <AppDropdown
    v-if="escondeCamposInstitucion"
    id="comisaria"
    v-model="institucionDenunciante.comisaria"
    class="col-12 md:col-6"
    disabled
    label="Comisaría"
    option-label="descripcion"
    option-value="id"
    :options="comisarias"
    :retrieve-data-action="mantenedor_getComisarias"
    show-clear
  />

  <AppDropdown
    v-if="escondeCamposInstitucion"
    id="destacamento"
    v-model="institucionDenunciante.destacamento"
    class="col-12 md:col-6"
    disabled
    label="Destacamento"
    option-label="descripcion"
    option-value="id"
    :options="destacamentos"
    :retrieve-data-action="mantenedor_getDestacamentos"
    show-clear
  />

  <AppInput
    v-if="escondeCamposInstitucion"
    id="region"
    v-model="institucionDenunciante.region"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Región"
  />
  <AppDropdown
    v-else
    id="region"
    v-model="institucionDenunciante.region"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Región"
    option-label="descripcion"
    option-value="id"
    :options="regiones"
    :retrieve-data-action="mantenedor_getRegiones"
    show-clear
  />

  <AppInput
    v-if="escondeCamposInstitucion"
    id="comuna"
    v-model="institucionDenunciante.comuna"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Comuna"
  />
  <AppDropdown
    v-else
    id="comuna"
    v-model="institucionDenunciante.comuna"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Comuna"
    option-label="descripcion"
    option-value="id"
    :options="comunasOption"
    :retrieve-data-action="mantenedor_getComunas"
    show-clear
  />

  <AppInput
    id="calle"
    v-model="institucionDenunciante.calle"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Calle"
  />

  <AppInput
    id="numero"
    v-model="institucionDenunciante.numero"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Número"
  />

  <AppInput
    id="telefono-contacto"
    v-model="institucionDenunciante.telefonoContacto"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Teléfono de contacto"
  />

  <AppInput
    id="correo-electronico-contacto"
    v-model="institucionDenunciante.correoElectronicoContacto"
    class="col-12 md:col-6 lg:col-3"
    disabled
    label="Correo electrónico de contacto"
  />
</AppFieldset>
</template>

<script setup>
import { computed } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { useAntecedentesCausaData } from '@/modules/preclasificador/composables'

const { institucionDenunciante } = useAntecedentesCausaData()

const {
  prefecturas,
  regiones,
  comuna,
  institucionesDenuncia,
  comisarias,
  destacamentos,
  mantenedor_getComunas,
  mantenedor_getComisarias,
  mantenedor_getInstitucionesDenuncia,
  mantenedor_getDestacamentos,
  mantenedor_getCodigoInstitucionesDenunciaById,
  mantenedor_getRegiones,
  mantenedor_getPrefecturas
} = useMantenedorStore()

const escondeCamposInstitucion = computed(() => {
  return codigoInstitucion(institucionDenunciante.unidadPoliciaOrganismo) === '1' ||
      codigoInstitucion(institucionDenunciante.unidadPoliciaOrganismo) === '2'
})

const comunasOption = computed(() => {
  return comuna.value.filter((c) => c.idPadre === institucionDenunciante.region)
})

function codigoInstitucion (value) {
  return mantenedor_getCodigoInstitucionesDenunciaById(value)
}

</script>
