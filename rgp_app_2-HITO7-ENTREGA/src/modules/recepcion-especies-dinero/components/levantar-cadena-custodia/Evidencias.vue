<template>
<AppForm
  id="evidenciasLevantamiento"
  :form-submitted="formSubmitted"
  :validation-scope="evidenciasValidationScope"
>
  <AppFieldset
    legend="Evidencias"
    :toggleable="readOnly"
  >
    <TablaEvidencias
      :editando="editando"
      :value="evidencias"
      @eliminar="openEliminar"
      @modificar="modificarDatosTabla"
    />
    <section v-if="!readOnly">
      <p class="my-3 ml-2">
        Ingresar Datos de la Evidencia:
      </p>
      <div class="col-12 grid p-fluid">
        <AppDropdown
          id="marca"
          v-model="formData.marca"
          class="col-12 md:col-6 lg:col-4"
          label="Seleccione Marca"
          option-label="name"
          option-value="value"
          :options="marcaOptions"
          show-clear
        />
        <div
          v-if="formData.marca === 1"
          class="col-8 grid p-fluid pr-0"
        >
          <AppDropdown
            id="clase"
            v-model="formData.clase"
            class="col-12 md:col-6 lg:col-6"
            label="Clase"
            option-label="name"
            option-value="name"
            :options="claseOptions"
            :rules="{ required }"
            show-clear
          />
          <AppDropdown
            id="peso"
            v-model="formData.peso"
            class="col-12 md:col-6 lg:col-6"
            label="Peso"
            option-label="name"
            option-value="value"
            :options="pesoOptions"
            :rules="{ required }"
            show-clear
          />
        </div>
        <div
          v-else
          class="col-6"
        />
        <AppInputNumber
          id="cantidad"
          v-model="formData.cantidad"
          class="col-12 md:col-6 lg:col-4"
          label="Cantidad"
          :min="0"
          :rules="{ required }"
          show-buttons
          :step="1"
          :use-grouping="false"
        />
        <div class="col-12 lg:col-8">
          <AppTextarea
            id="lugarLevantamiento"
            v-model="formData.lugarLevantamiento"
            :auto-resize="true"
            cols="100"
            label="Lugar Levantamiento"
            rows="1"
            :rules="{ required }"
          />
        </div>
        <AppTextarea
          id="descripcion"
          v-model="formData.descripcionEspecie"
          :auto-resize="true"
          class="col-12"
          cols="100"
          label="Descripción"
          rows="1"
          :rules="{ required }"
        />
      </div>
      <p class="my-3 ml-3">
        Ingresar Imágenes:
      </p>
      <div class="col-12 grid">
        <div class="col-4">
          <div class="col-12">
            <FileUpload
              ref="files"
              v-model="filesOnSelect"
              accept="image/*"
              choose-label="Seleccionar Imagen"
              class="btn-fileupload lg:col-12 w-full"
              :max-file-size="16000000"
              mode="basic"
              @select="onSelect"
            />
          </div>
          <div class="col-12 mt-3 mb-5">
            <Button
              class="btn-form w-full"
              :disabled="!filesOnSelect"
              icon="pi pi-paperclip"
              icon-pos="right"
              label="Adjuntar"
              style="min-width: 256px"
              @click="addArchivo"
            />
          </div>
        </div>

        <div class="col-8">
          <TablaImagenes :value="imagenes" />
        </div>
      </div>
      <div class="mt-3 mb-5 lg:col-offset-8">
        <Button
          v-if="!editando"
          class="btn-form w-auto"
          icon="pi pi-save"
          icon-pos="right"
          label="Guardar Evidencia"
          style="min-width: 256px"
          @click="addEvidencia"
        />
        <Button
          v-else
          class="p-button-outlined p-button-warning w-auto"
          icon="pi pi-save"
          icon-pos="right"
          label="Modificar Evidencia"
          style="min-width: 256px"
          @click="addEvidencia"
        />
      </div>
    </section>
  </AppFieldset>
</AppForm>
</template>

<script setup>
import {
  provide,
  ref,
  defineProps,
  defineExpose,
  onMounted,
  reactive
} from 'vue'
import {
  useAppToast,
  useConfirmDialog,
  useFormValidation
} from '@/modules/common/composables'
import { requestUtil, appUtil } from '@/utils'
import { useLevantamientoCadenaCustodio } from '../../composables/useLevantamientoCadenaCustodio'
import TablaEvidencias from './TablaEvidencias.vue'
import TablaImagenes from './TablaImagenes.vue'

const { toastError, TOAST_MESSAGES } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastWarning } = useAppToast()
const {
  evidencias,
  imagenes,
  levantamientoCadena_getEvidencias,
  levantamientoCadena_addEvidencia,
  levantamientoCadenaCustodio_addImagen,
  levantamientoCadenaCustodio_SET_TABLA_IMAGEN,
  levantamientoCadenaCustodio_SET_DATA_EVIDENCIA,
  levantamientoCadenaCustodio_DELETE_EVIDENCIA
} = useLevantamientoCadenaCustodio()
onMounted(() => {
  getEvidencias()
})

const files = ref()
const filesOnSelect = ref(false)
const editando = ref(false)

function initialData () {
  return {
    tipoAntecedente: 'Otro',
    nombreArchivo: '',
    descripcionArchivo: '',
    tipoArchivo: '',
    extensionArchivo: '',
    tamanoArchivo: '',
    ubicacionArchivo: '',
    origen: '',
    formatoActual: '',
    relacionFront: '',
    version: '',
    fotografiasVideos: '',
    idArchivo: '',
    idRelacion: '',
    idTipoRelacion: ''
  }
}

const imagenAgregar = reactive(initialData())
const evidenciasValidationScope = ref('evidencia-scope')

const formData = reactive({
  marca: '',
  clase: '',
  peso: '',
  cantidad: null,
  lugarLevantamiento: '',
  descripcionEspecie: '',
  idEvidencia: ''
})

defineProps({
  readOnly: {
    type: Boolean,
    default: false
  }
})

provide(evidenciasValidationScope, formData)

const { isFormValid, formSubmitted, required, resetFormData } =
  useFormValidation({
    formData,
    validationScope: evidenciasValidationScope.value
  })

function onSelect (e) {
  try {
    const archivo = e.files[0]
    if (archivo) {
      const tipo = archivo.type
      const nombreArchivo = archivo.name
      const tamano = archivo.size

      if (tipo.includes('image')) {
        imagenAgregar.tipoArchivo = 'IMAGEN'
      } else if (tipo.includes('application')) {
        imagenAgregar.tipoArchivo = 'DOCUMENTO'
      } else if (tipo.includes('video')) {
        imagenAgregar.tipoArchivo = 'VIDEO'
      } else if (tipo.includes('audio')) {
        imagenAgregar.tipoArchivo = 'AUDIO'
      } else {
        imagenAgregar.tipoArchivo = 'OTRO'
      }

      imagenAgregar.idArchivo = appUtil.cadenaAleatoria(32)
      imagenAgregar.nombreArchivo = nombreArchivo.replace(/\.[^/.]+$/, '')
      imagenAgregar.extensionArchivo = nombreArchivo.split('.').pop()
      imagenAgregar.tamanoArchivo = (tamano / 1024).toFixed(0)
    }
    filesOnSelect.value = !filesOnSelect.value
  } catch (error) {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}

function addArchivo () {
  const dataDoc = {
    relacionFront: imagenAgregar.relacionFront,
    idTipoRelacion: imagenAgregar.idTipoRelacion
  }
  requestUtil({
    action: levantamientoCadenaCustodio_addImagen,
    payload: {
      ...dataDoc,
      ...imagenAgregar
    }
  })
  files.value.clear()
  filesOnSelect.value = !filesOnSelect.value
}

async function getEvidencias () {
  await requestUtil({
    action: levantamientoCadena_getEvidencias,
    payload: {
      idNueAsignada: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      nue: 0
    }
  })
}
function modificarDatosTabla (data) {
  Object.assign(formData, data)
  editando.value = true
}
function openEliminar (data) {
  console.log('DATA Evidencia', data)

  launchConfirmDialog({
    message: `¿Estás seguro de eliminar la evidencia?`,
    accept: () => {
      levantamientoCadenaCustodio_DELETE_EVIDENCIA(data.idEvidencia)
      toastWarning('Documento Eliminado')
    }
  })
  resetFormData()
  editando.value = false
}

function addEvidencia () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  if (!editando.value) {
    requestUtil({
      action: levantamientoCadena_addEvidencia,
      payload: {
        idEvidencia: appUtil.cadenaAleatoria(32),
        marca: formData.marca === '' ? 0 : formData.marca,
        clase:
          typeof formData.clase === 'number'
            ? formData.clase.toString()
            : formData.clase,
        peso: formData.peso === '' ? null : formData.peso,
        cantidad: formData.cantidad,
        descripcionEspecie: formData.descripcionEspecie,
        lugarLevantamiento: formData.lugarLevantamiento,
        observaciones: 'string',
        fotografias: [
          {
            base64: imagenes.value.length > 0 ? 'imagenes.value' : 'Sin imagen'
          }
        ]
        // imagenes
      }
    })
    // const imagenes = imagenAgregar
    setTablaImagenes()
    resetFormData()
  } else {
    launchConfirmDialog({
      message: `¿Estás seguro de modificar la evidencia?`,
      accept: () => {
        console.log('evidencia', evidencias.value)
        setEvidencia()
        setTablaImagenes()
      }
    })
  }
}
function setEvidencia () {
  requestUtil({
    action: levantamientoCadenaCustodio_SET_DATA_EVIDENCIA,
    payload: {
      idEvidencia: formData.idEvidencia,
      marca: formData.marca === '' ? 0 : formData.marca,
      clase: formData.clase,
      peso: formData.peso === '' ? null : formData.peso,
      cantidad: formData.cantidad,
      descripcionEspecie: formData.descripcionEspecie,
      lugarLevantamiento: formData.lugarLevantamiento,
      observaciones: 'string',
      fotografias: [
        {
          base64: 'imagenes.value'
        }
      ]
    },
    resolve: () => {
      toastSuccess('Evidencia modificada con éxito ')
      // const imagenes = imagenAgregar
      resetFormData()
      editando.value = false
    }
  })
}
function setTablaImagenes () {
  requestUtil({
    action: levantamientoCadenaCustodio_SET_TABLA_IMAGEN,
    payload: {
      imagenAgregar
    }
  })
}

const marcaOptions = [
  { name: 'Especie Peligrosa', value: 1 },
  { name: 'Especie Digital', value: 2 },
  { name: 'Vehículo', value: 3 }
]
const claseOptions = [
  { name: 'Uno', value: 1 },
  { name: 'Dos', value: 2 },
  { name: 'Tres', value: 3 }
]
const pesoOptions = [
  { name: 'Kilo', value: 1 },
  { name: 'Gramo', value: 2 },
  { name: 'Tonelada', value: 3 }
]
defineExpose({ formData, imagenAgregar })
</script>
<style scoped>
p {
  font-weight: bold;
  font-size: 1.2em;
}
</style>
