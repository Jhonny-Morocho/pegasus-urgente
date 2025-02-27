<template>
<div class="col-12">
  <AppDropdown
    id="agrupar"
    class="col-3 p-fluid"
    label="Agrupar por"
    option-label="value"
    option-value="id"
    :options="motivoAgrupacion"
    show-clear
  />
</div>
<AppFieldsetCustom :panel="paneles.documentos">
  <div class="flex flex-row-reverse col-12">
    <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
      <InputText
        id="filter-text"
        v-model="inputFiltro"
        class="p-inputtext-sm"
        placeholder="Buscar"
      />
      <Button
        class="btn-primary p-button-sm"
        icon="pi pi-search"
      />
    </div>
  </div>

  <TablaDocumentos
    v-model:selection="documentosSeleccionados"
    class="col-12"
    :dirige-investigacion="true"
    selectable
    :value="documentos"
    @ver-documento="verDocumento"
  />
</AppFieldsetCustom>
</template>

<script setup>
import TablaDocumentos from '@/modules/tramitar-audiencia/components/tables/TablaDocumentos.vue'
import AppFieldsetCustom from '@/modules/common/components/AppFieldsetCustom.vue'
import { onMounted, reactive, ref } from 'vue-demi'
import { requestUtil } from '@/utils'
import { useDocumentoStore } from '@/modules/global/composables'
import { usePanelesStore, useTramitarAudiencia } from '@/modules/tramitar-audiencia/composables'

// va en mantenedor...
const motivoAgrupacion = [
  {
    id: 1,
    value: 'Clases Documentales'
  },
  {
    id: 2,
    value: 'Procedencia'
  },
  {
    id: 3,
    value: 'Nombre'
  }
]

const inputFiltro = ref('')
const documentosSeleccionados = ref([])

const { idDenuncia } = useTramitarAudiencia()

const { documentos, documento_getDocumentosByIdDenuncia } = useDocumentoStore()
const { paneles } = usePanelesStore()

const documentosTable = reactive({
  isLoading: false,
  firstRecord: null
})

async function getDocumentosEnCausa (pagination = undefined) {
  if (!pagination) {
    documentosTable.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: documento_getDocumentosByIdDenuncia,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => (documentosTable.isLoading = l)
  })
}

onMounted(() => {
  getDocumentosEnCausa()
})
</script>
