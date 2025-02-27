<template>
<AppFieldset legend="Rótulo de la NUE">
  <div class="p-fluid w-full">
    <Nue
      class="col-12 md:col-6 lg:col-4 mb-4"
      :label="'Ingrese NUE'"
      :loading="nueLoader"
      @buscar-nue="busquedaNue"
    />
  </div>
  <AppBtnNextTeleported
    button-next-disabled
    class="mr-2"
    icon="pi pi-arrow-right"
    icon-pos="right"
    label="Activar NUE"
    @click="activarNue(formData)"
  />
  <div
    v-if="formData.nueEncontrado"
    class="grid pl-3"
  >
    <div class="col-12">
      <p class="mb-2">
        <span class="font-bold">Institución: </span>
        Policía de Investigaciones
      </p>
    </div>
    <div class="col-12">
      <p class="mb-2">
        <span class="font-bold">Fecha/hora Levantamiento: </span>
        {{ formatDate(new Date()) }}
      </p>
    </div>
    <AppForm
      id="form-levantar-cadena"
      class="grid w-full"
      :form-submitted="formSubmitted"
      validation-scope="form-levantar-cadena"
    >
      <AppDropdown
        id="unidad-levantamiento"
        v-model="formData.unidad"
        class="col-12 md:col-6 lg:col-4 mb-0 mt-2"
        label="Unidad"
        option-label="name"
        option-value="name"
        :options="[
          { name: 'Robos y Focos Criminales', value: 1 },
          { name: 'Tipo 2', value: 2 },
        ]"
        :rules="{ required }"
        show-clear
      />
      <AppInput
        id="grado-cargo-levantamiento"
        v-model="formData.gradoCargo"
        class="col-12 md:col-6 lg:col-4 mb-0 mt-2"
        label="Grado/Cargo"
        :rules="{ required }"
      />
      <AppInput
        id="ruc-levantamiento"
        v-model="formData.rucLevantamiento"
        class="col-12 md:col-6 lg:col-4 mb-0 mt-2"
        label="RUC (xxx-x)"
      />
      <AppInputNumber
        id="folio-levantamiento"
        v-model="formData.folioLevantamiento"
        class="col-12 md:col-6 lg:col-4 mb-0 mt-2"
        label="Folio"
        :min="0"
      />
      <AppInput
        id="direccion-del-ss-levantamiento"
        v-model="formData.direccionDelSS"
        class="col-12 lg:col-8 mb-0 mt-2"
        label="Dirección del S.S."
        :rules="{ required }"
      />
    </AppForm>
  </div>
</AppFieldset>
</template>

<script setup>
import { defineExpose, reactive, defineEmits, ref } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import {
  useAppDialog,
  useAppToast,
  useFormValidation
} from '@/modules/common/composables'
import { useLevantamientoCadenaCustodio } from '../../composables/useLevantamientoCadenaCustodio'
import Nue from '@/modules/recepcion-especies-dinero/components/global/Nue.vue'
import ModalNueNoAsignadoOEnUso from './modals/ModalNueNoAsignadoOEnUso.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

const { launchDialog } = useAppDialog()
const {
  levantamientoCadena_getNue,
  levantamientoCadenaCustodio_SET_EVIDENCIA
} = useLevantamientoCadenaCustodio()

const formData = reactive({
  nue: null,
  unidad: '',
  gradoCargo: '',
  rucLevantamiento: '',
  folioLevantamiento: null,
  direccionDelSS: '',
  nueEncontrado: null,
  fechalevantamiento: '',
  institucion: '',
  idOrganismo: null
})

const { formSubmitted, required, isFormValid, resetFormData } = useFormValidation({
  formData,
  validationScope: 'form-levantar-cadena'
})

const nueLoader = ref(false)

function busquedaNue (nue) {
  nueLoader.value = true
  resetFormData()
  console.log('nue', nue)
  levantamientoCadenaCustodio_SET_EVIDENCIA()
  formData.nueEncontrado = false
  requestUtil({
    action: levantamientoCadena_getNue,
    payload: { nue },
    resolve: (respuestaBack) => {
      nueLoader.value = false
      console.log('respuesta de back', respuestaBack)
      if (
        respuestaBack.estadoNue === 'nue_no_existe' ||
        respuestaBack.estadoNue === 'cadena_levantada'
      ) {
        nueNoencontrado(respuestaBack)
      } else {
        formData.nueEncontrado = true
        formData.fechalevantamiento = new Date()
        formData.nue = nue
        formData.idOrganismo = respuestaBack.idOrganismo
      }
    },
    reject: (err) => {
      console.error(err)
    }
  })
}

function nueNoencontrado (respuestaBack) {
  launchDialog({
    component: ModalNueNoAsignadoOEnUso,
    // (condicional del header) buscar un dato en la respuesta de back para hacer la validacion de si el nue no es valido o no se encontro ruc asociado a este
    header: 'NUE en uso o no asignado',
    props: {
      respuestaBack
    },
    width: '28%',
    cancelLabel: 'Cerrar'
  })
}
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

const emit = defineEmits(['activar-nue'])

const { toastError, TOAST_MESSAGES } = useAppToast()

function activarNue () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('activar-nue', formData)
}

defineExpose({ formData })
</script>

<style scoped>
.buttonSearch {
  height: 2.5em;
  border-radius: 0 5px 5px 0px;
}
</style>
