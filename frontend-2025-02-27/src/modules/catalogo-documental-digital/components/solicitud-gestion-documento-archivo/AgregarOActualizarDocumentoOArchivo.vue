<template>
<AppForm
  id="formCrearDocumento"
  class="col-12"
  :form-submitted="formSubmitted"
  validation-scope="formCrearDocumento"
>
  <section>
    <div class="col-12 flex align-items-center justify-content-end">
      <a>Necesitas ayuda</a>
      <Button
        class="question"
        icon="pi pi-question-circle"
        @click="openAyuda()"
      />
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid">
        <AppDropdown
          id="formato"
          v-model="formData.formato"
          class="col-12 md:col-4 p-fluid"
          label="Formato de recepción"
          option-label="descripcion"
          option-value="id"
          :options="formatoRecepcion"
          :rules="{ required }"
          show-clear
        />
        <div class="col-12 md:col-4">
          <FileUpload
            id="seleccionar-archivo"
            accept="image/*,video/*,audio/*,application/*"
            choose-label="Seleccionar Archivo"
            class="p-button-outlined w-full"
            :disabled="formData.formato === 1"
            :max-file-size="16000000"
            mode="basic"
            name="demo[]"
            :rules="{ required }"
            @select="onSelect"
          />
        </div>
        <AppInput
          id="nombreArchivo"
          v-model="formData.nombreArchivo"
          class="col-12 md:col-4 p-fluid"
          label="Nombre del Archivo"
          :rules="{ required }"
        />
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid">
        <AppDropdown
          id="claseDocumental"
          v-model="formData.claseDocumental"
          class="col-12 md:col-4 p-fluid"
          label="Clase Documental"
          option-label="descripcion"
          option-value="id"
          :options="claseDocumental"
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
          :options="procedencia"
          :rules="{ required }"
          show-clear
        />
        <AppDropdown
          id="nivelAcceso"
          v-model="formData.nivelAcceso"
          class="col-12 md:col-4 p-fluid"
          label="Nivel de Acceso"
          option-label="nombre"
          option-value="id"
          :options="nivelAcceso"
          show-clear
        />
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid">
        <AppDropdown
          id="nivelFirma"
          v-model="formData.nivelFirma"
          class="col-12 md:col-4 p-fluid"
          label="Nivel de Firma"
          option-label="descripcion"
          option-value="id"
          :options="nivelFirma"
          show-clear
        />

        <AppDropdown
          id="idioma"
          v-model="formData.idioma"
          class="col-12 md:col-4 p-fluid"
          label="Idioma"
          option-label="descripcion"
          option-value="id"
          :options="idiomas"
          show-clear
        />

        <AppInput
          id="cantidadPaginas"
          v-model="formData.cantidadPaginas"
          class="col-12 md:col-4 p-fluid"
          label="Cantidad de Páginas"
          :rules="{ required, numeric }"
        />
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid pt-5 flex justify-content-between">
        <div class="col-5">
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
              { descripcion: 'Si', id: 1 },
              { descripcion: 'No', id: 0 },
              { descripcion: 'Por Definir', id: 2 }
            ]"
            :rules="{ required }"
          />
        </div>
        <div class="col-5">
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
              { descripcion: 'Si', id: 1 },
              { descripcion: 'No', id: 0 },
              { descripcion: 'Por Definir', id: 2 }
            ]"
            :rules="{ required }"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <div class="grid formgrid pt-5 flex justify-content-between">
        <div class="col-5">
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
              { descripcion: 'Si', id: 1 },
              { descripcion: 'No', id: 0 },
              { descripcion: 'Por Definir', id: 2 }
            ]"
            :rules="{ required }"
          />
        </div>
        <div class="col-5">
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
              { descripcion: 'Si', id: 1 },
              { descripcion: 'No', id: 0 },
              { descripcion: 'Por Definir', id: 2 }
            ]"
          />
        </div>
      </div>
    </div>
    <div class="col-12 md:col-12 p-fluid">
      <AppTextarea
        id="resumen"
        v-model="formData.resumen"
        :auto-resize="true"
        class="p-fluid col-12"
        placeholder="Resumen"
        rows="15"
      />
    </div>
    <div
      v-if="selectTab === 1"
      class="col-12 md:col-12 p-fluid"
    >
      <AppTextarea
        id="comentarioActualizacion"
        v-model="comentarioActualizacion"
        :auto-resize="true"
        class="p-fluid col-12"
        placeholder="Comentarios a la actualización"
        rows="15"
      />
    </div>
    <div class="col-12 flex align-items-center justify-content-end px-3">
      <div clas="flex flex-column field p-fluid col-12">
        <AppBtnRightTeleported>
          <Button
            class="col-3 btn-primary px-5 mr-5"
            icon="pi pi-send"
            icon-pos="right"
            label="Enviar Solicitud"
            :loading="isLoading"
            @click="enviarSolicitud"
          />
        </AppBtnRightTeleported>
      </div>
    </div>
  </section>
</AppForm>
</template>
<script setup>
import store from '@/store'
import ModalAyuda from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/modal/ModalAyuda.vue'
import { computed, defineExpose, defineProps, reactive, ref, watch } from 'vue'
import {
  useAppDialog,
  useConfirmDialog,
  useAppToast,
  useFormValidation
} from '@/modules/common/composables'
import {
  useMantenedorCDD,
  useSolicitudesFiscalCDD
} from '@/modules/catalogo-documental-digital/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useRouter } from 'vue-router'
import { useBase64 } from '@vueuse/core'

const router = useRouter()
const { toastError, toastSuccess, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { launchDialog } = useAppDialog()

const { solicitudesFiscalCDD_solicitudSubirOActualizarDocumento } =
  useSolicitudesFiscalCDD()

const {
  nivelAcceso,
  formatoRecepcion,
  claseDocumental,
  procedencia,
  nivelFirma,
  idiomas
} = useMantenedorCDD()

const props = defineProps({
  origenTabla: propTypes.string,
  catalogo: propTypes.object,
  selectTab: propTypes.string,
  documentoSeleccionado: propTypes.object,
  tabChange: propTypes.boolean
})

const disabled = ref('')
const comentarioActualizacion = ref('')

const formData = reactive({
  fileBase64: '',
  nombreArchivo: '',
  formatoRecepcion: null,
  claseDocumental: null,
  procedencia: null,
  idioma: 1,
  nivelAcceso: 0,
  nivelFirma: 3,
  tipoSolicitud: 'agregar',
  cantidadPaginas: '',
  almacenamientoFisico: 3,
  consultas: 3,
  respaldoCustodia: 3,
  esEvidencia: 3,
  resumen: '',
  observaciones: '',
  formato: null,
  codigoCatalogo: ''
})

const solicitante = reactive({
  idSolicitante: store.state.session.user.sub,
  nombreSolicitante: store.state.session.user.name
})

const { formSubmitted, required, isFormValid, resetFormData, numeric } =
  useFormValidation({ formData, validationScope: 'formCrearDocumento' })

const documentoSeleccionado = computed(() => props.documentoSeleccionado)
const tabChange = computed(() => props.tabChange)

const isLoading = ref(false)

function openAyuda () {
  launchDialog({
    component: ModalAyuda,
    header: '',
    width: '30%',
    cancelLabel: 'Cerrar'
  })
}

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
      disabled.value = true
      // necesarios para que funcione el endpoint
      formData.relacionFront = 'Documento diligencia'
      formData.origen = 'Diligencia'
      formData.mime_type = tipo
    }
  } catch (error) {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}

function enviarSolicitud () {
  console.log(formData)
  console.log(documentoSeleccionado.value)
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const fiscalias = store.state.session.user.fiscalias
  const fiscalia = fiscalias.find((f) => f.default === true)
  formData.fiscalia = fiscalia.fiscalia
  solicitante.email = store.state.session.user.email || ''
  solicitante.cargo = store.state.session.user.cargo || ''
  solicitante.telefono = store.state.session.user.telefono || ''
  solicitante.anexo = store.state.session.user.anexo || ''

  formData.nombreCatalogo = props.catalogo.nombre_catalogo
  formData.codigoCatalogo = props.catalogo.id_folder_filenet

  if (props.selectTab === 1) {
    formData.idDocumentoFilenet = documentoSeleccionado.value.id
    formData.observaciones = comentarioActualizacion.value
    formData.idArchivo = documentoSeleccionado.value.id
    formData.tipoSolicitud = 'actualizar'
    formData.esActualizacion = true
  }

  console.log(formData)

  launchConfirmDialog({
    header: 'Enviar Solicitud ',
    acceptLabel: 'Aceptar',
    message: '¿Estás seguro de querer enviar la Solicitud?',
    accept: () => {
      requestUtil({
        action: solicitudesFiscalCDD_solicitudSubirOActualizarDocumento,
        payload: {
          solicitante: solicitante,
          dataDocumento: formData
        },
        resolve: () => {
          toastSuccess('La solicitud ha sido enviada con éxito')
          resetFormData()
          router.push({ name: 'BandejaFiscalCdd' })
        },
        reject: () => {
          toastError('Error al enviar la solicitud')
        }
      })
    }
  })
}

watch(documentoSeleccionado, () => {
  Object.assign(formData, documentoSeleccionado.value)
})

watch(tabChange.value, () => {
  resetFormData()
})

defineExpose({ formData, isFormValid, resetFormData })
</script>

<style scoped>
.question {
  color: black;
  background-color: transparent;
}
.question:hover {
  color: black;
  background-color: transparent;
}
.p-button-label,
.p-selectbutton .p-button {
  font-weight: normal !important;
}
.p-button {
  font-weight: normal !important;
}
.p-button:enabled:focus {
  color: black;
  background-color: transparent;
}
</style>
