<template>
<PageHeader
  v-if="esModeloVista2"
  class="mb-6"
  :items-menu-superior="itemsMenuSuperior"
  page-title="Registrar Datos de DICREP"
/>
<section class="mb-8">
  <AppFieldset legend="Solicitar Orden de Servicio de Traslado">
    <div class="grid col-12">
      <div class="col-6">
        <p><strong>Fiscalía Regional: </strong>{{ dataServicio?.fiscalia }}</p>
        <p><strong>Institución: </strong>{{ dataServicio?.institucion }}</p>
        <p><strong>Administrador: </strong>{{ dataServicio?.administrador }}</p>
      </div>
      <div class="col-6">
        <p><strong>Custodio: </strong>{{ dataServicio?.custodio }}</p>
        <p><strong>RUN Custodio: </strong>{{ dataServicio?.runCustodio }}</p>
        <p v-if="esModeloVista2">
          <strong>Fecha Entrega: </strong>{{ dataServicio?.fechaEntrega }}
        </p>
        <AppForm
          v-else
          :form-submitted="formSubmitted"
          validation-scope="fechaEntrega"
        >
          <AppCalendar
            id="entrega"
            v-model="formData.fechaEntega"
            class="col-6"
            label="Fecha Entrega"
            :min-date="new Date()"
            :rules="{ required }"
            show-time
          />
        </AppForm>
      </div>
    </div>
  </AppFieldset>

  <AppFieldset legend="Especies Involucradas Ley 20.000 - 19.913">
    <TablaGenerarCuponDeDeposito
      class="w-full mb-4"
      es-modelo2
      es-modelo4
      index
      :selectable="false"
    />
    <h4 class="col-12">
      Cantidad total de especies: {{ totalEspecies }}
    </h4>
    <Button
      v-if="!esModeloVista2"
      class="p-button-outlined px-4 mt-6"
      icon="pi pi-file"
      icon-pos="right"
      label="Vista Previa"
      @click="openVistaprevia"
    />
  </AppFieldset>

  <AppFieldset legend="Especies Involucradas Ley 469 - 470 CPP">
    <TablaGenerarCuponDeDeposito
      class="w-full mb-4"
      es-modelo2
      es-modelo4
      :selectable="false"
    />
    <h4 class="col-12">
      Cantidad total de especies: {{ totalEspecies }}
    </h4>
    <Button
      v-if="!esModeloVista2"
      class="p-button-outlined px-4 mt-6"
      icon="pi pi-file"
      icon-pos="right"
      label="Vista Previa"
      @click="openVistaprevia"
    />
  </AppFieldset>

  <div
    v-if="!esModeloVista2"
    class="col-12 flex justify-content-end"
  >
    <Button
      class="p-button-outlined px-4 mt-6"
      icon="pi pi-eternal-link"
      icon-pos="right"
      label="Firmar Comprobante"
      @click="handleFirmarComprobante"
    />
  </div>

  <div
    v-else
  >
    <AppTextarea
      id="observaciones"
      v-model="formData.observaciones"
      class="col-12"
      cols="150"
      label="Observaciones"
      rows="5"
      :rules="{ required }"
    />
    <div class="grid col-12">
      <SubirArchivo
        ref="subirImagen"
        class="col-4"
        :is-loading="isLoading"
        :relacion-front="seccion?.id"
        :select-label="'Subir Orden de Servicio Firmado'"
        :tipos-archivo="'image/*, Aplication/*'"
        @subir-archivo:adjuntar="adjuntarOrdenServicio"
      />
      <SubirArchivo
        ref="subirImagen"
        class="col-4"
        :is-loading="isLoading"
        :relacion-front="seccion?.id"
        :select-label="'Subir Orden de Entrega Firmado'"
        :tipos-archivo="'image/*, Aplication/*'"
        @subir-archivo:adjuntar="adjuntarOrdenEntrega1"
      />
      <SubirArchivo
        ref="subirImagen"
        class="col-4"
        :is-loading="isLoading"
        :relacion-front="seccion?.id"
        :select-label="'Subir Orden de Entrega Firmado'"
        :tipos-archivo="'image/*, Aplication/*'"
        @subir-archivo:adjuntar="adjuntarOrdenEntrega2"
      />
    </div>
  </div>

  <AppBtnsSteps
    v-if="esModeloVista2"
    @back-step="handleBackStep"
  />

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Registrar Salida"
      @click="handleNextStep"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import TablaGenerarCuponDeDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue'
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue'
import AppBtnsSteps from '@/modules/common/components/buttons/AppBtnsSteps.vue'
import SubirArchivo from '@/modules/global/components/documentos/SubirArchivo.vue'
import { useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useRoute, useRouter } from 'vue-router'
import { useItemsMenuSuperiorCadena } from '@/modules/recepcion-especies-dinero/composables'

const { itemsMenuSuperior } = useItemsMenuSuperiorCadena()
const { launchConfirmDialog } = useConfirmDialog()

const route = useRoute()
const router = useRouter()
const esModeloVista2 = ref(false)
const dataServicio = ref()
const formData = reactive({
  fechaEntrega: null,
  observaciones: ''
})

const { formSubmitted, required } = useFormValidation({ formData, validationScope: 'fechaEntrega' })

onMounted(() => {
  checkRoute()
})

function checkRoute () {
  if (route.path.includes('registro-datos-dicrep')) {
    esModeloVista2.value = true
  }
}

function handleNextStep () {
  /* No hace nada...definir
  if (route.path.includes('registro-datos-dicrep')) {
    // setear variables vista Registro tarea bandeja
  } else {
    // setear variables vista Registro final steps
  } */

  launchConfirmDialog({
    header: 'Registrar Salida',
    message: '¿Está seguro de Registrar Salida?'
  })
}

function handleBackStep () {
  router.push({ name: 'BandejaCustodio' })
}
</script>

<style scoped>
p{
  margin: 20px 0 20px 0;
}
</style>
