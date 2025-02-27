<template>
<AppFieldset
  id="materializar-solicitud"
  class="w-full p-4"
  legend="Materializa Equipo Jurídico"
>
  <div class="grid col-12">
    <div>
      <p class="mb-3">
        <strong>Fiscalía: </strong> {{ resumenCausa?.fiscalia ?? 'Sin información' }}
      </p>
      <p><strong>Fiscal Asignado: </strong> {{ resumenCausa?.fiscalAsignado ?? 'Sin información' }}</p>
    </div>
    <div class="col-12 flex pl-0">
      <AppDropdown
        id="tribunales"
        v-model="formData.idTribunal"
        class="col-3 p-fluid"
        label="Tribunales"
        option-label="descripcion"
        option-value="id"
        :options="juzgados"
        placeholder
        :retrieve-data-action="mantenedor_getjuzgados"
        :rules="{ required }"
        show-clear
      />
    </div>
  </div>
  <section class="grid col-12">
    <AppTextarea
      id="instrucciones-especificas"
      v-model="formData.instruccionesEquipoJuridico"
      :auto-resize="true"
      class="col-12"
      label="Instrucciones Específicas"
      rows="6"
      :rules="{ required }"
    />
    <h4 class="col-12">
      ¿Desea Revisar Escrito?
    </h4>
    <AppSelectButton
      id="revisa-escrito"
      v-model="formData.revisarEscrito"
      class="col-12 md:col-4 lg:col-3"
      option-label="name"
      option-value="value"
      :options="[
        { name: 'Si', value: true },
        { name: 'No', value: false },
      ]"
      :rules="{ required }"
    />
  </section>
</AppFieldset>
</template>
<script setup>
import { defineProps, inject } from 'vue'

import AppFieldset from '@/modules/common/components/AppFieldset.vue'

import { propTypes } from '@/modules/common/types'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorStore } from '@/modules/global/composables'
import { useSolicitudesStore } from '@/modules/solicitudes/composables'

const { mantenedor_getjuzgados, juzgados } = useMantenedorStore()
const { resumenCausa } = useSolicitudesStore()
const { required } = useFormValidation()

defineProps({
  modelValue: propTypes.object
})
const formData = inject('materializar-solicitud')

</script>
