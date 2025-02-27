<template>
<AppFieldset
  class="w-full"
  legend="Materializa Fiscal"
>
  <div class="col-12 flex">
    <div>
      <p class="mb-3">
        <strong>Fiscalía: </strong> {{ fiscalia }}
      </p>
      <p><strong>Fiscal Asignado: </strong> {{ fiscalAsignado }}</p>
    </div>
  </div>
  <AppDropdown
    id="tribunalesFiscal"
    v-model="formData.idTribunal"
    class="col-3 p-fluid"
    label="Tribunales"
    option-label="descripcion"
    option-value="id"
    :options="juzgados"
    placeholder
    :retrieve-data-action="mantenedor_getjuzgados"
    :rules="{ required }"
    show-clear
  />
  <div class="col-12">
    <AppFieldset legend="Elaborar Escrito">
      <div class="p-inputgroup">
        <AppDropdown
          id="materializa-audiencia"
          v-model="formData.idPlantillaEscritoFiscal"
          class="col-12 md:col-4"
          label="Plantilla"
          option-label="descripcion"
          option-value="value"
          :options="plantillaOptions"
          placeholder
          show-clear
          @change="
            getPlantillaEscritoFiscal(formData.idPlantillaEscritoFiscal)
          "
        />
      </div>

      <Editor
        id="editor-elaborar-escrito-materializacion"
        v-model="formData.materializacionTextoFiscal"
        class="col-12 my-4"
        editor-style="height: 256px"
      />
      <div class="my-4 flex justify-content-between w-full">
        <Button
          class="p-button-outlined"
          icon="pi pi-file"
          icon-pos="right"
          label="Vista Previa"
          style="width: 256px"
          @click="vistaPreviaMaterializacion"
        />
        <Button
          class="btn-form"
          icon="pi pi-save"
          icon-pos="right"
          label="Guardar Escrito"
          style="width: 256px"
          @click="guardarEscrito()"
        />
      </div>
    </AppFieldset>
  </div>
</AppFieldset>
</template>
<script setup>
import { defineProps, defineEmits, inject, computed } from 'vue'

import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import ModalVerEscritos from '@/modules/global/components/modals/ModalVerEscritos.vue'

import { propTypes } from '@/modules/common/types'
import { useAppDialog, useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'

const { mantenedor_getjuzgados, juzgados } = useMantenedorStore()
const { resumenCausa } = useSolicitudesStore()
const { required } = useFormValidation()
const { launchDialog } = useAppDialog()

defineProps({
  plantillaOptions: propTypes.array
})

const fiscalAsignado = computed(
  () =>
    resumenCausa.value?.fiscalAsignado ||
    'Sin información'
)
const fiscalia = computed(
  () =>
    resumenCausa.value?.fiscalia ||
    'Sin información'
)

const formData = inject('materializar-solicitud')

const emit = defineEmits(['get-plantilla', 'guardar-escrito'])

function getPlantillaEscritoFiscal (idPlantilla) {
  emit('get-plantilla', idPlantilla)
}

function vistaPreviaMaterializacion () {
  launchDialog({
    component: ModalVerEscritos,
    header: 'Ver Escrito',
    props: { data: formData.value?.materializacionTextoFiscal },
    width: '67%',
    cancelLabel: 'Cerrar'
  })
}
function guardarEscrito () {
  emit('guardar-escrito', formData.value?.materializacionTextoFiscal)
}
</script>
