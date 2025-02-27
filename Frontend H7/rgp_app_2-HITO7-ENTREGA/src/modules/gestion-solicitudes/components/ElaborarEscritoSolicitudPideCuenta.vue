<template>
<AppFieldset legend="Elaborar Escrito">
  <div class="p-inputgroup">
    <AppDropdown
      id="materializa-juzgados"
      v-model="formData.idPlantillaPideCuenta"
      class="col-12 md:col-4"
      label="Plantilla"
      option-label="name"
      option-value="value"
      :options="PlantillaPideCuenta"
      placeholder
      show-clear
      @change="getPlantillaPideCuenta(formData.idPlantillaPideCuenta)"
    />
  </div>

  <Editor
    id="editor-elaborar-escrito-materializacion"
    v-model="formData.editorPideCuenta"
    class="col-12 my-4"
    editor-style="height: 256px"
  />
  <div class="flex w-full justify-content-end">
    <div>
      <Button
        class="p-button-outlined px-6 mt-3"
        icon="pi pi-file"
        icon-pos="right"
        label="Vista Previa"
        @click="vistaPreviaMaterializacion"
      />
    </div>
  </div>
</AppFieldset>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import { useAppDialog } from '@/modules/common/composables'
import ModalVerEscritos from '@/modules/global/components/modals/ModalVerEscritos.vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  modelValue: propTypes.object
})

const emit = defineEmits(['update:modelValue', 'get-plantilla-pide-cuenta'])

const formData = ref(props.modelValue)

watch(formData.value, (newValues) => {
  emit('update:modelValue', newValues)
})
const { launchDialog } = useAppDialog()

const PlantillaPideCuenta = ref([
  {
    name: 'Plantilla 1',
    value: 1
  }
])

function getPlantillaPideCuenta (idPlantilla) {
  emit('get-plantilla-pide-cuenta', idPlantilla)
}

function vistaPreviaMaterializacion () {
  launchDialog({
    component: ModalVerEscritos,
    header: 'Ver Escrito',
    props: { data: formData.value?.editorPideCuenta },
    width: '67%',
    cancelLabel: 'Cerrar'
  })
}
</script>
