<template>
<AppFieldset
  class="col-12 mt-2"
  legend="Formulario de Riesgo NNA"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4>¿Requiere Formulario de Riesgo NNA?</h4>
    <span>
      <AppSelectButton
        id="requiereFormularioDeRiesgo"
        v-model="form.requiereFormularioRiesgoNNA"
        class="mb-3"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
        :rules="{ required }"
      />
    </span>
  </div>
  <AppFieldset
    v-if="form.requiereFormularioRiesgoNNA"
    class="col-12"
    :collapsed="!form.requiereFormularioRiesgoNNA"
    legend="Formulario de Riesgo NNA"
    :toggleable="true"
  >
    <SubirArchivoIncrustado
      ref="formularioNnaVictima"
      choose-label="Seleccionar Archivo"
      :data-archivos="formulariosRiesgo"
      :is-loading="isLoading"
      :relacion-front="seccion?.id"
      tipo-relacion="formularioNnaVictima"
      :tipos-archivo="'image/*, application/*'"
      @subir-archivo:adjuntar="adjuntarDocumento"
      @subir-archivo:eliminar="eliminarDocumento"
    />
  </AppFieldset>
</AppFieldset>
</template>

<script setup>
import { ref } from 'vue'
import { requestUtil } from '@/utils'
import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import {
  useDocumentoStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const {
  formulariosRiesgo,
  documento_addDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_getDocumentoBySeccionCDD
} = useDocumentoStore()

const { idCatalogo } = useIdentificacionDenunciaStore()
const { seccionesFUD } = useMantenedorStore()
const { required } = useFormValidation()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const form = sujetosIntervinientesInject
const formularioNnaVictima = ref()
const seccion = seccionesFUD.value.find((x) => x.codigo === '6')

function adjuntarDocumento (documento) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: documento,
    resolve: () => {
      formularioNnaVictima.value.resetFormData()
      toastSuccess('Documento Adjuntado')
      getDocumentosEnSeccion()
    }
  })
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
      idCategoriaDocumento: seccion.id,
      idCatalogo: idCatalogo.value,
      categoria: seccion.descripcion
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
  console.log(formulariosRiesgo.value)
}

const isLoading = ref(false)

</script>
