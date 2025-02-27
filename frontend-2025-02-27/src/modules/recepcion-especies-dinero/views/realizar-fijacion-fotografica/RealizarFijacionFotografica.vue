<template>
<AppFieldset
  v-if="tieneRUE"
  :collapsed="fieldsetCollapse"
  legend="Solicitud de Fijación Fotográfica"
>
  <SolicitudFijacionFotografica
    :data="dataFijacion"
  />
</AppFieldset>
<AppFieldset
  v-else
  legend="Búsqueda por RUE"
>
  <div class="p-fluid w-full">
    <Nue
      ref="campoNue"
      class="col-12 md:col-6 lg:col-4 mb-4"
      :label="'Ingrese RUE'"
      :loading="nueLoader"
      @buscar-nue="getDataEspecie"
    />
  </div>
</AppFieldset>
<AppFieldset
  :collapsed="fieldsetCollapse"
  legend="Especie"
>
  <DatosEspecie :data="dataFijacion" />
</AppFieldset>
<AppFieldset
  :collapsed="fieldsetCollapse"
  legend="Realizar Fijación Fotográfica"
>
  <FormAgregarFotografia
    ref="formFijacionFotografica"
    :procedencia="'Registrar Fijación Fotográfica'"
    :show-progress="showProgress"
    @agregar-fotografia="addFotografia"
  />
  <TablaDocumentos
    :documentos="documentos"
    :loading="loaderDocumentos"
    @delete-archivo="deleteArchivo"
  />
</AppFieldset>
</template>
<script setup>
import SolicitudFijacionFotografica from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/SolicitudFijacionFotografica.vue'
import DatosEspecie from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/DatosEspecie.vue'
import FormAgregarFotografia from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/FormAgregarFotografia.vue'
import TablaDocumentos from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/TablaDocumentos.vue'
import Nue from '@/modules/recepcion-especies-dinero/components/global/Nue.vue'
import { ref, computed } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import {
  // useComprobanteDeRecepcionRechazoStore,
  useFijacionFotografica,
  useSubirArchivosStore
} from '@/modules/recepcion-especies-dinero/composables'

const dataEspecieGet = ref()

const {
  subirArchivosStore_subirArchivo,
  subirArchivosStore_deleteArchivo,
  subirArchivosStore_getArchivosSubidosByIdEspecie
} = useSubirArchivosStore()

const { fijacionfotografica_getDataEspecieFijacion, dataFijacion } = useFijacionFotografica()

const { toastError, toastSuccess } = useAppToast()

const documentos = ref(null)

const fieldsetCollapse = ref(true)

const loaderDocumentos = ref(false)

// const tieneRUE = computed(() => !!dataFijacion.value?.rue)
const tieneRUE = computed(() => false)

function getDataEspecie (rue) {
  if (rue) {
    requestUtil({
      action: fijacionfotografica_getDataEspecieFijacion,
      payload: { rue },
      resolve: (res) => {
        if (res) {
          dataEspecieGet.value = res
          getArchivosSubidos()
          fieldsetCollapse.value = false
        } else {
          toastError(`No se encontró especie asociada al RUE: ${rue}`)
        }
      }
    })
  }
}

function getArchivosSubidos () {
  requestUtil({
    action: subirArchivosStore_getArchivosSubidosByIdEspecie,
    payload: { id: [dataEspecieGet.value.idEspecie] },
    loader: (l) => (loaderDocumentos.value = l),
    resolve: (data) => {
      documentos.value = data
      if (data.length > 0) {
        toastSuccess(`Lista Actualizada`)
      }
    },
    reject: () => {
      toastError('Ocurrió un error inesperado, intenta nuevamente')
    }
  })
}

const formFijacionFotografica = ref()

const showProgress = ref(false)

function deleteArchivo (d) {
  requestUtil({
    action: subirArchivosStore_deleteArchivo,
    payload: { idArchivos: [d.id_filenet] },
    loader: (l) => {
      showProgress.value = l
      loaderDocumentos.value = l
    },
    resolve: (data) => {
      toastSuccess(
        `El archivo '${data}' se eliminó correctamente`
      )
      getArchivosSubidos()
    },
    reject: (e) => {
      toastError('Ocurrió un error inesperado, intenta nuevamente')
    }
  })
}

function addFotografia (d) {
  requestUtil({
    action: subirArchivosStore_subirArchivo,
    payload: {
      ...d,
      especies: [dataEspecieGet.value.idEspecie]
    },
    loader: (l) => {
      showProgress.value = l
      loaderDocumentos.value = l
    },
    resolve: (data) => {
      toastSuccess(
        `El archivo '${
          data.find((e) => e.nombre_archivo).nombre_archivo
        }' se subió correctamente`
      )
      getArchivosSubidos()
      formFijacionFotografica.value.resetform()
    },
    reject: (e) => {
      toastError('Ocurrió un error inesperado, intenta nuevamente')
    }
  })
}
</script>
