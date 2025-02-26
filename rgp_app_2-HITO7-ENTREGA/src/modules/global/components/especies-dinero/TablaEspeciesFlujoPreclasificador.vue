<template>
<AppDataTable
  id="tabla-especies"
  v-bind="$attrs"
  class="col-12"
>
  <Column header="Familia Especie">
    <template #body="{ data }">
      {{ familiaEspecie(data?.familiaEspecie) ?? 'No esta el id en el mantenedor' }}
    </template>
  </Column>
  <Column header="Tipo Especie">
    <template #body="{ data }">
      {{ tipoEspecie(data?.idTipoEspecie) ?? data.idTipoEspecie }}
    </template>
  </Column>
  <Column header="Ámbito Especie">
    <template #body="{ data }">
      {{ ambitoEspecie(data?.ambitoEspecie) }}
    </template>
  </Column>
  <Column header="RUE">
    <template #body="{ data }">
      {{ data?.rue }}
    </template>
  </Column>
  <Column header="NUE">
    <template #body="{ data }">
      {{ data?.nue }}
    </template>
  </Column>
  <Column :header="isAsignacion ? 'Cantidad / Monto' : 'Cantidad'">
    <template #body="{ data }">
      {{ data?.cantidadEspecie }}
    </template>
  </Column>
  <Column header="Lugar de Almacenamiento">
    <template #body="{ data }">
      <p v-if="data.lugarAlmacenamiento">
        {{ data?.lugarAlmacenamiento }}
      </p>
      <p v-else>
        N/A
      </p>
    </template>
  </Column>
  <Column header="Solicitudes">
    <template #body="{ data }">
      <Button
        v-if="data.solicitudes"
        v-tooltip.top="tooltipFormat(data.solicitudes)"
        class="p-button-rounded p-button-outlined btn-color"
        icon="pi pi-copy"
      />
      <span v-else>NO</span>
    </template>
  </Column>
  <Column header="Indicadores">
    <template #body="{ data }">
      <Button
        v-if="tieneIndicadores(data)"
        v-tooltip.top="tooltipIndicadores(data)"
        class="p-button-rounded p-button-outlined btn-color"
        icon="pi pi-info"
      />
      <span v-else>NO</span>
    </template>
  </Column>
  <Column header="Destino">
    <template #body="{ data }">
      <p v-if="data.destino">
        {{ data?.destino }}
      </p>
      <p v-else>
        N/A
      </p>
    </template>
  </Column>
  <slot name="acciones" />
</AppDataTable>
</template>
<script setup>
import { defineProps } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

defineProps({
  isAsignacion: Boolean
})

const { mantenedor_getNombreFamiliaEspecie, mantenedor_getNombreTipoEspecie, mantenedor_getNombreAmbitoEspecie, mantenedor_getAllTiposEspecie } = useMantenedorStore()

function familiaEspecie (idFamiliaEspecie) {
  if (idFamiliaEspecie) {
    return mantenedor_getNombreFamiliaEspecie(idFamiliaEspecie)
  }
  return 'Sin Familia'
}

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

function ambitoEspecie (idAmbito) {
  return mantenedor_getNombreAmbitoEspecie(idAmbito) ?? 'Sin Ambito' // llegan ambitos con 0
}

function tooltipFormat (data) {
  return data.join('\n')
}

function tieneIndicadores (especies) {
  return especies?.indicadorArma || especies?.indicadorEvidencia || especies?.indicadorMedioUsadoCometerDelito
}

function tooltipIndicadores (especies) {
  const indicadores = []

  if (especies?.indicadorArma) {
    indicadores.push('* Arma')
  }
  if (especies?.indicadorEvidencia) {
    indicadores.push('* Evidencia')
  }
  if (especies?.indicadorMedioUsadoCometerDelito) {
    indicadores.push('* Medio Usado para Cometer Delito')
  }

  return tooltipFormat(indicadores)
}
</script>
<style lang="scss" scoped>
.btn-color {
  color: #fca149;
}
</style>
