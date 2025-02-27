<template>
<hr class="mb-4 mt-0">
<section class="px-3 pt-3 pb-0 mb-2">
  <ul class="grid list-none pl-3 mb-4">
    <li class="col-12 md:col-6">
      <strong>RUC:</strong> {{ ruc }}
    </li>
    <li class="col-12 md:col-6">
      <strong>Tipo Sujeto:</strong> {{ mantenedor_getNombreTipoSujeto(sujeto?.tipoSujeto) }}
    </li>
    <li class="col-12 md:col-6">
      <strong>Fiscal Asignado:</strong> {{ resumenCausa?.nombreFiscalAsignado }}
    </li>
    <li class="col-12 md:col-6">
      <strong>N° Documento:</strong> {{ sujeto?.numeroDocumento }}
    </li>
  </ul>

  <AppFieldset
    class="p-3"
    legend="Medidas de Protección Aplicadas"
  >
    <TablaMedidasProteccionAplicadas
      v-model:first="medidaFirstRecord"
      :loading="isLoadingMedidasProteccion"
      :rows="medidasProteccionPersona?.paginacion?.tamanoPagina"
      :total-records="medidasProteccionPersona?.paginacion?.elementosTotales"
      :value="medidasProteccionPersona.data"
      @eliminar-medida="eliminarMedidaProteccion"
      @page="getMedidasProteccionPersona"
    />
  </AppFieldset>

  <AppFieldset
    class="px-3 pt-3 pb-0"
    legend="Agregar Medidas de Protección"
  >
    <TablaMedidasProteccionAplicadas
      class="mb-4"
      :loading="isLoadingMedidasProteccionLocal"
      :total-records="medidasProteccionLocal.length"
      :value="medidasProteccionLocal"
      :with-actions="true"
      @eliminar-medida="eliminarMedidaProteccion"
    />
    <AppForm
      id="aplicar-medida"
      class="grid w-full mx-auto"
      :form-submitted="formSubmitted"
      validation-scope="aplicar-medida"
    >
      <AppDropdown
        id="medida-proteccion"
        v-model="formData.medidaProteccion"
        class="col-12 md:col-4"
        label="Medida de Protección a Aplicar"
        option-label="descripcion"
        option-value="id"
        :options="medidasProteccion"
        :retrieve-data-action="mantenedor_getMedidasProteccion"
        :rules="{ required }"
      />
      <AppCalendar
        id="fecha-vigencia-desde"
        v-model="formData.vigenciaDesde"
        class="col-12 md:col-4"
        label="Fecha Vigencia Desde"
        :rules="{ required }"
      />
      <AppCalendar
        id="fecha-vigencia-hasta"
        v-model="formData.vigenciaHasta"
        class="col-12 md:col-4"
        label="Fecha Vigencia Hasta"
        :max-date="getCurrentDatePlus(100)"
      />
      <AppTextarea
        id="anotaciones"
        v-model="formData.anotaciones"
        class="col-12 mb-0"
        cols="45"
        label="Anotaciones"
        rows="6"
      />
      <div class="col-12 md:col-4 md:col-offset-8">
        <Button
          class="btn-form m-0"
          icon="pi pi-save"
          icon-pos="right"
          label="Agregar Medida de Protección"
          :loading="isLoadingBtnAgregarMedida"
          @click="handleAgregarMedidaProteccion"
        />
      </div>
    </AppForm>
  </AppFieldset>

  <div class="flex flex-row-reverse">
    <Button
      class="p-button-primary ml-2"
      disabled
      icon="pi pi-send"
      icon-pos="right"
      label="Enviar a Atención de Usuarios"
      @click="enviarAtencionUsuarios"
    />
    <Button
      class="p-button-text"
      label="Cerrar"
      @click="dialog.close()"
    />
  </div>
</section>
</template>

<script setup>
import { inject, reactive, onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import TablaMedidasProteccionAplicadas from '../TablaMedidasProteccionAplicadas.vue'

const {
  medidasProteccion,
  mantenedor_getNombreTipoSujeto,
  mantenedor_getMedidasProteccion
} = useMantenedorStore()

const {
  medidasProteccionPersona,
  sujetosIntervinientes_deleteMediaProteccionById,
  sujetosIntervinientes_postAgregarMedidaProteccion,
  sujetosIntervinientes_getMedidasProteccionPersonaById
} = useSujetosIntervinientesStore()

const dialog = inject('dialogRef')

const { ruc, sujeto, resumenCausa } = dialog.value?.data

const formData = reactive({
  medidaProteccion: null,
  vigenciaDesde: null,
  vigenciaHasta: null,
  anotaciones: ''
})

const { formSubmitted, required, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: 'aplicar-medida'
})

async function handleAgregarMedidaProteccion () {
  if (!isFormValid()) {
    return
  }
  postAgregarMedidaProteccion(formData, sujeto)
}

function enviarAtencionUsuarios () {
  dialog.value.close()
}

function getCurrentDatePlus (years) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  currentDate.setFullYear(currentYear + years)
  return currentDate
}

const medidasProteccionLocal = ref([])
const isLoadingMedidasProteccionLocal = ref(false)

const isLoadingMedidasProteccion = ref(false)
const medidaFirstRecord = ref(0)
const isLoadingBtnAgregarMedida = ref(false)

async function getMedidasProteccionPersona (pagination = undefined) {
  if (!pagination) {
    medidaFirstRecord.value = 0
  }

  await requestUtil({
    action: sujetosIntervinientes_getMedidasProteccionPersonaById,
    payload: {
      idPersona: sujeto?.idPersona,
      params: {
        page: pagination?.page,
        size: pagination?.rows
      }
    },
    loader: (l) => { isLoadingMedidasProteccion.value = l }
  })
}

async function postAgregarMedidaProteccion (_medida, _sujeto) {
  const parsedPayload = {
    id: null,
    idRelacionSujeto: _sujeto.idRelacionSujeto,
    idPersona: _sujeto.idPersona,
    idTipoMedida: _medida.medidaProteccion,
    tipoMedida: null,
    anotaciones: _medida.anotaciones,
    fechaInicio: _medida.vigenciaDesde,
    fechaFin: _medida.vigenciaHasta
  }
  console.log(parsedPayload)

  await requestUtil({
    action: sujetosIntervinientes_postAgregarMedidaProteccion,
    payload: { ...parsedPayload },
    loader: (l) => {
      isLoadingBtnAgregarMedida.value = l
      isLoadingMedidasProteccionLocal.value = l
    },
    resolve: (_res) => {
      medidasProteccionLocal.value.push(_res)
      resetFormData()
    }
  })
}

async function eliminarMedidaProteccion (medida) {
  await requestUtil({
    action: sujetosIntervinientes_deleteMediaProteccionById,
    payload: {
      idMedida: medida?.id
    },
    resolve: () => {
      medidasProteccionLocal.value = medidasProteccionLocal.value.filter((el) => el.id !== medida?.id)
    },
    loader: (l) => { isLoadingMedidasProteccionLocal.value = l }
  })
}

onMounted(() => {
  getMedidasProteccionPersona()
})
</script>
