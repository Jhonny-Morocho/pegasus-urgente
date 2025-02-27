<template>
<AppFieldset legend="Tipo de Elementos Usados">
  <AppDropdown
    id="tipo-elemento-usado"
    v-model="formData.tipoElementoUsado"
    class="col-12"
    :disabled="readOnly"
    label="Tipo de Elementos Usados"
    option-label="descripcion"
    option-value="id"
    :options="mediosComisionDelitos"
    show-clear
    @change="getTipoElementoUsado"
  />
  <AppDropdown
    v-if="mantenedor_getCodigoMediosComisionDelitosById(formData.tipoElementoUsado) !== '9'"
    id="elemento-usado"
    v-model="formData.elementoUsado"
    class="col-12 mb-0"
    :disabled="readOnly || !formData.tipoElementoUsado"
    label="Elementos Usados"
    :loading="elementosUsadosLoading"
    option-label="descripcion"
    option-value="id"
    :options="tipoElementoUsado"
    show-clear
  />
  <AppInput
    v-if="mantenedor_getCodigoMediosComisionDelitosById(formData.tipoElementoUsado) === '9'"
    id="otro-elemento-usado"
    v-model="formData.otroElementoUsado"
    class="col-12 mb-0"
    :disabled="readOnly"
    label="Otro Elemento Usado"
  />
</AppFieldset>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useDelitoInject, useMantenedorStore } from '@/modules/global/composables/'
import { requestUtil } from '@/utils'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject

const { mediosComisionDelitos, mantenedor_getTiposMediosComisionDelito, tipoElementoUsado, mantenedor_getTiposElementosUsadoByIdPadre, mantenedor_getCodigoMediosComisionDelitosById } = useMantenedorStore()

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposMediosComisionDelito })
}
getDataMantenedor()

const elementosUsadosLoading = ref(false)

async function getTipoElementoUsado (_idPadre) {
  if (formData.tipoElementoUsado) {
    formData.otroElementoUsado = ''
    const params = {
      'id-tipo-elemento': formData.tipoElementoUsado
    }
    requestUtil({
      action: mantenedor_getTiposElementosUsadoByIdPadre,
      payload: { params },
      loader: (l) => {
        elementosUsadosLoading.value = l
      }
    })
  } else resetElemento()
}
const resetElemento = () => {
  formData.elementoUsado = ''
  formData.otroElementoUsado = ''
}
</script>
