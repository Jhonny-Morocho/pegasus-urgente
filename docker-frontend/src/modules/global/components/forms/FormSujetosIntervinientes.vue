<template>
<div>
  <AppForm
    id="sujeto-interviniente"
    :form-readonly="readOnly"
    :form-submitted="formSubmitted"
    :form-validation-disabled="formData.esNn"
    :validation-scope="validationScope"
  >
    <div class="flex justify-content-center mt-3">
      <Button
        id="agregarInterviniente"
        class="btn-fileupload my-3"
        :disabled="isDisabled"
        :icon="isCollapsed ? 'pi pi-user-plus' : 'pi pi-minus-circle'"
        icon-pos="right"
        :label="isCollapsed ? 'Agregar un Interviniente' : 'Cancelar'"
        :loading="loadingButton"
        style="width: auto"
        type="button"
        @click="toggleAgregarSujeto"
      />
      <div
        v-if="!isCollapsed"
        style="width: 10px"
      />
      <Button
        v-if="!isCollapsed && !readOnly"
        id="limpiarFormInterviniente"
        class="p-button-outlined p-button-warning my-3"
        icon="pi pi-times"
        icon-pos="right"
        label="Limpiar"
        style="width: auto"
        type="button"
        @click="resetFormDataSujeto"
      />
    </div>
    <AppFieldset
      v-show="!isCollapsed"
      legend="Identificación Interviniente"
      :toggleable="true"
    >
      <SujetosIntervinientesIdentificacion @change-tipo-sujeto="changeTipoSujeto" />
      <SujetosIntervinientesDatosComplementarios class="mb-5" />
      <SujetosIntervinientesInfoContacto />
      <div class="col-12 grid text-center flex justify-content-center">
        <div
          v-if="formData.readonly"
          class="flex justify-content-center"
        >
          <Button
            class="btn-form px-6"
            icon="pi pi-minus-circle"
            icon-pos="right"
            label="Cerrar"
            style="width: auto"
            @click="cancelarEdicion"
          />
        </div>
        <div
          v-else
          class="flex justify-content-center"
        >
          <Button
            v-if="!isEditando"
            class="btn-form px-6"
            icon="pi pi-user-plus"
            icon-pos="right"
            label="Guardar Interviniente"
            :loading="loadingButton"
            style="width: auto"
            @click="handleSubmitForm"
          />
          <div
            v-else
            class="flex"
          >
            <div class="mr-4">
              <Button
                class="p-button-outlined p-button-warning"
                icon="pi pi-times"
                label="Cancelar"
                @click="cancelarEdicion"
              />
            </div>
            <div>
              <Button
                class="p-button-warning"
                icon="pi pi-pencil"
                label="Modificar Interviniente"
                :loading="loadingButton"
                @click="handleSubmitForm"
              />
            </div>
          </div>
        </div>
      </div>
    </AppFieldset>
  </AppForm>
</div>
</template>

<script setup>
// composables
import { 
  defineProps, 
  defineEmits, 
  onMounted
} from 'vue'
import {
  useMantenedorStore,
  useSujetosIntervinientesInject,
  useSujetosIntervinientesProvide
} from '@/modules/global/composables'
import { requestUtil } from '@/utils'

// components
import SujetosIntervinientesInfoContacto from '@/modules/global/components/sujetos-intervinientes/SujetosIntervinientesInfoContacto.vue'
import SujetosIntervinientesIdentificacion from '@/modules/global/components/sujetos-intervinientes/SujetosIntervinientesIdentificacion.vue'
import SujetosIntervinientesDatosComplementarios from '@/modules/global/components/sujetos-intervinientes/SujetosIntervinientesDatosComplementarios.vue'
import { useFormValidation } from '@/modules/common/composables'

const { mantenedor_getTipoPersonaIdByCodigo, mantenedor_getRespuestaBasico, mantenedor_getCategoriasDocumento } = useMantenedorStore()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { sujetosIntervinientesValidationScope } = useSujetosIntervinientesProvide()
const formData = sujetosIntervinientesInject

const { resetFormData } = useFormValidation({
  formData,
  validationScope: sujetosIntervinientesValidationScope
})

function getRespuestaBasica () {
  const params = {
    nombreMantenedor: 'SI_NO'
  }
  requestUtil({
    action: mantenedor_getRespuestaBasico,
    payload: { params }
  })
}

getRespuestaBasica()

const resetFormDataSujeto = () => {
  resetFormData()
  formData.hasSrceiData = false
  formData.idRepresentaInstitucion = mantenedor_getTipoPersonaIdByCodigo('0')
}

const cancelarEdicion = () => {
  resetFormDataSujeto()
  emit('cancelar-edicion')
}

const toggleAgregarSujeto = () => {
  resetFormDataSujeto()
  emit('agregar-interviniente')
}

const handleSubmitForm = () => {
  delete formData.hasSrceiData
  emit('handle-submit-form')
}

defineProps({
  validationScope: {
    type: String,
    default: 'SujetosIntervinientes'
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
  isDisabled: {
    type: Boolean,
    default: false
  },
  readOnly: Boolean
})

const emit = defineEmits(['reset-form-data', 'handle-submit-form', 'cancelar-edicion', 'agregar-interviniente', 'change-tipo-sujeto'])
function changeTipoSujeto () {
  emit('change-tipo-sujeto')
}

onMounted(() => {
  requestUtil({action: mantenedor_getCategoriasDocumento})
})
</script>
