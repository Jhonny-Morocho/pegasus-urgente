<template>
<hr>
<main class="p-3 pb-0 mb-0">
  <AppForm
    id="solicitud-antecedente"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="solicitud-antecedente"
  >
    <AppDropdown
      id="ambito"
      v-model="formData.idAmbito"
      class="col-12 md:col-4"
      label="Ámbito"
      option-label="descripcion"
      option-value="id"
      :options="tiposAmbitoAntecedentes"
      :retrieve-data-action="mantenedor_getTiposAmbitoAntecedentes"
      :rules="{ required }"
      show-clear
      @change="getDataSegunAmbito"
    />
    <AppFieldset
      v-if="hasFieldset"
      class="w-full"
      :legend="`Lista de ${nombreAmbito}`"
    >
      <div class="p-inputgroup w-full md:w-4 ml-auto">
        <InputText
          id="filter-text"
          v-model="filtroTexto"
          class="p-inputtext-sm"
          placeholder="Buscar"
        />
        <Button
          class="btn-primary p-button-sm"
          icon="pi pi-search"
          @click="null"
        />
      </div>
      <TablaSolicitudSujetos
        v-if="codigoAmbito === '1'"
        v-model:first="sujetos.first"
        v-model:selection="formData.seleccionTabla"
        class="w-full mt-3"
        :loading="sujetos.isLoading"
        :rows="sujetos.paginacion?.tamanoPagina"
        :total-records="sujetos.paginacion?.elementosTotales"
        :value="sujetos.data"
      />
      <TablaSolicitudEspecies
        v-if="codigoAmbito === '2'"
        v-model:first="especies.first"
        v-model:selection="formData.seleccionTabla"
        class="w-full mt-3"
        :loading="especies.isLoading"
        :rows="especies.paginacion?.tamanoPagina"
        :total-records="especies.paginacion?.elementosTotales"
        :value="especies.data"
      />
    </AppFieldset>
  </AppForm>
  <section class="w-full flex flex-row-reverse gap-2">
    <Button
      class="px-6 p-button-primary"
      disabled
      label="Obtener"
      :loading="isLoadingMantenedor"
      @click="handleObtenerAntecedente"
    />
    <Button
      class="px-4 p-button-text"
      icon="pi pi-times"
      label="Cancelar"
      @click="dialogRef.close()"
    />
  </section>
</main>
</template>

<script setup>
import { reactive, inject, computed, ref, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useEspeciesDineroStore, useMantenedorStore, useSujetosIntervinientesStore } from '../../composables'
import TablaSolicitudEspecies from './TablaSolicitudEspecies.vue'
import TablaSolicitudSujetos from './TablaSolicitudSujetos.vue'

const dialogRef = inject('dialogRef')

const props = reactive({ ...dialogRef.value?.data })
const idDenuncia = computed(() => props?.idDenuncia)
const idCausa = computed(() => props?.idCausa)
const tipoSolicitudData = computed(() => props?.tipoSolicitudData)

const { toastError, TOAST_MESSAGES } = useAppToast()

const { tiposAmbitoAntecedentes, mantenedor_getTiposAmbitoAntecedentes } = useMantenedorStore()
const { sujetosIntervinientes_getSujetosByIdGlobal } = useSujetosIntervinientesStore()
const { especiesDinero_getEspecieByIdDenuncia } = useEspeciesDineroStore()
const {
  mantenedor_getTiposSujetos,
  mantenedor_getFamiliaEspecies,
  mantenedor_getFamiliasDelito,
  mantenedor_getAllTiposEspecie
} = useMantenedorStore()

const formData = reactive({
  idAmbito: null,
  seleccionTabla: null,
  idCausa: null
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'solicitud-antecedente'
})

const filtroTexto = ref('')

const sujetos = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const especies = reactive({
  isLoading: false,
  first: 0,
  data: [],
  paginacion: null
})

const codigoAmbito = computed(() => {
  const ambitoFound = tiposAmbitoAntecedentes.value?.find(ambito => ambito.id === formData.idAmbito)
  return ambitoFound?.codigo
})

const hasFieldset = computed(() => codigoAmbito.value === '1' || codigoAmbito.value === '2')

const nombreAmbito = computed(() => {
  if (codigoAmbito.value === '1') {
    return 'Intervinientes'
  }
  if (codigoAmbito.value === '2') {
    return 'Especies / Dinero'
  }

  return ''
})

function getDataSegunAmbito () {
  formData.seleccionTabla = null
  formData.idCausa = null

  if (codigoAmbito.value === '1') { // CODIGO 1: Ambito Sujeto
    getSujetos()
  }
  if (codigoAmbito.value === '2') { // CODIGO 2: Ambito Especies
    getEspecies()
  }
  if (codigoAmbito.value === '3') { // CODIGO 2: Ambito Causa
    formData.idCausa = idCausa.value
  }
}

function getSujetos (pagination = undefined) {
  if (!pagination) {
    sujetos.first = 0
  }

  const params = {
    page: pagination?.page || 0,
    size: pagination?.rows || 5
  }

  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => { sujetos.isLoading = l },
    resolve: ({ data, paginacion }) => {
      sujetos.data = data
      sujetos.paginacion = paginacion
    }
  })
}

// SE DEBE MODIFICAR EL ENDPOINT DE ESPECIES PARA QUE TENGA PAGINACION Y BUSQUEDA
function getEspecies (pagination = undefined) {
  if (!pagination) {
    especies.first = 0
  }

  const params = {
    page: pagination?.page || 0,
    size: pagination?.rows || 5
  }

  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    resolve: (data) => {
      especies.data = data
      especies.paginacion = {
        tamanoPagina: data?.length < 5 ? 5 : data?.length,
        elementosTotales: data?.length
      }
    },
    loader: (l) => { especies.isLoading = l }
  })
}

function handleObtenerAntecedente () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (hasFieldset.value && !formData.seleccionTabla) {
    codigoAmbito.value === '1' ? toastError('Debes seleccionar un Interviniente') : toastError('Debes seleccionar una Especie')
    return
  }

  const solicitud = {
    ...tipoSolicitudData.value,
    ...formData
  }

  dialogRef.value?.close(solicitud)
}

const isLoadingMantenedor = ref(false)

function getDataMantenedor () {
  requestUtil({
    action: mantenedor_getTiposSujetos,
    loader: (l) => { isLoadingMantenedor.value = l }
  })
  requestUtil({
    action: mantenedor_getFamiliaEspecies,
    loader: (l) => { isLoadingMantenedor.value = l }
  })
  requestUtil({
    action: mantenedor_getFamiliasDelito,
    loader: (l) => { isLoadingMantenedor.value = l }
  })
  requestUtil({
    action: mantenedor_getAllTiposEspecie,
    loader: (l) => { isLoadingMantenedor.value = l }
  })
}

onMounted(() => {
  getDataMantenedor()
})
</script>
