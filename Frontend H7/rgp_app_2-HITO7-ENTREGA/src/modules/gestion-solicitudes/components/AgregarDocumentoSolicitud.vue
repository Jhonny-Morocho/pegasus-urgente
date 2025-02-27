<template>
<AppFieldset
  class="w-full"
  legend="¿Desea agregar un documento a la solicitud?"
  :toggleable="true"
>
  <TablaDocumentos
    v-model="documentosSeleccionados"
    v-model:selection="documentosSeleccionados"
    :action-options="opciones"
    selection-mode
    :value="documentos"
  />
  <div class="ml-3 p-fluid mt-5">
    <p>
      ¿Desea adjuntar la Carpeta Investigativa?
    </p>
    <AppSelectButton
      id="archivo-provisional-consulta"
      v-model="form.carpetaInvestigativa"
      class="col-12"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false }
      ]"
    />
  </div>
</AppFieldset>
</template>
<script setup>
import { inject, ref } from 'vue'

import TablaDocumentos from '@/modules/gestion-solicitudes/components/tablas/TablaDocumentos.vue'

import { useDocumentoStore } from '@/modules/global/composables'

const { documentos } = useDocumentoStore()

const documentosSeleccionados = ref()
const form = inject('materializar-solicitud')

const opciones = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Imprimir',
        command: () => {
          console.log('a')
        }
      },
      {
        label: 'Descargar',
        command: () => {
          console.log('a')
        }
      },
      {
        label: 'Ver Documento',
        command: () => {
          console.log('a')
        }
      }
    ]
  }
])
</script>
