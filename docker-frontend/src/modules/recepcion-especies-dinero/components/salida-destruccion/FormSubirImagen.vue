<template>
<AppFieldset legend="Adjuntar Archivos de Registro">
  <h4 class="my-6">Imágenes de las especies</h4>
  <TablaDocumentos
    readOnly
    showImage
    :value="documentos"
  />
  <div class="w-full grid col-12 my-6">
    <h4 class="mb-4 col-12">Ingresar imágenes del proceso de destrucción</h4>
    <SubirArchivo 
      ref="subirImagen"
      class="col-4"
      :select-label="'Seleccionar Imagen'"
      :is-loading="isLoading"
      :relacion-front="seccion?.id"
      :tipos-archivo="'image/*'"
      @subir-archivo:adjuntar="adjuntarDocumento"
    />
    <AppForm
      class="grid col-12"
      :form-submitted="formSubmitted"
      validation-scope="dataArchivo"
    >
      <AppInput
        id="nombreArchivo"
        v-model="formData.nombreArchivo"
        class="col-4 p-fluid"
        label="Nombre del Archivo"
      />
      <AppInput
        id="descripcion"
        v-model="formData.descripcion"
        class="col-5 p-fluid"
        label="Descripción"
      />
      <div class="col-3">
        <Button
          class="p-button-outlined col-12"
          icon="pi pi-save"
          icon-pos="right"
          label="Guardar Imagen"
          @click="saveDocumento"
        />
      </div>
    </AppForm>
  </div>
</AppFieldset>
<div class="flex w-full">
  <div class="col-8 grid">
    <SubirArchivo 
      ref="subirImagen"
      class="col-6"
      :select-label="'Subir Acta Destrucción Firmada'"
      :is-loading="isLoading"
      :relacion-front="seccion?.id"
      :tipos-archivo="'image/*, Aplication/*'"
      @subir-archivo:adjuntar="adjuntarActaDestruccion"
    />
    <SubirArchivo 
      ref="subirImagen"
      class="col-6"
      :select-label="'Subir Orden de Servicion Firmado'"
      :is-loading="isLoading"
      :relacion-front="seccion?.id"
      :tipos-archivo="'image/*, Aplication/*'"
      @subir-archivo:adjuntar="adjuntarOrdenServicio"
    />
    <SubirArchivo 
      ref="subirImagen"
      class="col-6"
      :select-label="'Subir Orden de Destrucción Firmado'"
      :is-loading="isLoading"
      :relacion-front="seccion?.id"
      :tipos-archivo="'image/*, Aplication/*'"
      @subir-archivo:adjuntar="adjuntarOrdenDestruccion"
    />
    <SubirArchivo 
      ref="subirImagen"
      class="col-6"
      :select-label="'Subir Comprobante de Pesaje'"
      :is-loading="isLoading"
      :relacion-front="seccion?.id"
      :tipos-archivo="'image/*, Aplication/*'"
      @subir-archivo:adjuntar="adjuntarComprobantePesaje"
    />
  </div>
  <div class="">
    <Button
      class="p-button-outlined px-8 ml-6"
      icon="pi pi-external"
      icon-pos="right"
      label="Firmar Comprobante"
      @click="handleFirmarComprobante"
    />
  </div>
</div>

</template>

<script setup>
import { ref, reactive } from 'vue';
import TablaDocumentos from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/TablaDocumentos.vue'
import SubirArchivo from '@/modules/global/components/documentos/SubirArchivo.vue';
import { useFormValidation } from '@/modules/common/composables';

const isLoading = ref(false)
const imagen = ref()
const actaDestruccion = ref()
const ordenServicio = ref()
const comprobandePesaje = ref()
const documentos = ref([
  {
    fecha_creacion:'23-06-22',
    nombre_archivo: 'Test image',
    descripcion: 'Test...',
    procedencia: 'Carabineros'
  }
])

const formData = reactive({
  nombreArchivo: '',
  descripcion: '',
})

const { formSubmitted } = useFormValidation({ formData, validationScope: 'dataArchivo' })

function adjuntarDocumento(file){
  imagen.value = file
}
function adjuntarActaDestruccion(file){
  actaDestruccion.value = file
}
function adjuntarOrdenServicio(file){
  ordenServicio.value = file
}
function adjuntarOrdenDestruccion(file){
  ordenServicio.value = file
}
function adjuntarComprobantePesaje(file){
  comprobandePesaje.value = file
}

function handleFirmarComprobante(){
  // etc..
}

function saveDocumento(){
  // requestUtil({
  //   action: documento_addDocumentoCDD,
  //   payload: documento.value,
  //   resolve: () => {
  //     toastSuccess('Documento Adjuntado')
  //   }
  // })
  // getDocumentos()
}
</script>