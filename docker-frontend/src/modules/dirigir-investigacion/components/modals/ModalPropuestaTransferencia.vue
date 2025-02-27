<template>
<hr>
<section p-4>
  <AppFieldset
    class="mt-4"
    collapsed
    legend="Relaciones"
    toggleable
  >
    <TablaRelaciones
      v-model:first="relacionesTable.firstRecord"
      class="col-12"
      :loading="relacionesTable.isLoading"
      read-only
      :rows="paginacionRelaciones?.tamanoPagina"
      :total-records="paginacionRelaciones?.elementosTotales"
      :value="relaciones"
      @page="getRelaciones"
    />
  </AppFieldset>

  <AppFieldset
    legend="Antecedentes de la Transferencia"
    toggleable
  >
    <main class="w-full formgrid grid px-4 py-0 mt-2 mx-0">
      <ul class="col-12 md:col-6 list-none flex flex-column gap-3">
        <li><strong>Fiscalía Origen: </strong>{{ resumenCausa?.nombreFiscaliaLocal }}</li>
        <li><strong>Fiscalía Destino: </strong>{{ mantenedor_getNombreFiscaliaById(infoCausa?.fiscaliaCompetente) }}</li>
        <li><strong>Motivo de Transferencia: </strong>{{ mantenedor_getNombreMotivoTransferenciaById(infoCausa?.motivoTransferencia) }}</li>
      </ul>
      <ul class="col-12 md:col-6 list-none flex flex-column gap-3">
        <li>
          <strong>Comentario: </strong>
          <p>{{ infoCausa?.comentario }}</p>
        </li>
      </ul>
    </main>
  </AppFieldset>

  <AppFieldset
    class="w-full"
    legend="Notificación de Transferencia"
    :toggleable="true"
  >
    <AppForm
      id="form-notificacion-transferencia"
      class="w-full"
      :form-submitted="formSubmitted"
      validation-scope="form-notificacion-transferencia"
    >
      <main class="w-full px-4 py-0 mt-2 mx-0">
        <AppDropdown
          id="plantilla"
          v-model="formData.idPlantilla"
          class="col-4 p-fluid"
          label="Plantilla"
          option-label="descripcion"
          option-value="id"
          :options="plantillasDiligencia"
          :retrieve-data-action="mantenedor_getPlantillasDiligencia"
          show-clear
          @change="setPlantilla"
        />
        <AppEditor
          id="editor-instrucciones-especificas"
          v-model="formData.textoEscrito"
          class="col-12 w-full"
          :rules="{ required }"
        />
      </main>
    </AppForm>
  </AppFieldset>
</section>
<section class="w-full flex flex-row-reverse px-4 gap-3">
  <Button
    class="btn-primary px-4"
    icon="pi pi-send"
    icon-pos="right"
    label="Enviar Propuesta de Trasferencia"
    @click="handleEnviarPropuesta"
  />
  <Button
    class="p-button-text px-4"
    icon="pi pi-times"
    icon-pos="right"
    label="Cancelar"
    @click="handleCancelar"
  />
</section>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'
import { useDirigirInvestigacionStore } from '../../composables'
import { requestUtil } from '@/utils'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import TablaRelaciones from '@/modules/dirigir-investigacion/components/TablaRelaciones.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'

const dialogRef = inject('dialogRef')

const { toastError, TOAST_MESSAGES } = useAppToast()

const {
  idDenuncia,
  resumenCausa
} = useDirigirInvestigacionStore()

const {
  relaciones,
  relaciones_getRelaciones,
  paginacion: paginacionRelaciones
} = useRelacionesStore()

const {
  // eslint-disable-next-line no-unused-vars
  fiscalias,
  plantillasDiligencia,
  mantenedor_getNombreFiscaliaById,
  mantenedor_getNombreMotivoTransferenciaById,
  mantenedor_getPlantillasDiligencia
} = useMantenedorStore()

const infoCausa = reactive({
  ...dialogRef.value?.data?.infoCausa
})

const formData = reactive({
  idPlantilla: null,
  textoEscrito: ''
})

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-notificacion-transferencia'
})

function handleCancelar () {
  dialogRef.value.close()
}

function handleEnviarPropuesta () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  dialogRef.value.close(formData)
}

const relacionesTable = reactive({
  firstRecord: 0,
  isLoading: false
})

async function getRelaciones (pagination = undefined) {
  if (!pagination) {
    relacionesTable.firstRecord = 0
  }

  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }

  requestUtil({
    action: relaciones_getRelaciones,
    payload: {
      idDenuncia: idDenuncia.value,
      params
    },
    loader: (l) => { relacionesTable.isLoading = l }
  })
}

function setPlantilla () {
  const plantillaElegida = plantillasDiligencia.value?.find((plantilla) => plantilla.id === formData.idPlantilla)

  formData.textoEscrito = plantillaElegida?.valor
}

onMounted(async () => {
  await getRelaciones()
})
</script>
