<template>
<section>
  <h4>RUCs creados exitosamente</h4>
  <AppFieldset
    class="col-12 mt-4"
    legend="Folios con Detenidos con RUC"
  >
    <AppDataTable
      id="folio-detenidos-ruc"
      class="col-12"
      :total-records="procedimientoConRucs.length"
      :value="procedimientoConRucs"
    >
      <Column header="Institución">
        <template #body="{ data }">
          {{ mantenedor_getNombreInstitucionesDenunciaById(data.institucion) ?? 'Sin Información' }}
        </template>
      </Column>
      <Column header="Folio">
        <template #body="{ data }">
          {{ data.folio }}
        </template>
      </Column>
      <Column header="RUC">
        <template #body="{ data }">
          {{ data.ruc }}
        </template>
      </Column>
      <Column header="Delito">
        <template #body="{ data }">
          {{ data.descripcionDelito }}
        </template>
      </Column>
      <Column header="Detenidos">
        <template #body="{ data }">
          {{ data.cantidadDetenidos }}
        </template>
      </Column>
      <Column header="Fecha Ingreso Folio">
        <template #body="{ data }">
          {{ dateTimeUtil.formatToFrontendWithTime(data.fechaIngresoFolio) }}
        </template>
      </Column>
      <Column header="Fiscal/Turno">
        <template #body="{ data }">
          {{ data.fiscalTurno.toUpperCase() }}
        </template>
      </Column>
      <Column header="PJUD">
        <template #body="{ data }">
          {{ data.pjudResponse.etapaProceso +' '+ data.pjudResponse.estadoProceso }}
        </template>
      </Column>
      <Column header="CRR Interconexión">
        <template #body="{ data }">
          {{ data.pjudResponse.crrIdInteconexion }}
        </template>
      </Column>
      <Column header="Error">
        <template #body="{ data }">
          {{ data.pjudResponse.codError +' '+ data.pjudResponse.descError }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>
<script setup>
import { dateTimeUtil } from '@/utils'

import { useMantenedorStore } from '@/modules/global/composables'
import { useStepDetenidosACDStore } from '@/modules/flagrancia/composables'

const { mantenedor_getNombreInstitucionesDenunciaById } = useMantenedorStore()
const { procedimientoConRucs } = useStepDetenidosACDStore()

</script>
