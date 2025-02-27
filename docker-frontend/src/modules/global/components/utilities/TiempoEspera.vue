<template>
<div class="flex text-left">
  <div class="mr-2">
    {{ tiempo }}
  </div>
  <div>
    <Button
      class="p-button-rounded p-button-raised"
      :class="alertaEspera"
      icon="pi pi-clock"
    />
  </div>
</div>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { computed, defineProps, onMounted, ref } from 'vue'

const props = defineProps({
  fecha: propTypes.string
})

const displayDays = ref(0)
const displayHours = ref(0)
const displayMinutes = ref(0)
const displaySeconds = ref(0)
const alertaEspera = ref('')

const _seconds = computed(() => 1000)
const _minutes = computed(() => _seconds.value * 60)
const _hours = computed(() => _minutes.value * 60)
const _days = computed(() => _hours.value * 24)

function setAlerta (tiempoEspera) {
  if (tiempoEspera < 16) {
    alertaEspera.value = 'p-button-success'
  }
  if (tiempoEspera >= 16 && tiempoEspera < 24) {
    alertaEspera.value = 'p-button-warning'
  }
  if (tiempoEspera >= 24) {
    alertaEspera.value = 'p-button-danger'
  }
}

const tiempo = computed(() => {
  return `${displayDays.value} Días, ${displayHours.value}:${displayMinutes.value}:${displaySeconds.value}hrs`
})

function formatNumber (num) {
  return num < 10 ? '0' + num : num
}

function showElapsed () {
  setInterval(() => {
    const now = new Date()
    const startTime = new Date(props.fecha)

    const distance = now.getTime() - startTime.getTime()

    const days = Math.floor(distance / _days.value)
    const hours = Math.floor((distance % _days.value) / _hours.value)
    const minutes = Math.floor((distance % _hours.value) / _minutes.value)
    const seconds = Math.floor((distance % _minutes.value) / _seconds.value)

    setAlerta(Math.floor(distance / _hours.value))

    displayDays.value = formatNumber(days)
    displayHours.value = formatNumber(hours)
    displayMinutes.value = formatNumber(minutes)
    displaySeconds.value = formatNumber(seconds)
  }, 1000)
}

onMounted(() => {
  showElapsed()
})
</script>
<style scoped>
* {
  transition: all 0.5s;
}

.p-button{
  cursor: default;
}
</style>
