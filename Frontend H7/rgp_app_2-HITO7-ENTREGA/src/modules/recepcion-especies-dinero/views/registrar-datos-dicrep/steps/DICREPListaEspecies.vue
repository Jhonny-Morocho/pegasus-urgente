<template>
<section class="mb-8">
  <AppFieldset legend="Lista de Especies Disponibles para Subastar">
    <TablaGenerarCuponDeDeposito 
      class="w-full mb-4"
      esModelo2
      esModelo3
      :readOnly="false"
      :value="listaEspeciesMock"
    />
    <h3>Cantidad total de especies: {{ totalEspecies }}</h3>
  </AppFieldset>
  <div class="grid col-12">
    <div class="col-8">
      <Message severity="error">
        <strong class="ml-4">Alerta: </strong>{{ alerta }}  
      </Message>
    </div>
    <div class="col-4">
      <Button
        class="btn-primary mt-4"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="Registrar Especies"
        @click="handleRegistrarEspecies"
      />
    </div>
  </div>
  <div class="col-4 mt-6">
    <h4 class="col-12 mb-3">
      ¿Requiere traslado externo?
    </h4>
    <AppSelectButton
      id="traslado"
      v-model="esEfectivo"
      class="col-12 p-fluid"
      option-label="descripcion"
      option-value="value"
      :options="[
        { descripcion: 'Si', value: true },
        { descripcion: 'No', value: false }
      ]"
    />
  </div>

  <AppBtnRightTeleported>
    <Button
      class="btn-primary"
      icon="pi pi-arrow-right"
      icon-pos="right"
      label="Generar Oficio de Entrega"
      @click="handleNextStep"
    />
  </AppBtnRightTeleported>
</section>
</template>

<script setup>
import { ref } from 'vue';
import AppBtnRightTeleported from '@/modules/common/components/buttons/AppBtnRightTeleported.vue';
import TablaGenerarCuponDeDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue';
import ModalConfirmacionEnvioDestruccion from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/registrar-dicrep/modals/ModalConfirmacionEnvioDestruccion.vue'
import { useAppDialog } from '@/modules/common/composables';
import { useRouter } from 'vue-router';

const { launchDialog } = useAppDialog()
const router = useRouter()
const totalEspecies = ref(null)
const esEfectivo = ref(null)
const alerta = 'Las especies con valor comercial serán enviadas a subasta y las sin valor comercial serán enviadas a destrucción'

const listaEspeciesMock = ref([
  {
    nue: '123443',
    rue: '123443',
    ruc: '123443',
    ley: '123443',
    descripcion: 'IPhone 7',
    cantidad: 5,
    codigoFiscalia: '902',
    bodega: 'A1',
    sector: 'Planta Baja',
    casillero: 'B2',
    fechaSolicitud: '29-01-2023',
    marca: 'N/A',
    valorComercial: 'Si'
  }
])

function handleRegistrarEspecies(){
  launchDialog({
    component: ModalConfirmacionEnvioDestruccion,
    header: 'Confirmación de Envío a Destrucción',
    confirmLabel: 'Confirmar',
    width: '80%',
    props: { data: listaEspeciesMock.value },
    accept: () => {
      launchDialog({
        component: ModalConfirmacionEnvioDestruccion,
        header: 'Confirmación de Envío a Subasta',
        confirmLabel: 'Confirmar',
        width: '80%',
        props: { data: listaEspeciesMock.value },
      })
    }
  })
}

function handleNextStep(){
  router.push({ name: 'DICREPOrdenServicio' })
}
</script>