<template>
<section>
  <ResumenCausa
    :causa="resumenCausa"
    title="Resumen Causa"
  />
  <Relaciones :relaciones="relaciones" />
  <AgregarDocumentoResolucionTribunal v-if="esOtrasSolicitudes" />

  <AppBtnNextTeleported
    :label="!esOtrasSolicitudes ? 'Elaborar Escrito' : 'Agregar Medidas Cautelares'"
    @click="handleNextStep"
  />
</section>
</template>

<script setup>
import ResumenCausa from '@/modules/global/components/solicitudes/ResumenCausa.vue'
import Relaciones from '@/modules/global/components/solicitudes/Relaciones.vue'
import relaciones from '@/data/gestorSolicitudes/relaciones.json'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import AgregarDocumentoResolucionTribunal from '@/modules/solicitudes/components/otro-tipo/AgregarDocumentoResolucionTribunal.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, reactive } from 'vue-demi'

const router = useRouter()
const route = useRoute()
const esOtrasSolicitudes = computed(() => {
  if (route.path === '/solicitudes/otro-tipo/resumen-relacion') {
    return true
  }
})
const resumenCausa = reactive({
  ruc: 'ruc',
  nombre: 'nombre',
  reservada: 'reservada',
  fecha: 'fecha',
  fiscalAsignado: 'fiscalAsignado',
  fiscaliaLocal: 'fiscaliaLocal',
  estadoRelacion: 'estadoRelacion',
  etapaRelacion: 'etapaRelacion',
  estadoCausa: 'estadoCausa',
  tipoDenuncia: 'tipoDenuncia',
  fechaAsignacion: 'fechaAsignacion',
  fechaFormalizacion: 'fechaFormalizacion',
  plazoInvestigacion: 'plazoInvestigacion',
  fechaPreinscripcion: 'fechaPreinscripcion',
  procesoCausa: 'procesoCausa',
  audienciasProgramadas: 'audienciasProgramadas'
})

function handleNextStep () {
  if (route.path === '/solicitudes/comunicacion/resumen-relacion') {
    router.push({ name: 'solicitudDeComunicacionEleborarEscrito' })
  } else if (route.path === '/solicitudes/otro-tipo/resumen-relacion') {
    router.push({ name: 'solicitudesOtroTipoMedidasCautelares' })
  } else if (route.path === '/solicitudes/autorizacion-de-diligencias/resumen-relacion') {
    router.push({ name: 'solicitudAutorizacionDiligenciaResumenRelacion' })
  }
}
</script>
