<template>
<AppFieldset
  legend="Direcciones y Contacto"
>
  <AppDataTable
    id="dataTableDocumentos"
    class="w-full"
    responsive-layout="scroll"
    :value="direccionContacto"
  >
    <Column header="Tipo Dirección">
      <template #body="{ data }">
        {{ data.tipoDireccion }}
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ data.direccion }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ data.comuna }}
      </template>
    </Column>
    <Column header="Región">
      <template #body="{ data }">
        {{ data.region }}
      </template>
    </Column>
    <Column header="Teléfono">
      <template #body="{ data }">
        {{ data.telefono }}
      </template>
    </Column>
    <Column header="Correo Electrónico">
      <template #body="{ data }">
        {{ data.email }}
      </template>
    </Column>
  </AppDataTable>
</AppFieldset>
</template>
<script setup>
import direccionContacto from '@/data/gestorSolicitudes/direccionContacto.json'
</script>
