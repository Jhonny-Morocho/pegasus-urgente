<template>
<AppForm>
  <AppForm
    class="grid col-12"
    :form-submitted="formSubmitted"
    validation-scope="orden-servicio-traslado"
  >
    <div class="grid col-12">
      <AppInput
        id="calle"
        v-model="formData.volumen"
        class="col-4 p-fluid"
        label="Volumen Mt3 (Aproximado)"
        :rules="{ required }"
      />
      <AppInput
        id="kilos"
        v-model="formData.kilos"
        class="col-4 p-fluid"
        label="Kilos"
        :rules="{ required }"
      />
      <AppInput
        v-if="tipoDeServicio === 'traslado'"
        id="tipo-vehiculo"
        v-model="formData.tipoVehiculo"
        class="col-4 p-fluid"
        label="Tipo de Vehiculo"
        :rules="{ required }"
      />
      <AppInput
        v-if="tipoDeServicio === 'destruccion'"
        id="empresa"
        v-model="formData.empresa"
        class="col-4 p-fluid"
        label="Empresa de Destrucción"
        :rules="{ required }"
      />

      <!-- Fila de servicio de traslado -->
      <AppInput
        v-if="tipoDeServicio === 'traslado'"
        id="cantidad-peonetas"
        v-model="formData.cantidadPeonetas"
        class="col-4 p-fluid"
        label="Cantidad de Peonetas"
        :rules="{ required, numeric }"
      />
      <AppInput
        v-if="tipoDeServicio === 'traslado'"
        id="direccion-origen"
        v-model="formData.direccionOrigen"
        class="col-4 p-fluid"
        label="Direccion de Origen"
        :rules="{ required }"
      />
      <AppInput
        v-if="tipoDeServicio === 'traslado'"
        id="direccion-destino"
        v-model="formData.direccionOrigen"
        class="col-4 p-fluid"
        label="Direccion de Destino"
        :rules="{ required }"
      />
      <!-- Fin Fila de servicio de traslado -->

      <!-- Fila de servicio de destrucción -->
      <AppInput
        v-if="tipoDeServicio === 'destruccion'"
        id="direccion-empresa"
        v-model="formData.direccionEmpresa"
        class="col-4 p-fluid"
        label="Dirección de la empresa de destrucción"
        :rules="{ required, numeric }"
      />
      <AppInput
        v-if="tipoDeServicio === 'destruccion'"
        id="contacto-empresa"
        v-model="formData.contactoEmpresa"
        class="col-4 p-fluid"
        label="Contacto empresa"
        :rules="{ required }"
      />
      <AppInput
        v-if="tipoDeServicio === 'destruccion'"
        id="telefono-empresa"
        v-model="formData.telefonoEmpresa"
        class="col-4 p-fluid"
        label="Teléfono de empresa de servicio"
        :rules="{ required }"
      />
      <!-- Fin Fila de servicio de destrucción -->

      <AppInput
        id="contacto-custodia"
        v-model="formData.contactoCustodia"
        class="col-4 p-fluid"
        :disabled="disabled"
        label="Contacto de Custodia"
        :rules="{ required }"
      />
      <AppInput
        id="telefono-custodia"
        v-model="formData.telefonoCustodia"
        class="col-4 p-fluid"
        :disabled="disabled"
        label="Teléfono de Custodia"
        :rules="{ required }"
      />
      <AppInput
        id="email-custodio"
        v-model="formData.emailCustodio"
        class="col-4 p-fluid"
        :disabled="disabled"
        label="Email de Custodio"
        :rules="{ required, email }"
      />
      <AppCalendar
        id="fecha-hora"
        v-model="formData.esDevolucion"
        class="col-4"
        label="Fecha/Hora de Traslado"
        :min-date="new Date()"
        show-time
      />
      <AppInput
        id="descripcion"
        v-model="formData.descripcion"
        class="col-8 p-fluid"
        :disabled="disabled"
        label="Descripción"
      />
    </div>
    <div class="col-12 flex justify-content-end">
      <div class="col-3">
        <Button
          class="p-button-outlined col-3 "
          icon="pi pi-send"
          icon-pos="right"
          label="Solicitar Orden de Servicio"
          @click="solicitarServicio"
        />
      </div>
    </div>
  </AppForm>
</AppForm>
</template>

<script setup>
import { reactive, defineProps } from 'vue';
import { propTypes } from '@/modules/common/types';
import { useFormValidation } from '@/modules/common/composables';

defineProps({
  tipoDeServicio: propTypes.string
})
const formData = reactive({

})
const { formSubmitted, required, email, numeric } = useFormValidation({ formData, validationScope:'orden-servicio-traslado' })
</script>