<template>
<section>
  <hr class="mb-4">
  <div class="grid">
    <div class="col-12 flex flex-wrap align-items-center mb-4">
      <i class="pi pi-exclamation-triangle ml-1 mr-2 text-2xl" />
      <p class="text-lg">
        <strong>Se Concluirá Agrupación de Causa</strong>
      </p>
    </div>

    <div class="px-3 col-12">
      <div class="flex flex-column">
        <p class="mb-2">
          <strong>RUC: </strong>{{ data?.ruc }}
        </p>
        <p class="mb-2">
          <strong>Número de intervinientes: </strong>{{ data?.numeroIntervinientes }}
        </p>
        <p class="mb-2">
          <strong>Causa Principal: </strong>{{ causaPrincipal?.ruc }}
        </p>
        <p><strong>Causas a Agrupar: </strong>{{ rucsAAgrupar }}</p>
      </div>
    </div>
  </div>
</section>
</template>

<script setup>
import { inject, reactive, computed } from 'vue'

const dialogRef = inject('dialogRef')

const data = reactive({
  ...dialogRef.value?.data
})

const causaPrincipal = computed(() => data?.causas?.find(c => c.esPrincipal))

const causasAAgrupar = computed(() => data?.causas?.filter(c => !c.esPrincipal))

const rucsAAgrupar = computed(() => {
  const rucs = []
  causasAAgrupar.value?.forEach(c => {
    rucs.push(c.ruc)
  })
  return rucs.join(', ')
})
</script>
