<template>
<AppFieldset legend="Lista de Delitos">
  <TablaDelitos
    v-model:first="delitosPag.firstRecord"
    :data-delitos="delitos"
    :loading="tablaDelitos.isLoading"
    :read-only="!isCollapsed"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    @page="getDelitos"
    @tabla-delito:ver-mas="setModoLectura"
  />
</AppFieldset>
<FormDelitos
  :is-collapsed="!isCollapsed"
  :loading-button="loadingTablaDelitos"
  :read-only="modoLectura"
  :validation-scope="delitoValidationScope"
  @cancelar-edicion="toggleFormularioDelito"
  @emit-adjuntar="adjuntarDocumento"
  @emit-agregar="handleSubmitForm"
  @emit-eliminar="eliminarDocumento"
/>
</template>

<script setup>
import { onMounted, provide, reactive, ref } from 'vue'
import { useMantenedorStore, useDelitoStore, useDelitoProvide } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { populateDelito } from '@/modules/global/contracts'
import { useTermino } from '../../composables'
import TablaDelitos from '../../components/tablas/revisar-antecedentes-causa/TablaDelitos.vue'
import FormDelitos from '@/modules/global/components/forms/FormDelitos.vue'

const { delitoValidationScope, formData } = useDelitoProvide()

provide(delitoValidationScope, formData)

const { mantenedor_getTiposDelito, mantenedor_getFamiliasDelito } = useMantenedorStore()

const { idDenuncia } = useTermino()

const tablaDelitos = reactive({
  isLoading: false,
  isEditando: false,
  firstRecord: 0
})

const { delitos, paginacion, delito_getDelitoByIdDenuncia, delito_SET_MEDIOSTRANSPORTE, delito_getDelitoByIdDetalleHechoDelictual } = useDelitoStore()

const isCollapsed = ref(true)
const modoLectura = ref(false)

const delitosPag = reactive({
  isLoading: false,
  firstRecord: 0
})

function getTiposFamiliasDelito () {
  requestUtil({
    action: mantenedor_getFamiliasDelito
  })
  requestUtil({
    action: mantenedor_getTiposDelito
  })
}

async function getDelitos (pagination = undefined) {
  if (!pagination) {
    delitosPag.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: delito_getDelitoByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (tablaDelitos.isLoading = l)
  })
}
onMounted(async () => {
  getTiposFamiliasDelito()
  getDelitos()
})

function toggleFormularioDelito () {
  isCollapsed.value = !isCollapsed.value
}

async function setModoLectura (delito) {
  console.log('Delito MODO LECTURA: ', delito)
  const { idDetalleHechoDelictual } = delito
  requestUtil({
    action: delito_getDelitoByIdDetalleHechoDelictual,
    payload: {
      idDetalleHechoDelictual: idDetalleHechoDelictual
    },
    resolve: (response) => {
      isCollapsed.value = false
      modoLectura.value = true
      populateDelito(response, formData)
      delito_SET_MEDIOSTRANSPORTE(response.mediosTransportes || [])
    },
    reject: (e) => console.log(e)
  })
}
</script>
