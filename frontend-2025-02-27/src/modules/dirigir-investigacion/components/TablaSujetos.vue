<template>
<section class="col-12">
  <AppDataTable
    v-bind="$attrs"
    id="tabla-sujetos"
  >
    <Column header="Tipo Sujeto">
      <template #body="{ data }">
        {{ mantenedor_getNombreTipoSujeto(data.tipoSujeto) }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        {{ data?.numeroDocumento }}
      </template>
    </Column>
    <Column header="Nombre Completo">
      <template #body="{ data }">
        {{ obtenerNombreCompleto(data) }}
      </template>
    </Column>
    <Column header="Edad">
      <template #body="{ data }">
        {{ data?.edad }}
      </template>
    </Column>
    <Column header="Alerta">
      <template #body="{ data }">
        <div
          v-if="data?.alertas.length"
          class="flex"
        >
          <ChipAlerta
            v-for="(alerta, index) in data?.alertas"
            :key="index"
            :alerta="alerta"
            :is-chip-con-modal="true"
          />
        </div>
        <div v-else>
          N/A
        </div>
      </template>
    </Column>
    <Column header="Dirección">
      <template #body="{ data }">
        {{ obtenerDireccionDelito(data?.direccion) || 'N/A' }}
      </template>
    </Column>
    <Column header="Comuna">
      <template #body="{ data }">
        {{ data?.comuna || 'N/A' }}
      </template>
    </Column>
    <Column
      v-if="!readOnly && !isEditando"
      header="Acciones"
    >
      <template #body="slotProps">
        <AppMenuOptions
          v-model="sujeto"
          :menu-options="seeMoreOption ? opcionesSujetoSeeMore : opcionesSujeto"
          :slot-props="slotProps"
        />
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'

import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil } from '@/utils'

defineProps({
  readOnly: Boolean,
  isEditando: Boolean,
  seeMoreOption: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'modificar',
  'eliminar',
  'ver-mas',
  'get-ficha-sujeto',
  'get-ficha-contacto',
  'get-direcciones',
  'derivar-a-uravit',
  'solicitar-app-pauta',
  'definir-medidas-proteccion'
])

const {
  mantenedor_getTiposSujetos,
  mantenedor_getNombreTipoSujeto
} = useMantenedorStore()

const sujeto = ref()

onMounted(() => {
  requestUtil({ action: mantenedor_getTiposSujetos })
})

function obtenerNombreCompleto (sujeto) {
  let nombreCompleto = ''
  if (sujeto?.nombres) {
    nombreCompleto += sujeto.nombres
  }
  if (sujeto?.apellidoPaterno) {
    nombreCompleto += ` ${sujeto.apellidoPaterno}`
  }
  if (sujeto?.apellidoMaterno) {
    nombreCompleto += ` ${sujeto.apellidoMaterno}`
  }

  return nombreCompleto
}

function obtenerDireccionDelito (dire) {
  let direccionDelito = ''
  if (dire?.calle) {
    direccionDelito += ` ${dire.calle}`
  }
  if (dire?.numeroCalle) {
    direccionDelito += ` ${dire.numeroCalle}`
  }

  return direccionDelito
}

const opcionesSujeto = ref([
  {
    label: 'Modificar',
    command: () => {
      emit('modificar', sujeto.value)
    }
  },
  {
    label: 'Eliminar',
    command: () => {
      emit('eliminar', sujeto.value)
    }
  },
  {
    label: 'Ver Más',
    command: () => {
      emit('ver-mas', sujeto.value)
    }
  },
  {
    label: 'Ficha Sujeto',
    command: () => {
      emit('get-ficha-sujeto', sujeto.value)
    }
  },
  {
    label: 'Ficha de Contacto',
    command: () => {
      emit('get-ficha-contacto', sujeto.value)
    }
  },
  {
    label: 'Direcciones Históricas',
    command: () => {
      emit('get-direcciones', sujeto.value)
    }
  },
  {
    label: 'Derivar a URAVIT',
    command: () => {
      emit('derivar-a-uravit', sujeto.value)
    },
    disabled: () => true
  },
  {
    label: 'Solicitar Aplicación Pauta',
    command: () => {
      emit('solicitar-app-pauta', sujeto.value)
    },
    disabled: () => true
  },
  {
    label: 'Definir Medidas Protección',
    command: () => {
      emit('definir-medidas-proteccion', sujeto.value)
    }
  }
])

const opcionesSujetoSeeMore = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Más',
        command: () => {
          emit('ver-mas', sujeto.value)
        }
      }
    ]
  }
])
</script>
