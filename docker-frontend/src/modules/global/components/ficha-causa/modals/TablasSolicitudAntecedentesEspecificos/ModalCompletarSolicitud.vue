<template>
<AppForm
  id="formSolicitarAntecedenteEspecifico"
  :form-submitted="formSubmitted"
  validation-scope="formSolicitarAntecedenteEspecifico"
>
  <div class="grid px-1">
    <AppDropdown
      id="ambitoespecie"
      v-model="formSolicitarAntecedenteEspecifico.idAmbito"
      class="col-12 md:col-4"
      label="Ámbito"
      option-label="name"
      option-value="name"
      :options="[{ name: 'Sujetos' }, { name: 'Especies' }]"
      :rules="{ required }"
      @change="tiposSegunAmbito"
    />
    <AppDropdown
      v-if="false"
      id="tipoSegunAmbito"
      v-model="tipoSegunAmbito"
      class="col-12 md:col-4"
      :label="formSolicitarAntecedenteEspecifico.idAmbito ? 'Tipo '+formSolicitarAntecedenteEspecifico.idAmbito : 'Tipo'"
      option-label="label"
      option-value="value"
      :options="listaTipoSegunAmbito"
    />
  </div>
  <AppFieldset
    v-model:collapsed="isCollapsed"
    :legend="formSolicitarAntecedenteEspecifico.idAmbito ? 'Registros de '+formSolicitarAntecedenteEspecifico.idAmbito : 'Seleccione Ámbito para cargar los Registros'"
    no-margin-bottom
  >
    <TablaSujetos
      v-if="formSolicitarAntecedenteEspecifico.idAmbito === 'Sujetos'"
      ref="sujetoSeleccionado"
      :is-solicitud="solicitud"
    />
    <div
      v-if="formSolicitarAntecedenteEspecifico.idAmbito === 'Especies'"
      class="col-12"
    >
      <TablaEspeciesDinero
        ref="especieSeleccionada"
        :data-especies-dinero="especies"
        :is-editando="editando"
        :is-solicitud="solicitud"
        :loading="loadingTablaEspecies"
      />
    </div>
  </AppFieldset>
</AppForm>
</template>
<script setup>
import { reactive, defineExpose, ref, defineProps } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { useEspeciesDineroStore, useFichaCausaStore, useMantenedorStore, useSujetosIntervinientesStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import TablaEspeciesDinero from '@/modules/global/components/especies-dinero/TablaEspeciesDinero.vue'
import TablaSujetos from '@/modules/global/components/sujetos-intervinientes/tablas/TablaSujetos.vue'

const isCollapsed = ref(true)
const solicitud = ref(true)
const tipoSegunAmbito = ref(null)
const {
  especiesDinero_getEspecieByIdDenuncia,
  especies
} = useEspeciesDineroStore()
const { idDenuncia } = useFichaCausaStore()
const { sujetosIntervinientes } = useSujetosIntervinientesStore()

const {
  mantenedor_getTiposSujetos,
  mantenedor_getFamiliaEspecies,
  mantenedor_getTiposEspecies,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getNombreTipoSujeto
} = useMantenedorStore()

mantenedor_getFamiliaEspecies()
mantenedor_getTiposEspecies()
mantenedor_getTiposSujetos()

const listaTipoSegunAmbito = ref([])

function getEspecies () {
  requestUtil({
    action: especiesDinero_getEspecieByIdDenuncia,
    payload: { idDenuncia: idDenuncia.value }
  })
}

function tiposSegunAmbito () {
  isCollapsed.value = false
  if (formSolicitarAntecedenteEspecifico.idAmbito === 'Especies') {
    if (especies.value.length > 0) {
      getEspecies()
    }
    listaTipoSegunAmbito.value = especies.value.map((e) => {
      return {
        ...e,
        label: mantenedor_getNombreTipoEspecie(e.idTipoEspecie),
        value: e.idTipoEspecie
      }
    })
  } else if (formSolicitarAntecedenteEspecifico.idAmbito === 'Sujetos') {
    listaTipoSegunAmbito.value = sujetosIntervinientes.value.map((s) => {
      return {
        ...s,
        label: mantenedor_getNombreTipoSujeto(s.tipoSujeto),
        value: s.tipoSujeto
      }
    })
  }
}

const props = defineProps({
  dataAntecedente: propTypes.object
})
console.log('data', props)
const formSolicitarAntecedenteEspecifico = reactive({
  id: '',
  idDenuncia: idDenuncia.value,
  idAntecedenteSolicitado: props.dataAntecedente.idAntecedenteDisponible,
  idOrigen: props.dataAntecedente.idOrigen,
  idAmbito: '',
  idTipoSujeto: '',
  idPersonaSujeto: '',
  idFamiliaEspecie: '',
  idEspecie: '',
  idTipoEspecie: '',
  referencia: '',
  estado: '',
  personaSujeto: ''
})

const { isFormValid, formSubmitted, required } = useFormValidation({
  formData: formSolicitarAntecedenteEspecifico,
  validationScope: 'formSolicitarAntecedenteEspecifico'
})

const { toastError, TOAST_MESSAGES } = useAppToast()

const especieSeleccionada = ref(null)

const sujetoSeleccionado = ref([])

function retrieveData (retrieve) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  if (formSolicitarAntecedenteEspecifico.idAmbito === 'Especies') {
    const dataEspecie = especieSeleccionada.value.especieSeleccionada
    formSolicitarAntecedenteEspecifico.idTipoEspecie = dataEspecie.idTipoEspecie
    formSolicitarAntecedenteEspecifico.idFamiliaEspecie = dataEspecie.familiaEspecie
    formSolicitarAntecedenteEspecifico.idEspecie = dataEspecie.idEspecie
  } else if (formSolicitarAntecedenteEspecifico.idAmbito === 'Sujetos') {
    const dataSujeto = sujetoSeleccionado.value.sujetoSeleccionado
    formSolicitarAntecedenteEspecifico.idPersonaSujeto = dataSujeto.idRelacionSujeto
    formSolicitarAntecedenteEspecifico.idTipoSujeto = dataSujeto.tipoSujeto
    formSolicitarAntecedenteEspecifico.personaSujeto = dataSujeto.nombres + ' ' + dataSujeto.apellidoPaterno + ' ' + dataSujeto.apellidoMaterno
  }
  retrieve?.(formSolicitarAntecedenteEspecifico)
}

defineExpose({ retrieveData })
</script>
