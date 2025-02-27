<template>
<div class="grid w-full">
  <div class="col-12 md:col-6 pl-4">
    <p>
      <strong>Fecha/Hora Consulta: </strong>
      {{ dateTimeUtil.formatToFrontendWithTime(dataFiscal?.fechaSolicitud) }}
    </p>
    <p>
      <strong>Decisión de Término o Suspensión: </strong>{{ consultaTermino?.idTipoTermino ? 'Término' : 'No defindo' }}
    </p>
    <p>
      <strong>Tipo de Término o Suspensión: </strong>{{
        mantenedor_getDescripcionTipoTerminoById(
          consultaTermino?.idTipoTermino
        )
      }}
    </p>
    <p>
      <strong>Subtipo de Término o Suspensión: </strong>{{
        mantenedor_getDescripcionTipoSubterminoById(
          consultaTermino?.idSubTipoTermino
        )
      }}
    </p>
    <p>
      <strong>Nivel de Consulta: </strong>Requiere consulta al Fiscal Jefe
    </p>
  </div>
  <div
    v-if="dataFiscal?.texto"
    class="col-12 md:col-6 pr-4"
  >
    <p><strong>Motivo de Término o Suspensión: </strong></p>
    <p>{{ dataFiscal?.texto }}</p>
  </div>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const {
  mantenedor_getDescripcionTipoTerminoById,
  mantenedor_getDescripcionTipoSubterminoById
} = useMantenedorStore()

defineProps({
  consultaTermino: propTypes.object
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
