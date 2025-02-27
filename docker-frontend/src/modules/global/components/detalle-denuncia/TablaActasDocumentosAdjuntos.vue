<template>
<AppForm
  id="registro-parte"
  class="mt-4"
  :form-submitted="formSubmitted"
  validation-scope="formActasDocumentos"
>
  <AppFieldset
    class="p-fluid col-12 mx-auto pt-3"
    legend="Agregar Documentos Adjuntos (opcional)"
    :toggleable="true"
  >
    <AppDropdown
      id="tipoDocumento"
      v-model="formData.tipoDocumento"
      class="col-12 md:col-6 lg:col-3"
      label="Tipo de Documento"
      option-label="descripcion"
      option-value="id"
      :options="tiposDocumentosAdjuntos"
      :retrieve-data-action="mantenedor_getTiposDocumentosAdjuntos"
      :rules="{
        required
      }"
      show-clear
      @change="getNombresDocumento"
    />
    <AppDropdown
      id="nombreDocumento"
      v-model="formData.nombreDocumento"
      class="col-12 md:col-6 lg:col-3"
      :disabled="formData.tipoDocumento === ''"
      label="Nombre de Documento"
      :loading="loading.nombresTipoDocumento"
      option-label="descripcion"
      option-value="id"
      :options="nombresTipoDocumento"
      :rules="{
        required
      }"
      show-clear
    />
    <AppInput
      id="observaciones"
      v-model="formData.observaciones"
      class="col-12 lg:col-6"
      label="Observaciones"
      :rules="{
        required
      }"
    />
    <div class="col-offset-2 col-8 md:col-6 md:col-offset-0 lg:col-3">
      <p class="pl-2">
        Estado del Documento(
        <span class="text-color"> * </span>)
      </p>
      <AppSelectButton
        id="estado-documento"
        v-model="formData.esDocumentoFaltante"
        class=""
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Adjunto', value: false },
          { name: 'Faltante', value: true }
        ]"
        :rules="{
          required
        }"
      />
    </div>
    <div class="col-12 flex justify-content-center pt-0 pb-4">
      <Button
        v-if="editando"
        class="p-button-warning p-button-outlined mr-3"
        icon="pi pi-plus"
        icon-pos="right"
        label="Cancelar"
        style="width: auto"
        @click="cancelarEdicion"
      />
      <Button
        class="btn-fileupload"
        icon="pi pi-book"
        icon-pos="right"
        :label="editando ? 'Modificar Documento' : 'Agregar Documento'"
        style="width: auto"
        @click="agregarDocumento"
      />
    </div>
    <AppDataTable
      class="w-full mb-4 px-3 pt-3"
      :loading="loading.documentosAdjuntos"
      responsive-layout="scroll"
      :rows="5"
      striped-rows
      :total-records="actasDocumentosAdjuntos.length"
      :value="actasDocumentosAdjuntos"
    >
      <Column header="Tipo Documento">
        <template #body="{ data }">
          <span>
            {{ mantenedor_getDescripciontiposDocumentosAdjuntosById(data.tipoDocumento) }}
          </span>
        </template>
      </Column>
      <Column header="Nombre Documento">
        <template #body="{ data }">
          <span>
            {{ getNombreDocumento(data.nombreDocumento) }}
          </span>
        </template>
      </Column>

      <Column header="Documentos Faltantes">
        <template #body="{ data }">
          <span>
            {{ data.esDocumentoFaltante ? 'Si' : 'No' }}
          </span>
        </template>
      </Column>
      <Column header="Observaciones">
        <template #body="{ data }">
          <span v-tooltip.top="data.comentarioAcd">
            {{ data.observaciones.substring(0,30) + "..." }}
          </span>
        </template>
      </Column>
      <Column
        header="Acciones"
        style="width: 74px"
      >
        <template #body="{ data }">
          <div class="flex justify-content-center">
            <Button
              aria-controls="overlay_menu"
              aria-haspopup="true"
              class="p-button-rounded p-button-outlined btn-primary-outline"
              icon="pi pi-ellipsis-v"
              type="button"
              @click="toggleAcciones($event, data)"
            />
          </div>
          <Menu
            id="overlay_menu"
            ref="menuPartes"
            :model="menuPartesItems"
            :popup="true"
          />
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</AppForm>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { requestUtil } from '@/utils'
import { useOficinaPartesStore } from '@/modules/global/composables/useOficinaPartesStore'
import { useAppToast, useFormValidation, useConfirmDialog } from '@/modules/common/composables'
import { useMantenedorStore } from '../../composables'

const { launchConfirmDialog } = useConfirmDialog()
const { toastSuccess, toastError, toastWarning, TOAST_MESSAGES } = useAppToast()

const { actasDocumentosAdjuntos, oficinaPartes_agregarDocumento, oficinaPartes_ELIMINAR_DOCUMENTO, oficinaPartes_EDITAR_DOCUMENTO } = useOficinaPartesStore()

const {
  mantenedor_getTiposDocumentosAdjuntos, tiposDocumentosAdjuntos,
  mantenedor_getNombresTipoDocumento, nombresTipoDocumento,
  mantenedor_getDescripciontiposDocumentosAdjuntosById
} = useMantenedorStore()

const formData = reactive(initialData())

const loading = reactive({
  nombresTipoDocumento: false,
  documentosAdjuntos: false
})

const editando = ref(false)
const nombresDocumentos = ref([])
const documentoSeleccionado = ref({})
const menuPartes = ref({})

const { formSubmitted, isFormValid, required, resetFormData } = useFormValidation({
  formData: formData,
  validationScope: 'formActasDocumentos'
})

function initialData () {
  return {
    tipoDocumento: '',
    nombreDocumento: '',
    observaciones: '',
    esDocumentoFaltante: null,
    esDocumentoSolicitado: false
  }
}

const getNombresDocumento = (opt) => {
  requestUtil({
    action: mantenedor_getNombresTipoDocumento,
    payload: { idTipoDocumento: opt.value },
    loader: (l) => (loading.nombresTipoDocumento = l)
  })
}

function getNombresTiposDocumentos () {
  if (!nombresDocumentos.value.length) {
    tiposDocumentosAdjuntos.value.forEach((td) => requestUtil({
      action: mantenedor_getNombresTipoDocumento,
      payload: { idTipoDocumento: td.id },
      resolve: (r) => nombresDocumentos.value.push(...r)
    }))
  }
}

function getNombreDocumento (id) {
  if (nombresDocumentos.value.length > 0)setTimeout(() => { loading.documentosAdjuntos = false }, 1000)
  return nombresDocumentos.value.find((documento) => documento.id === id)?.descripcion
}

function populateForm (data) {
  Object.assign(formData, data)
}

function handleEditarParte () {
  console.log('editar', documentoSeleccionado.value)
  populateForm(documentoSeleccionado.value)
  editando.value = true
}

function cancelarEdicion () {
  resetFormData()
  formSubmitted.value = false
  editando.value = false
}

function handleEliminarParte () {
  launchConfirmDialog({
    message: `¿Estás seguro de eliminar Acta/Documento?`,
    accept: () => {
      oficinaPartes_ELIMINAR_DOCUMENTO(documentoSeleccionado.value)
      toastWarning('Acta/Documento Eliminado')
    }
  })
}

function agregarDocumento () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (!editando.value) {
    loading.documentosAdjuntos = true
    requestUtil({
      action: oficinaPartes_agregarDocumento,
      payload: { ...formData },
      resolve: () => {
        getNombresTiposDocumentos()
        toastSuccess('Documento Agregado')
        cancelarEdicion()
      },
      reject: (err) => {
        console.log(err)
        toastError('Ha ocurrido un error.\n', err)
      }
    })
  } else {
    launchConfirmDialog({
      message: '¿Estás Seguro(a)?',
      accept: () => {
        oficinaPartes_EDITAR_DOCUMENTO({ ...formData })
        toastSuccess('Medio de Transporte Modificado con Éxito')
        cancelarEdicion()
      }
    })
  }
}

function toggleAcciones (event, data) {
  documentoSeleccionado.value = data
  menuPartes.value.toggle(event)
}

const menuPartesItems = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Modificar',
        command: () => {
          handleEditarParte()
        }
      },
      {
        label: 'Eliminar',
        command: () => handleEliminarParte()
      }
    ]
  }
])
</script>
<style scoped>
.text-color {
  color: var(--red-700);
}
</style>
