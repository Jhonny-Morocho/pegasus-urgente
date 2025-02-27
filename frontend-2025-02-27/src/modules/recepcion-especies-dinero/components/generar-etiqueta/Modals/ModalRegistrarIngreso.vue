<template>
<div class="col-12 mx-2">
  <hr>
  <p class="my-2">
    RUC : {{ data.ruc }}
  </p>
  <p>NUE : {{ data.nue }} </p>
  <div
    v-if="rues.length > 0"
  >
    <p
      v-for="r in rues"
      :key="r"
      class="my-3"
    >
      <span>RUE : </span>{{ r.RUE }}
    </p>
  </div>
  <p class="my-2">
    Custodio : {{ nombreCustodio }}
  </p>
  <p>Fecha/Hora de Ingreso de Datos :{{ formatDate(fechaIngreso) }}</p>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import { useAppGlobalProperties } from '@/modules/common/composables'

const { $userName } = useAppGlobalProperties()
const nombreCustodio = $userName.value
const fechaIngreso = new Date()

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
defineProps({
  data: propTypes.array,
  rues: propTypes.array
})
</script>
