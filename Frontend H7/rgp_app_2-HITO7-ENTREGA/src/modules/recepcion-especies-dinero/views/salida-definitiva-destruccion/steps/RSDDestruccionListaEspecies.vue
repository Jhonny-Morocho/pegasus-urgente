<template>
<section class="mb-6">
  <AppFieldset legend="Lista de Especies Disponibles para Destrucción">
    <TablaGenerarCuponDeDeposito 
      class="w-full mb-4"
      readOnly
      esModelo2
      :value="dataTesting"
    />
    <h3>Cantidad total de especies: {{ totalEspecies }}</h3>
  </AppFieldset>
  <AppFieldset legend="Especies con instrucción de salida definitiva">
    <TablaGenerarCuponDeDeposito 
      class="w-full mb-4"
      esModelo2
      :selectable="false"
    />
    <h3>Cantidad total de especies: {{ totalEspecies }}</h3>
  </AppFieldset>
  
  <AppForm
    class="grid col-12"
    :form-submitted="formSubmitted"
    validation-scope="info-destruccion"
  >
    <div class="col-4">
      <h4>¿Requiere traslado externo?</h4>
      <AppSelectButton
        id="traslado"
        v-model="formData.traslado"
        class="col-10 p-fluid mt-3"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Sí', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-4">
      <h4>¿Requiere orden de destrucción?</h4>
      <AppSelectButton
        id="traslado"
        v-model="formData.ordenDestruccion"
        class="col-10 p-fluid mt-3"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Sí', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
  </AppForm>

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Generar Acta Destrucción"
      @click="handleNextStep"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { reactive, ref } from 'vue';
// components
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import TablaGenerarCuponDeDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue'
// composables
import { useFormValidation } from '@/modules/common/composables';
import { useRouter } from 'vue-router';
// logic

const router = useRouter()
const totalEspecies = ref(null)
const formData = reactive({
  traslado: null,
  ordenDestruccion: null
})

const { formSubmitted } = useFormValidation({formData, validationScope: 'info-destruccion'})

function handleNextStep () {
  router.push({ name: 'RSDDestruccionRegistrarSalida' })
}

const dataTesting = [
  {
    nue: "12345",
    rue: "12345",
    ruc: "12345",
    ley: "test",
    descripcion: "test",
    cantidad: "test",
    fiscalía: "test",
    bodega: "test",
    sector: "test",
    casillero: "test",
    fechaSolicitud: "test",
    marca: "test",
  }
]
</script>