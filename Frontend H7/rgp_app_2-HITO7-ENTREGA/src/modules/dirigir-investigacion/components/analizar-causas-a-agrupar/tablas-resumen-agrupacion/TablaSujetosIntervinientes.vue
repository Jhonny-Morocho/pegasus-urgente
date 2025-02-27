<template>
<section>
  <AppDataTable
    v-bind="$attrs"
    id="tabla-sujetos"
  >
    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ getNombreTipoSujeto(data?.tipoSujeto) }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.numeroDocumento || '---' }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ parseNombreSujeto(data) || '---' }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{ data }">
        {{ data?.edad || '---' }}
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ parseDireccionSujeto(data?.direccion) || '---' }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ data?.direccion?.comuna || '---' }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getNombreTipoSujeto } = useMantenedorStore()

function parseNombreSujeto (sujeto) {
  let nombre = ''

  if (sujeto?.nombres) {
    nombre += sujeto.nombres
  }
  if (sujeto?.apellidoPaterno) {
    nombre += ' ' + sujeto.apellidoPaterno
  }
  if (sujeto?.apellidoMaterno) {
    nombre += ' ' + sujeto.apellidoMaterno
  }

  return nombre
}

function parseDireccionSujeto (direccion) {
  let dire = ''
  if (direccion?.calle) {
    dire += direccion.calle
  }
  if (direccion?.numeroCalle) {
    dire += ' ' + direccion.numeroCalle
  }

  return dire
}

function getNombreTipoSujeto (id) {
  if (id) {
    return mantenedor_getNombreTipoSujeto(id)
  } else {
    return ''
  }
}
</script>
