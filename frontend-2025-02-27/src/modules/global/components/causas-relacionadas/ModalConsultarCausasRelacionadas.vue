<template>
<hr>
<section class="px-2">
  <AppForm
    id="buscar-causas-relacionadas"
    class="mb-2 mt-5"
    :form-submitted="formSubmitted"
    validation-scope="buscar-causas-relacionadas"
  >
    <FormConsultaSimple />
    <AppFieldset
      class="mt-4 w-full"
      collapsed
      legend="Búsqueda Avanzada"
      toggleable
    >
      <FormConsultaAvanzada />
    </AppFieldset>
  </AppForm>

  <div class="grid w-full">
    <div class="col-12 md:col-4 p-fluid">
      <p class="mb-2 pl-2 font-bold">
        Coincidencia Vinculante
      </p>
      <AppSelectButton
        id="es-vinculante"
        v-model="consulta.esCombinada"
        class=""
        option-label="descripcion"
        option-value="value"
        :options="[
          { descripcion: 'Parcial', value: false },
          { descripcion: 'Total', value: true },
        ]"
      />
    </div>
    <div class="col-12 md:col-8 flex justify-content-end gap-3 align-items-center">
      <Button
        id="btn-limpiar-campos"
        class="btn-fileupload"
        icon="pi pi-filter-slash"
        icon-pos="right"
        label="Limpiar campos"
        @click="limpiarFiltros"
      />
      <Button
        id="btn-buscar-duplicidad"
        class="btn-form"
        icon="pi pi-search"
        icon-pos="right"
        label="Buscar Causas Relacionadas"
        @click="consultarCausasRelacionadas"
      />
      <Button
        id="btn-buscar-duplicidad-saf"
        class="btn-form"
        icon="pi pi-search"
        icon-pos="right"
        label="Buscar Causas Relacionadas SAF"
        @click="consultarCausasRelacionadasSaf"
      />
    </div>
  </div>
  <TablaCausasRelacionadasEncontradas
    v-model:first="causasEncontradas.first"
    v-model:selection="causasSeleccionadas"
    :loading="causasEncontradas.isLoading"
    :rows="causasEncontradas.paginacion?.tamanoPagina"
    :total-records="causasEncontradas.paginacion?.elementosTotales"
    :value="causasEncontradas.data"
    @page="consultarCausasRelacionadas"
  />
  <div class="flex flex-row-reverse mt-5">
    <Button
      class="px-4 ml-5"
      :disabled="!causasSeleccionadas.length"
      icon="pi pi-save"
      icon-pos="right"
      label="Guardar Causas Relacionadas"
      @click="guardarCausasRelacionadas"
    />
    <Button
      class="px-4 p-button-text"
      icon="pi pi-times"
      icon-pos="left"
      label="Cancelar"
      @click="dialogRef.close()"
    />
  </div>
</section>
</template>
<script setup>
import { inject, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast, useFormValidation, useAppDialog } from '@/modules/common/composables'
import { useCausasRelacionadasStore, useMantenedorStore, useCausaRelacionadaState } from '@/modules/global/composables'
import TablaCausasRelacionadasEncontradas from '@/modules/global/components/causas-relacionadas/TablaCausasRelacionadasEncontradas.vue'
import TablaCausasRelacionadasEncontradasSaf from '@/modules/global/components/causas-relacionadas/TablaCausasRelacionadasEncontradasSaf.vue'
import FormConsultaSimple from './FormConsultaSimple.vue'
import FormConsultaAvanzada from './FormConsultaAvanzada.vue'

const dialogRef = inject('dialogRef')

const { toastError, toastWarning, toastSuccess } = useAppToast()
const { launchDialog } = useAppDialog()

const {
  causasRelacionadas_consultarCausasRelacionadas,
  causasRelacionadas_consultarCausasRelacionadasSaf
} = useCausasRelacionadasStore()
const { consulta, resetCausaRelacionadaState } = useCausaRelacionadaState()

const {
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito,
  mantenedor_getTiposSujetos,
  mantenedor_getEstadosCausa
} = useMantenedorStore()

const { formSubmitted, isFormValid, resetFormData } = useFormValidation({
  formData: consulta,
  validationScope: 'buscar-causas-relacionadas'
})

const causasSeleccionadas = ref([])

const causasEncontradas = reactive({
  data: [],
  paginacion: null,
  first: 0,
  isLoading: false
})
const causasEncontradasSaf = reactive({
  data: [],
  paginacion: null,
  first: 0,
  isLoading: false
})

function tieneAlMenosUnCampo (values) {
  return Boolean(Object.values(values).find(f => !!f))
}

function consultarCausasRelacionadas (pagination = undefined) {
  if (!isFormValid() || !tieneAlMenosUnCampo(consulta)) {
    toastError('Para buscar causas relacionadas, debe ingresar los datos de búsqueda mínimos')
    return
  }

  const query = {
    ...consulta,
    idTipoDelito: (consulta.idTipoDelito === -1 || !consulta.idTipoDelito) ? consulta.idFamiliaDelito : consulta.idTipoDelito
  }

  if (!pagination) {
    causasEncontradas.first = 0
  }

  requestUtil({
    action: causasRelacionadas_consultarCausasRelacionadas,
    payload: {
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 5,
        ...query
      }
    },
    loader: (l) => { causasEncontradas.isLoading = l },
    resolve: ({ data, paginacion }) => {
      if (!paginacion?.elementosTotales) {
        toastWarning('No se encontraron Causas Relacionadas')
      } else {
        causasEncontradas.data = data
        causasEncontradas.paginacion = paginacion
        toastSuccess('Se encontraron Causas Relacionadas')
      }
    }
  })
}
function consultarCausasRelacionadasSaf (pagination = undefined) {
  if (!isFormValid() || !tieneAlMenosUnCampo(consulta)) {
    toastError('Para buscar causas relacionadas, debe ingresar los datos de búsqueda mínimos')
    return
  }

  const query = {
    ...consulta,
    idTipoDelito: (consulta.idTipoDelito === -1 || !consulta.idTipoDelito) ? consulta.idFamiliaDelito : consulta.idTipoDelito
  }

  if (!pagination) {
    causasEncontradasSaf.first = 0
  }

  requestUtil({
    action: causasRelacionadas_consultarCausasRelacionadasSaf,
    payload: {
      params: {
        page: pagination?.page || 0,
        size: pagination?.rows || 10,
        ...query
      }
    },
    loader: (l) => { causasEncontradasSaf.isLoading = l },
    resolve: ({ data, paginacion }) => {
      if (!paginacion?.elementosTotales) {
        toastWarning('No se encontraron Causas Relacionadas SAF')
      } else {
        causasEncontradasSaf.data = data
        causasEncontradasSaf.paginacion = paginacion
        toastSuccess('Se encontraron Causas Relacionadas SAF')
        handleModalCausasRelacionadasSaf()
      }
    }
  })
}

function handleModalCausasRelacionadasSaf () {
  launchDialog({
    component: TablaCausasRelacionadasEncontradasSaf,
    header: 'Causas Relacionadas SAF',
    width: '70%',
    props: {
      causasEncontradasSaf
    }
  })
}
function guardarCausasRelacionadas () {
  dialogRef.value.close(causasSeleccionadas.value)
}

function limpiarFiltros () {
  causasEncontradas.data = []
  causasEncontradas.first = 0
  causasEncontradas.isLoading = false
  causasEncontradas.paginacion = null
  resetFormData()
  resetCausaRelacionadaState()
}

onMounted(() => {
  mantenedor_getTiposDelito()
  mantenedor_getFamiliasDelito()
  mantenedor_getTiposSujetos()
  mantenedor_getEstadosCausa()
})

onBeforeUnmount(() => {
  limpiarFiltros()
})
</script>
