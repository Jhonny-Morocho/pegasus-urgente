<template>
<div class="flex flex-column">
  <p><strong>RUC: </strong>{{ causa?.ruc }}</p>
  <p><strong>Dias sin actividad: </strong>{{ causa?.diasInactividad }}</p>
  <p><strong>Tarea: </strong>{{ causa?.tarea }}</p>
</div>
</template>

<script setup>
import { reactive } from 'vue'

const causa = reactive({
  ruc: '',
  diasInactividad: '',
  tarea: ''
})
</script>
