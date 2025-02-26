<template>
<section class="col-12">
  <AppForm
    id="relato-hecho"
    :form-submitted="formSubmitted"
    validation-scope="formRelato"
  >
    <AppDropdown
      v-if="!readOnly && !noDropdown"
      id="plantilla"
      v-model="idPlantilla"
      class="col-12 md:col-4"
      :disabled="isDisabled"
      label="Seleccione Plantilla"
      option-label="labelPlantilla"
      option-value="idPlantilla"
      :options="plantillaOptions"
      placeholder
      show-clear
      @change="idPlantilla ? emitGenerarPlantilla() : null"
    />
    <div v-if="isLoadingPlantilla">
      <LoaderSkeleton height="30vh" />
    </div>
    <!-- refinar editor-style  width: 80vw para otras resoluciones diferentes a 1280x800 -->
    <AppEditor
      v-else
      id="editor-relato-hecho"
      v-model="formData.relato"
      :disabled="isDisabled"
      :readonly="readOnly"
      :rules="{ required }"
    />
    <div class="mb-3 mt-4 flex justify-content-center">
      <Button
        v-if="!readOnly"
        class="btn-form"
        :disabled="isDisabled"
        icon="pi pi-plus-circle"
        icon-pos="right"
        label="Guardar Relato"
        style="width: 256px"
        @click="emitGuardarRelato()"
      />
    </div>
  </AppForm>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps, defineEmits, reactive, watch, onMounted, ref } from 'vue'
import { usePamStore, useRelatoStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const { toastError } = useAppToast()
const { procesoPam } = usePamStore()

const { relato } = useRelatoStore()

const props = defineProps({
  readOnly: Boolean,
  isLoadingPlantilla: Boolean,
  plantillaOptions: propTypes.array,
  relato: propTypes.object,
  esFichaCausa: Boolean,
  noDropdown: Boolean,
  isDisabled: { type: Boolean, default: false }

})

const idPlantilla = ref(0)

const formData = reactive({
  idRelato: '',
  idProcedimiento: '',
  idDenuncia: '',
  relato: '',
  idFuncionarioRol: '',
  esPrincipal: true,
  contenidoPredefinido: '',
  palabraClave: ''
})

watch(props, () => {
  if (props.relato) {
    populateForm(props.relato)
  }
})

onMounted(() => {
  setTimeout(() => {
    populateForm(relato.value)
  }, 50)
})
function populateForm (data) {
  Object.assign(formData, data)
}

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'formRelato'
})

const emit = defineEmits(['editor-relato:generar-plantilla', 'editor-relato:guardar-relato'])

function emitGenerarPlantilla () {
  emit('editor-relato:generar-plantilla', idPlantilla.value)
}

function emitGuardarRelato () {
  if (!isFormValid()) {
    toastError('Debe completar el relato del hecho!')
    return
  }
  emit('editor-relato:guardar-relato', {
    ...formData,
    idPlantilla: idPlantilla.value,
    idDenuncia: procesoPam.value.idDenuncia
  })
}
</script>
<style scoped>
.cont-spinner {
  position: fixed;
}
.spinner {
  width: 50px;
  height: 50px;
}

</style>
