<template>
<DataTable
  id="causas-asociadas-ficha-sujeto"
  class="col-12"
  :value="$data"
>
  <Column
    field="ruc"
    header="RUC"
  >
    <template #body="{ data }">
      <Button
        class="p-button-text pl-0 ml-0 btn-primary-outline"
        :label="data?.ruc"
        @click="sendToFichaCausa(data)"
      />
    </template>
  </Column>
  <Column
    field="nombreCausa"
    header="Nombre Causa"
  >
    <template #body="data">
      {{ data.nombreCausa }}
    </template>
  </Column>
  <Column
    field="alerta"
    header="Alerta"
  >
    <template #body="data">
      {{ data.alerta }}
    </template>
  </Column>
  <Column
    field="fechaAgrupacion"
    header="Fecha Agrupación"
  >
    <template #body="data">
      {{ data.fechaAgrupacion }}
    </template>
  </Column>
  <Column
    field="estado"
    header="Estado"
  >
    <template #body="data">
      {{ data.estado }}
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="data">
      <AppMenuOptions
        v-model="antecedenteSeleccionado"
        :auto-z-index="false"
        :menu-options="accionesDireccion"
        :slot-props="data"
        :z-base-index="99999"
      />
    </template>
  </Column>
</DataTable>
</template>

<script setup>
import { ref } from 'vue'
import { requestUtil } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const accionesDireccion = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Ficha Causa',
        command: () => {
          verFichaCausa()
        }
      }
    ]
  }
])
function verFichaCausa () {
  // Refactoirizar con los datos obtenidos desde la tabla
  // const id = data.procesoPam.idDenuncia
  requestUtil({
    // action: fichaCausa_getCausa,
    // payload: { idDenuncia: id },
    resolve: (res) => {
      // fichaCausa_SET_CAUSA(data)
      router.push(`/ficha-causa/${res.rolUnico}`)
    },
    reject: (err) => {
      console.error(err)
    }
  })
}
</script>
