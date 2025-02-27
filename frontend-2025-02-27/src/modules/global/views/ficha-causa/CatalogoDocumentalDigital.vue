<template>
<section>
  <div class="grid">
    <div class="col-12 md:col-6 lg:col-3">
      <AppDropdown
        id="agruparPor"
        v-model="agruparPor"

        label="Agrupar por"
        option-label="name"
        option-value="name"
        :options="listaAgruparPor"
        show-clear
        style="width: 100%"
      />
    </div>
    <AppFieldset
      class="w-full"
      legend="Documentos y Archivos"
    >
      <div class="col-12 md:col-6 md:col-offset-6 lg:col-4 lg:col-offset-8">
        <div
          class="p-inputgroup px-2"
          style="height: 36px; margin-top: 6px"
        >
          <InputText
            v-model="buscar"
            placeholder="Buscar"
          />
          <Button
            class="btn-primary"
            icon="pi pi-search"
          />
        </div>
      </div>
      <TablaDocumentos
        :data-documentos="documentos"
        :is-editando="isEditando"
        :loading="tablaDocumentos.isLoading"
        :value="documentos"
        @documentos:editar-documento="setModoEdicion"
        @documentos:eliminar-documento="eliminarDocumento"
      />
    </AppFieldset>
  </div>
</section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import TablaDocumentos from '@/modules/global/components/documentos/TablaDocumentos.vue'
import { useDocumentoStore } from '../../composables'
import { useAppToast } from '@/modules/common/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'
import { requestUtil } from '@/utils'

// const { idDenuncia } = useFichaCausaStore()
const { toastError } = useAppToast()
const { documentos, documento_getDocumentosByCatalogoCDD } = useDocumentoStore()
const { idCatalogo } = useIdentificacionDenunciaStore()

const params = ref('')
const tablaDocumentos = reactive({
  isLoading: false,
  fisrtRecord: 0
})

function init () {
  if (!idCatalogo.value) {
    console.log('Sin idCatalogo')
    return
  }

  const idcatalogo = idCatalogo.value.replace('{', '').replace('}', '')
  params.value = `?page=${0}&size=${10}`

  requestUtil({
    action: documento_getDocumentosByCatalogoCDD,
    payload: {
      idCatalogo: idcatalogo,
      params: params.value
    },
    loading: (l) => { tablaDocumentos.isLoading = l },
    reject: () => { toastError('Ocurrió un error al cargar los documentos') }
  })

  console.log(idCatalogo.value)
  console.log(documentos.value)
}

const listaAgruparPor = [
  { name: 'Audiencias' },
  { name: 'Procedencia' },
  { name: 'Últimos ingresos' }
]

onMounted(() => {
  init()
})
</script>
