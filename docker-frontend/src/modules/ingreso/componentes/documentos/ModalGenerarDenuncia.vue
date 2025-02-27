<template>
<section>
  <div>
    <hr class="mb-5">
    <h3 class="mb-4">
      RUC: {{ ruc }}
    </h3>
    <h3 class="mb-4">
      Institución que Recibe denuncia: <span v-if="identificacionDenuncia?.idOrigen">{{ identificacionDenuncia.idOrigen }}</span>
      <span v-else>Ministerio Público</span>
    </h3>
    <h3 class="mb-4">
      Medio de recepción: <span v-if="identificacionDenuncia?.idMedioRecepcion">{{ identificacionDenuncia?.idMedioRecepcion }}</span>
      <span v-else>Físico / Electrónico</span>
    </h3>
    <h3 class="mb-4">
      Fiscalía:
      <span v-if="identificacionDenuncia?.idFiscaliaMantenedor">{{ mantenedor_getNombreFiscaliaById(identificacionDenuncia?.idFiscaliaMantenedor) }}</span>
      <span v-else>{{ mantenedor_getNombreFiscaliaById(identificacionDenuncia?.idFiscalia) }}</span>
    </h3>
    <h3 class="mb-4">
      Nombre de Usuario: <span>{{ $userAuth?.name }}</span>
    </h3>
    <h3 class="mb-4">
      Fecha / Hora Creación: <span>{{ dateTimeUtil.formatToFrontendWithTime(new Date()) }}</span>
    </h3>
    <h3 class="mb-4">
      ID Único Denuncia: <span>{{ identificacionDenuncia?.identificadorUnicoDenuncia }}</span>
    </h3>
    <h3 class="mb-4">
      Especie y Dinero: <span>{{ especies?.length > 0 ? especies?.length : 'No Presenta' }} ítem(s)</span>
    </h3>
    <h3>
      Documentos Asociados: <span>{{ documentos?.length > 0 ? especies?.length : 'No Presenta' }} dcto.(s)</span>
    </h3>
  </div>
</section>
</template>

<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { defineProps, onMounted } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useDocumentoStore, useMantenedorStore, useEspeciesDineroStore } from '@/modules/global/composables'
import { useAppGlobalProperties } from '@/modules/common/composables'
import { useCrearCausaStore } from '@/modules/ingreso/composables'

const { mantenedor_getNombreFiscalia, mantenedor_getNombreFiscaliaById } = useMantenedorStore()
const { ruc } = useCrearCausaStore()
const { especies } = useEspeciesDineroStore()
const { documentos } = useDocumentoStore()
// VALUES
const { $userAuth } = useAppGlobalProperties()

function getMantenedor () {
  requestUtil({ action: mantenedor_getNombreFiscalia })
}
onMounted(() => getMantenedor())

defineProps({
  identificacionDenuncia: {
    type: Object,
    default: () => null
  }
})
// LOGIC
</script>

<style scoped>
span {
  font-weight: 400;
}
</style>
