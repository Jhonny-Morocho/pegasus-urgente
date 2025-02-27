<template>
<LoaderSkeleton
  v-if="showLoader"
  height="1000px"
/>
<section
  v-else
  class="mt-6"
>
  <div>
    <AppFieldset legend="Tipo de Firma">
      <AppDropdown
        id="tipoFirma"
        v-model="tipoFirma"
        class="col-4 p-fluid"
        label="Seleccione tipo de firma"
        option-label="value"
        option-value="id"
        :options="[
          { id: 2, value: 'Firma Manual' }
        ]"
      />
    </AppFieldset>

    <AppFieldset
      v-show="formData.tipoFirma === 1"
      legend="Firma Biométrica"
    >
      <div class="grid col-12">
        <div class="col-6">
          <h4>Firma Receptor Documento</h4>
          <img
            alt="huella"
            class="huella huella-lg"
            src="@/assets/images/huella.jpg"
          >
        </div>
        <div class="col-6">
          <p class="mb-4">
            <strong>Rut Receptor: </strong>12.234.566-8
          </p>
          <p class="mb-4">
            <strong>Nombre Receptor: </strong>Andrea Rojas Rojas
          </p>
        </div>
      </div>
    </AppFieldset>
    <AppFieldset
      v-show="tipoFirma === 2"
      legend="Firma Manual"
    >
      <div class="col-12 flex justify-content-center">
        <Button
          id="seleccionar-firma"
          class="p-button-outlined px-8"
          icon="pi pi-print"
          icon-pos="right"
          label="Imprimir"
        />
      </div>
    </AppFieldset>

    <AppFieldset
      v-show="tipoFirma != null"
      class="col-12 mt-4"
      legend="Comprobante de Devolución"
    >
      <div class="grid mt-3 col-12 mb-2 lg:mb-0">
        <div class="col-6">
          <p class="mb-4">
            <strong>RUT de quien entrega: </strong>{{ dataUsuario?.rut || 'N/A' }}
          </p>
          <p class="mb-4">
            <strong>Nombre de quien entrega: </strong>{{ dataUsuario?.nombre || 'N/A' }}
          </p>
          <p class="mb-4">
            <strong>Fecha entrega documento:: </strong>{{ formatDate(new Date()) }}
          </p>
        </div>
        <div class="col-6">
          <p class="mb-4">
            <strong>RUT de quien recibe: </strong>{{ intervineintesRegistroDevolucion.rutReceptor }}
          </p>
          <p class="mb-4">
            <strong>Nombre de quien recibe: </strong>{{ intervineintesRegistroDevolucion.nombreReceptor }}
          </p>
          <p class="mb-4">
            <strong>Nombre del documento: </strong>{{ documentoAgendamiento.nombre }}
          </p>

          <div v-show="tipoFirma === 1">
            <p class="mb-4">
              <strong>Firma: </strong>
            </p>
            <img
              alt="huella"
              class="huella huella-sm"
              src="@/assets/images/huella.jpg"
            >
          </div>
        </div>
        <div class="w-full flex justify-content-end">
          <div v-show="tipoFirma === 1">
            <Button
              class="p-button-outlined px-8 mr-4"
              icon="pi pi-print"
              icon-pos="right"
              label="Imprimir"
            />
            <Button
              class="btn-primary px-8"
              icon="pi pi-send"
              icon-pos="right"
              label="Enviar Comprobante por correo"
            />
          </div>
          <div v-show="tipoFirma === 2">
            <FileUpload
              id="seleccionar-firma"
              v-model="formData.documentoFirmado"
              accept="image/*,application/pdf"
              button-outlined
              choose-label="Subir Comprobante Firmado"
              icon="pi pi-plus"
              icon-pos="left"
              :max-file-size="16000000"
              mode="basic"
              name="demo[]"
              px-3
              :value="true"
              @select="onSelect"
            />
          </div>
        </div>
      </div>
    </AppFieldset>
  </div>

  <AppBtnNextTeleported
    class="btn-primary"
    :disabled="!seSubioComprobante "
    icon="pi pi-arrow-right"
    label="Continuar"
    @click="enviarRegsitroDevolucion"
  />
</section>
</template>
<script setup>
// COMPONETNS
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

// UTILS
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

// COMPOSABLES
import { requestUtil, dateTimeUtil } from '@/utils'
import { useAppToast, useConfirmDialog } from '@/modules/common/composables'
import { useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'
const router = useRouter()
const { toastSuccess, toastError } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { taskId, documentoAgendamiento, intervineintesRegistroDevolucion, solicitudesEncargadoBodega_generarRegistroDevolucion } = useSolicitudesEncargadoBodega()

// VALUES
const tipoFirma = ref(null)
const showLoader = ref(false)
const seSubioComprobante = ref(null)
const formData = reactive({
  documentoFirmado: null
})

// LOGIC
function enviarRegsitroDevolucion () {
  showLoader.value = true
  launchConfirmDialog({
    header: 'Registrar Devolución',
    message: '¿Está seguro de querer Registrar Devolución?',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Cancelar',
    width: '35%',
    accept: () => {
      registrarDevolucion()
    },
    reject: () => {
      showLoader.value = false
    },
    onHide: () => {
      showLoader.value = false
    }
  })
}

function registrarDevolucion () {
  requestUtil({
    action: solicitudesEncargadoBodega_generarRegistroDevolucion,
    payload: {
      taskId: taskId.value,
      nombreRecibe: intervineintesRegistroDevolucion.value.nombreReceptor,
      rutRecibe: intervineintesRegistroDevolucion.value.rutReceptor,
      correoRecibe: intervineintesRegistroDevolucion.value.correoReceptor,
      tipoFirma: documentoAgendamiento.value.idArchivo,
      idArchivo: documentoAgendamiento.value.idArchivo
    },
    resolve: () => {
      showLoader.value = false
      toastSuccess('Registro de devolución generado correctamente')
      router.push({ name: 'CddBandejaEncargadoBodega' })
    },
    reject: () => {
      showLoader.value = false
      toastError('Error al generar registro de devolución')
    }
  })
}
function onSelect () {
  seSubioComprobante.value = true
  toastSuccess('Comprobante adjuntado correctamente')
}

function formatDate (date) {
  if (!date) {
    return ''
  }
  return dateTimeUtil.formatToFrontendWithTime(date)
}

</script>

<style scoped>
.huella {
  border: solid 1px #000;
  padding: 5px;
}
.huella-lg {
  width: 200px;
  height: 200px;
}
.huella-sm {
  width: 80px;
  height: 80px;
}

.firma-sm {
  width: 80px;
}
</style>
