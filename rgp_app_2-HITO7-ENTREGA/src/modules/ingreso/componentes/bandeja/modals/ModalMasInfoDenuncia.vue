<template>
<section>
  <div>
    <hr class="mb-6">
    <ul>
      <li><strong>Código Tarea: </strong>{{ denuncia?.tarea?.taskId }}</li>

      <li><strong>RUC: </strong>{{ denuncia?.data?.denuncia?.ruc }}</li>

      <li v-if="denuncia.tipoDenuncia === 'oficio'">
        <strong>RUT Imputado: </strong>{{ }}
      </li>
      <li v-if="denuncia.tipoDenuncia === 'oficio'">
        <strong>Estado Tarea: </strong>{{ }}
      </li>
      <li v-if="denuncia.tipoDenuncia === 'oficio'">
        <strong>Tipo Denuncia: </strong>{{ }}
      </li>
      <li v-if="denuncia.tipoDenuncia === 'oficio'">
        <strong>Fecha/Hora Asignación: </strong>{{ formatFecha(denuncia?.fechaHoraAsignacion) }}
      </li>
      <li v-if="denuncia.tipoDenuncia === 'Fisica'">
        <strong>Canal: </strong>{{ }}
      </li>
      <li v-if="denuncia.tipoDenuncia !== 'oficio' && denuncia?.tipoDenuncia !== undefined">
        <strong>RUT Denunciante: </strong>{{ }}
      </li>
      <li v-if="denuncia.tipoDenuncia !== 'oficio'">
        <strong>Nombre Denunciante: </strong>{{ denuncia?.data?.denuncia?.denunciante?.nombre }}
      </li>
      <li v-if="denuncia.tipoDenuncia !== undefined">
        <strong>Lesionados: </strong>
        <i
          :class="isHeridoMuerto(denuncia?.herido)"
          style="font-size: 1.2rem"
        />
      </li>
      <li v-if="denuncia.tipoDenuncia !== undefined">
        <strong>Fallecidos: </strong>
        <i
          :class="isHeridoMuerto(denuncia?.muerto)"
          style="font-size: 1.2rem"
        />
      </li>
    </ul>
  </div>
</section>
</template>

<script setup>
import { dateTimeUtil } from '@/utils'
import { defineProps } from 'vue'

defineProps({
  denuncia: {
    type: Object,
    default: () => null
  }
})

function isHeridoMuerto (value) {
  return value ? 'pi pi-check-circle' : 'pi pi-times-circle'
}

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

// LOGIC
</script>

<style lang="scss" scoped>
.icono-urgente {
  color: red;
}
ul {
  list-style: none;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
li {
  font-size: 1.2rem;
}
</style>
