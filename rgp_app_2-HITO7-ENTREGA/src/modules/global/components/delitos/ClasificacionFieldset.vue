<template>
<AppFieldset legend="Clasificación del Delito">
  <AppDropdown
    id="grado-ejecucion-delito"
    v-model="formData.gradoEjecucionDelito"
    class="col-12 md:col-6 lg:col-4"
    :disabled="readOnly"
    label="Grado de Ejecución del Delito"
    option-label="descripcion"
    option-value="descripcion"
    :options="gradoEjecucion"
    show-clear
  />
  <AppDropdown
    id="modus-operandi"
    v-model="formData.modusOperandi"
    class="col-12 md:col-6 lg:col-4"
    :disabled="readOnly"
    label="Modus Operandi"
    option-label="descripcion"
    option-value="descripcion"
    :options="modusOperandiOptions"
    show-clear
  />
  <AppDropdown
    id="submodus-operandi"
    v-model="formData.subModusOperandi"
    class="col-12 md:col-6 lg:col-4"
    :disabled="readOnly"
    label="Submodus Operandi"
    option-label="descripcion"
    option-value="descripcion"
    :options="subModusOperandiOptions"
    show-clear
  />
  <AppInput
    id="problema-criminal"
    v-model="formData.problemaDelictualFenomenoCriminal"
    class="col-12 md:col-6 lg:col-6 mb-0"
    :disabled="readOnly"
    label="Problema Delictual o Fenómeno Criminal"
  />
  <AppInput
    id="patron-criminal"
    v-model="formData.patronCriminal"
    class="col-12 md:col-12 lg:col-6 mb-0"
    :disabled="readOnly"
    label="Patrón Criminal"
  />
</AppFieldset>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDelitoInject } from '../../composables/useDelito'

defineProps({
  readOnly: Boolean
})

const { delitoInject } = useDelitoInject()

const formData = delitoInject

const modusOperandiOptions = [
  { descripcion: 'Aborda Víctima', value: 1 },
  { descripcion: 'Acciones contra Personas', value: 2 },
  { descripcion: 'Amarre o Retención Víctima', value: 3 },
  { descripcion: 'Elementos de Ocultación', value: 4 },
  { descripcion: 'Mecanismo de Apertura/Rompimiento/Acceso', value: 5 },
  { descripcion: 'Medios de Comisión', value: 6 },
  { descripcion: 'Neutralización de Medios de Seguridad', value: 7 },
  { descripcion: 'Punto de Entrada Vivienda/Local Comercial', value: 8 },
  { descripcion: 'Uso de Vigilante', value: 9 },
  { descripcion: 'Vías de Acceso', value: 10 }
]

const subModusOperandiOptions = [
  { descripcion: 'A Vehículo Repartidor', value: 1 },
  { descripcion: 'Acceso Proveedores', value: 2 },
  { descripcion: 'Acceso Público', value: 3 },
  { descripcion: 'Agresión Física', value: 4 },
  { descripcion: 'Amenaza Verbal', value: 5 },
  { descripcion: 'Amenaza con Armas', value: 6 }
]

const gradoEjecucion = [
  { descripcion: 'Tentado', value: 1 },
  { descripcion: 'Frustrado', value: 2 },
  { descripcion: 'Consumado', value: 3 }
]
</script>
