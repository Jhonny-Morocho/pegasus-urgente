v
<template>
<section class="col-12 px-0">
  <AppFieldset
    class="mb-0 pb-0 pr-0"
    legend="Especies / Dinero"
    no-margin-bottom
  >
    <div class="col-12 lg:col-8 grid mb-0 pb-0">
      <AppDropdown
        id="ambito-especie"
        v-model="formData.ambitoEspecie"
        class="col-12 md:col-6"
        :disabled="readOnly"
        label="Ámbito de la Especie"
        option-label="descripcion"
        option-value="id"
        :options="ambitoEspecie"
        :retrieve-data-action="mantenedor_getAmbitoEspecie"
        :rules="{
          required
        }"
        show-clear
        @change="mantenedor_getCodigoAmbitoEspecieById(formData.ambitoEspecie) !== '4' ? resetNue() : null"
      />
      <AppInput
        id="nue"
        v-model="formData.nue"
        class="col-12 md:col-6"
        :disabled="mantenedor_getCodigoAmbitoEspecieById(formData.ambitoEspecie) === '4' || readOnly"
        label="NUE"
        max-length="50"
        :rules="{required}"
      />
      <AppDropdown
        id="familia-especie"
        v-model="formData.familiaEspecie"
        class="col-12 md:col-6"
        :disabled="readOnly"
        label="Familia de la Especie"
        option-label="descripcion"
        option-value="id"
        :options="familiaEspecies"
        :retrieve-data-action="mantenedor_getFamiliaEspecies"
        :rules="{
          required
        }"
        show-clear
        @change="getTiposByIdFamilia"
      />
      <AppDropdown
        id="tipo-especie"
        v-model="formData.idTipoEspecie"
        class="col-12 md:col-6"
        :disabled="readOnly"
        label="Tipo de Especie"
        :loading="loadingTipoEspecie"
        option-label="descripcion"
        option-value="id"
        :options="listaTiposEspecie"
        :rules="{
          required
        }"
        show-clear
      />
    </div>
    <div class="col-12 lg:col-4 grid mb-0 pb-0">
      <AppTextarea
        id="declaracion"
        v-model="formData.descripcion"
        :auto-resize="true"
        class="col-12"
        cols="100"
        :disabled="readOnly"
        label="Escriba aquí la descripción"
        rows="6"
        :rules="{ required, maxLength: maxLength(255) }"
      />
    </div>
  </AppFieldset>
</section>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { defineProps, computed, ref, defineEmits, watch } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { useEspeciesDineroInject } from '@/modules/global/composables/useEspeciesDinero'
import { requestUtil } from '@/utils'

const {
  familiaEspecies, tipoEspecies, ambitoEspecie, mantenedor_getFamiliaEspecies,
  mantenedor_getAmbitoEspecie, mantenedor_getTiposEspecies,
  mantenedor_getCodigoAmbitoEspecieById
} = useMantenedorStore()

const listaTiposEspecie = computed(() => {
  return tipoEspecies.value.filter((t) => t.idPadre === formData.familiaEspecie)
})

const { especiesDineroInject: formData } = useEspeciesDineroInject()
const { mantenedor_getCodigoFamiliaEspecie } = useMantenedorStore()

const { required, maxLength } = useFormValidation()

defineProps({
  readOnly: Boolean
})

const emit = defineEmits(['familia-especie'])

const loadingTipoEspecie = ref(false)

watch(() => formData.ambitoEspecie,
  () => { if (mantenedor_getCodigoAmbitoEspecieById(formData.ambitoEspecie) === '4') formData.nue = 'Sin Información' })

watch(() => formData.familiaEspecie,
  () => emit('familia-especie', codigoEspecie(formData.familiaEspecie)))

function resetNue () {
  formData.nue = ''
}
function codigoEspecie (idTipoEspecie) {
  return mantenedor_getCodigoFamiliaEspecie(idTipoEspecie)
}
function getTiposByIdFamilia () {
  codigoEspecie()
  loadingTipoEspecie.value = true
  formData.idTipoEspecie = null
  const payload = {
    id: formData.familiaEspecie
  }
  requestUtil({
    action: mantenedor_getTiposEspecies,
    payload,
    resolve: () => {
      loadingTipoEspecie.value = false
    }
  })
}
</script>
