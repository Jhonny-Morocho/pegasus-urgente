<template>
<section>
  <AppForm
    id="form-ingreso-especie-nue"
    class="grid"
    :form-submitted="formSubmitted"
    validation-scope="form-ingreso-especie-nue"
  >
    <AppInput
      id="nue"
      v-model="formData.nue"
      class="col-12 md:col-6 lg:col-4 md:mr-1 lg:mr-0"
      :disabled="readOnly"
      label="NUE"
      :rules="{
        required
      }"
    />
    <AppDropdown
      id="familia-especie"
      v-model="formData.idFamilia"
      class="col-12 md:col-6 lg:col-4"
      label="Familia de la Especie"
      option-label="descripcion"
      option-value="id"
      :options="familiaEspecies"
      :rules="{ required }"
      show-clear
      @change="filtrarTipos"
    />
    <AppDropdown
      id="tipo-especie"
      v-model="formData.tipo"
      class="col-12 md:col-6 lg:col-4"
      :disabled="readOnly"
      label="Tipo de Especie"
      :loading="loadingTipoEspecie"
      option-label="descripcion"
      option-value="id"
      :options="listaTiposEspecie"
      :rules="{
        required,
      }"
      show-clear
    />
    <AppInput
      id="descripcion"
      v-model="formData.descripcion"
      class="col-12 lg:col-8"
      label="Descripción"
      :rules="{
        required,
      }"
    />
    <AppInputNumber
      v-if="!esDinero"
      id="cantidad"
      v-model="formData.cantidad"
      class="col-12 md:col-6 lg:col-4 md:mr-1 lg:mr-0"
      label="Cantidad"
      :min="0"
      :rules="{
        required,
      }"
      show-buttons
    />
    <AppInput
      v-else
      id="cantidad"
      v-model="formData.monto"
      class="col-12 md:col-6 lg:col-4 md:mr-1 lg:mr-0"
      label="Monto"
      :rules="{
        required,
      }"
    />
    <div
      v-if="!esDinero"
      class="col-12 md:col-6 lg:col-4"
    >
      <p class="ml-2">
        ¿Es Especie peligrosa? (<span style="color: #b00020">*</span>)
      </p>
      <AppSelectButton
        id="es-peligrosa"
        v-model="formData.especiePeligrosa"
        class="w-100"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{
          required
        }"
      />
    </div>
    <AppDropdown
      v-if="!esDinero"
      id="id-nivel-peligro"
      v-model="formData.especiePeligrosaClase"
      class="col-12 md:col-6 lg:col-4 mt-auto"
      :disabled="!formData.especiePeligrosa || isLoading"
      label="Clase"
      :loading="isLoading"
      option-label="descripcion"
      option-value="id"
      :options="clasesPeligro"
      :rules="formData.especiePeligrosa ? { required } : ''"
      show-clear
    />
    <AppFieldset
      class="w-full"
      collapsed
      legend="Subir imágenes (Opcional)"
      :toggleable="true"
    >
      <FormAgregarFotografia
        ref="formFijacionFotografica"
        :procedencia="'Recepción Agregar NUE'"
        :show-progress="showProgress"
        @agregar-fotografia="addFotografiaLocal"
      />
      <TablaDocumentos
        :documentos="archivos"
        :loading="loaderDocumentos"
        @delete-archivo="deleteArchivo"
      />
    </AppFieldset>
    <div class="col-12">
      <AppTextarea
        id="descripcion-archivo"
        v-model="formData.observacion"
        class="w-100"
        label="Observación"
        rows="5"
      />
    </div>
    <div class="col-12 flex justify-content-center">
      <Button
        class="btn-form w-auto"
        :disabled="especieAgregada"
        :icon="especieAgregada ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
        icon-pos="right"
        label="Guardar NUE"
        style="min-width: 256px"
        @click="addEspecieNue"
      />
    </div>
  </AppForm>
</section>
</template>
<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import {
  computed,
  ref,
  defineEmits,
  defineProps,
  reactive,
  defineExpose,
  watch
} from 'vue'
import FormAgregarFotografia from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/FormAgregarFotografia.vue'
import TablaDocumentos from '@/modules/recepcion-especies-dinero/components/fijacion-fotografica/TablaDocumentos.vue'
import { useSubirArchivosStore } from '@/modules/recepcion-especies-dinero/composables'

defineProps({
  especieAgregada: Boolean
})

function initialForm () {
  return {
    cantidad: null,
    monto: null,
    descripcion: null,
    especiePeligrosa: null,
    especiePeligrosaClase: null,
    idFamilia: null,
    nue: null,
    observacion: null,
    tipo: null
  }
}

const formData = reactive(initialForm())

const { formSubmitted, required, isFormValid } = useFormValidation({
  formData,
  validationScope: 'form-ingreso-especie-nue'
})

watch(
  () => formData.idFamilia,
  () => {
    formData.tipo = null
  }
)

const { toastError, TOAST_MESSAGES, toastSuccess } = useAppToast()

const emit = defineEmits(['agregar-especie-nue'])

const {
  familiaEspecies,
  allTiposEspecie,
  mantenedor_getAllTiposEspecie,
  clasesPeligro,
  mantenedor_getClasePeligroEspecie,
  mantenedor_getCodigoFamiliaEspecieById
} = useMantenedorStore()

const esDinero = computed(
  () => mantenedor_getCodigoFamiliaEspecieById(formData.idFamilia) === '21'
)

function addEspecieNue () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('agregar-especie-nue', { ...formData, esDinero: esDinero.value })
}

const listaTiposEspecie = computed(() => {
  return allTiposEspecie.value.filter((t) => t.idPadre === formData.idFamilia)
})

const loadingTipoEspecie = ref(false)

requestUtil({
  action: mantenedor_getAllTiposEspecie,
  loader: (l) => {
    loadingTipoEspecie.value = l
  }
})

const isLoading = ref(false)

requestUtil({
  action: mantenedor_getClasePeligroEspecie,
  loader: (value) => {
    isLoading.value = value
  }
})

function resetForm () {
  Object.assign(formData, initialForm())
  formSubmitted.value = false
}

const {
  subirArchivosStore_addArchivoLocal,
  subirArchivosStore_deleteArchivoLocal,
  archivos
} = useSubirArchivosStore()

const loaderDocumentos = ref(false)

const formFijacionFotografica = ref()

const showProgress = ref(false)

function addFotografiaLocal (d) {
  requestUtil({
    action: subirArchivosStore_addArchivoLocal,
    payload: d,
    loader: (l) => {
      showProgress.value = l
      loaderDocumentos.value = l
    },
    resolve: (data) => {
      toastSuccess(`El archivo '${data.titulo}' se subió correctamente`)
      formFijacionFotografica.value.resetform()
    },
    reject: () => {
      toastError('Ocurrió un error inesperado, intenta nuevamente')
    }
  })
}

function deleteArchivo (d) {
  requestUtil({
    action: subirArchivosStore_deleteArchivoLocal,
    payload: d,
    resolve: (r) => {
      toastSuccess(`El archivo '${r.titulo}' se eliminó`)
    }
  })
}

defineExpose({ resetForm })
</script>
