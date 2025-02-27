<template>
<hr class="mb-4">
<section class="px-3 pt-3">
  <div class="grid">
    <div class="col-12 mb-4">
      <h1 class="text-xl flex flex-wrap align-items-center">
        <i class="pi pi-exclamation-triangle ml-1 mr-2 text-2xl" /> Se Concluirá
        Asignación de Causa
      </h1>
    </div>

    <div class="px-3 col-12 grid">
      <div class="col-6 flex flex-column">
        <p class="mb-2">
          <strong>RUC: </strong>{{ ruc }}
        </p>
        <p><strong>Número de intervinientes: </strong>{{ nroIntervinientes }}</p>
      </div>
      <div class="col-6 flex flex-column">
        <p class="mb-2">
          <strong>Motivo de Transferencia: </strong>{{ descripcionMotivoTransferencia(motivoTransferencia) }}
        </p>
        <p><strong>Fiscalía de Destino: </strong>{{ fiscaliaDestino }}</p>
      </div>
    </div>

    <div class="col-12 mt-3">
      <AppFieldset legend="Notificación de Transferencia">
        <section class="col-12 p-fluid">
          <AppDropdown
            id="plantilla"
            v-model="formData.idPlantilla"
            class="col-4"
            label="Plantilla"
            option-label="descripcion"
            option-value="id"
            :options="plantillaOptions"
            @change="getPlantillaInstruccion"
          />
          <Editor
            id="editr-solicitud-transferencia"
            v-model="formData.solicitudTransferencia"
            class="col-12"
            editor-style="height: 256px"
          />
        </section>
      </AppFieldset>
    </div>
  </div>
  <footer class="flex flex-row-reverse">
    <Button
      class="w-4 ml-2"
      icon="pi pi-send"
      icon-pos="right"
      label="Confirmar Transferencia"
      @click="confirmarTransferencia"
    />
  </footer>
</section>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'

const dialogRef = inject('dialogRef')

const {
  ruc,
  fiscaliaDestino,
  nroIntervinientes,
  motivoTransferencia
} = dialogRef.value?.data

const { mantenedor_getNombreMotivoTransferenciaById } = useMantenedorStore()

function descripcionMotivoTransferencia (value) {
  return mantenedor_getNombreMotivoTransferenciaById(value)
}

function confirmarTransferencia () {
  dialogRef.value.close(formData)
}

const formData = reactive({
  solicitudTransferencia: '',
  idPlantilla: null
})

function getPlantillaInstruccion () {
  const texto = `<p>Orden de Transferencia</p>
  <p>RUC N°: ${ruc}</p>
  <p><br></p>
  <p>Sr. [COMPLETE NOMBRE]</p>
  <p>Subprefecto de Investigaciones</p>
  <p><br></p>
  <p>Presente</p>
  <p>Conforme a lo dispuesto en el artículo 79 del Código Procesal Penal, se ordena la transferencia de la causa RUC N°: ${ruc}. 
  Solicito a usted practicar aquellas diligencias de investigación necesarias para proceder con la transferencia de la causa antes mencionada.</p>`
  formData.solicitudTransferencia = texto
}

const plantillaOptions = ref([{ id: 1, descripcion: 'Plantilla Instrucción General' }])
</script>
