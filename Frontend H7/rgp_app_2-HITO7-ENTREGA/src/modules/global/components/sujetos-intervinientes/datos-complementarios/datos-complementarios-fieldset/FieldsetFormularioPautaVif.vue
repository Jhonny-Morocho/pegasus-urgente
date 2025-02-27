<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Pauta VIF"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4>¿Requiere Pauta VIF?</h4>
    <span>
      <AppSelectButton
        id="requierePautaVif"
        v-model="form.requierePautaVIF"
        class="mb-3"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </span>
  </div>
  <SubirArchivoIncrustado
    v-if="form.requierePautaVIF"
    ref="formularioNnaPautaVIF"
    choose-label="Seleccionar Archivo"
    :data-archivos="pautasVif"
    :is-loading="isLoading"
    :relacion-front="seccion.id"
    :tipos-archivo="'image/*, application/*'"
    @subir-archivo:adjuntar="adjuntarDocumento"
    @subir-archivo:eliminar="eliminarDocumento"
  />
</AppFieldset>
</template>

<script setup>
import { ref } from 'vue'
import { requestUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import {
  useDocumentoStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const {
  pautasVif,
  documento_addDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_getDocumentoBySeccionCDD
} = useDocumentoStore()

const { idCatalogo } = useIdentificacionDenunciaStore()
const { seccionesFUD } = useMantenedorStore()
const formularioNnaPautaVIF = ref()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const form = sujetosIntervinientesInject
const seccion = seccionesFUD.value.find((x) => x.codigo === '7')

function adjuntarDocumento (documento) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: documento,
    resolve: () => {
      formularioNnaPautaVIF.value.resetFormData()
      toastSuccess('Documento Adjuntado')
    }
  })
  getDocumentosEnSeccion()
}

function eliminarDocumento (documento) {
  launchConfirmDialog({
    message: `¿Estás seguro de querer eliminar el documento ${documento.nombre}?`,
    accept: () => {
      requestUtil({
        action: documento_deleteDocumentoCDD,
        payload: { idDocumento: documento.id },
        resolve: () => {
          getDocumentosEnSeccion()
        },
        loader: (l) => {
          isLoading.value = l
        }
      })
    }
  })
}

function getDocumentosEnSeccion () {
  requestUtil({
    action: documento_getDocumentoBySeccionCDD,
    payload: {
      size: 10,
      page: 0,
      idCategoriaDocumento: seccion?.id,
      idCatalogo: idCatalogo.value,
      categoria: seccion.descripcion
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
  console.log(pautasVif.value)
}
const isLoading = ref(false)

</script>
