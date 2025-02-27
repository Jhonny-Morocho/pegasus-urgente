<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Datos Hospitalización"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4>¿Fue hospitalizado?</h4>
    <span>
      <AppSelectButton
        id="quedoHospitalizado"
        v-model="form.quedoHospitalizado"
        class="mb-3"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
        @change="resetCampos"
      />
    </span>
  </div>
  <div
    v-if="form.quedoHospitalizado"
    class="col-12"
  >
    <div class="grid">
      <div class="col-12 md:col-4">
        <span class="p-float-label">
          <AppInput
            id="idOrganismoSalud"
            v-model="form.idOrganismoSalud"
            label="Hospital o Clínica"
            :rules="{ required }"
          />
        </span>
      </div>
      <div class="col-12 md:col-4">
        <span class="p-float-label">
          <AppInput
            id="nombreApellidosMedico"
            v-model="form.nombresMedico"
            label="Nombre del Médico"
            :rules="{ required, alfabetico }"
          />
        </span>
      </div>
      <div class="col-12 md:col-4">
        <span class="p-float-label">
          <RutInput
            id="rutMedicoTratante"
            v-model="form.rutMedicoTratante"
            label="RUT o N° de Identificación del Médico"
            :rules="{ required, rutValid }"
          />
        </span>
      </div>
    </div>
    <SubirArchivoIncrustado
      ref="hospitalizado"
      choose-label="Seleccionar Archivo"
      :data-archivos="hospitalizacion"
      :is-loading="isLoading"
      :relacion-front="seccion.id"
      :tipos-archivo="'image/*,application/*'"
      @subir-archivo:adjuntar="adjuntarDocumento"
      @subir-archivo:eliminar="eliminarDocumento"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { ref } from 'vue'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'

// utils
import { requestUtil } from '@/utils'

// composables
import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

// global composables
import {
  useDocumentoStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

const { toastSuccess } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const {
  hospitalizacion,
  documento_addDocumentoCDD,
  documento_deleteDocumentoCDD,
  documento_getDocumentoBySeccionCDD
} = useDocumentoStore()

const { idCatalogo } = useIdentificacionDenunciaStore()
const { seccionesFUD } = useMantenedorStore()
const seccion = seccionesFUD.value.find((x) => x.codigo === '1')
const { required, alfabetico, rutValid } = useFormValidation()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const form = sujetosIntervinientesInject
const hospitalizado = ref()

function adjuntarDocumento (documento) {
  requestUtil({
    action: documento_addDocumentoCDD,
    payload: documento,
    resolve: () => {
      hospitalizado.value.resetFormData()
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
      idCategoriaDocumento: seccion.id,
      idCatalogo: idCatalogo.value,
      categoria: seccion.descripcion
    },
    loader: (l) => {
      isLoading.value = l
    }
  })
  console.log(hospitalizacion.value)
}
const isLoading = ref(false)

function resetCampos () {
  if (!form.quedoHospitalizado) {
    form.nombresMedico = ''
    form.rutMedicoTratante = ''
    form.idOrganismoSalud = ''
  }
}
</script>
