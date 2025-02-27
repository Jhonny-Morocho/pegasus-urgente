<template>
<div>
  <AppForm
    v-if="isCollapsed"
    :id="validationScope"
    :form-readonly="formData.isReadOnly"
    :form-submitted="formSubmitted"
    :validation-scope="validationScope"
  >
    <div>
      <EspeciesDineroFieldset @familia-especie="familiaEspecie" />

      <!-- ESPECIE ANIMAL -->
      <EspecieAnimalFieldset v-if="familiaEspecieSeleccionada === '4'" />

      <!-- ESPECIE DOCUMENTO -->
      <EspecieDocumentoFieldset v-if="familiaEspecieSeleccionada === '22'" />

      <!-- ESPECIE VEHICULO -->
      <EspecieVehiculoFieldset v-if="familiaEspecieSeleccionada === '46'">
        <template #adjuntar-geolocalizacion>
          <SubirArchivoIncrustado
            ref="especiesDineroGeolocalizacion"
            choose-label="Seleccionar Archivo"
            :data-archivos="fotosVideosEyD"
            :relacion-front="seccion?.id"
            :tipo-relacion="
              'especiesDineroGeolocalizacion' + ` ${validationScope}`
            "
            :tipos-archivo="'image/*, application/*, video/mp4'"
            @subir-archivo:adjuntar="adjuntar"
            @subir-archivo:eliminar="eliminar"
          />
        </template>
      </EspecieVehiculoFieldset>

      <DineroFieldset v-if="familiaEspecieSeleccionada === '21'" />

      <EspeciesAbarrotes v-if="false" />

      <InformacionGeneralDeLaEspecie />

      <AppFieldset
        class="col-12"
        legend="Fotografías y/o Video"
      >
        <SubirArchivoIncrustado
          ref="especiesDineroObservacion"
          choose-label="Seleccionar Archivo o Video"
          :data-archivos="fotosVideosEyD"
          :is-loading="loadingDocs"
          :relacion-front="seccion?.id"
          :tipos-archivo="'image/*, application/*, video/mp4'"
          @subir-archivo:adjuntar="adjuntar"
          @subir-archivo:eliminar="eliminar"
        />
      </AppFieldset>
      <RelacionSujetoEspecie :read-only="formData.isReadOnly" />

      <div class="col-12 pb-5">
        <div
          v-if="formData.isReadOnly"
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
          <Button
            v-if="!isEditando"
            class="btn-form px-6"
            icon="pi pi-plus-circle"
            icon-pos="right"
            label="Agregar Especie"
            :loading="loadingButton"
            style="width: auto"
            @click="handleAgregarEspecie"
          />
          <div
            v-else
            class="flex"
          >
            <div class="mr-4">
              <Button
                class="p-button-warning p-button-outlined"
                icon="pi pi-times"
                icon-pos="left"
                label="Cancelar"
                style="width: auto"
                @click="emit('cancelar-edicion', familiaEspecieSeleccionada)"
              />
            </div>
            <div>
              <Button
                class="p-button-warning"
                icon="pi pi-pencil"
                icon-pos="left"
                label="Modificar Especie"
                :loading="loadingButton"
                style="width: auto"
                @click="emit('agregar-especie', formData)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppForm>
</div>
</template>

<script setup>
// composables
import { defineProps, defineEmits, ref, defineExpose } from 'vue'
// components
import EspeciesDineroFieldset from '@/modules/global/components/especies-dinero/EspeciesDineroFieldset.vue'
import EspeciesAbarrotes from '@/modules/global/components/especies-dinero/EspeciesAbarrotes.vue'
import DineroFieldset from '@/modules/global/components/especies-dinero/DineroFieldset.vue'
import InformacionGeneralDeLaEspecie from '@/modules/global/components/especies-dinero/InformacionGeneralDeLaEspecie.vue'
import RelacionSujetoEspecie from '@/modules/global/components/especies-dinero/RelacionSujetoEspecie.vue'
import EspecieAnimalFieldset from '@/modules/global/components/especies-dinero/EspecieAnimalFieldset.vue'
import EspecieDocumentoFieldset from '@/modules/global/components/especies-dinero/EspecieDocumentoFieldset.vue'
import EspecieVehiculoFieldset from '@/modules/global/components/especies-dinero/EspecieVehiculoFieldset.vue'
import {
  useDocumentoStore,
  useEspeciesDineroStore
} from '@/modules/global/composables'
import { useEspeciesDineroInject } from '../../composables/useEspeciesDinero'
import { generateEspeciesContract } from '@/modules/global/contracts'
import { propTypes } from '@/modules/common/types'
const familiaEspecieSeleccionada = ref(null)

const especiesDineroObservacion = ref()
const especiesDineroGeolocalizacion = ref()
const { dineros } = useEspeciesDineroStore()

const { fotosVideosEyD } = useDocumentoStore()

function familiaEspecie (data) {
  familiaEspecieSeleccionada.value = data
}

const { especiesDineroInject: formData } = useEspeciesDineroInject()

function handleAgregarEspecie () {
  const payload = generateEspeciesContract({
    ...formData,
    dineros: dineros.value
  })
  // Se Agregan datos para que pase validacion de backend luego del cambio de vista con el nuevo figma
  payload.existeAnimalInvolucrado = false
  payload.cantidadEspecie = formData.cantidadEspecie ?? 0
  if (familiaEspecieSeleccionada.value === '4') {
    // Familia Animal
    payload.existeAnimalInvolucrado = true
  } else if (familiaEspecieSeleccionada.value === '22') {
    // Familia Documento
    payload.esDocumentoValor = true
  } else if (familiaEspecieSeleccionada.value === '46') {
    // Familia Vehiculo
    payload.esVehiculo = true
  } else if (familiaEspecieSeleccionada.value === '21') {
    // Familia Dinero
    payload.esDinero = true
  }
  emit('agregar-especie', payload)
}

defineProps({
  validationScope: {
    type: String,
    default: 'formulario-especies'
  },
  formSubmitted: {
    type: Boolean,
    default: false
  },
  loadingButton: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  isEditando: {
    type: Boolean,
    default: false
  },
  seccion: propTypes.object,
  loadingDocs: Boolean,
})

function adjuntar (documento) {
  emit('adjuntar-documento', documento)
}

function eliminar (documento) {
  emit('eliminar-documento', documento)
}

const emit = defineEmits([
  'reset-form-data',
  'cancelar-edicion',
  'agregar-especie',
  'adjuntar-documento',
  'eliminar-documento'
])

function reset () {
  especiesDineroObservacion.value.resetFormData()
  especiesDineroGeolocalizacion.value.resetFormData()
}

defineExpose({ reset })
</script>
