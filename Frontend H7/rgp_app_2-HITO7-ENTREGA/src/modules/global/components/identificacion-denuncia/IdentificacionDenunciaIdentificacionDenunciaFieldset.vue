<template>
<div
  v-if="loading"
  class="col-12"
>
  <LoaderSkeleton />
</div>
<div
  v-else
  class="p-fluid"
>
  <!-- OFICIO -->
  <AppFieldset
    v-if="tipoFieldsetIdentificacion === 'oficio'"
    legend="Identificación de la Denuncia"
  >
    <AppInput
      id="id-unico-denuncia"
      v-model="formData.identificadorUnicoDenuncia"
      class="col-12 md:col-4 lg:col-3"
      disabled
      label="Identificador Único de Denuncia"
    />
    <AppInput
      id="medio-recepcion"
      v-model="formData.medioDeRecepcion"
      class="col-12 md:col-4 lg:col-3"
      disabled
      label="Medio de Recepción"
    />
    <AppDropdown
      id="tipo-denuncia"
      v-model="formData.idTipoDenuncia"
      class="col-12 md:col-4 lg:col-3"
      disabled
      label="Tipo de Denuncia"
      option-label="descripcion"
      option-value="id"
      :options="tiposDenuncia"

      show-clear
    />
    <AppCalendar
      id="fecha-denuncia"
      v-model="formData.fechaDeDenuncia"
      class="col-12 md:col-4 lg:col-3"
      disabled
      label="Fecha / Hora Denuncia"
      show-time
    />
    <AppInput
      v-if="formData.tipoDenuncia !== 1"
      id="numero-parte-denuncia"
      v-model="formData.numeroOficio"
      class="col-12 md:col-4 lg:col-3"
      label="N° de Oficio"
    />

    <AppDropdown
      id="forma-envio"
      v-model="formData.formaEnvio"
      class="col-12 md:col-4 lg:col-3 mt-auto md:mb-2 lg:mb-4"
      label="Forma de Envío"
      option-label="descripcion"
      option-value="idFormaEnvio"
      :options="[
        { descripcion: 'MANUAL', idFormaEnvio: '1' },
        { descripcion: 'Digital', idFormaEnvio: '2' }
      ]"
      show-clear
    />
    <div class="col-12 md:col-8 lg:col-12 grid">
      <div class="col-12 md:col-6 lg:col-3 mt-auto">
        <p class="mb-1 ml-2">
          ¿Fiscal Denunciante?(
          <span
            class="text-color"
          >
            *
          </span>)
        </p>
        <AppSelectButton
          id="es-fiscal-denunciante"
          v-model="formData.esFiscalDenunciante"
          class="w-full mb-0"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
          :rules="{
            required
          }"
        />
      </div>
      <div class="col-12 md:col-6 lg:col-3 mt-auto">
        <p class="mb-1 ml-2">
          ¿Denuncia Reservada?(
          <span
            class="text-color"
          >
            *
          </span>)
        </p>
        <AppSelectButton
          id="es-denuncia-reservada"
          v-model="formData.esReservada"
          class="w-full mb-0"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
          :rules="{
            required
          }"
          :validation-scope="validationScope"
        />
      </div>
    </div>
  </AppFieldset>

  <!-- DIRECTA -->
  <AppFieldset
    v-else
    class="grid col-4 mt-2 ml-3"
    legend="Identificación de la Denuncia"
  >
    <div class="col-12 ml-2">
      <div class="felx flex-column px-1">
        <p class="mb-1">
          <strong>Identificador Único de Denuncia: </strong>{{ formData.identificadorUnicoDenuncia }}
        </p>
        <p class="my-4">
          <strong>Medio de Recepción: </strong>{{ formData.medioDeRecepcion }}
        </p>
        <p class="mt-4">
          <strong>Fecha / Hora Denuncia: </strong>{{ dateTimeUtil.formatToFrontendWithTime(identificacionDenuncia?.fechaIngreso) }}
        </p>
        <p class="mt-4">
          <strong>Tipo de Denuncia: </strong>{{ mantenedor_getTipoDenunciaNombreById(formData.idTipoDenuncia) }}
        </p>
      </div>
    </div>
  </AppFieldset>
</div>
</template>
<script setup>
import { defineExpose, reactive, defineProps } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'
import { useMantenedorStore } from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

import { useFormValidation } from '@/modules/common/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import { dateTimeUtil } from '@/utils'
const { required } = useFormValidation()
const { tiposDenuncia } = useMantenedorStore()
const { identificacionDenuncia } = useIdentificacionDenunciaStore()

const formData = reactive({
  identificadorUnicoDenuncia: '',
  medioDeRecepcion: '',
  idTipoDenuncia: '',
  fechaDeDenuncia: new Date(),
  usuarioRecepcionaDenuncia: '',
  numeroOficio: '',
  formaEnvio: '',
  esFiscalDenunciante: null,
  esReservada: null
})

const { mantenedor_getTipoDenunciaNombreById } = useMantenedorStore()

defineProps({
  validationScope: propTypes.string,
  tipoFieldsetIdentificacion: propTypes.string,
  loading: propTypes.boolean
})

function populateData (data) {
  Object.assign(formData, data)
}

defineExpose({ formData, populateData })
</script>
<style scoped>
.text-color{
  color: var(--red-700);
}
</style>
