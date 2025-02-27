<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Restricción de libertad"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4>¿Fue restringido de libertad?</h4>
    <span>
      <AppSelectButton
        id="requierePautaVif"
        v-model="form.fueRestringidoDeLibertad"
        class="mb-3"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </span>
  </div>
  <AppFieldset
    v-if="form.fueRestringidoDeLibertad"
    class="col-12"
    :collapsed="!form.fueRestringidoDeLibertad"
    legend="A quien se entregó"
    :toggleable="true"
  >
    <div class="col-12 md:col-6 lg:col-3 mt-5">
      <span class="p-float-label">
        <AppDropdown
          id="aQuienEntrego"
          v-model="form.aQuienEntrego"
          label="¿A quien se entregó?"
          option-label="name"
          option-value="name"
          :options="aQuienEntregoOptions"
          :rules="{ required }"
          show-clear
          value="aQuienEntrego"
        />
      </span>
    </div>
    <div
      v-if="form.aQuienEntrego === 'Tribunal de Familia'"
      class="col-12 md:col-6 lg:col-4"
    >
      <h4 class="m-0 my-2">
        ¿Se informó al Tribunal de Familia?
      </h4>
      <span>
        <AppSelectButton
          id="seInformoAlTribunalFamilia"
          v-model="form.seInformoAlTribunalFamilia"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
          :rules="{ required }"
        />
      </span>
    </div>
    <div
      v-if="
        form.aQuienEntrego === 'Adulto Responsable' ||
          form.aQuienEntrego === 'Otro'
      "
      class="col-12 md:col-6 lg:col-4 mb-3 mt-5"
    >
      <span class="p-float-label">
        <AppInput
          id="adultoResponsable"
          v-model="form.adultoResponsable"
          label="Adulto Responsable u Otro"
          :rules="{ required }"
        />
      </span>
    </div>
  </AppFieldset>
</AppFieldset>
</template>
<script setup>

// ELIMINAR JSON / PEDIR MANTENEDOR
import { aQuienEntregoOptions } from '@/data/datosComplementariosIntervinientes.json'
import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'

const { required } = useFormValidation()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

</script>
