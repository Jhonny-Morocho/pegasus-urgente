<template>
<AppFieldset legend="¿Es Hallazgo?">
  <AppSelectButton
    id="es-hallazgo"
    v-model="formData.esHallazgo"
    class="col-12 lg:col-6"
    :disabled="readOnly"
    option-label="descripcion"
    option-value="value"
    :options="[
      { descripcion: 'Si', value: true },
      { descripcion: 'No', value: false },
    ]"
    @change="resetHallazgo"
  />
  <AppDropdown
    id="viaInformacionAportada"
    v-model="formData.tipoHallazgo"
    class="col-12 mb-0"
    :disabled="!formData.esHallazgo || readOnly"
    label="Hallazgo de "
    option-label="descripcion"
    option-value="id"
    :options="tipoHallazgo"
    show-clear
  />
</AppFieldset>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDelitoInject } from '@/modules/global/composables/useDelito'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()
const { tipoHallazgo, mantenedor_getTipoHallazgo } = useMantenedorStore()
const formData = delitoInject

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTipoHallazgo })
}
getDataMantenedor()

const resetHallazgo = () => {
  formData.tipoHallazgo = ''
}

</script>
