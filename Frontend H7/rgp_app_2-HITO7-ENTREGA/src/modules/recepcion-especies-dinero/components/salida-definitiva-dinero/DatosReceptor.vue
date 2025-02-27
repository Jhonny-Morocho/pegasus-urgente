<template>
<div class="col-12 md:col-6">
  <p class="mb-3">
    <span class="font-bold">Monto: </span>{{ data?.monto }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Interés: </span>{{ data?.interes }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Monto Total: </span>{{ data?.montoTotal }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Modo de Entrega: </span>{{ data?.modoEntrega }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Entidad bancaria: </span>{{ data?.entidadBancaria }}
  </p>
  <p><span class="font-bold">Número de cuenta: </span>{{ data?.numeroCuenta }}</p>
</div>
<div class="col-12 md:col-6">
  <p class="mb-3">
    <span class="font-bold">Tipo de cuenta: </span>{{ data?.tipoCuenta }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Dueño de cuenta: </span>{{ data?.duenoCuenta }}
  </p>
  <p class="mb-3">
    <span class="font-bold">RUN del Dueño: </span>{{ data?.runDueno }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Teléfono: </span>{{ data?.telefono }}
  </p>
  <p><span class="font-bold">Correo: </span>{{ data?.correo }}</p>
</div>
<AppForm
  :id="validationScope"
  :form-submitted="formSubmitted"
  :validation-scope="validationScope"
>
  <AppTextarea
    id="observaciones"
    v-model="formData.observaciones"
    class="col-12"
    cols="150"
    label="Observaciones"
    rows="5"
    :rules="{ required }"
  />
</AppForm>
</template>
<script setup>
import { defineProps, defineExpose } from 'vue'
import { propTypes } from '@/modules/common/types'
import { useFormValidation } from '@/modules/common/composables'
import { useRegistrarsalidaDefinitivaForm } from '@/modules/recepcion-especies-dinero/composables'

const { required } = useFormValidation()

const { formData } = useRegistrarsalidaDefinitivaForm()

defineProps({
  data: propTypes.object,
  formSubmitted: {
    type: Boolean,
    default: false
  },
  validationScope: {
    type: String,
    default: 'elaborarAudiencia'
  }
})

defineExpose(formData)
</script>
