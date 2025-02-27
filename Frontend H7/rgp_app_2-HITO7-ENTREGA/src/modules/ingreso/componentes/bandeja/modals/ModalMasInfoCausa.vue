<template>
<section>
  <div>
    <hr class="mb-6">
    <span class="mb-4">
      <strong>Código Tarea: </strong>{{ denuncia[0]?.codigoTarea }}
    </span>
    <br>
    <br>
    <span class="mb-4">
      <strong>RUT Imputado: </strong>{{ denuncia[0]?.rutImputado }}
    </span>
    <br>
    <br>
    <span class="mb-4">
      <strong>Estado Tarea: </strong>{{ denuncia[0]?.estadoTarea }}
    </span>
    <br>
    <br>
    <span class="mb-4">
      <strong>Tipo Denuncia: </strong>{{ denuncia[0]?.tipoDenuncia }}
    </span>
    <br>
    <br>
    <span class="mb-4">
      <strong>Fecha/Hora Asignación: </strong>{{ dateTimeUtil.formatToFrontendWithTime(denuncia[0]?.fechaHoraAsignacion) }}
    </span>
    <br>
    <br>
    <div class="flex flex-row">
      <div>
        <span class="mb-4">
          <strong>Lesionados: </strong>
        </span>
      </div>
      <div
        v-if="denuncia[0]?.existenHeridos === 'SI'"
        class="ml-2"
      >
        <i
          class="pi pi-check-circle"
          style="font-size: 1.2rem"
        />
      </div>
      <div v-else>
        NO
      </div>
    </div>
    <br>
    <span class="mb-4">
      <strong>Fallecidos: </strong>{{ denuncia[0]?.existenMuertos }}
    </span>
  </div>
</section>
</template>

<script setup>
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

defineProps({
  denuncia: {
    type: Object,
    default: () => null
  }
})

// LOGIC
</script>

<style lang="scss" scoped>
.icono-urgente {
  color: red;
}
span {
  font-size: 1.2rem;
}
</style>
