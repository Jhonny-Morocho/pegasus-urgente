<template>
<AppFieldset legend="Delitos">
  <div class="col-12 grid py-0">
    <AppDropdown
      id="busquedaDelito"
      v-model="busquedaDelito"
      class="col-12 md:col-4 p-fluid"
      :disabled="readOnly || !tiposDelito.length"
      label="Buscar Delito"
      option-label="descripcion"
      option-value="id"
      :options="tiposDelito"
      show-clear
      @change="setDelito"
    />
    <AppDropdown
      id="familia-delito"
      v-model="formData.idFamiliaDelito"
      class="col-12 md:col-4 p-fluid"
      :disabled="readOnly"
      label="Seleccione Familia del Delito"
      option-label="descripcion"
      option-value="id"
      :options="familiasDelito"
      :rules="{ required }"
      show-clear
      @change="setFamiliaDelito"
    />
    <AppDropdown
      id="tipo-delito"
      v-model="formData.idTipoDelito"
      class="col-12 md:col-4 p-fluid"
      :disabled="readOnly || !formData.idFamiliaDelito"
      label="Seleccione Tipo de Delito"
      option-label="descripcion"
      option-value="id"
      :options="tiposDelitoFilter"
      :rules="{ required }"
      show-clear
      @change="setDelitoDenunciado"
    />
  </div>
</AppFieldset>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'

import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '../../composables'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { requestUtil } from '@/utils'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()
const { required } = useFormValidation()
const formData = delitoInject
const busquedaDelito = ref('')
const {
  familiasDelito, tiposDelito,
  mantenedor_getNombreTipoDelito, mantenedor_getTiposDelito,
  mantenedor_getNombreFamiliaDelito,
  mantenedor_getIdFamiliaDelitoByIdPadreTipoDelito,
  mantenedor_getFamiliasDelito
} = useMantenedorStore()

const tiposDelitoFilter = computed(() => {
  const tipoDelitos = tiposDelito.value?.filter(
    (td) => td.idPadre === formData.idFamiliaDelito
  )
  return tipoDelitos?.length
    ? tipoDelitos
    : [{ descripcion: 'Sin Tipo Delito', id: 'sin-tipo' }]
})

function dataMantenedor () {
  requestUtil({ action: mantenedor_getTiposDelito })
  requestUtil({ action: mantenedor_getFamiliasDelito })
}
dataMantenedor()

function setDelitoDenunciado () {
  formData.delitoDenunciado = mantenedor_getNombreTipoDelito(formData.idTipoDelito)
}

function setFamiliaDelito () {
  formData.idTipoDelito = ''
  formData.familiaDelito = mantenedor_getNombreFamiliaDelito(formData.idFamiliaDelito)
}

function setDelito () {
  const idPadre = tiposDelito.value.find((delito) => delito.id === busquedaDelito.value)?.idPadre
  formData.idTipoDelito = busquedaDelito.value
  formData.idFamiliaDelito = mantenedor_getIdFamiliaDelitoByIdPadreTipoDelito(idPadre)
}
</script>
