<template>
<AppDataTable
  id="redes-familiares"
  class="col-12"
  :value="tablaSentencias"
>
  <Column
    field="tipoRedFamiliar"
    header="Tipo "
  >
    <template #body="slotProps">
      {{ slotProps.data.tipoRedFamiliar }}
    </template>
  </Column>
  <Column
    field="numeroDocumento"
    header="N° Documento"
  >
    <template #body="slotProps">
      {{ slotProps.data.numeroDocumento }}
    </template>
  </Column>
  <Column
    field="nombreCompleto"
    header="Nombre Completo"
  >
    <template #body="slotProps">
      {{ slotProps.data.nombreCompleto }}
    </template>
  </Column>
  <Column
    field="nacionalidad"
    header="Nacionalidad"
  >
    <template #body="slotProps">
      {{ slotProps.data.nacionalidad }}
    </template>
  </Column>
  <Column
    field="fechaNacimiento"
    header="Fecha de nacimiento"
  >
    <template #body="slotProps">
      {{ slotProps.data.fechaNacimiento }}
    </template>
  </Column>
  <Column
    field="edad"
    header="Edad"
  >
    <template #body="slotProps">
      {{ slotProps.data.edad }}
    </template>
  </Column>
  <Column
    field="genero"
    header="Género"
  >
    <template #body="slotProps">
      {{ slotProps.data.genero }}
    </template>
  </Column>
  <Column
    field="actions"
    header="Acciones"
  >
    <template #body>
      <span>
        <span>
          <Button
            aria-controls="overlay_menu"
            aria-haspopup="true"
            class="p-button-rounded p-button-outlined btn-primary-outline"
            icon="pi pi-ellipsis-v"
            type="button"
            @click="toggleVerSentecia"
          />
          <Menu
            id="overlay_menu"
            ref="menuVerSentencia"
            :model="optionSentencia"
            :popup="true"
          />
        </span>
      </span>
    </template>
  </Column>
</AppDataTable>
</template>
