<template>
<main>
  <hr class="mb-5">
  <AppFieldset legend="Delito">
    <ul>
      <li class="col-12 md:col-6">
        <strong>Delito:</strong>
        {{ data?.delito?.tipoDelito || tipoDelito(data?.delito?.idTipoDelito) }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Cámara Vigilancia:</strong>
        {{ data?.informacionCamara?.existeCamara }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Fecha/Hora del Delito:</strong>
        {{ fechaHoraDelito(data) }}
      </li>
      <li class="col-12 md:col-6">
        <strong>Alerta:</strong>
        {{ data?.vif ? 'VIF' : 'Sin Alertas' }}
      </li>
    </ul>
  </AppFieldset>
  <AppFieldset legend="Relaciones">
    <TablaRelaciones :value="relacionesDelito" />
  </AppFieldset>
  <AppFieldset
    legend="Ubicacion del Delito"
    no-margin-bottom
  >
    <section class="col-12 md:col-6">
      <ul class="flex flex-column w-full gap-3 px-0">
        <li>
          <strong>Dirección del Sitio del Suceso:</strong>
          {{ direccionDelito(data?.direccionDelito) }}
        </li>
        <li>
          <strong>Tipo de Lugar de Ocurrencia:</strong>
          {{ mantenedor_getDescripcionTipoLugarOcurrenciaById(data?.lugarDelito?.tipoLugarOcurrencia) || 'No definido' }}
        </li>
        <li>
          <strong>Lugar Específico de Ocurrencia:</strong>
          {{ data?.lugarDelito?.lugarEspecificoOcurrencia || 'No definido' }}
        </li>
        <li>
          <strong>Presenta Especies y/o Dinero:</strong>
          {{ cantidad?.especies ? 'Si' : 'No' }}
        </li>
        <li>
          <strong>Presenta Documentos:</strong>
          {{ cantidad?.documentos ? 'Si' : 'No' }}
        </li>
      </ul>
    </section>
    <section class="col-12 md:col-6">
      <MapInput
        :auto-complete="false"
        class="w-full"
        :draggable="false"
        :height="'h-20rem'"
        :position="direccionCoords"
        :zoom="18"
      />
    </section>
  </AppFieldset>
</main>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import { dateTimeUtil } from '@/utils'
import { computed, defineProps } from 'vue'
import { useFichaCausaData } from '../../composables'
import TablaRelaciones from '../informacion-causa/TablaRelaciones.vue'

const props = defineProps({
  data: propTypes.object
})

const { mantenedor_getNombreTipoDelito, mantenedor_getDescripcionComunasById, mantenedor_getDescripcionRegionById, mantenedor_getDescripcionTipoLugarOcurrenciaById } = useMantenedorStore()

const { cantidad, relaciones } = useFichaCausaData()

const relacionesDelito = computed(() => {
  return relaciones?.data.filter((r) => r.idDetalleHechoDelictual === props.data?.idDetalleHechoDelictual)
})

const direccionCoords = computed(() => {
  return {
    latitude: props?.data?.direccionDelito?.latitud,
    longitude: props?.data?.direccionDelito?.longitud
  }
})

function tipoDelito (idTipoDelito) {
  return mantenedor_getNombreTipoDelito(idTipoDelito)
}

function fechaHoraDelito (delito) {
  if (delito?.fechaHoraRango) {
    const inicio = formatDate(delito?.fechaHoraDelitoInicio)
    const fin = formatDate(delito?.fechaHoraDelitoFin)
    return `Desde ${inicio}, hasta ${fin}`
  }

  return formatDate(delito?.fechaOcurrencia)
}

function direccionDelito (direccionDelito) {
  const comuna = mantenedor_getDescripcionComunasById(direccionDelito?.comuna)
  const region = mantenedor_getDescripcionRegionById(direccionDelito?.region)

  return `${direccionDelito?.calle} ${direccionDelito?.numero}, ${comuna}, ${region}`.trim()
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>
<style scoped lang="scss">
li {
  list-style: none;
}
</style>
