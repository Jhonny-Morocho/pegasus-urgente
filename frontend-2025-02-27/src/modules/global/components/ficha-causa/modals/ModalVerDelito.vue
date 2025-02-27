<template>
<AppFieldset
  legend="Delito"
>
  <div class="col-12 md:col-6">
    <p class="mb-5">
      <span class="fontbold">Delito: </span>
      {{ getNombreTipoDelitoById(data?.delito.delito.idTipoDelito) }}
    </p>
    <p class="mt-2">
      <span class="fontbold">Fecha/Hora del delito: </span>
      {{ dateTimeUtil.formatToFrontendWithTime(data?.delito.fechaOcurrencia) }}
    </p>
  </div>
  <div class="col-12 md:col-6">
    <p class="mb-5">
      <span class="fontbold">Camara Vigilancia:</span>
      {{ data?.delito?.informacionCamara.existeCamara }}
    </p>
    <p>
      <span class="fontbold">Alerta: </span>
      {{ data?.delito?.vif ? 'VIF' : 'Sin alertas' }}
    </p>
  </div>
  <div class="col-12 md:col-4" />
</AppFieldset>
<AppFieldset
  legend="Relaciones"
>
  <div
    v-for="item in relacionesByDelito"
    :key="item"
    class="col-12 grid"
  >
    <p class="col-12 md:col-4">
      <span class="fontbold">Victima: </span>
      {{ item.nombreCompletoVictima ?? 'Sin Victima' }}
    </p>
    <p class="col-12 md:col-4">
      <span class="fontbold">Imputado: </span>
      {{ item.nombreCompletoImputado ?? 'Sin Imputado' }}
    </p>
    <p class="col-12 md:col-4">
      <span class="fontbold">Delito: </span>
      {{ item.nombreDelito }}
    </p>
  </div>
</AppFieldset>
<AppFieldset
  legend="Ubicación del Delito"
>
  <div class="col-12 md:col-5 mt-4 pl-5">
    <p class="mb-3">
      <span class="fontbold">Dirección del sitio del suceso: </span>
      {{ direccionDelito }}
    </p>
    <p class="mb-3">
      <span class="fontbold">Tipo de lugar de ocurrencia:</span>
      {{ data?.delito?.lugarDelito?.tipoLugarOcurrencia ? data?.delito?.lugarDelito?.tipoLugarOcurrencia : 'N/A' }}
    </p>
    <p class="mb-3">
      <span class="fontbold">Lugar especifico de ocurrencia:</span>
      {{ data?.delito?.lugarDelito?.lugarEspecificoOcurrencia ? data?.delito?.lugarDelito?.lugarEspecificoOcurrencia : 'N/A' }}
    </p>
    <p class="mb-3">
      <span class="fontbold">Presenta especies y/o dinero:</span>
      {{ especies ? "Si" : "No" }}
    </p>
    <p>
      <span class="fontbold">Presenta Documentos:</span>
      {{ documentos ? "Si" : "No" }}
    </p>
  </div>
  <div class="col-12 md:col-7 mt-0 pt-0">
    <MapInput
      :auto-complete="false"
      class="col-12 mt-0 pt-0"
      :draggable="false"
      :height="'h-28rem'"
      :position="coordenadasDelito"
      :zoom="18"
    />
  </div>
</AppFieldset>
</template>
<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
import { useDocumentoStore, useEspeciesDineroStore, useMantenedorStore, useRelacionesStore } from '@/modules/global/composables'

import { dateTimeUtil } from '@/utils'
const { relaciones } = useRelacionesStore()
const { especies } = useEspeciesDineroStore()
const { documentos } = useDocumentoStore()
const { mantenedor_getNombreTipoDelito } = useMantenedorStore()
const data = defineProps({
  delito: propTypes.object,
  coordenadasDelito: propTypes.object
})

const relacionesByDelito = relaciones.value.filter(r => r.idDetalleHechoDelictual === data.delito.idDetalleHechoDelictual)

const coordenadasDelito = {
  latitude: data.delito.direccionDelito.latitud,
  longitude: data.delito.direccionDelito.longitud
}

const direccionDelito = data.delito?.direccionDelito ? `${data.delito?.direccionDelito?.calle} ${data.delito?.direccionDelito?.numero}, ${data.delito?.direccionDelito?.comuna}, ${data.delito?.direccionDelito?.region}` : null

function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
}

</script>
<style scoped>
.fontbold{
  font-weight: bold
}
</style>
