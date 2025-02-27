<template>
<section>
  <AppDataTable
    id="dataTableDocumentos"
    :value="listaDocumentos"
  >
    <Column header="Tipo de antecedentes">
      <template #body="{ data }">
        {{ data?.idDocumento?.idTipoDocumento }}
      </template>
    </Column>
    <Column header="Tipo de archivo">
      <template #body="{ data }">
        {{ data?.idDocumento?.idFormatoCategoria }}
      </template>
    </Column>
    <Column header="Descripción">
      <template #body="{ data }">
        {{ data?.idDocumento?.descripcion }}
      </template>
    </Column>
    <Column
      header="Acciones"
      style="width: 48px"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <Button
            v-tooltip.top="'Eliminar Documento'"
            class="p-button-rounded p-button-outlined p-button-danger"
            icon="pi pi-trash"
            type="button"
            @click="handleEliminar(data)"
          />
        </div>
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps, ref } from 'vue'

const props = defineProps({
  dataDocumentos: propTypes.array
})

const listaDocumentos = ref(props.dataDocumentos)

function handleEliminar (documento) {
  console.log('handleEliminar()', documento)
  const indexDocumento = listaDocumentos.value.findIndex(
    (intervinienteData) => intervinienteData.idPersona === documento.idPersona
  )
  listaDocumentos.value.splice(indexDocumento, 1)
}
</script>
