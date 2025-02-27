<template>
<AppForm
  :id="validationScope"
  :form-readonly="readOnly"
  :form-submitted="formSubmitted"
  :validation-scope="validationScope"
>
  <div class="flex justify-content-center mt-3">
    <Button
      id="agregar-delito"
      class="btn-fileupload"
      :disabled="isFolioCerrado"
      :icon="!isCollapsed ? 'pi pi-plus' : 'pi pi-minus-circle'"
      icon-pos="right"
      :label="!isCollapsed ? 'Agregar Delito' : 'Cancelar'"
      :loading="loadingButton.isLoadingBoton"
      style="width: auto"
      type="button"
      @click="toggleBotonAgregar"
    />
    <Button
      v-if="isCollapsed && !readOnly"
      id="limpiarFormDelito"
      class="p-button-outlined p-button-warning ml-3"
      icon="pi pi-times"
      icon-pos="right"
      label="Limpiar"
      style="width: auto"
      type="button"
      @click="resetForm"
    />
  </div>
  <div
    v-if="isCollapsed"
    class="grid"
  >
    <div class="col-12">
      <DelitosFieldset />
    </div>

    <div class="col-12 lg:col-8">
      <EsAnonimoFieldset />
    </div>

    <div class="col-12 md:col-5 lg:col-4">
      <FechaHoraFieldset />
    </div>

    <div class="col-12 md:col-7 lg:col-8">
      <LugarDelitoFieldset />
    </div>

    <div class="col-12 md:col-5 lg:col-4">
      <ElementosUsadosFieldset />
    </div>

    <div class="col-12 md:col-7 lg:col-8">
      <ClasificacionFieldset />
    </div>

    <div class="col-12 md:col-4">
      <EsHallazgoFieldset />
    </div>

    <div class="col-12">
      <MedioTransporteFieldset :read-only="readOnly" />
    </div>

    <div class="col-12">
      <ExistenLesionadosFallecidosDetenidos />
    </div>

    <div class="col-12 md:col-8">
      <InformacionCamarasFieldset />
    </div>

    <div class="col-12 md:col-4">
      <VigilanciaFieldset />
      <SujetosFieldset />
    </div>

    <div class="col-12">
      <AppFieldset legend="Grabación / Video">
        <SubirArchivoIncrustado
          ref="delitoGrabacion"
          choose-label="Seleccionar Video MP4"
          :data-archivos="videosDelitos"
          :relacion-front="seccionVideo?.id"
          :tipos-archivo="'video/mp4'"
          @subir-archivo:adjuntar="
            (doc) => adjuntarDocumento(doc, delitoGrabacion.resetFormData)
          "
          @subir-archivo:eliminar="eliminar"
        />
      </AppFieldset>
    </div>

    <div class="col-12">
      <AmbitoNnaFieldset>
        <template #adjuntar-denuncia>
          <SubirArchivoIncrustado
            ref="delitoAmbitoNNA"
            choose-label="Seleccionar Archivo"
            :data-archivos="formulariosDenuncia"
            :is-loading="loadingDocs"
            :relacion-front="seccionDenuncia?.id"
            :tipos-archivo="'image/*,application/*'"
            @subir-archivo:adjuntar="
              (doc) => adjuntarDocumento(doc, delitoAmbitoNNA.resetFormData)
            "
            @subir-archivo:eliminar="eliminar"
          />
        </template>
      </AmbitoNnaFieldset>
    </div>

    <div class="col-12">
      <InfoAdicionalFieldset />
    </div>

    <div class="col-12">
      <DireccionFieldset />
    </div>

    <div class="col-12 pb-5">
      <div
        v-if="readOnly"
        class="flex justify-content-center"
      >
        <Button
          class="btn-form px-6"
          icon="pi pi-minus-circle"
          icon-pos="right"
          label="Cerrar"
          style="width: auto"
          @click="emit('cancelar-edicion')"
        />
      </div>
      <div
        v-else
        class="flex justify-content-center"
      >
        <div class="mr-4">
          <Button
            class="p-button-outlined p-button-warning"
            icon="pi pi-times"
            label="Cancelar"
            @click="emit('cancelar-edicion')"
          />
        </div>
        <Button
          v-if="!editando"
          class="btn-form"
          icon="pi pi-plus-circle"
          icon-pos="right"
          label="Guardar Delito"
          :loading="loadingButton.isLoading"
          style="width: auto"
          @click="emit('emit-agregar')"
        />

        <div v-else>
          <Button
            class="p-button-warning"
            icon="pi pi-pencil"
            label="Modificar Delito"
            :loading="loadingButton.isLoading"
            @click="emit('emit-agregar')"
          />
        </div>
      </div>
    </div>
  </div>
</AppForm>
</template>
<script setup>
import { defineProps, defineEmits, ref } from 'vue'
// composables
import {
  useDocumentoStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'

const { mantenedor_getRespuestaBasico } = useMantenedorStore()
const { videosDelitos, formulariosDenuncia } = useDocumentoStore()

const emit = defineEmits([
  'emit-boton-agregar',
  'emit-adjuntar',
  'emit-eliminar',
  'emit-agregar',
  'emit-reset',
  'cancelar-edicion'
])

const delitoGrabacion = ref()
const delitoAmbitoNNA = ref()

function getRespuestaBasica () {
  const params = {
    nombreMantenedor: 'SI_NO'
  }
  requestUtil({
    action: mantenedor_getRespuestaBasico,
    payload: { params }
  })
}
getRespuestaBasica()

defineProps({
  validationScope: {
    type: String,
    default: 'formulario-delitos'
  },
  formSubmitted: {
    type: Boolean,
    default: false
  },
  isFolioCerrado: {
    type: Boolean,
    default: false
  },
  loadingButton: propTypes.object,
  isCollapsed: {
    type: Boolean,
    default: false
  },
  editando: {
    type: Boolean,
    required: true
  },
  seccionVideo: propTypes.object,
  seccionDenuncia: propTypes.object,
  loadingDocs: Boolean,
  readOnly: Boolean
})

function toggleBotonAgregar () {
  emit('emit-boton-agregar')
}
function resetForm () {
  emit('emit-reset')
}
function adjuntarDocumento (documento, resetFunc) {
  emit('emit-adjuntar', documento, resetFunc)
}

function eliminar (documento) {
  emit('emit-eliminar', documento)
}
</script>
