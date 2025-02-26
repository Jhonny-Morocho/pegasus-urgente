<template>
<section>
  <AppForm
    id="registro-contacto-funcionarios"
    :form-submitted="formSubmitted"
    validation-scope="formRegistroContactoFuncionario"
  >
    <AppFieldset legend="Funcionarios">
      <AppDropdown
        id="tipo"
        v-model="formData.tipo"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Tipo Funcionario"
        option-label="descripcion"
        option-value="id"
        :options="tipoFuncionario"
        placeholder
        :retrieve-data-action="mantenedor_getTipoFuncionario"
        :rules="{
          required,
        }"
        show-clear
        @change="
          formData.esTestigo = true /*Cuando se selecciona un valor el select button del Testigo se marca en Si*/
        "
      />
      <RutInput
        id="rut"
        v-model="formData.rut"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="RUT"
        :rules="{
          required,
        }"
      />
      <AppInput
        id="nombre"
        v-model="formData.nombre"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Nombre"
        :rules="{
          required,
          alfabetico,
        }"
      />

      <AppInput
        id="apellidoPaterno"
        v-model="formData.apellidoPaterno"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Apellido Paterno"
        :rules="{
          required,
          alfabetico,
        }"
      />

      <AppInput
        id="apellidoMaterno"
        v-model="formData.apellidoMaterno"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Apellido Materno"
        :rules="{
          alfabetico,
        }"
      />

      <AppInput
        id="grado"
        v-model="formData.grado"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Grado"
        :rules="{
          required,
        }"
      />

      <AppInput
        id="numeroPlaca"
        v-model="formData.numeroPlaca"
        class="col-12 md:col-6 lg:col-3"
        :disabled="soloLectura"
        label="Número de Placa"
        :rules="{
          required,
        }"
      />

      <div class="col-12 p-0">
        <div class="col-12 md:col-6 lg:col-3">
          <p class="pl-2">
            ¿ Es Testigo ?
          </p>
          <AppSelectButton
            id="esTestigo"
            v-model="formData.esTestigo"
            :disabled="soloLectura"
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false },
            ]"
          />
        </div>
      </div>

      <template #bottom>
        <div class="flex justify-content-center">
          <Button
            v-if="!funcionarioEditar"
            class="btn-form mb-4 px-5"
            :disabled="soloLectura"
            icon="pi pi-user-plus"
            icon-pos="right"
            label="Agregar Funcionario"
            style="width: auto"
            @click="handleAgregarFuncionario"
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
                @click="handleCancelarEdicion"
              />
            </div>
            <div>
              <Button
                class="p-button-warning"
                icon="pi pi-pencil"
                label="Modificar Funcionario"
                @click="handleEditarFuncionario"
              />
            </div>
          </div>
        </div>
        <TablaFuncionarios
          class="mt-4 px-3"
          :loading="loading"
          @funcionario:rellenar="handleRellenarFuncionario"
        />
      </template>
    </AppFieldset>
  </AppForm>
</section>
</template>

<script setup>
import { reactive, ref, defineExpose, defineProps } from 'vue'
import TablaFuncionarios from '@/modules/flagrancia/components/registro-contacto/TablaFuncionarios.vue'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import { useFuncionarios, useMantenedorStore } from '@/modules/global/composables'
import { format } from '@fiquu/cl-rut'

import { useAppToast, useFormValidation } from '@/modules/common/composables'
const {
  funcionario,
  funcionarios_EDIT_FUNCIONARIO,
  funcionarios_ADD_FUNCIONARIO_LOCAL
} = useFuncionarios()

const { toastSuccess, toastError, TOAST_MESSAGES } = useAppToast()

const {
  mantenedor_getTipoFuncionario,
  tipoFuncionario,
  mantenedor_getIdTipoFuncionarioByCodigo
} = useMantenedorStore()

const formData = reactive({
  tipo: '',
  rut: '',
  esTestigo: null,
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  grado: '',
  numeroPlaca: ''
})
defineProps({
  soloLectura: Boolean
})
const {
  isFormValid,
  formSubmitted,
  required,
  resetFormData,
  alfabetico
} = useFormValidation({
  formData,
  validationScope: 'formRegistroContactoFuncionario'
})

const indexFuncionarioAEditar = ref(null)
const funcionarioEditar = ref(false)
const loading = ref(false)

function handleAgregarFuncionario () {
  const formularioProcesado = procesarFormulario()
  if (!formularioProcesado) {
    return
  }
  loading.value = true
  funcionarios_ADD_FUNCIONARIO_LOCAL(formularioProcesado)
  toastSuccess('El funcionario ha sido agregado con éxito')
  handleCancelarEdicion()
}

// rellena los datos del funcionario a modificar
function handleRellenarFuncionario ({ index, funcionarioData }) {
  funcionarioEditar.value = true
  indexFuncionarioAEditar.value = index
  funcionarioData.rut = format(funcionarioData.rut)
  Object.keys(formData).forEach((key) => {
    formData[key] = funcionarioData[key]
  })
}

function handleEditarFuncionario () {
  const formularioProcesado = procesarFormulario()

  if (!formularioProcesado) {
    return
  }
  loading.value = true
  funcionarios_EDIT_FUNCIONARIO({
    funcionario: formularioProcesado,
    index: indexFuncionarioAEditar.value
  })
  // resetea el formulario
  toastSuccess('El funcionario ha sido actualizado con éxito')
  handleCancelarEdicion()
}

function handleCancelarEdicion () {
  indexFuncionarioAEditar.value = null
  funcionarioEditar.value = false
  resetFormData()
  formSubmitted.value = false
  loading.value = false
}

function procesarFormulario () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  // verifica si existe tipo
  const existeTipoACargo = funcionario.value.filter(
    (f) => f.tipo === mantenedor_getIdTipoFuncionarioByCodigo('2')
  )

  // solo puede haber un funcionario tipo 'A Cargo del Procedimiento'
  if (
    existeTipoACargo.length > 0 &&
    formData.tipo === mantenedor_getIdTipoFuncionarioByCodigo('2') &&
    indexFuncionarioAEditar.value === null
  ) {
    toastError('Tipo de funcionario ya registrado, debe seleccionar otra opción')

    return
  }

  const existeRut = funcionario.value.filter((f) => f.rut === formData.rut)

  if (existeRut.length > 0 && indexFuncionarioAEditar.value === null) {
    formData.rut = ''
    toastError('RUT ya registrado')

    return
  }

  return {
    ...formData,
    idFuncionario: null,
    idPersona: '',
    idRut: null,
    idNombre: null,
    idFuncionarioOrganismo: null,
    rut: formData.rut.replaceAll('.', '')
  }
}

function populateData (data) {
  Object.assign(formData, data)
}
defineExpose({ formData, populateData })
</script>
