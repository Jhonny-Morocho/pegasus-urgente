<template>
<div class="col-12">
  <LoaderSkeleton v-if="isLoading" />
  <section
    v-if="propuesta?.seguirlinea && !isLoading"
    class="grid px-4"
  >
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Propuesta de Asignacion: </strong>
        {{ propuestaPreclasificador(propuesta?.decisionAsignacion) }}
      </li>
      <li class="capitalize">
        <strong>Complejidad: </strong>
        {{ propuesta?.seguirlinea?.idComplejidad }}
      </li>
      <li>
        <strong>Especialidad: </strong>
        {{ especialidadFiscalia(propuesta?.seguirlinea?.idEspecialidad) }}
      </li>
      <li v-if="nombreFiscal">
        <strong>Fiscal: </strong>
        {{ nombreFiscal }}
      </li>
    </ul>
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Comentario: </strong>
        <p>{{ propuesta?.seguirlinea?.comentario }}</p>
      </li>
    </ul>
  </section>
  <section
    v-if="propuesta?.transferir"
    class="grid px-4"
  >
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Propuesta de Asignacion: </strong>
        {{ propuestaPreclasificador(propuesta?.decisionAsignacion) }}
      </li>
      <li>
        <strong>Motivo Transferencia: </strong>
        {{ motivoTransferencia(propuesta?.transferir?.idMotivoTransferencia) }}
      </li>
      <li>
        <strong>Fiscalía Competente: </strong>
        {{ fiscaliaCompetente(propuesta?.transferir?.idFiscaliaDestino) }}
      </li>
    </ul>
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Comentario: </strong>
        <p>{{ propuesta?.transferir?.comentario }}</p>
      </li>
    </ul>
  </section>
  <section
    v-if="propuesta?.agruparCausa"
    class="grid px-4"
  >
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Propuesta de Asignacion: </strong>
        {{ propuestaPreclasificador(propuesta?.decisionAsignacion) }}
      </li>
      <li>
        <strong>Motivo Agrupación: </strong>
        {{ motivoAgrupacion(propuesta?.agruparCausa?.idMotivoAgrupacion) }}
      </li>
      <li>
        <strong>Causa Principal: </strong>
        {{ causaPrincipal(propuesta?.agruparCausa?.causas) }}
      </li>
      <li>
        <strong>Causas a Agrupar: </strong>
        {{ causasAgrupar(propuesta?.agruparCausa?.causas) }}
      </li>
    </ul>
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Comentario: </strong>
        <p>{{ propuesta?.agruparCausa?.comentario }}</p>
      </li>
    </ul>
  </section>
  <section
    v-if="propuesta?.desestimar"
    class="grid px-4"
  >
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Propuesta de Asignacion: </strong>
        {{ propuestaPreclasificador(propuesta?.decisionAsignacion) }}
      </li>
      <li>
        <strong>Tipo de Término: </strong>
        {{ tipoTermino(propuesta?.desestimar?.idTipoTermino) }}
      </li>
      <li>
        <strong>Motivo Desistimiento: </strong>
        {{ motivoDesistimiento(propuesta?.desestimar?.idMotivo) }}
      </li>
    </ul>
    <ul class="col-12 md:col-6 list">
      <li>
        <strong>Comentario: </strong>
        <p>{{ propuesta?.desestimar?.comentario }}</p>
      </li>
    </ul>
  </section>
</div>
</template>
<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { propTypes } from '@/modules/common/types'
import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const props = defineProps({
  propuesta: propTypes.object
})

const {
  fiscalias,
  mantenedor_getTiposTermino,
  mantenedor_getMotivosDesestimacion,
  mantenedor_getEspecialidadesFiscalia,
  mantenedor_getMotivosTransferencia,
  mantenedor_getMotivoAgrupacion,
  mantenedor_getDescripcionMotivoDesestimacionById,
  mantenedor_getDescripcionTipoTerminoById,
  mantenedor_getDescripcionEspecialidadFiscalia,
  mantenedor_getNombreMotivoTransferenciaById,
  mantenedor_getNombreMotivoAgrupacionById,
  mantenedor_getFiscalById,
  mantenedor_getFiscalias
} = useMantenedorStore()

// eslint-disable-next-line no-unused-vars
const nombreFiscal = ref('')
const isLoading = ref(false)

function propuestaPreclasificador (value) {
  switch (value) {
    case 'clasificacion':
      return 'Seguir Linea Investigativa'
    case 'desestimacion':
      return 'Desestimar Causa'
    case 'transferencia':
      return 'Transferir Causa'
    case 'agrupacion':
      return 'Agrupar Causas'
    default:
      return 'Sin Definir'
  }
}

function motivoDesistimiento (value) {
  return mantenedor_getDescripcionMotivoDesestimacionById(value)
}

function tipoTermino (value) {
  return mantenedor_getDescripcionTipoTerminoById(value)
}

function especialidadFiscalia (value) {
  if (value === '-1') {
    return 'Sin Especialidad'
  }
  return mantenedor_getDescripcionEspecialidadFiscalia(value)
}

function motivoTransferencia (value) {
  return mantenedor_getNombreMotivoTransferenciaById(value)
}

function motivoAgrupacion (value) {
  return mantenedor_getNombreMotivoAgrupacionById(value)
}

function fiscaliaCompetente (value) {
  const fiscaliaFound = fiscalias.value.find((fiscalia) => fiscalia.id === value)
  return fiscaliaFound?.descripcion
}

function causaPrincipal (causas) {
  const principal = causas?.find(c => c.esPrincipal)
  return principal.idCausa
}

function causasAgrupar (causas) {
  const agrupar = causas?.filter(c => !c.esPrincipal)
  return agrupar.map(a => a.idCausa).join(', ')
}

// eslint-disable-next-line no-unused-vars
function getNombreFiscal () {
  requestUtil({
    action: mantenedor_getFiscalById,
    payload: {
      idFiscal: props.propuesta?.seguirlinea?.idFiscalAsignado
    },
    resolve: (data) => {
      nombreFiscal.value = data?.nombresCompletos
    },
    loader: (loadState) => { isLoading.value = loadState }
  })
}

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getFiscalias })
  requestUtil({ action: mantenedor_getTiposTermino })
  requestUtil({ action: mantenedor_getMotivosDesestimacion })
  requestUtil({ action: mantenedor_getEspecialidadesFiscalia })
  requestUtil({ action: mantenedor_getMotivosTransferencia })
  requestUtil({ action: mantenedor_getMotivoAgrupacion })
}

onMounted(() => {
  getDataMantenedor()
  if (props?.propuesta?.seguirlinea) {
    getNombreFiscal()
  }
})
</script>
<style lang="scss" scoped>
.list{
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
