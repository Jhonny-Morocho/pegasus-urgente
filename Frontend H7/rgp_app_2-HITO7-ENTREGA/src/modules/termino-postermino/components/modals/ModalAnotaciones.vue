<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Anotaciones"
    no-margin-bottom
  >
    <TablaAnotaciones :value="[]" />
    <section class="mt-4 col-12 grid p-fluid">
      <div class="col-9 m-0">
        <AppInput
          id="input-anotacion"
          v-model="detalleAnotacion"
          label="Anotación"
        />
      </div>
      <div class="col-3 m-0">
        <Button
          class="btn-form"
          :disabled="!detalleAnotacion"
          icon="pi pi-save"
          icon-pos="right"
          label="Agregar Anotación"
          @click="agregarAnotacion"
        />
      </div>
    </section>
  </AppFieldset>
</section>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { ref, defineProps, onMounted } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useAppGlobalProperties, useAppToast } from '@/modules/common/composables'
import TablaAnotaciones from '@/modules/global/components/historial-causa/TablaAnotaciones.vue'

const props = defineProps({
  ruc: propTypes.string
})

const { toastSuccess } = useAppToast()

const { $userName } = useAppGlobalProperties()

const detalleAnotacion = ref('')

async function agregarAnotacion () {
// USAR COMPOSABLE useAnotacionCausaStore CONTIENE ENDPOINTS NUEVOS
}

async function getAnotaciones () {
// Comentario para eliminar incidencia de SQ, esta function es un WIP
}

onMounted(async () => {
  getAnotaciones()
})
</script>
