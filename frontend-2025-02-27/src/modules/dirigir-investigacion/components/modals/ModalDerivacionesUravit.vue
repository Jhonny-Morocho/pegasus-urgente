<template>
<section>
  <hr class="mb-5 mt-0">
  <AppFieldset legend="Derivaciones a URAVIT">
    <AppDataTable
      id="derivaciones-uravit"
      class="col-12"
      :loading="isLoading"
      :value="derivaciones"
    >
      <Column header="Tipo Sujeto">
        <template #body="{ data }">
          {{ data?.descripcionTipoSujeto }}
        </template>
      </Column>
      <Column header="RUT">
        <template #body="{ data }">
          {{ data?.numeroDocumento }}
        </template>
      </Column>
      <Column header="Urgente">
        <template #body="{ data }">
          {{ data?.urgente }}
        </template>
      </Column>
      <Column header="Motivo">
        <template #body="{ data }">
          {{ data?.motivo }}
        </template>
      </Column>
      <Column header="Evaluacion de Riesgo">
        <template #body="{ data }">
          {{ data?.evaluacion }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>
</section>
</template>

<script setup>
/* eslint-disable */
import { defineProps, ref, onMounted } from 'vue'
import { propTypes } from '@/modules/common/types'
import { requestUtil } from '@/utils'
import { useSujetosIntervinientesStore } from '@/modules/global/composables'

const props = defineProps({
  ruc: propTypes.string
})

const {
  sujetosIntervinientes,
  sujetosIntervinientes_getSujetosEnCausa
} = useSujetosIntervinientesStore()

const derivaciones = ref([])

const firstRecord = ref(0)
const isLoading = ref(false)

async function getSujetos (pagination = undefined) {
  if (!pagination) {
    firstRecord.value = 0
  }
  const params = {
    page: pagination?.page,
    size: pagination?.rows
  }
   requestUtil({
    action: sujetosIntervinientes_getSujetosEnCausa,
    payload: {
      idGlobal: props.ruc,
      params
    },
    loader: (l) => (isLoading.value = l)
  })
}

onMounted(async () => {
   getSujetos()

  sujetosIntervinientes.value.forEach((sujeto) => {
    const newSujeto = {
      ...sujeto,
      urgente: 'no-aplica', // POR HACER
      motivo: 'no-aplica', // POR HACER
      evaluacion: 'no-aplica' // POR HACER
    }

    derivaciones.value.push(newSujeto)
  })
})

</script>
