<template>
<AppFieldset
  class="col-12 p-fluid"
  legend="Fijación Fotográfica"
>
  <p class="col-12 md:col-6">
    <span class="font-bold">Familia Especie:</span>
    {{
      mantenedor_getNombreFamiliaEspecie(
        especiesIncautadas.familiaEspecie ?? dataFijacionFotografica.idFamilia
      )
    }}
  </p>
  <p class="col-12 md:col-6">
    <span class="font-bold">Tipo Especie:</span>
    {{
      tipoEspecie(
        especiesIncautadas.idTipoEspecie ??
          dataFijacionFotografica.idTipoEspecie
      )
    }}
  </p>
  <FormAgregarFotografia
    ref="formFijacionFotografica"
    class="my-4"
    :procedencia="'Ingreso Fijación Fotográfica'"
    :show-progress="showProgress"
    @agregar-fotografia="addFotografia"
  />
  <TablaDocumentos
    :documentos="documentos"
    :loader-get-archivos="loaderGetArchivos"
    :loading="loaderDocumentos"
    @delete-archivo="deleteArchivo"
    @get-archivo="getArchivo"
  />
</AppFieldset>
<AppBtnNextTeleported
  label="Asignar Ubicación"
  @click="handleNextStep"
/>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import TablaDocumentos from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/TablaDocumentos.vue'
import FormAgregarFotografia from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/FormAgregarFotografia.vue'
import {
  useComprobanteDeRecepcionRechazoStore,
  useEspecieIncautadaPendienteRecepcionStore,
  useIngresoDinero,
  useSubirArchivosStore
} from '@/modules/recepcion-especies-dinero/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import ModalVerDocumento from '@/modules/catalogo-documental-digital/components/common/modal/ModalVerDocumento.vue'
import { useCreacionYGestionDeCDD } from '@/modules/catalogo-documental-digital/composables'

const emit = defineEmits(['next-step'])
const { toastSuccess, toastError } = useAppToast()

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getAllTiposEspecie,
  mantenedor_getNombreTipoEspecie
} = useMantenedorStore()

const { dataFijacionFotografica, datosEspecie } = useIngresoDinero()

const { especiesIncautadas } = useEspecieIncautadaPendienteRecepcionStore()

const {
  stepComprobanteDeRecepcionRechazo_getArchivosSubidosByIdEspecie
} = useComprobanteDeRecepcionRechazoStore()

const {
  subirArchivosStore_subirArchivo,
  subirArchivosStore_deleteArchivo
} = useSubirArchivosStore()

const { creacionYGestionDeCDD_getDocumentoById } = useCreacionYGestionDeCDD()

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

const documentos = ref([])
const loaderDocumentos = ref(false)

function getArchivosSubidos () {
  console.log('fija', datosEspecie.value.at(-2).idEspecie)
  requestUtil({
    action: stepComprobanteDeRecepcionRechazo_getArchivosSubidosByIdEspecie,
    payload: { id: datosEspecie.value.at(-2).idEspecie },
    loader: (l) => (loaderDocumentos.value = l),
    resolve: (data) => {
      documentos.value = data
      toastSuccess(`Lista Actualizada`)
    },
    reject: () => {
      toastError('Ocurrió un error inesperado, intenta nuevamente')
    }
  })
}
getArchivosSubidos()

const loaderGetArchivos = ref(false)
const { launchDialog } = useAppDialog()
const base64 = ref('')
const mimeType = ref('')

function getArchivo (id) {
  requestUtil({
    action: creacionYGestionDeCDD_getDocumentoById,
    payload: { id },
    loader: (l) => (loaderGetArchivos.value = l),
    resolve: (data) => {
      // documentos.value = data
      mimeType.value = data.mimeType
      base64.value = data.documento
      launchDialog({
        component: ModalVerDocumento,
        header: 'Imágenes',
        width: '80vw',
        heigth: '50vh',
        props: {
          dataDocumento: {
            archivo: base64.value,
            mimeType: mimeType.value
          }
        },
        cancelLabel: 'Cerrar'
      })
    },
    reject: () => {
      toastError('Ocurrió un error inesperado, intenta nuevamente')
    }
  })
}

function deleteArchivo (d) {
  console.log('deleteArchivo', d)
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

function handleNextStep () {
  emit('next-step', 'asignar-ubicacion')
}

const formFijacionFotografica = ref()

const showProgress = ref(false)

function addFotografia (d) {
  requestUtil({
    action: subirArchivosStore_subirArchivo,
    payload: {
      ...d,
      especies: [especiesIncautadas.value.idEspecie]
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
    reject: () => {
      toastError('Ocurrió un error inesperado, intenta nuevamente rejected')
    }
  })
}
</script>
