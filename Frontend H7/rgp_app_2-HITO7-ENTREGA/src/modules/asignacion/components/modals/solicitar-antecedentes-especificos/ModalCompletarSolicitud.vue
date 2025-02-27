<template>
<hr>
<section class="p-3 pb-0 mb-0">
  <AppForm
    id="solicitud-antecedente"
    class="w-full"
    :form-submitted="formSubmitted"
    validation-scope="solicitud-antecedente"
  >
    <div class="col-12 p-fluid">
      <AppDropdown
        id="ambito"
        v-model="formData.ambito"
        class="col-12 md:col-4"
        label="Ámbito"
        option-label="descripcion"
        option-value="id"
        :options="ambitoOptions"
        :rules="{ required }"
        @change="resetSeleccion"
      />
    </div>
    <AppFieldset
      v-if="hasFieldset"
      class="mt-4 mb-0 pb-0"
      :legend="`Lista de ${nombreAmbito}`"
    >
      <div class="p-inputgroup md:w-6 lg:w-4 md:ml-auto mt-4 lg:mt-0 mb-5">
        <InputText
          id="filter-text"
          v-model="filtroTexto"
          class="p-inputtext-sm"
          placeholder="Buscar"
        />
        <Button
          class="btn-primary p-button-sm"
          icon="pi pi-search"
          @click="null"
        />
      </div>
      <TablaSolicitudSujetos
        v-if="formData.ambito === 'sujeto'"
        v-model:selection="formData.seleccionTabla"
        :value="filtroSujetos"
      />
      <TablaSolicitudEspecie
        v-if="formData.ambito === 'especie'"
        v-model:first="especieDinero.firstRecord"
        v-model:selection="formData.seleccionTabla"
        :loading="especieDinero.isLoading"
        :rows="paginacionEspecies?.tamanoPagina"
        :total-records="paginacionEspecies?.elementosTotales"
        :value="especies"
        @page="getEspecies"
      />
    </AppFieldset>
  </AppForm>
  <div class="flex flex-row-reverse mt-6">
    <Button
      label="Obtener"
      style="width: 240px"
      @click="obtenerSolicitud"
    />
    <Button
      class="mr-4 p-button-text p-button-plain"
      icon="pi pi-times"
      label="Cancelar"
      style="width: 120px"
      @click="dialog.close()"
    />
  </div>
</section>
</template>
<script setup>
import { ref, computed, inject, reactive } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useEspeciesDineroStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { requestUtil, appUtil } from '@/utils'
import TablaSolicitudSujetos from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/TablaSolicitudSujetos.vue'
import TablaSolicitudEspecie from '@/modules/asignacion/components/modals/solicitar-antecedentes-especificos/TablaSolicitudEspecie.vue'

const dialog = inject('dialogRef')

const antecedente = reactive({ ...dialog.value.data?.antecedente })

const idDenuncia = dialog.value.data?.idDenuncia

const { toastError, TOAST_MESSAGES } = useAppToast()

const { includeWord } = appUtil

const formData = reactive({
  ambito: null,
  seleccionTabla: null
})

const especieDinero = reactive({
  isLoading: false,
  firstRecord: 0
})

const { required, formSubmitted, isFormValid } = useFormValidation({
  formData,
  validationScope: 'solicitud-antecedente'
})

const {
  sujetosIntervinientes,
  sujetosIntervinientes_getSujetosByIdGlobal
} = useSujetosIntervinientesStore()

const {
  especies,
  paginacionEspecies,
  especiesDinero_getEspecieByIdDenuncia
} = useEspeciesDineroStore()

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdGlobal,
    payload: { idDenuncia: idDenuncia }
  })
}

function getEspecies (pagination = undefined) {
  if (!pagination) {
    especieDinero.firstRecord = 0
  }

  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia },
    resolve: () => console.log(especies.value)
  })
}

const filtroTexto = ref('')

const filtroSujetos = computed(() => {
  const sujetos = sujetosIntervinientes.value

  if (filtroTexto.value) {
    return sujetos?.filter((sujeto) =>
      includeWord(sujeto.nombres, filtroTexto.value) || // Nombre Interviniente
        includeWord(sujeto.numeroDocumento, filtroTexto.value) || // Número Doc. Identificación
        includeWord(sujeto.descripcionTipoSujeto, filtroTexto.value) // Tipo Sujeto
    )
  }
  return sujetos
})

const nombreAmbito = computed(() => {
  const found = ambitoOptions.find((a) => a.id === formData.ambito)
  return found?.descripcion
})

const hasFieldset = computed(() => {
  return formData.ambito === 'sujeto' || formData.ambito === 'especie'
})

function resetSeleccion () {
  formData.seleccionTabla = null
  if (formData.ambito === 'sujeto') {
    getSujetos()
    return
  }
  if (formData.ambito === 'especie') {
    getEspecies()
  }
}

const ambitoOptions = [
  { id: 'sujeto', descripcion: 'Sujetos' },
  { id: 'especie', descripcion: 'Especie / Dinero' },
  { id: 'causa', descripcion: 'Causa' }
]

function obtenerSolicitud () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  if (isFormValid && !formData.seleccionTabla && hasFieldset.value) {
    toastError(`Debes seleccionar un dato en la tabla para realizar la solicitud`)
    return
  }

  const payload = {
    antecedentesSolicitadosId: antecedente?.idAntecedente,
    origenId: antecedente?.idOrigen,
    ambitoId: formData.ambito,
    especieId: formData.seleccionTabla?.idEspecie,
    intervinienteId: formData.seleccionTabla?.idPersona
  }

  dialog.value.close(payload)
}

</script>
