<template>
<AppFieldset legend="Información Adicional del Delito">
  <div class="col-12 lg:col-3 mt-auto">
    <h4 class="mb-2 text-center">
      ¿Entrega de Detenidos por Civiles? (*)
    </h4>
    <span>
      <AppSelectButton
        id="entrega-detenidos-civiles"
        v-model="formData.entregaDetenidosPorCiviles"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
      />
    </span>
  </div>
  <div class="col-12 lg:col-3 mt-auto">
    <h4 class="mb-2 text-center">
      ¿Es Accidente de Transito? (*)
    </h4>
    <span>
      <AppSelectButton
        id="es-accidente-transito"
        v-model="formData.esAccidenteTransito"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
      />
    </span>
  </div>
  <div class="col-12 lg:col-3 mt-auto">
    <h4 class="mb-2 text-center">
      ¿Es Incendio? (*)
    </h4>
    <span>
      <AppSelectButton
        id="es-incendio"
        v-model="formData.esIncendio"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
      />
    </span>
  </div>
  <div class="col-12 lg:col-3 mt-auto">
    <h4 class="mb-2 text-center">
      ¿Es Violencia Intrafamiliar (VIF)? (*)
    </h4>
    <span>
      <AppSelectButton
        id="entrega-detenidos-civiles"
        v-model="formData.vif"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        :rules="{ required }"
      />
    </span>
  </div>
</AppFieldset>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { defineProps } from 'vue'

import { useDelitoInject } from '@/modules/global/composables/useDelito'

defineProps({
  readOnly: Boolean
})
const { delitoInject } = useDelitoInject()

const formData = delitoInject

const { required } = useFormValidation()
</script>
