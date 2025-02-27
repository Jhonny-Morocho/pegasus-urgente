<template>
<div class="grid col-12">
  <AppInput
    id="nombreArchivo"
    v-model="formData.nombreArchivo"
    class="col-12 md:col-4 p-fluid"
    label="Nombre del Archivo"
    :rules="{ required }"
  />
  <AppInput
    id="formatoRecepcion"
    v-model="formData.formatoRecepcion"
    class="col-12 md:col-4 p-fluid"
    label="Formato de Recepción"
    :rules="{ required }"
  />
  <AppDropdown
    id="claseDocumental"
    v-model="formData.claseDocumental"
    class="col-12 md:col-4 p-fluid"
    label="Clase Documental"
    option-label="descripcion"
    option-value="id"
    :options="[
      { descripcion: 'Clase Documental 1', id: 1 },
      { descripcion: 'Clase Documental 2', id: 2 }
    ]"
    :rules="{ required }"
    show-clear
  />
  <AppDropdown
    id="procedencia"
    v-model="formData.procedencia"
    class="col-12 md:col-4 p-fluid"
    label="Procedencia"
    option-label="descripcion"
    option-value="id"
    :options="[
      { descripcion: 'Procedencia 1', id: 1 },
      { descripcion: 'Procedencia 2', id: 2 }
    ]"
    :rules="{ required }"
    show-clear
  />
  <AppDropdown
    id="idioma"
    v-model="formData.idioma"
    class="col-12 md:col-4 p-fluid"
    label="Idioma"
    option-label="descripcion"
    option-value="id"
    :options="[
      { descripcion: 'Español (Chile)', id: 1 },
      { descripcion: 'Otro', id: 2 }
    ]"
    show-clear
  />
  <AppDropdown
    id="nivelFirma"
    v-model="formData.nivelFirma"
    class="col-12 md:col-4 p-fluid"
    label="Nivel de Firma"
    option-label="descripcion"
    option-value="id"
    :options="[
      { descripcion: 'Firmado', id: 1 },
      { descripcion: 'Sin Firma 2', id: 2 }
    ]"
    show-clear
  />
  <AppInput
    id="cantidadPaginas"
    v-model="formData.cantidadPaginas"
    class="col-12 md:col-4 p-fluid"
    label="Cantidad de Páginas"
    :rules="{ required, numeric }"
  />
  <AppDropdown
    id="nivelAcceso"
    v-model="formData.nivelAcceso"
    class="col-12 md:col-4 p-fluid"
    label="Nivel de Acceso"
    option-label="descripcion"
    option-value="id"
    :options="[
      { descripcion: 'Nivel de Acceso 1', id: 1 },
      { descripcion: 'Nivel de Acceso 2', id: 2 }
    ]"
    show-clear
  />
  <FileUpload
    id="seleccionar-archivo"
    accept="image/*,video/*,audio/*,application/*"
    choose-label="Seleccionar Archivo"
    class="btn-fileupload"
    :disabled="isEditando"
    :max-file-size="16000000"
    mode="basic"
    name="demo[]"
    @select="onSelect"
  />
  <div class="grid justify-content-between col-12">
    <div class="grid col-6">
      <h3 class="col-12">
        ¿Requiere almacenamiento físico?
      </h3>
      <AppSelectButton
        id="almacenamientoFisico"
        v-model="formData.almacenamientoFisico"
        class="col-12 p-fluid"
        option-label="descripcion"
        option-value="id"
        :options="[
          { descripcion: 'Si', id: '1' },
          { descripcion: 'No', id: '2' },
          { descripcion: 'Por Definir', id: '3' }
        ]"
      />
      <h3 class="col-12">
        ¿Disponible para consultas?
      </h3>
      <AppSelectButton
        id="consultas"
        v-model="formData.consultas"
        class="col-12 p-fluid"
        option-label="descripcion"
        option-value="id"
        :options="[
          { descripcion: 'Si', id: '1' },
          { descripcion: 'No', id: '2' },
          { descripcion: 'Por Definir', id: '3' }
        ]"
      />
      <h3 class="col-12">
        ¿Existe respaldo físico en custodia?
      </h3>
      <AppSelectButton
        id="respaldoCustodia"
        v-model="formData.respaldoCustodia"
        class="col-12 p-fluid"
        option-label="descripcion"
        option-value="id"
        :options="[
          { descripcion: 'Si', id: '1' },
          { descripcion: 'No', id: '2' },
          { descripcion: 'Por Definir', id: '3' }
        ]"
      />
      <h3 class="col-12">
        ¿Es Evidencia?
      </h3>
      <AppSelectButton
        id="esEvidencia"
        v-model="formData.esEvidencia"
        class="col-12 p-fluid"
        option-label="descripcion"
        option-value="id"
        :options="[
          { descripcion: 'Si', id: '1' },
          { descripcion: 'No', id: '2' },
          { descripcion: 'Por Definir', id: '3' }
        ]"
      />
    </div>
    <div class="grid col-6">
      <div class="grid col-12">
        <AppTextarea
          id="descripcionArchivo"
          v-model="formData.descripcionArchivo"
          :auto-resize="true"
          class="p-fluid col-12"
          cols="100"
          placeholder="Ingresar Comentarios"
          rows="25"
        />
      </div>
    </div>
  </div>
</div>
</template>
<script setup>
import { defineExpose, reactive, ref } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

const { required, numeric } = useFormValidation()
const { toastError } = useAppToast()

const disabled = ref('')

const formData = reactive({
  nombreArchivo: '',
  formatoRecepcion: null,
  claseDocumental: null,
  procedencia: null,
  idioma: null,
  nivelFirma: null,
  cantidadPaginas: '',
  almacenamientoFisico: null,
  consultas: null,
  respaldoCustodia: null,
  esEvidencia: null,
  descripcionArchivo: ''
})

function onSelect (e) {
  try {
    const archivo = e.files[0]
    if (archivo) {
      const tipo = archivo.type
      const nombreArchivo = archivo.name
      const tamano = archivo.size

      if (tipo.includes('image')) {
        formData.formatoRecepcion = 'IMAGEN'
      } else if (tipo.includes('application')) {
        formData.formatoRecepcion = 'DOCUMENTO'
      } else if (tipo.includes('video')) {
        formData.formatoRecepcion = 'VIDEO'
      } else if (tipo.includes('audio')) {
        formData.formatoRecepcion = 'AUDIO'
      } else {
        formData.formatoRecepcion = 'OTRO'
      }
      formData.nombreArchivo = nombreArchivo.replace(/\.[^/.]+$/, '')
      formData.extensionArchivo = nombreArchivo.split('.').pop()
      formData.tamanoArchivo = (tamano / 1024).toFixed(0)
      disabled.value = true
      // necesarios para que funcione el endpoint
      formData.relacionFront = 'Documento diligencia'
      formData.formatoActual = 'string'
      formData.origen = 'Diligencia'
      formData.tipoAntecedente = 'string'
      formData.tipoArchivo = formData.formatoRecepcion
    }
  } catch (error) {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}

function retrieveData (retrieve) {
  retrieve?.(formData)
}
defineExpose({ retrieveData })
</script>
