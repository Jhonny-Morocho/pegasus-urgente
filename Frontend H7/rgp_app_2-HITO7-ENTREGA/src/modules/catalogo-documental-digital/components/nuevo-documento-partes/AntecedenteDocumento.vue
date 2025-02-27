<template>
<AppForm
  id="ingresoDocumento"
  class="col-12"
  :form-submitted="formSubmitted"
  validation-scope="formIngresoDocumento"
>
  <section>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid">
        <div class="col-4">
          <FileUpload
            id="seleccionar-archivo"
            v-model="formData.archivo"
            accept="image/*,application/pdf"
            choose-label="Digitalizar Documento"
            class="p-button-outlined w-full p-fluid"
            :disabled="isEditando"
            icon="pi pi-print"
            :max-file-size="16000000"
            mode="basic"
            name="demo[]"
            :value="true"
            @select="onSelect"
          />
        </div>
        <div class="col-4">
          <AppInput
            id="nombreArchivo"
            v-model="formData.nombreArchivo"
            label="Nombre del Archivo"
            :rules="{ required }"
          />
        </div>
        <div class="col-4">
          <AppDropdown
            id="formato"
            v-model="formData.formato"
            label="Formato de recepción"
            option-label="descripcion"
            option-value="id"
            :options="[
              { id: 1, descripcion: 'Documento Electrónico' },
              { id: 2, descripcion: 'Documento físico' }
            ]"
            :rules="{ required }"
            show-clear
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid">
        <div class="col-4">
          <AppDropdown
            id="claseDocumental"
            v-model="formData.claseDocumental"
            label="Clase Documental"
            option-label="descripcion"
            option-value="id"
            :options="claseDocumental"
            :rules="{ required }"
            show-clear
          />
        </div>
        <div class="col-4">
          <AppDropdown
            id="procedencia"
            v-model="formData.procedencia"
            label="Procedencia"
            option-label="descripcion"
            option-value="id"
            :options="procedencia"
            :rules="{ required }"
            show-clear
          />
        </div>
        <div class="col-4">
          <AppDropdown
            id="nivelAcceso"
            v-model="formData.nivelAcceso"
            label="Nivel de Acceso"
            option-label="nombre"
            option-value="id"
            :options="nivelAcceso"
            show-clear
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid">
        <div class="col-4">
          <AppDropdown
            id="nivelFirma"
            v-model="formData.nivelFirma"
            label="Nivel de Firma"
            option-label="descripcion"
            option-value="id"
            :options="nivelFirma"
            show-clear
          />
        </div>
        <div class="col-4">
          <AppDropdown
            id="idioma"
            v-model="formData.idioma"
            label="Idioma"
            option-label="descripcion"
            option-value="id"
            :options="idiomas"
            show-clear
          />
        </div>
        <div class="col-4">
          <AppInput
            id="cantidadPaginas"
            v-model="formData.cantidadPaginas"
            label="Cantidad de Páginas"
            :rules="{ required, numeric }"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid pt-5">
        <div class="col-6">
          <h4 class="col-12 font-normal mb-3">
            ¿Requiere almacenamiento físico?
          </h4>
          <AppSelectButton
            id="almacenamientoFisico"
            v-model="formData.almacenamientoFisico"
            class="col-12 p-fluid"
            option-label="descripcion"
            option-value="id"
            :options="[
              { descripcion: 'Si', id: 'Si' },
              { descripcion: 'No', id: 'No' },
              { descripcion: 'Por Definir', id: 'Por Definir' }
            ]"
          />
        </div>
        <div class="col-6 end">
          <h4 class="col-12 font-normal mb-3">
            ¿Disponible para consultas?
          </h4>
          <AppSelectButton
            id="consultas"
            v-model="formData.consultas"
            class="col-12 p-fluid"
            option-label="descripcion"
            option-value="id"
            :options="[
              { descripcion: 'Si', id: 'Si' },
              { descripcion: 'No', id: 'No' },
              { descripcion: 'Por Definir', id: 'Por Definir' }
            ]"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid pt-5">
        <div class="col-6">
          <h4 class="col-12 font-normal mb-3">
            ¿Existe respaldo físico en custodia?
          </h4>
          <AppSelectButton
            id="respaldoCustodia"
            v-model="formData.respaldoCustodia"
            class="col-12 p-fluid"
            option-label="descripcion"
            option-value="id"
            :options="[
              { descripcion: 'Si', id: 'Si' },
              { descripcion: 'No', id: 'No' },
              { descripcion: 'Por Definir', id: 'Por Definir' }
            ]"
          />
        </div>
        <div class="col-6 end">
          <h4 class="col-12 font-normal mb-3">
            ¿Es Evidencia?
          </h4>
          <AppSelectButton
            id="esEvidencia"
            v-model="formData.esEvidencia"
            class="col-12 p-fluid"
            option-label="descripcion"
            option-value="id"
            :options="[
              { descripcion: 'Si', id: 'Si' },
              { descripcion: 'No', id: 'No' },
              { descripcion: 'Por Definir', id: 'Por Definir' }
            ]"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <AppTextarea
        id="descripcionArchivo"
        v-model="formData.descripcionArchivo"
        :auto-resize="true"
        class="p-fluid col-12"
        cols="100"
        placeholder="Resumen"
        rows="10"
      />
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <AppTextarea
        id="observacionesArchivo"
        v-model="formData.observaciones"
        :auto-resize="true"
        class="p-fluid col-12"
        cols="100"
        placeholder="Observaciones Oficina de Partes"
        rows="10"
      />
    </div>
  </section>
</AppForm>
</template>
<script setup>
import store from '@/store'
import { defineExpose, onMounted, reactive } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useMantenedorCDD } from '@/modules/catalogo-documental-digital/composables'
import { requestUtil } from '@/utils'
import { useBase64 } from '@vueuse/core'

const { toastError } = useAppToast()

const {
  nivelAcceso,
  claseDocumental,
  procedencia,
  nivelFirma,
  idiomas,
  mantenedorCDD_getNivelAcceso,
  mantenedorCDD_getFormatoRecepcion,
  mantenedorCDD_getClaseDocumental,
  mantenedorCDD_getProcedencia,
  mantenedorCDD_getNivelFirma,
  mantenedorCDD_getIdiomas
} = useMantenedorCDD()

onMounted(async () => {
  requestUtil({ action: mantenedorCDD_getNivelAcceso })
  requestUtil({ action: mantenedorCDD_getFormatoRecepcion })
  requestUtil({ action: mantenedorCDD_getClaseDocumental })
  requestUtil({ action: mantenedorCDD_getProcedencia })
  requestUtil({ action: mantenedorCDD_getNivelFirma })
  requestUtil({ action: mantenedorCDD_getIdiomas })
})

const formData = reactive({
  nombreArchivo: '',
  formatoRecepcion: null,
  claseDocumental: null,
  procedencia: null,
  idioma: 1,
  nivelFirma: null,
  cantidadPaginas: '',
  almacenamientoFisico: null,
  consultas: null,
  respaldoCustodia: null,
  esEvidencia: null,
  descripcionArchivo: '',
  observaciones: '',
  fileBase64: '',
  extensionArchivo: '',
  tamanoArchivo: '',
  origen: 'Diligencia',
  relacionFront: 'Documento Diligencia',
  formatoActual: '',
  tipoAntecedente: '',
  mime_type: '',
  Vista: true,
  codigo_catalogo: '{808ED383-0000-C811-8C3A-3126F85EA73A}',
  nombre_catalogo: 'PRUEBA',
  idSolicitante: store.state.session.user.sub
})

const { formSubmitted, required, isFormValid, resetFormData, numeric } =
  useFormValidation({
    formData,
    validationScope: 'formIngresoDocumento'
  })

defineExpose({ formData, isFormValid, resetFormData })

async function onSelect (e) {
  try {
    const archivo = e.files[0]
    if (archivo) {
      const tipo = archivo.type
      const nombreArchivo = archivo.name
      const tamano = archivo.size
      const base64 = useBase64(archivo)
      await base64.execute()
      const base64String = base64.base64.value
      formData.fileBase64 = base64String.split(',')[1]
      formData.nombreArchivo = nombreArchivo.replace(/\.[^/.]+$/, '')
      formData.extensionArchivo = nombreArchivo.split('.').pop()
      formData.tamanoArchivo = (tamano / 1024).toFixed(0)
      formData.mime_type = tipo
      console.log('formdata', formData)
    }
  } catch (error) {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}
</script>

<style scoped>
.Selection {
  font-size: 18px;
  padding-bottom: 15px;
  text-align: start;
}
</style>
