<template>
<section>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Historial de la Causa"
    no-margin-bottom
  >
    <TablaHistorialCausa
      read-only
      :value="historialCausa"
    />
  </AppFieldset>
</section>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { inject, onMounted, ref } from 'vue'
import TablaHistorialCausa from '@/modules/dirigir-investigacion/components/TablaHistorialCausa.vue'
import { useHistorialCausaStore } from '@/modules/global/composables'

const dialogRef = inject('dialogRef')
const props = dialogRef.value?.data

const { historialCausa } = useHistorialCausaStore()

const isLoading = ref(false)
const firstRecord = ref(0)

function getHistorial (pagination = undefined) {
  console.log('')
}

function verDocumento (data) {
  console.log('🚀 ~ file: ModalHistorialCausa.vue ~ line 52 ~ verDocumento ~ data', data)
}

onMounted(() => {
  getHistorial()
})
</script>
