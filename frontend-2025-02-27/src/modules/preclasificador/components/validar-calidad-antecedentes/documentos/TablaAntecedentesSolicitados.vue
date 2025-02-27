<template>
<section>
  <AppDataTable
    id="antecedentes-solicitados"
    class="col-12"
    v-bind="$attrs"
    :value="antecedentesSolicitados"
  >
    <template #header>
      <div class="flex justify-content-start align-items-center">
        <h3 class="mb-3">
          Antecedentes Solicitados
        </h3>
      </div>
    </template>
    <template #empty>
      No antecedentes solicitados
    </template>

    <Column header="Antecedente Solicitados">
      <template #body="{data}">
        {{ data.nombreAntecedente ?? fichaCausa_getNombreAntecedentes(data.idAntecedenteSolicitado) }}
      </template>
    </Column>
    <Column header="Origen">
      <template #body="{data}">
        {{ data.nombreOrigen ?? fichaCausa_getNombreOrigenAntecedentes(data.idOrigen) }}
      </template>
    </Column>
    <Column header="Ámbito">
      <template #body="{data}">
        <span class="capitalize">{{ data.idAmbito }}</span>
      </template>
    </Column>
    <Column header="Tipo Sujeto / Familia Especie">
      <template #body="{data}">
        <span>
          {{ mantenedor_getNombreTipoSujeto(data.idTipoSujeto) }}
          {{ mantenedor_getNombreFamiliaEspecie(data.idFamiliaEspecie) }}
        </span>
      </template>
    </Column>
    <Column header="Sujeto / Tipo Especie">
      <template #body="{data}">
        <span>
          {{ data.personaSujeto }}
          {{ mantenedor_getNombreTipoEspecie(data.idTipoEspecie) }}
        </span>
      </template>
    </Column>
    <Column header="Fecha de Solicitud">
      <template #body="{data}">
        <span>
          {{ dateTimeUtil.formatToFrontend(data.fechaUltimaModifica) }}
        </span>
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{data}">
        <span>
          {{ data.estado === '' ? 'Solicitado' : data.estado }}
        </span>
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <AppMenuOptions
          v-model="antecedenteSeleccionado"
          :menu-options="opcionesTablaSolicitados"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useAppToast } from '@/modules/common/composables'
import { useFichaCausaStore, useMantenedorStore } from '@/modules/global/composables'

const { toastSuccess } = useAppToast()

const props = defineProps({
  hasPedirCuenta: Boolean
})

const emit = defineEmits(['ver-respuesta'])

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getNombreTipoSujeto
} = useMantenedorStore()

const {
  antecedentesSolicitados,
  fichaCausa_getNombreAntecedentes,
  fichaCausa_getNombreOrigenAntecedentes
} = useFichaCausaStore()

const antecedenteSeleccionado = ref(null)

const opcionesTablaSolicitados = ref([
  {
    label: 'Acciones Antecedentes',
    items: [
      {
        label: 'Pedir Cuenta',
        command: () => {
          console.log('PEDIR CUENTA')
        },
        disabled: () => true,
        visible: () => props.hasPedirCuenta
      },
      {
        label: 'Ver Respuesta',
        command: () => {
          emit('ver-respuesta', antecedenteSeleccionado.value)
        }
      },
      {
        label: 'Re-Solicitar',
        command: () => {
          toastSuccess('Se Re-Solicitó el Antecedente')
        }
      }
    ]
  }
])

</script>
