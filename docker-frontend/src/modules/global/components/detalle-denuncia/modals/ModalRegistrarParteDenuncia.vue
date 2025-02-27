<template>
<div class="">
  <span>
    <strong>Fecha/Hora Registro:</strong>
    {{ dateTimeUtil.formatToFrontendWithTime(registroParte.fechaHoraDenuncia) }}
  </span>
  <br>
  <br>
  <span>
    <strong>N° de Referencia o Carátula:</strong>
    {{ registroParte?.numeroDeReferencia }}
  </span>
  <br>
  <br>
  <span>
    <strong>Institución:</strong>
    {{ mantenedor_getNombreInstitucionesDenunciaById(registroParte?.unidadPolicialOrganismo) }}
  </span>
  <br>
  <br>
  <span>
    <strong>Documentos Recibidos:</strong>
    {{ totalDocRecibidos }}
  </span>
  <br>
  <br>
  <span>
    <strong>Documentos Faltantes:</strong>
    {{ totalDocFaltantes }}
  </span>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useOficinaPartesStore } from '@/modules/global/composables/useOficinaPartesStore'
import { dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getNombreInstitucionesDenunciaById } = useMantenedorStore()
const { registroParte, partes } = useOficinaPartesStore()

const totalDocFaltantes = computed(() => {
  let docFaltantes = 0
  partes.value.forEach((p) => {
    p.documentos.forEach((d) => {
      if (d.esDocumentoFaltante) {
        docFaltantes++
      }
    })
  })
  return docFaltantes
})

const totalDocRecibidos = computed(() => {
  let docsRecibidos = 0
  partes.value.forEach((p) => {
    p.documentos.forEach(() => {
      docsRecibidos++
    })
  })
  return docsRecibidos
})
</script>
<style scoped>
span {
  font-size: 1.1rem;
}
p {
  font-size: 1.1rem;
  padding-bottom: 1.5rem;
  line-height: 1.5rem;
  color: #ED7B0E;
}
</style>
