<template>
<AppFieldset
  legend="Ingresar Nuevo Eslabón"
  v-bind="$attrs"
>
  <h3 class="col-12 my-2">
    Entregado por:
  </h3>
  <div class="grid col-12">
    <p class="col-12 md:col-6 my-2">
      <span class="font-bold"> Nombre: </span>{{ queinRecibe?.nombre }}
    </p>
    <p class="col-12 md:col-6 my-2">
      <span class="font-bold"> Institución: </span>{{ queinRecibe?.institucion }}
    </p>
    <p class="col-12 md:col-6 my-2">
      <span class="font-bold"> RUT: </span>{{ queinRecibe?.rut }}
    </p>
    <p class="col-12 md:col-6 my-2">
      <span class="font-bold"> Unidad: </span>{{ queinRecibe?.unidad }}
    </p>
    <p class="col-12 md:col-6 my-2">
      <span class="font-bold"> Cargo: </span>{{ queinRecibe?.cargo }}
    </p>
  </div>
  <div class="col-12">
    <h3>Recibido por:</h3>
  </div>
  <AppForm
    id="nuevoEslabon"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="validationScopeEslabon"
  >
    <div class="grid col-12 p-fluid">
      <AppInput
        id="nombre"
        v-model="formData.nombre"
        class="col-12 md:col-6 lg:col-4"
        :disabled="readOnly"
        label="Nombre"
        :rules="{ required }"
      />
      <RutInput
        id="rut-sujeto"
        v-model="formData.rutQuienRecibe"
        class="col-12 md:col-6 lg:col-4"
        label="Rut"
        :rules="{ required }"
      />
      <AppInput
        id="gradoQuienRecibe"
        v-model="formData.gradoQuienRecibe"
        class="col-12 md:col-6 lg:col-4"
        :disabled="readOnly"
        label="Grado/Cargo"
        :rules="{ required }"
      />
      <AppInput
        id="institucionQuienRecibe"
        v-model="formData.institucionQuienRecibe"
        class="col-12 md:col-6 lg:col-4"
        :disabled="readOnly"
        label="Institución"
        :rules="{ required }"
      />
      <AppInput
        id="unidadQuienRecibe"
        v-model="formData.unidadQuienRecibe"
        class="col-12 md:col-6 lg:col-4"
        :disabled="readOnly"
        label="Unidad"
        :rules="{ required }"
      />
    </div>
    <h3 class="col-12">
      Entregada para:
    </h3>
    <div class="col-12">
      <AppDropdown
        id="motivoEntrega"
        v-model="formData.motivoEntrega"
        class="col-12 md:col-6 lg:col-4 pl-0"
        label="Motivo de Entrega"
        option-label="name"
        option-value="name"
        :options="motivoEntregaOptions"
        :rules="{ required }"
        show-clear
      />
    </div>

    <h3 class="my-3">
      Ingresar Imágenes:
    </h3>
    <div class="col-12 grid">
      <div class="col-12 md:col-4">
        <div class="col-12">
          <FileUpload
            ref="files"
            v-model="filesOnSelect"
            accept="image/*"
            choose-label="Seleccionar Imagen"
            class="btn-fileupload lg:col-12 w-full"
            :max-file-size="16000000"
            mode="basic"
            name="demo[]"
            @select="onSelect"
          />
        </div>
        <div class="col-12 mt-3 mb-5">
          <Button
            class="btn-form w-full"
            :disabled="!filesOnSelect"
            icon="pi pi-paperclip"
            icon-pos="right"
            label="Adjuntar Imagen"
            :loading="isLoadingAdjuntar"
            style="min-width: 256px"
            @click="addArchivoNuevoEslabon"
          />
        </div>
      </div>

      <div class="col-12 md:col-8">
        <TablaImagenes />
      </div>
    </div>
    <AppTextarea
      id="observacionesDelEslabon"
      v-model="formData.observacionesDelEslabon"
      :auto-resize="true"
      class="col-12 p-fluid"
      cols="100"
      label="Observaciones del eslabón"
      rows="3"
    />
  </AppForm>
</AppFieldset>
<div class="mt-3 mb-5 lg:col-offset-8">
  <Button
    class="btn-form w-auto"
    icon="pi pi-save"
    icon-pos="right"
    label="Firmar con Clave Única"
    :loading="isLoadingAdjuntar"
    style="min-width: 256px"
    @click="openFirmaConClaveUnica"
  />
</div>
</template>

<script setup>
import { defineExpose, reactive, defineProps, computed, ref } from 'vue'
// components
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import TablaImagenes from '@/modules/recepcion-especies-dinero/components/levantar-cadena-custodia/TablaImagenes.vue'
// composables
import { useFormValidation, useAppToast } from '@/modules/common/composables'
import { useLevantamientoCadenaCustodio } from '../../composables'
// utils
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'

const { levantamientoCadenaCustodio_addImagen } =
  useLevantamientoCadenaCustodio()
const { toastError } = useAppToast()
const imagenAgregar = reactive(initialData())

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
    formatoActual: 'string',
    relacionFront: 'string',
    version: '',
    fotografiasVideos: '',
    idArchivo: 'string',
    idRelacion: 'string',
    idTipoRelacion: 'string'
  }
}

const p = defineProps({
  ultimoEslabon: propTypes.object
})

const files = ref()
const filesOnSelect = ref(false)
const formData = reactive({
  nombre: '',
  rutQuienRecibe: '',
  gradoQuienRecibe: '',
  institucionQuienRecibe: '',
  unidadQuienRecibe: '',
  motivoentrega: '',
  observacionesDelEslabon: ''
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

      imagenAgregar.nombreArchivo = nombreArchivo.replace(/\.[^/.]+$/, '')
      imagenAgregar.extensionArchivo = nombreArchivo.split('.').pop()
      imagenAgregar.tamanoArchivo = (tamano / 1024).toFixed(0)
    }
    filesOnSelect.value = !filesOnSelect.value
  } catch (error) {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
  }
}

function addArchivoNuevoEslabon () {
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

const { required, isFormValid, formSubmitted, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'validationScopeEslabon'
  })

const motivoEntregaOptions = [
  { name: 'Traslado', id: 1 },
  { name: 'Custodia', id: 1 },
  { name: 'Peritaje', id: 1 },
  { name: 'Inspección Presencial', id: 1 }
]

const queinRecibe = computed(() =>
  p.ultimoEslabon.intervinientesCadena?.find((e) => e.rol === 'Recibe')
)
// const queinEntrega = computed(() => p.ultimoEslabon.intervinientesCadena.find(e => e.rol === 'Entrega'))

defineExpose({ formData, isFormValid, resetFormData, imagenAgregar })
</script>
