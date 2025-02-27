<template>
<section class="col-12">
  <AppForm
    id="parentesco"
    :form-submitted="formSubmitted"
    validation-scope="parentesco"
  >
    <div class="grid">
      <AppDropdown
        id="referencial"
        v-model="formData.idPersonaReferencial"
        class="col-12 md:col-6 lg:col-4"
        label="Seleccione Referencial"
        option-label="nombreCompleto"
        option-value="idPersona"
        :options="referencialOptions"
        placeholder
        :rules="{ required }"
        show-clear
        @change="resetReferenciado"
      />

      <AppDropdown
        id="parentesco"
        v-model="formData.idTipo"
        class="col-12 md:col-6 lg:col-4"
        :disabled="!formData.idPersonaReferencial"
        label="Seleccione Parentesco"
        option-label="descripcion"
        option-value="id"
        :options="relacionesSujetos"
        placeholder
        :retrieve-data-action="mantenedor_getRelacionesSujetos"
        :rules="{ required }"
        show-clear
      />

      <AppDropdown
        id="referenciado"
        v-model="formData.idPersonaReferenciada"
        class="col-12 md:col-6 lg:col-4"
        :disabled="!formData.idPersonaReferencial"
        label="Seleccione Referenciado"
        option-label="nombreCompleto"
        option-value="idPersona"
        :options="referenciadoOptions"
        placeholder
        :rules="{ required }"
        show-clear
      />
    </div>
    <div class="mt-3 flex justify-content-center">
      <Button
        v-if="!isEditando"
        class="btn-form"
        :disabled="!formData.idPersonaReferencial || !formData.idPersonaReferenciada || isDisabled"
        icon="pi pi-link"
        icon-pos="right"
        label="Agregar Parentesco"
        :loading="loadingState"
        style="width: 256px"
        @click="emitAgregarParentesco()"
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
            @click="emitCancelarEdicion()"
          />
        </div>
        <div>
          <Button
            class="p-button-warning"
            icon="pi pi-pencil"
            label="Modificar Parentesco"
            :loading="loadingState"
            @click="emitAgregarParentesco()"
          />
        </div>
      </div>
    </div>
  </AppForm>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { defineProps, defineEmits, defineExpose, reactive, computed } from 'vue'
import { useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables'

const { toastError, TOAST_MESSAGES } = useAppToast()

const { relacionesSujetos, mantenedor_getRelacionesSujetos, mantenedor_getIdTipoSujetoByCodigo } = useMantenedorStore()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()

const formData = reactive({
  idPersonaReferencial: '',
  idPersonaReferenciada: '',
  idRelacionAfinidad: '',
  idTipo: ''
})

const { required, isFormValid, resetFormData, formSubmitted } = useFormValidation({
  formData,
  validationScope: 'parentesco'
})

const emit = defineEmits([
  'parentesco:agregar',
  'parentesco:editar',
  'parentesco:cancelarEdicion'
])

const props = defineProps({
  loadingState: Boolean,
  isEditando: Boolean,
  isDisabled: { type: Boolean, default: false }

})

function setForm (data) {
  const {
    idPersonaReferencial,
    idPersonaReferenciada,
    idRelacionAfinidad,
    idTipo
  } = data
  formData.idPersonaReferencial = idPersonaReferencial
  formData.idPersonaReferenciada = idPersonaReferenciada
  formData.idRelacionAfinidad = idRelacionAfinidad
  formData.idTipo = idTipo
}

function getTipoReferencial (tipo) {
  const sujetos = []
  sujetosIntervinientes.value.forEach((s) => {
    if (s.tipoSujeto === tipo) {
      const nombreCompleto = s.razonSocial ?? `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
      sujetos.push({
        ...s,
        nombreCompleto
      })
    }
  })
  return sujetos
}
const referencialOptions = computed(() => { // solo imputados
  return (
    getTipoReferencial(mantenedor_getIdTipoSujetoByCodigo('3')) // tipoSujeto imputado
  )
})

function getTipoReferenciado () {
  const sujetos = []
  sujetosIntervinientes.value.forEach((s) => {
    const nombreCompleto = s.razonSocial ?? `${s.nombres} ${s.apellidoPaterno} ${s.apellidoMaterno}`
    sujetos.push({
      ...s,
      nombreCompleto
    })
  })
  const sujetosReferenciados = sujetos?.filter((s) => s.idPersona !== formData.idPersonaReferencial)
  return sujetosReferenciados
}
const referenciadoOptions = computed(() => { // todos los sujetos intervinientes
  return getTipoReferenciado()
})

function resetReferenciado (s) {
  if (s.value === formData.idPersonaReferenciada) formData.idPersonaReferenciada = ''
}

function emitAgregarParentesco () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  // Si está editando emite el evento de editar, sino el de agregar
  props.isEditando
    ? emit('parentesco:editar', { ...formData })
    : emit('parentesco:agregar', { ...formData })
}

function emitCancelarEdicion () {
  resetFormData()
  formData.idPersonaReferencial = ''
  formData.idPersonaReferenciada = ''
  formData.idTipo = ''
  emit('parentesco:cancelarEdicion')
}

defineExpose({ setForm, resetFormData, emitCancelarEdicion })
</script>
