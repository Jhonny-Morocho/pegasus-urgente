<template>
<AppForm
  class="col-12"
  :form-submitted="formSubmitted"
  validation-scope="formFoo"
>
  <div class="grid formgrid ml-2">
    <div class="col-4">
      <AppInput
        id="codigoBarras"
        v-model="formData.codigoBarras"
        label="Código de Barras Interno"
        :rules="{ required }"
      />
    </div>

    <div
      v-if="!props.esBodegaTemporal"
      class="col-4"
    >
      <AppDropdown
        id="idEdificio"
        v-model="formData.idEdificio"
        label="Edificio"
        option-label="nombre"
        option-value="id"
        :options="ubicacionEdificios"
        :rules="{ required }"
        show-clear
        @change="getBodegaByEdificio"
      />
    </div>
    <div
      v-if="!props.esBodegaTemporal"
      class="col-4"
    >
      <AppDropdown
        id="idBodega"
        v-model="formData.idBodega"
        :disabled="hayEdificio"
        label="Bodega"
        option-label="nombre"
        option-value="id"
        :options="ubicacionBodegas"
        :rules="{ required }"
        show-clear
        @change="getPasillobyBodega"
      />
    </div>
    <div
      v-if="!props.esBodegaTemporal"
      class="col-4"
    >
      <AppDropdown
        id="idPasillo"
        v-model="formData.idPasillo"
        :disabled="hayBodega"
        label="Pasillo"
        option-label="nombre"
        option-value="id"
        :options="ubicacionPasillos"
        :rules="{ required }"
        show-clear
        @change="getEstanteByPasillo"
      />
    </div>
    <div
      v-if="!props.esBodegaTemporal"
      class="col-4"
    >
      <AppDropdown
        id="idEstante"
        v-model="formData.idEstante"
        :disabled="hayPasillo"
        label="Estante"
        option-label="nombre"
        option-value="id"
        :options="ubicacionEstantes"
        show-clear
        @change="getCasilleroByEstante"
      />
    </div>
    <div
      v-if="!props.esBodegaTemporal"
      class="col-4"
    >
      <AppDropdown
        id="idCasillero"
        v-model="formData.idCasillero"
        :disabled="hayEstante"
        label="Casillero"
        option-label="nombre"
        option-value="id"
        :options="ubicacionCasilleros"
        show-clear
      />
    </div>
  </div>
  <div class="col-12 md:col-12">
    <div class="pb-6">
      <AppTextarea
        id="comentario"
        v-model="formData.observaciones"
        class="col-12"
        cols="150"
        label="Observaciones"
        rows="5"
      />
    </div>
  </div>
</AppForm>
</template>
<script setup>
// COMPONENTS

// UTILS
import { reactive, ref, defineExpose, defineProps } from 'vue'

// COMPONSABLES
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useMantenedorCDD } from '../../composables'
import { useFormValidation } from '@/modules/common/composables'
const {
  ubicacionEdificios,
  ubicacionBodegas,
  ubicacionEstantes,
  ubicacionCasilleros,
  ubicacionPasillos,
  mantenedorCDD_getUbicacionBodegas,
  mantenedorCDD_getUbicacionPasillos
} = useMantenedorCDD()

// VALUES
const hayBodega = ref(true)
const hayEstante = ref(true)
const hayPasillo = ref(true)
const hayEdificio = ref(true)

const props = defineProps({
  esBodegaTemporal: propTypes.boolean
})

const formData = reactive({
  codigoBarras: '',
  idEdificio: '',
  idBodega: '',
  idPasillo: '',
  idEstante: '',
  idCasillero: '',
  observaciones: ''
})
const { isFormValid, formSubmitted, required } = useFormValidation({ formData, validationScope: 'formFoo' })

// LOGIC
function getBodegaByEdificio () {
  console.log(formData)
  requestUtil({
    action: mantenedorCDD_getUbicacionBodegas,
    payload: { idEdificio: formData.idEdificio },
    resolve: () => {
      hayEdificio.value = false
    }
  })
}

function getPasillobyBodega () {
  console.log(formData.idBodega)
  requestUtil({
    action: mantenedorCDD_getUbicacionPasillos,
    payload: { idBodega: formData.idBodega },
    resolve: () => {
      hayBodega.value = false
    }
  })
}

function getEstanteByPasillo () {
  hayPasillo.value = false
}
function getCasilleroByEstante () {
  hayEstante.value = false
}

defineExpose({ formData, isFormValid })
</script>
