<template>
<div>
  <hr class="mb-5 mt-0">
  <AppFieldset
    legend="Identificación de Sujeto / Interviniente"
  >
    <div class="col-12 md:col-8">
      <p><strong>Tipo Sujeto: </strong>{{ interviniente?.tipoSujeto }}</p>
      <p><strong>Numero Documento: </strong>{{ interviniente?.nroDocumento }}</p>
      <p><strong>Nombre Completo: </strong>{{ interviniente?.nombreCompleto }}</p>
      <p class="mb-0">
        <strong>Delito(s): </strong>{{ interviniente?.delitos[0] }}
      </p>
    </div>
    <div class="col-12 md:col-4">
      <p><strong>Edad: </strong>{{ interviniente?.edad }}</p>
      <p><strong>Alertas: </strong>{{ interviniente?.alertas[0]?.sigla }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    legend="Direcciones y Contacto"
  >
    <AppDataTable
      class="w-full"
      :value="direcciones"
    >
      <Column header="Tipo Dirección">
        <template #body="{ data }">
          {{ data?.tipoDireccion }}
        </template>
      </Column>
      <Column header="Dirección">
        <template #body="{ data }">
          {{ data?.direccion }}
        </template>
      </Column>
      <Column header="Comuna">
        <template #body="{ data }">
          {{ data?.comuna }}
        </template>
      </Column>
      <Column header="Región">
        <template #body="{ data }">
          {{ data?.region }}
        </template>
      </Column>
      <Column header="Teléfono">
        <template #body="{ data }">
          {{ data?.telefono }}
        </template>
      </Column>
      <Column header="Correo Electrónico">
        <template #body="{ data }">
          {{ data?.email }}
        </template>
      </Column>
    </AppDataTable>
  </AppFieldset>

  <AppFieldset
    legend="Derivar a URAVIT"
  >
    <AppForm
      class="col-12 grid"
      :form-submitted="formSubmitted"
      validation-scope="modal-derivar-uravit"
    >
      <div class="col-12 md:col-4 flex flex-column">
        <p class="mb-3 text-center">
          <strong>¿Es Urgente?(<span class="text-error">*</span>)</strong>
        </p>
        <AppSelectButton
          id="id-es-urgente"
          v-model="formData.esUrgente"
          class="w-full"
          option-label="name"
          option-value="value"
          :options="[
            { name: 'Si', value: true },
            { name: 'No', value: false }
          ]"
          :rules="{ required }"
        />
      </div>
      <AppTextarea
        id="id-causal-motivo-derivacion"
        v-model="formData.causalMotivoDerivacion"
        :auto-resize="true"
        class="col-8 mb-0"
        label="Causal o Motivo Derivación"
        :rows="5"
        :rules="{ required }"
      />
    </AppForm>
  </AppFieldset>

  <div class="flex flex-row-reverse">
    <Button
      label="Enviar a URAVIT"
      @click="handleEnviar"
    />
    <Button
      class="p-button-text p-button-plain mr-4"
      icon="pi pi-times"
      icon-pos="right"
      label="Cancelar"
      @click="handleCancelar"
    />
  </div>
</div>
</template>

<script setup>
import { reactive, inject, onMounted } from 'vue'
import { useFormValidation } from '@/modules/common/composables'

const dialogRef = inject('dialogRef')

const formData = reactive({
  esUrgente: null,
  causalMotivoDerivacion: ''
})

const {
  formSubmitted,
  isFormValid,
  required
} = useFormValidation({ formData, validationScope: 'modal-derivar-uravit' })

function handleEnviar () {
  if (!isFormValid()) {
    return
  }

  const data = {
    ...formData,
    interviniente: interviniente,
    direcciones: direcciones
  }
  dialogRef.value.close(data)
}

function handleCancelar () {
  dialogRef.value.close()
}

onMounted(() => {
  console.log(dialogRef?.value.data)
})

const interviniente = {
  tipoSujeto: 'Particular',
  nroDocumento: '18.205.944-7',
  nombreCompleto: 'Javier Parada Noriega',
  delitos: ['HURTO - HURTO ROBO MANO ARMADA'],
  edad: '37',
  alertas: [
    { sigla: 'VIF', detalle: 'Causa VIF con pauta de riesgo' }
  ]
}
const direcciones = [
  {
    tipoDireccion: 'Particular',
    direccion: 'Paul Harris 3392',
    comuna: 'Las Condes',
    region: 'Metropolitana',
    telefono: '+56 2 22 22 22',
    email: 'direccion@email.com'
  }
]
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
