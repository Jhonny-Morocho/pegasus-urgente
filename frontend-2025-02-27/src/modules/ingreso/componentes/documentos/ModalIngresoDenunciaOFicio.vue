<template>
<div>
  <hr class="mb-5">
  <span> <strong>Institución que recibe la denuncia:</strong> Fiscalía </span>
  <br>
  <br>
  <span>
    <strong>Medio de recepción:</strong>
    {{ identificacionDenuncia?.idMedioRecepcion }}
  </span>
  <br>
  <br>
  <span>
    <strong>Identificador Único de Denuncia: </strong>
    {{ identificacionDenuncia?.identificadorUnicoDenuncia }}
  </span>
  <br>
  <br>
  <span>
    <strong>Tipo denuncia: </strong>{{ tipoDenunciaObject.codigo === '3' ? 'Oficio' : 'Física' }}
  </span>
  <br>
  <br>
  <span>
    <strong>Fiscalía: </strong>{{
      mantenedor_getNombreFiscaliaById(identificacionDenuncia?.idFiscalia)
    }}
  </span>
  <br>
  <br>
  <span>
    <strong>Fecha/Hora Parte/Denuncia: </strong>
    {{ dateTimeUtil.formatToFrontendWithTime(new Date()) }}
  </span>
  <br>
  <br>
  <span>
    <strong>Especie y Dinero: </strong> {{ especies?.length }} ítem(s)
  </span>
  <br>
  <br>
  <span>
    <strong>Documentos Asociados: </strong> {{ documentos?.length }} dcto.(s)
  </span>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import {
  useDocumentoStore,
  useMantenedorStore,
  useEspeciesDineroStore
} from '@/modules/global/composables'
import { useIdentificacionDenunciaStore } from '@/modules/ingreso/composables'

import { dateTimeUtil } from '@/utils'

const { mantenedor_getNombreFiscalia, mantenedor_getNombreFiscaliaById } =
  useMantenedorStore()
const { tipoDenunciaObject } = useIdentificacionDenunciaStore()

// UTILITIES
const { especies } = useEspeciesDineroStore()
const { documentos } = useDocumentoStore()

mantenedor_getNombreFiscalia()
defineProps({
  identificacionDenuncia: {
    type: Object,
    required: true
  }
})
</script>
<style scoped>
span {
  font-size: 1.15rem;
}
p {
  font-size: 1.15rem;
  padding-bottom: 1.5rem;
  line-height: 1.5rem;
  color: #ed7b0e;
}
</style>
