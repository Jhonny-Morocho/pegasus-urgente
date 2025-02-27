<template>
<div>
  <hr>
  <div class="mt-4 mb-6 header">
    CARABINEROS DE CHILE PREF. CASABLANCA 5°. COM. CASABLANCA.
  </div>

  <AppFieldset
    class="mb-5"
    legend="Antecedentes de la Denuncia"
    :toggleable="true"
  >
    <div class="col-12 md:col-6">
      <p><strong>Tipo de denuncia: </strong>{{ mantenedor_getTipoDenunciaNombreById(antecedentes?.idTipoDenuncia) }}</p>
      <p><strong>Region: </strong>{{ fiscaliaLocal?.region }}</p>
      <p><strong>Nombre Fiscalia: </strong>{{ fiscaliaLocal?.nombreFiscalia }}</p>
      <p><strong>Institución Policial: </strong>{{ institucion?.unidadPoliciaOrganismo }}</p>
    </div>
    <div class="col-12 md:col-6">
      <p><strong>Fecha Denuncia: </strong>{{ antecedentes?.fechaHoraDenuncia.split('T')[0] }}</p>
      <p><strong>Hora Denuncia: </strong>{{ antecedentes?.fechaHoraDenuncia.split('T')[1] }}</p>
      <p><strong>Unidad Policial: </strong>{{ institucion?.unidadPoliciaOrganismo }}</p>
      <p><strong>Prefectura: </strong>{{ institucion?.prefecturaDependenciaUP }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    v-if="!isDenunciaDirecta"
    class="mb-5"
    :collapsed="true"
    legend="Funcionario que confecciona el Parte"
    :toggleable="true"
  >
    <div class="col-12">
      <p><strong>Nombre: </strong>{{ infoDenuncia?.funcionarioParte?.nombreFuncionario }}</p>
      <p><strong>RUT: </strong>{{ infoDenuncia?.funcionarioParte?.rutFuncionario }}</p>
      <p><strong>Grado: </strong>{{ infoDenuncia?.funcionarioParte?.gradoFuncionario }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    v-if="!isDenunciaDirecta"
    class="mb-5"
    :collapsed="true"
    legend="Funcionario a Cargo del Procedimiento"
    :toggleable="true"
  >
    <div class="col-12">
      <p><strong>Nombre: </strong>{{ antecedentes?.funcionarioCargoProcedimiento }}</p>
      <p><strong>RUT: </strong>{{ infoDenuncia?.funcionarioProcedimiento?.rutFuncionario }}</p>
      <p><strong>Grado: </strong>{{ infoDenuncia?.funcionarioProcedimiento?.gradoFuncionario }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Antecedentes del Delito"
    :toggleable="true"
  >
    <div
      v-for="(delito, index) in delitos"
      :key="index"
      class="grid w-full p-2 mb-4"
    >
      <div class="col-12 md:col-6">
        <p><strong>Codigo Delito: </strong>{{ delito?.delito?.tipoDelito }}</p>
        <p><strong>Fecha Delito: </strong>{{ delito?.fechaOcurrencia }}</p>
        <p><strong>Hora Delito: </strong>{{ delito?.fechaOcurrencia }}</p>
      </div>
      <div class="col-12 md:col-6">
        <p><strong>Lugar Ocurrencia: </strong>{{ delito?.lugarDelito?.lugarOcurrencia }}</p>
        <p><strong>Direccion del Delito: </strong>{{ delito?.direccionDelito?.calle }}, {{ delito?.direccionDelito?.comuna }}</p>
        <p><strong>Region: </strong>{{ delito?.direccionDelito?.region }}</p>
      </div>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Identificación del Denunciante"
    :toggleable="true"
  >
    <div class="col-12 md:col-6">
      <p><strong>Tipo Doc.Identificación: </strong></p>
      <p><strong>Nro.Doc.Identificación: </strong></p>
      <p><strong>Nombres: </strong>{{ infoDenuncia?.identificacionDenunciante?.nombres }}</p>
      <p><strong>Apellido Paterno: </strong>{{ infoDenuncia?.identificacionDenunciante?.apellidoPaterno }}</p>
      <p><strong>Apellido Materno: </strong>{{ infoDenuncia?.identificacionDenunciante?.apellidoMaterno }}</p>
      <p><strong>Nacionalidad: </strong>{{ infoDenuncia?.identificacionDenunciante?.nacionalidad }}</p>
    </div>
    <div class="col-12 md:col-6">
      <p><strong>Sexo: </strong>{{ infoDenuncia?.identificacionDenunciante?.sexo }}</p>
      <p><strong>Fecha Nacimiento: </strong>{{ infoDenuncia?.identificacionDenunciante?.fechaNacimiento }}</p>
      <p><strong>Dirección Denunciante: </strong>{{ infoDenuncia?.identificacionDenunciante?.direccionDenunciante }}</p>
      <p><strong>Comuna: </strong>{{ infoDenuncia?.identificacionDenunciante?.comuna }}</p>
      <p><strong>Región: </strong>{{ infoDenuncia?.identificacionDenunciante?.region }}</p>
      <p><strong>Telefonos: </strong>{{ infoDenuncia?.identificacionDenunciante?.telefonos }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Relato del Hecho"
    :toggleable="true"
  >
    <div class="col-12">
      <p class="text-justify">
        {{ relato?.relato || 'Relato sin definir' }}
      </p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Mas Información"
    :toggleable="true"
  >
    <div class="flex flex-column">
      <p class="line-height-4">
        <strong>Especies Sustraídas: </strong>{{ infoDenuncia?.especiesRelatoHecho?.especiesSustraidas }}
      </p>
      <p class="line-height-4">
        <strong>Avaluo: </strong>{{ infoDenuncia?.especiesRelatoHecho?.avaluo }}
      </p>
      <p class="line-height-4">
        <strong>Testigos: </strong>{{ infoDenuncia?.especiesRelatoHecho?.testigos }}
      </p>
      <p class="line-height-4">
        <strong>Camaras: </strong>{{ infoDenuncia?.especiesRelatoHecho?.camaras }}
      </p>
      <p class="line-height-4">
        <strong>Seguros: </strong>{{ infoDenuncia?.especiesRelatoHecho?.seguro }}
      </p>
      <p class="line-height-4">
        <strong>Citacion: </strong>{{ infoDenuncia?.especiesRelatoHecho?.citacion }}
      </p>
    </div>
  </AppFieldset>

  <div class="mt-6 mb-4 footer">
    CARABINEROS DE CHILE PREF. CASABLANCA 5°. COM. CASABLANCA.
  </div>
</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAntecedentesCausaStore, useDelitoStore, useMantenedorStore, useRelatoStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { useTermino } from '../../composables'
import { requestUtil } from '@/utils'

const { ruc, idDenuncia } = useTermino()

const { mantenedor_getTipoDenunciaNombreById } = useMantenedorStore()

const { delitos, delito_getDelitoByIdDenuncia } = useDelitoStore()

const {
  // sujetosIntervinientes,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()

const { antecedentes, fiscaliaLocal, institucion, antecedentesCausa_getAntecedentesCausa } = useAntecedentesCausaStore()

const { relato_getRelatoByIdDenuncia, relato_SET_DEFAULT_STATE, relato } = useRelatoStore()

const isDenunciaDirecta = computed(() => { return mantenedor_getTipoDenunciaNombreById(antecedentes.value.idTipoDenuncia) === 'DIRECTA' })

const isLoading = ref(false)

const params = ref({
  page: 0,
  size: 50
})

async function getDelito () {
  await requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value, params },
    resolve: ({ data }) => {
      console.log('delito by id denuncia:', data)
    }
  })
}

async function getSujetos () {
  await requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia.value, params }
  })
}

async function getAntecedentesCausa () {
  await requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value }
  })
}

async function getRelatoById () {
  relato_SET_DEFAULT_STATE()
  requestUtil({
    action: relato_getRelatoByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value },
    loader: (l) => (isLoading.value = l)
  })
}

onMounted(async () => {
  getDelito()
  getSujetos()
  getAntecedentesCausa()
  getRelatoById()
  console.log('Desde modal ver denuncia Antecedentes', antecedentes)
  console.log('Desde modal ver denuncia Relato', relato)
  console.log('Desde modal ver denuncia Delito', delitos)
})
</script>

<style scoped>
strong {
  color: #686868;
  font-weight: 400;
  line-height: 1.5;
}

.header {
  font-weight: 500;
  width: 160px;
  font-size: 14px;
  line-height: 22px;
}
.footer {
  font-weight: 500;
  width: 160px;
  font-size: 14px;
  line-height: 22px;
}
</style>
