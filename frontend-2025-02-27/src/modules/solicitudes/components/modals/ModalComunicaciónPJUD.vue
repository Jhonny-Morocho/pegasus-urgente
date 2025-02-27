<template>
<hr>
<main class="p-3">
  <section
    v-if="success"
    class="col-12"
  >
    <div class="flex align-items-center justify-content-start pl-1">
      <div class="p-3">
        <i class="pi text-5xl mx-2 pi-check-circle text-green-400" />
      </div>
      <p class="text-lg font-bold">
        La solicitud ha sido enviada con éxito
      </p>
    </div>
    <div class="w-full mt-3">
      <p><strong>CRR:</strong> {{ solicitudPJUD.crrActividad }}</p>
    </div>
  </section>

  <section
    v-else-if="failed"
    class="w-full"
  >
    <div class="flex align-items-center justify-content-start pl-1">
      <div class="p-3">
        <i class="pi text-5xl mx-2 pi-exclamation-triangle text-yellow-500" />
      </div>
      <p class="text-lg font-bold">
        {{ solicitudPJUD.observacionHito }}
      </p>
    </div>
    <div class="w-full mt-3">
      <p><strong>CRR:</strong> {{ solicitudPJUD.crrActividad }}</p>
    </div>
  </section>

  <section
    v-else
    class="w-full"
  >
    <div class="flex align-items-center justify-content-start pl-1">
      <div class="p-3">
        <i class="pi text-5xl mx-2 pi-exclamation-triangle text-yellow-500" />
      </div>
      <p class="text-lg font-bold">
        Solicitud al PJUD aún en proceso
      </p>
    </div>
    <div class="w-full mt-3">
      <p><strong>CRR:</strong> {{ solicitudPJUD.crrActividad }}</p>
    </div>
  </section>
</main>
</template>
<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  solicitudPJUD: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const success = computed(() => props.title.includes('enviada'))
const failed = computed(() => props.title.includes('Error'))

</script>
