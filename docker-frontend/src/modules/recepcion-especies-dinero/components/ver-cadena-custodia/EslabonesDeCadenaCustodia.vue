<template>
<AppFieldset
  class="w-full"
  legend="Eslabones de Cadena de Custodia"
>
  <div
    v-for="item in eslabones"
    :key="item.idCadenaCustodia"
    class="grid md:pl-3 pr-1 w-full"
  >
    <Divider class="mb-0" />
    <AppDataTable
      class="col-12 md:col-5 px-0"
      no-paginator
      responsive-layout="stack"
      :value="[item]"
    >
      <Column
        header="Número"
      >
        <template #body="{data}">
          {{ data.numero }}
        </template>
      </Column>
      <Column
        header="Fecha/Hora"
      >
        <template #body="{data}">
          {{ formatDate(data.fechaHora) }}
        </template>
      </Column>
      <Column
        header="Motivo"
      >
        <template #body="{data}">
          {{ data.motivo }}
        </template>
      </Column>

      <Column
        header="Imágenes"
      >
        <template #body="{data}">
          <i
            class="pi pi-images link"
            style="font-size: 2em"
            @click="openModalImagen(data.imagenAgregar)"
          />
        </template>
      </Column>
    </AppDataTable>
    <AppDataTable
      class="col-12 md:col-7 px-0"
      no-paginator
      responsive-layout="stack"
      striped-rows
      :value="item.intervinientesCadena"
    >
      <Column
        header="Rol"
      >
        <template #body="{data}">
          {{ data.rol }}
        </template>
      </Column>
      <Column
        header="Nombre"
      >
        <template #body="{data}">
          {{ data.nombre }}
        </template>
      </Column>
      <Column
        header="RUT"
      >
        <template #body="{data}">
          {{ data.rut }}
        </template>
      </Column>

      <Column
        header="Cargo"
      >
        <template #body="{data}">
          {{ data.cargo }}
        </template>
      </Column>
      <Column
        header="Institución"
      >
        <template #body="{data}">
          {{ data.institucion }}
        </template>
      </Column>
      <Column
        header="Unidad"
      >
        <template #body="{data}">
          {{ data.unidad }}
        </template>
      </Column>
    </AppDataTable>
    <AppFieldset
      class="w-full mb-4"
      legend="Observaciones"
    >
      <p>{{ item.observaciones }}</p>
    </AppFieldset>
  </div>
</AppFieldset>
</template>

<script setup>
import { onMounted } from 'vue'
// componenst
import ModalImagenEvidencia from '../../components/ver-cadena-custodia/modals/ModalImagenEvidencia'
// composables
import { useVerCadenaCustodia } from '../../composables/useVerCadenaCustodia'
// utils
import { requestUtil, dateTimeUtil } from '@/utils'
import { useAppDialog } from '@/modules/common/composables'
const {
  eslabones,
  cadena,
  cadenaCustodio_getEslabonesCadenaCustodia
} = useVerCadenaCustodia()
const { launchDialog } = useAppDialog()
onMounted(() => {
  getEslabones()
})
function getEslabones () {
  requestUtil({
    action: cadenaCustodio_getEslabonesCadenaCustodia,
    payload: {
      idCadenaCustodia: cadena.value.rotuloCadenaCustodia.idCadenaCustodia
    }
  })
}
function openModalImagen (data) {
  launchDialog({
    component: ModalImagenEvidencia,
    header: `Imágenes`,
    width: '50%',
    props: {
      data
    },
    cancelLabel: 'Cerrar'
  })
}
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

</script>
