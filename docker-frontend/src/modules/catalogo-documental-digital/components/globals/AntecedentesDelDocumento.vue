<template>
<AppFieldset
  class="p-fluid pb-6 mt-0 pt-0"
  v-bind="$attrs"
>
  <AppForm
    id="formCrearDocumento"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="formCrearDocumento"
  >
    <LoaderSkeleton
      v-show="showLoader"
      height="1000px"
    />
    <section v-show="!showLoader">
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
            v-model="formData.formatoRecepcion"
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
              accept="image/*,application/*"
              choose-label="Seleccionar Archivo"
              class="p-button-outlined w-full"
              :disabled="
                !esOficinaPartes &&
                  formData.formatoRecepcion !==
                  getIdFormatoRecepcionByCodigo('2')
              "
              :max-file-size="16000000"
              mode="basic"
              name="demo[]"
              :remove-uploaded-files="prueba"
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
    </section>
    <div
      v-if="selectTab === 1 || esOficinaPartes"
      class="col-12 md:col-12 p-fluid"
    >
      <AppTextarea
        id="comentarioSolicitud"
        v-model="formData.comentarioSolicitud"
        :auto-resize="true"
        class="p-fluid col-12"
        :placeholder="
          esOficinaPartes
            ? 'Observaciones Oficina de Partes'
            : 'Comentarios a la actualización'
        "
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
  </AppForm>
</AppFieldset>
</template>
<script setup>
// COMPONENTS
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import ModalAyuda from '@/modules/catalogo-documental-digital/components/solicitud-gestion-documento-archivo/modal/ModalAyuda.vue'

// UTILS
import store from '@/store'
import { useRouter } from 'vue-router'
import { computed, defineExpose, defineProps, reactive, ref, watch, defineEmits } from 'vue'

// COMPOSABLES
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useAppDialog, useConfirmDialog, useAppToast, useFormValidation } from '@/modules/common/composables'
import { useCreacionYGestionDeCDD, useMantenedorCDD, useSolicitudesFiscalCDD } from '@/modules/catalogo-documental-digital/composables'
const router = useRouter()
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()
const { documentoActualizar } = useCreacionYGestionDeCDD()
const { toastError, toastSuccess, TOAST_MESSAGES } = useAppToast()
const { solicitudesFiscalCDD_solicitudSubirOActualizarDocumento } = useSolicitudesFiscalCDD()
const { nivelAcceso, formatoRecepcion, claseDocumental, procedencia, nivelFirma, idiomas } = useMantenedorCDD()

// VALUES
const disabled = ref('')
const prueba = ref(false)
const isLoading = ref(false)
const fiscalias = store.state.session.user.fiscalias
const fiscalia = fiscalias.find((f) => f.default === true)

const formData = reactive(initialData())
const tabChange = computed(() => props.tabChange)
const documentoSeleccionado = computed(() => props.documentoSeleccionado)

const emit = defineEmits(['setLoader'])
const { formSubmitted, required, isFormValid, numeric } = useFormValidation({ formData, validationScope: 'formCrearDocumento' })

const props = defineProps({
  origenTabla: propTypes.string,
  catalogo: propTypes.object,
  selectTab: propTypes.string,
  documentoSeleccionado: propTypes.object,
  tabChange: Boolean,
  showLoader: {
    type: Boolean,
    default: () => false
  },
  esOficinaPartes: {
    type: Boolean,
    default: () => false
  }
})

// LOGIC
watch(tabChange.value, () => {
  resetForm()
})
function initialData () {
  return {
    fileBase64: '',
    nombreArchivo: '',
    formatoRecepcion: null,
    claseDocumental: null,
    procedencia: null,
    idioma: getIdIdiomaByCodigo('es-CL'),
    nivelAcceso: null,
    almacenamientoFisico: null,
    consultas: null,
    respaldoCustodia: null,
    esEvidencia: null,
    tipoSolicitud: 'agregar',
    nivelFirma: null,
    cantidadPaginas: '',
    resumen: '',
    formato: null,
    codigoCatalogo: '',
    comentarioSolicitud: ''
  }
}

function openAyuda () {
  launchDialog({
    component: ModalAyuda,
    header: '',
    width: '30%',
    cancelLabel: 'Cerrar'
  })
}

function onSelect (e) {
  const archivo = e.files[0]
  let nombreArchivo = archivo.name
  formData.extensionArchivo = nombreArchivo.split('.').pop()

  if (
    (archivo && formData.extensionArchivo === 'pdf') ||
    formData.extensionArchivo === 'docx' ||
    formData.extensionArchivo === 'jpeg' ||
    formData.extensionArchivo === 'xlsx' ||
    formData.extensionArchivo === 'jpg' ||
    formData.extensionArchivo === 'png' ||
    formData.extensionArchivo === 'html'
  ) {
    const tipo = archivo.type
    const tamano = archivo.size
    const reader = new FileReader()

    reader.readAsDataURL(archivo)
    reader.onload = () => {
      formData.fileBase64 = reader.result.split(',')[1]
    }

    formData.nombreArchivo = nombreArchivo.replace(/\.[^/.]+$/, '')
    formData.tamanoArchivo = (tamano / 1024).toFixed(0)
    disabled.value = true
    formData.relacionFront = 'Gestion Documentos Actualizar'
    formData.origen = 'Gestion Documentos'
    formData.mime_type = tipo
  } else {
    nombreArchivo = null
    toastError(
      'Formato de archivo no permitido; formatos permitidos: pdf, docx, xlsx, jpg, jpeg, png, html'
    )
    prueba.value = true
  }
}
function getIdFormatoRecepcionByCodigo (codigoTipoRecpcion) {
  return formatoRecepcion.value?.find(
    (tipoCatalogo) => tipoCatalogo.codigo === codigoTipoRecpcion
  )?.id
}
function getIdIdiomaByCodigo (codigoIdioma) {
  return idiomas.value?.find((idioma) => idioma.codigo === codigoIdioma)?.id
}
function enviarSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  emit('setLoader', true)
  const solicitante = reactive({
    idSolicitante: store.state.session.user.sub,
    nombreSolicitante: store.state.session.user.name,
    fiscalia: fiscalia.fiscalia,
    email: store.state.session.user.email || '',
    cargo: store.state.session.user.cargo || '',
    telefono: store.state.session.user.telefono || '',
    anexo: store.state.session.user.anexo || ''
  })

  formData.nombreCatalogo = props.catalogo[0].nombreCatalogo
  formData.codigoCatalogo = props.catalogo[0].idFolderFilenet
  formData.tipoSolicitud = props.esOficinaPartes
    ? 'agregar-oficina-partes'
    : 'agregar'

  if (formData.fileBase64 === '') {
    formData.fileBase64 = documentoActualizar.value.documento
    formData.mime_type = documentoActualizar.value.mimeType
  }

  if (props.selectTab === 1) {
    formData.idDocumentoFilenet = documentoSeleccionado.value.idFilenet
    formData.idArchivo = documentoSeleccionado.value.idFilenet
    formData.tipoSolicitud = 'actualizar'
    formData.esActualizacion = true
  }

  const payload = {
    solicitante: {
      id_solicitante: solicitante.idSolicitante,
      nombre: solicitante.nombreSolicitante,
      fiscalia: solicitante.fiscalia,
      email: solicitante.email
    },
    dataDocumento: {
      id_clase_documental: formData.claseDocumental,
      codigoCatalogo: formData.codigoCatalogo,
      id_formato_recepcion: formData.formatoRecepcion,
      id_procedencia: formData.procedencia,
      id_nivel_acceso: formData.nivelAcceso,
      id_nivel_firma: formData.nivelFirma,
      disponible_consulta: formData.consultas,
      evidencia: formData.esEvidencia,
      resumen: formData.resumen,
      cantidad_paginas: formData.cantidadPaginas,
      existe_respaldo_fisico: formData.respaldoCustodia,
      requiere_almacenamiento: formData.almacenamientoFisico,
      mime_type: formData.mime_type,
      archivo: formData.fileBase64,
      nombre_archivo: formData.nombreArchivo,
      id_idioma: formData.idioma,
      tipo_solicitud: formData.tipoSolicitud,
      comentarioSolicitud: formData.comentarioSolicitud,
      idArchivo: formData.idArchivo
    }
  }
  if (formData.esActualizacion) {
    payload.dataDocumento.id_documento_filenet = formData.idArchivo
  }
  launchConfirmDialog({
    header: 'Enviar Solicitud ',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Cancelar',
    message: '¿Estás seguro de querer enviar la Solicitud?',
    accept: () => {
      requestUtil({
        action: solicitudesFiscalCDD_solicitudSubirOActualizarDocumento,
        payload: {
          ...payload
        },
        resolve: () => {
          toastSuccess('La solicitud ha sido enviada con éxito')
          resetForm()
          setTimeout(() => {
            props.esOficinaPartes
              ? router.push({ name: 'CddBandejaOficinaPartes' })
              : router.push({ name: 'BandejaFiscalCdd' })
          }, 300)
        },
        reject: () => {
          emit('setLoader', false)
          console.log('error')
          toastError(
            'Hubo un error al enviar la solicitud. Intente nuevamente'
          )
        }
      })
    },
    reject: () => {
      emit('setLoader', false)
    },
    onHide: () => {
      emit('setLoader', false)
    }
  })
}

function resetForm () {
  Object.assign(formData, initialData())
}

function populateForm (documentoSeleccionado) {
  console.log(documentoSeleccionado)
  formData.nombreArchivo = documentoSeleccionado.nombre
  formData.formatoRecepcion = documentoSeleccionado.formatoRecepcionId
  formData.claseDocumental = documentoSeleccionado.claseDocumentalId
  formData.nivelFirma = documentoSeleccionado.nivelFirmaId
  formData.procedencia = documentoSeleccionado.procedenciaId
  formData.nivelAcceso = documentoSeleccionado.nivelAccesoId
  formData.idioma = documentoSeleccionado.idiomaId
  formData.cantidadPaginas = documentoSeleccionado.cantidadPaginas
  formData.consultas = `${documentoSeleccionado.consultas}`
  formData.resumen = `${documentoSeleccionado.resumen}`
  formData.esEvidencia = documentoSeleccionado.esEvidencia
  formData.almacenamientoFisico = documentoSeleccionado.almacenamientoFisico
  formData.respaldoCustodia = documentoSeleccionado.respaldoFisico
  formData.consultas = documentoSeleccionado.disponibleConsultas
}

defineExpose({ formData, isFormValid, resetForm, populateForm })
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
