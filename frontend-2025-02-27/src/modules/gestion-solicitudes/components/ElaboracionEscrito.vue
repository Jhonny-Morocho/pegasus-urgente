<template>
<AppFieldset
  class="w-full"
  legend="Elaboración de Escrito"
>
  <div class="col-12 flex">
    <div class="col-6">
      <strong>Fiscalia:</strong> {{ fiscalia }}
    </div>
    <div class="col-6">
      <strong>Fiscal Asignado:</strong> {{ fiscalAsignado }}
    </div>
  </div>
  <AppDropdown
    id="tribunales"
    v-model="form.tribunal"
    class="col-3 p-fluid"
    label="Tribunales"
    option-label="descripcion"
    option-value="id"
    :options="juzgados"
    :rules="{ required }"
  />
  <AppFieldset
    class="w-full mt-3"
    legend="Escrito de Solicitud"
  >
    <RelatoEditor
      can-edit
      :is-loading-plantilla="isLoading"
      :plantilla-options="plantillaOptions"
      :relato="relatoResultado"
      @editor-relato:generar-plantilla="generarPlantilla"
      @editor-relato:guardar-relato="guardarRelato"
    />
  </AppFieldset>
</AppFieldset>
</template>
<script setup>
import { inject, ref, defineProps, onMounted } from 'vue'
import RelatoEditor from '@/modules/global/components/relato-del-hecho/EditorRelato.vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const { required } = useFormValidation()
const { toastSuccess } = useAppToast()

const { juzgados, mantenedor_getjuzgados } = useMantenedorStore()

const props = defineProps({
  injectKey: propTypes.string,
  fiscalia: propTypes.string,
  fiscalAsignado: propTypes.string
})

onMounted(() => {
  requestUtil({
    action: mantenedor_getjuzgados
  })
})

const form = inject(props.injectKey)
const isLoading = ref(false)

const relatoResultado = ref()

function guardarRelato (relato) {
  form.relato = relato
  toastSuccess('Relato guardado con éxito')
}

function generarPlantilla (idPlantilla) {
  relatoResultado.value = plantillaOptions.find(
    (plantilla) => plantilla.idPlantilla === idPlantilla
  )
}

const plantillaOptions = [
  {
    idPlantilla: 1,
    labelPlantilla: 'Ejemplo plantilla 1',
    relato: `<p>Ejemplo plantilla 1</p>`
  },
  {
    idPlantilla: 2,
    labelPlantilla: 'Ejemplo plantilla 2',
    relato: '<p>Ejemplo plantilla 2</p>'
  }
]
</script>
