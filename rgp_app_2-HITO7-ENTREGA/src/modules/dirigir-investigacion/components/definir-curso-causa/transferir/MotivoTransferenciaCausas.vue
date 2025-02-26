<template>
<div class="w-full">
  <div class="grid">
    <AppDropdown
      id="id-decision-causa"
      v-model="form.motivoTransferencia"
      class="p-fluid col-12 md:col-4"
      label="Motivo de Transferencia"
      option-label="descripcion"
      option-value="id"
      :options="motivoTransferencia"
      placeholder
      :retrieve-data-action="mantenedor_getMotivosTransferencia"
      :rules="{
        required,
      }"
      show-clear
    />

    <AppDropdown
      id="id-decision-causa"
      v-model="form.fiscaliaCompetente"
      class="p-fluid col-12 md:col-4"
      label="Fiscalía Competente"
      :loading="isLoadingFiscaliasCompetentes"
      option-label="descripcion"
      option-value="id"
      :options="fiscalias"
      placeholder
      :rules="{
        required,
      }"
      show-clear
    />

    <AppTextarea
      id="id-input-comentario"
      v-model="form.comentario"
      auto-resize
      class="p-fluid col-12 mb-0"
      label="Comentario"
      rows="5"
      :rules="{
        required,
      }"
    />
  </div>
</div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useGeorreferenciaStore, useMantenedorStore } from '@/modules/global/composables'
import { useFormValidation, useAppGlobalProperties } from '@/modules/common/composables'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const {
  fiscalias,
  motivoTransferencia,
  mantenedor_getMotivosTransferencia,
  mantenedor_getFiscalias,
  mantenedor_getFiscaliaByIDFiscalia,
  // eslint-disable-next-line no-unused-vars
  fiscalia
} = useMantenedorStore()

const {
  // eslint-disable-next-line no-unused-vars
  $userFiscaliaActual
} = useAppGlobalProperties()

const {
  // eslint-disable-next-line no-unused-vars
  fiscaliasCompetentes
} = useGeorreferenciaStore()

const props = defineProps({
  modelValue: propTypes.object
})
const emit = defineEmits(['update:modelValue'])

const {
  // eslint-disable-next-line no-unused-vars
  ruc
} = useDirigirInvestigacionStore()

const { required } = useFormValidation()

const form = ref(props.modelValue)

const isLoadingFiscaliasCompetentes = ref(false)

watch(form, (newValues) => {
  emit('update:modelValue', newValues)
})

function getIdFiscaliaCompetente (_id) {
  requestUtil({
    action: mantenedor_getFiscaliaByIDFiscalia,
    payload: {
      idFiscalia: _id
    },
    resolve: (_res) => {
      getFiscaliasById(_res?.data?.codigo)
    },
    loader: (l) => {
      isLoadingFiscaliasCompetentes.value = l
    }
  })
}

watch(fiscaliasCompetentes, (_value) => {
  if (!_value) { return }

  const firstValue = _value[0]

  getIdFiscaliaCompetente(firstValue?.idFiscalia)
})

async function getFiscaliasById (_id) {
  const payload = {
    params: {
      codigo: _id || 16 // 16: REGION METROPOLITANA X DEFECTO
    }
    // params: {
    //   codigo: $userFiscaliaActual.value?.fiscalia,
    //   region: $userFiscaliaActual.value?.region
    // }
  }

  requestUtil({
    action: mantenedor_getFiscalias,
    payload: _id ? payload : undefined,
    loader: (l) => {
      isLoadingFiscaliasCompetentes.value = l
    }
  })
}

onMounted(() => {
  if (fiscaliasCompetentes.value?.length) {
    getIdFiscaliaCompetente(fiscaliasCompetentes.value[0].idFiscalia)
  } else {
    getFiscaliasById()
  }
})
</script>
