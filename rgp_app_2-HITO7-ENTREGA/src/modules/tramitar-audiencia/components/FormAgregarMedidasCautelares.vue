<template>
<AppForm
  id="medidascautelares"
  :form-submitted="formSubmitted"
  validation-scope="medidascautelares"
>
  <div class="grid px-1">
    <AppDropdown
      id="imputado"
      v-model="formData.imputado"
      class="col-12 md:col-6 lg:col-3 p-inputtext-sm"
      label="Seleccione Imputado"
      option-label="nombreCompleto"
      :options="optionsListaImputados"
      :rules="{ required }"
      show-clear
    />
    <AppDropdown
      id="medida-cautelar"
      v-model="formData.medidaCautelar"
      class="col-12 md:col-6 lg:col-3"
      label="Seleccione Medida Cautelar"
      option-label="descripcion"
      option-value="id"
      :options="medidasCautelares"
      :rules="{ required }"
      show-clear
    />
    <AppInput
      id="descripcion-medida-cautelar"
      v-model="formData.descripcion"
      class="col-12 lg:col-6"
      label="Descripción Medida Cautelar"
      :rules="{ required }"
    />
    <div class="col-12 md:col-6 md:col-offset-3 lg:col-3 lg:col-offset-9">
      <Button
        class="btn-aprobar"
        icon="pi pi-save"
        icon-pos="right"
        label="Agregar Medida Cautelar"
        :loading="loadingState"
        @click="agregarMedida()"
      />
    </div>
  </div>
</AppForm>
</template>

<script setup>
import { defineEmits, reactive, ref, defineProps, computed } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'

const props = defineProps({
  listaImputados: propTypes.array,
  isIntrusiva: Boolean
})

const { medidasCautelares } = useMantenedorStore()

const optionsListaImputados = computed(() => {
  return props.listaImputados.map(i => {
    return {
      id: i.idPersona,
      nombreCompleto: `${i.nombres} ${i.apellidoPaterno} ${i.apellidoMaterno}`
    }
  })
})

// onMounted(async () => {
//   if (optionsListaImputados.value?.length === 1) {
//     formData.imputado = optionsListaImputados.value[0]
//   }
// })

const loadingState = ref(false)

const formData = reactive({
  imputado: null,
  medidaCautelar: null,
  descripcion: ''
})

const { required, isFormValid, formSubmitted, resetFormData } = useFormValidation({
  formData,
  validationScope: 'medidascautelares'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const emit = defineEmits(['medidas:agregar'])

function agregarMedida () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  emit('medidas:agregar', { ...formData })

  resetFormData()
}
</script>

<style lang="scss" scoped>
.btn-aprobar {
  background-color: $primary-color;
  transition: all 0.5s ease;

  &:hover {
    background-color: $primary-color-hover !important;
  }
}
</style>
