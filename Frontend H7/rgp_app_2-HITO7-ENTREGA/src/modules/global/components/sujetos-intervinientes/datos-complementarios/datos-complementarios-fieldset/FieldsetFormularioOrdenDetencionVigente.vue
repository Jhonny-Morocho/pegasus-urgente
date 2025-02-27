<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Orden de Detencion y/o Medidas Cautelares Vigentes"
>
  <div class="col-12 md:col-9 lg:col-4 text-center">
    <h4>¿Tiene Orden de Detención y/o Medidas Cautelares vigentes?(*)</h4>
    <span>
      <AppSelectButton
        id="ordenDetencionMedidasCautelaresVigentes"
        v-model="formData.tieneOrdenDetencionVigente"
        option-label="descripcion"
        option-value="id"
        :options="filterTipoRespuestaBasica"
        :rules="{ required }"
      />
    </span>
  </div>
  <SubirArchivoIncrustado
    v-if="
      mantenedor_getCodigoTipoRespuestaBasicaById(
        formData.tieneOrdenDetencionVigente
      ) === '1'
    "
    ref="ordenDetencionVigente"
    choose-label="Seleccionar Archivo"
    :data-archivos="ordenesDetencion"
    :is-loading="isLoading"
    :relacion-front="seccion.id"
    :tipos-archivo="'image/*, application/*'"
    @subir-archivo:adjuntar="adjuntarDocumento"
    @subir-archivo:eliminar="eliminarDocumento"
  />
</AppFieldset>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  ordenesDetencion,
  documento_deleteDocumentoCDD,
  documento_addDocumentoCDD,
  documento_getDocumentoBySeccionCDD
} = useDocumentoStore()

const { tipoRespuestaBasica, mantenedor_getCodigoTipoRespuestaBasicaById } =
  useMantenedorStore()
const { idCatalogo } = useIdentificacionDenunciaStore()
const { seccionesFUD } = useMantenedorStore()
const { required } = useFormValidation()
const ordenDetencionVigente = ref()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const formData = sujetosIntervinientesInject
const seccion = seccionesFUD.value.find((x) => x.codigo === '2')

const filterTipoRespuestaBasica = computed(() => {
  const fixedLabel = tipoRespuestaBasica.value.map((e) => {
    if (e.descripcion.includes('No Informado')) {
      return { ...e, descripcion: 'No Consultado' }
    }
    return e
  })
  return fixedLabel.filter((respuesta) => respuesta.codigo !== '4')
})

function adjuntarDocumento (documento) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: documento,
    resolve: () => {
      ordenDetencionVigente.value.resetFormData()
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
  console.log('idCatalogo', idCatalogo.value)
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
}
const isLoading = ref(false)

</script>
