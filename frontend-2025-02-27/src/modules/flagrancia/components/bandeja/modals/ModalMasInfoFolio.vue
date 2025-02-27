<template>
<div class="grid">
  <div class="grid col-12 flex flex-row">
    <div class="col-6 flex flex-column">
      <p class="mb-3">
        <strong>Detenidos Pendientes: </strong>{{ procedimiento?.antecedentes ? 'Si' : 'No' }}
      </p>
      <p class="my-3">
        <strong>Detenidos ACD: </strong>{{ procedimiento?.antecedentes?.length ? 'Si' : 'No' }}
      </p>
      <p class="my-3">
        <strong>Imputados: </strong>{{ procedimiento?.imputados?.length ? 'Si' : 'No' }}
      </p>
      <p class="mt-3 mb-2">
        <strong>Lesionados: </strong>{{ procedimiento?.existenLesionados ? 'Si' : 'No' }}
      </p>
      <p class="mt-3 my-3">
        <strong>Fallecidos: </strong>{{ procedimiento?.existenFallecidos ? 'Si' : 'No' }}
      </p>
    </div>
    <div class="flex flex-column">
      <p class="mb-3">
        <strong>Origen: </strong> APP
      </p>
      <p class="my-3">
        <strong>Institución: </strong>{{ procedimiento?.institucion ?? 'N/A' }}
      </p>
      <p class="my-3">
        <strong>Funcionario Responsable: </strong>{{ procedimiento?.nombreResponsable ?? 'N/A' }}
      </p>
      <p class="mt-3 mb-2">
        <strong>Audio: </strong>{{ procedimiento?.audio ?? 'N/A' }}
      </p>
      <p class="mt-3 my-3">
        <strong>Documentos: </strong>{{ procedimiento?.documentos ?? 'N/A' }}
      </p>
    </div>
  </div>
</div>
</template>

<script setup>
import { defineProps } from 'vue'

import { propTypes } from '@/modules/common/types'

defineProps({
  procedimiento: propTypes.object
})
</script>
