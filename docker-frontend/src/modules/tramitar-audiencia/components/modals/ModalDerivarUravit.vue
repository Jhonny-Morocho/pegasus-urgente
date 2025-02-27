<template>
<div v-if="loader">
  <LoaderSkeleton />
</div>
<div v-else>
  <hr class="mb-5 mt-0">
  <div class="flex justify-content-between mb-4">
    <p><strong>RUC: </strong>{{ causa?.ruc ?? causa.rolUnico }}</p>
    <p><strong>Fiscalía: </strong>{{ causa?.usuario?.fiscalia }}</p>
    <p><strong>Fiscal Asignado: </strong>{{ causa?.fiscalPropuesto }}</p>
  </div>
  <AppFieldset legend="Identificación de Sujeto / Interviniente">
    <div class="col-12 md:col-8">
      <p>
        <strong>Tipo Sujeto: </strong>
        <span v-if="sujeto?.interviniente.esVictima">VÍCTIMA</span>
        <span v-else>{{ mantenedor_getNombreTipoSujeto(sujeto?.tipoSujeto) }}</span>
      </p>
      <p>
        <strong>Numero Documento: </strong>{{ sujeto?.interviniente.identificacion.numeroDocumento }}
      </p>
      <p><strong>Nombre Completo: </strong>{{ relacion?.nombreCompletoVictima }}</p>
      <p class="mb-0">
        <strong>Delito(s): </strong>{{ relacion?.nombreDelito ?? causa.delito }}
      </p>
    </div>
    <div class="col-12 md:col-4">
      <p>
        <strong>Edad: </strong>
        {{ dateTimeUtil.getEdad(sujeto?.interviniente.persona.fechaNacimiento) }} años.
      </p>
      <p><strong>Alertas: </strong>{{ interviniente?.alertas[0]?.sigla }}</p>
    </div>
  </AppFieldset>

  <AppFieldset legend="Direcciones y Contacto">
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

  <AppFieldset legend="Derivar a URAVIT">
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
            { name: 'No', value: false },
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
  <!-- <div class="flex flex-row-reverse">
    <Button
      label="Enviar a URAVIT"
      @click="handleEnviar"
    />
  </div> -->
</div>
</template>

<script setup>
import { reactive, defineProps, onMounted, ref, defineExpose } from 'vue'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import {
  useMantenedorStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'
import { requestUtil, dateTimeUtil } from '@/utils'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const {
  mantenedor_getNombreTipoSujeto,
  mantenedor_getTiposSujetos
} = useMantenedorStore()

const props = defineProps({
  relacion: propTypes.object,
  causa: propTypes.object
})

function initialData () {
  return {
    esUrgente: null,
    causalMotivoDerivacion: ''
  }
}

const formData = reactive(initialData())

const { formSubmitted, isFormValid, required } = useFormValidation({
  formData,
  validationScope: 'modal-derivar-uravit'
})

const {
  sujetosIntervinientes_getSujetosByIdRelacionSujeto
} = useSujetosIntervinientesStore()

const sujeto = ref()

const loader = ref(false)

function getSujetos () {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
    payload: { idRelacionSujeto: props.relacion.idRelacionVictima },
    resolve: (r) => {
      sujeto.value = r
    },
    loader: (l) => {
      loader.value = l
    }
  })
}

onMounted(() => {
  getSujetos()
  mantenedor_getTiposSujetos()
})

function resetForm () {
  Object.assign(formData, initialData())
}

const { toastError, TOAST_MESSAGES } = useAppToast()

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  retrieveCb?.(formData)
}
defineExpose({ retrieveData, resetForm })

const interviniente = {
  tipoSujeto: 'Víctima',
  nroDocumento: '18.205.944-7',
  nombreCompleto: 'Javier Parada Noriega',
  delitos: ['HURTO - HURTO ROBO MANO ARMADA'],
  edad: '37',
  alertas: [{ sigla: 'VIF', detalle: 'Causa VIF con pauta de riesgo' }]
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
