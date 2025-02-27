<template>
<div>
  <hr>
  <AppFieldset
    class="mt-5"
    legend="Georreferenciación Guardada"
    no-margin-bottom
  >
    <TablaGeorreferenciacionGuardadas
      :value="georreferenciacionGuardadas"
      @georreferencia-guardada:eliminar-georreferencia="deleteGeorreferenciacion"
    />
  </AppFieldset>
</div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import TablaGeorreferenciacionGuardadas from '@/modules/dirigir-investigacion/components/resumen-causa/TablaGeorreferenciacionGuardadas.vue'

const dialogRef = inject('dialogRef')

const props = dialogRef.value?.data

const { dirigirInvestigacion_getGeorreferenciacionGuardadas } = useDirigirInvestigacionStore()

const georreferenciacionGuardadas = ref([])

async function getGeorreferencias () {
  requestUtil({
    action: dirigirInvestigacion_getGeorreferenciacionGuardadas,
    payload: {
      ruc: props?.ruc
    },
    resolve: (data) => {
      georreferenciacionGuardadas.value = data
    }
  })
}

async function deleteGeorreferenciacion (georreferencia) {
  console.log(georreferencia)
  //  requestUtil({
  //   action: dirigirInvestigacion_deleteCausaRelacionada,
  //   payload: {
  //     ruc: ruc.value,
  //     rucRelacionada: causa?.ruc
  //   },
  //   resolve: async () => {
  //      getGeorreferenciacionGuardada()
  //   }
  // })
}

onMounted(async () => {
  getGeorreferencias()
})
</script>
