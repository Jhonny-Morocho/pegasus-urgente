<template>
<div class="grid col-12">
  <h3 class="col-4">
    Fiscal / Turno: {{ user.preferred_username }}
  </h3>
  <h3 class="col-4">
    Procedimiento: {{ folio ? `Folio ${folio}` : 'Sin Folio' }}
  </h3>
  <div class="grid col-12">
    <AppDropdown
      id="nombreJuzgado"
      v-model="formData.juzgado"
      class="col-4 p-fluid"
      label="Seleccione Juzgado"
      option-label="descripcion"
      option-value="id"
      :options="juzgados"
      :retrieve-data-action="mantenedor_getjuzgados"
      show-clear
    />
    <AppDropdown
      id="nombreJuez"
      v-model="formData.nombreJuez"
      class="col-4 p-fluid "
      label="Seleccione Juez"
      option-label="descripcion"
      option-value="id"
      :options="[
        { descripcion: 'Juez 1', id: 1 },
        { descripcion: 'Juez 2', id: 2 }
      ]"
      show-clear
    />
    <AppDropdown
      id="otroJuez"
      v-model="formData.otroJuez"
      class="col-4 p-fluid"
      label="Seleccione  Otro Juez"
      option-label="descripcion"
      option-value="id"
      :options="[
        { descripcion: 'Otro Juez 1', id: 1 },
        { descripcion: 'Otro Juez 2', id: 2 }
      ]"
      show-clear
    />
  </div>
  <div class="grid col-12">
    <AppTextarea
      id="copiaCorreos"
      v-model="formData.copiaCorreos"
      :auto-resize="true"
      class="p-fluid col-12"
      cols="100"
      label="Ingrese correos electrónicos en copia"
      rows="6"
    />
  </div>
  <div class="grid col-12">
    <AppTextarea
      id="copiaCorreos"
      v-model="formData.comentarioSolicitudDeAutorizacion"
      :auto-resize="true"
      class="p-fluid col-12"
      cols="100"
      label="Comentario solicitud de autorización"
      rows="6"
    />
  </div>
  <div class="ml-2 mb-2">
    <h3>Resolución: </h3>
  </div>
  <div class="grid col-12">
    <AppSelectButton
      id="resolucion"
      v-model="formData.resolucion"
      class="col-4 p-fluid"
      option-label="descripcion"
      option-value="id"
      :options="[
        { descripcion: 'Autorizar', id: true },
        { descripcion: 'Rechazar', id: false }
      ]"
    />
  </div>
  <div class="col-12">
    <h3>
      Cargar Grabación:
    </h3>
    <Button
      class="col-4 p-button-outlined mr-4 my-3"
      icon="pi pi-paperclip"
      icon-pos="right"
      label="Seleccionar Archivo"
      @click="handleSeleccionarArchivo"
    />
  </div>
  <div class="col-12 flex justify-content-end mt-3">
    <Button
      class="mr-4 p-button-outlined bg-white"
      icon="pi pi-times"
      icon-pos="right"
      label="Cancelar"
      @click="cerrarDialog"
    />
    <Button
      icon="pi pi-send"
      icon-pos="right"
      label="Registrar Comunicación"
      @click="registrarComunicacion"
    />
  </div>
</div>
</template>

<script setup>
import { defineExpose, inject, reactive } from 'vue'
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useSessionStore } from '@/modules/session/composables'
import { requestUtil } from '@/utils'

import { useStepRegistroContactoStore } from '@/modules/flagrancia/composables'
import { useMantenedorStore, useDocumentoStore, usePamStore } from '@/modules/global/composables'
import ModalAgregarDocumento from '@/modules/flagrancia/components/diligencias-e-instrucciones/modales/ModalAgregarDocumento.vue'

const { procesoPam } = usePamStore()
const { documento_addDocumento } = useDocumentoStore()

const { toastSuccess } = useAppToast()
const { launchDialog } = useAppDialog()
const { user } = useSessionStore()
const { folio } = useStepRegistroContactoStore()
const { juzgados, mantenedor_getjuzgados } = useMantenedorStore()

const dialogRef = inject('dialogRef')
reactive({
  ...dialogRef.value?.data
})

const formData = reactive(initialData())
function initialData () {
  return {
    juzgado: '',
    nombreJuez: '',
    otroJuez: '',
    copiaCorreos: '',
    comentarioSolicitudDeAutorizacion: '',
    resolucion: null
  }
}

function handleSeleccionarArchivo () {
  launchDialog({
    component: ModalAgregarDocumento,
    header: 'Agregar documento o archivo',
    width: '70%',
    confirmLabel: 'Guardar Documento',
    confirmIcon: 'pi pi-save',
    accept: (data) => {
      guardarDocumento(data)
    }
  })
}

function guardarDocumento (data) {
  data.idDenuncia = procesoPam.value.idDenuncia
  data.version = ''
  requestUtil({
    action: documento_addDocumento,
    payload: data,
    resolve: () => {
      toastSuccess('Documento Adjuntado')
    }
  })
}
function registrarComunicacion () {
  console.log('registrar comunicación :>> ')
  cerrarDialog()
  /* requestUtil({
    action: ,
    payload: ,
    resolve: () => {
      toastSuccess('Comunicación registrada con éxito')
    }
  }) */
}

function cerrarDialog () {
  dialogRef.value.close()
}

defineExpose({ formData })

</script>
