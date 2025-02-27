<template>
<section>
  <PageHeader
    class="mb-5"
    :items-menu-superior="itemsMenuSuperior"
    page-title="Generar Cúpon de Déposito"
  />
  <TabView>
    <TabPanel
      v-for="tab in tabs"
      :key="tab.title"
      :header="tab.title"
    >
      <AppFieldset legend="Moneda Nacional">
        <TablaGenerarCuponDeDeposito
          class="col-12"
          :value="dinerosAGenerarCupon"
          @update-selection="updateSelection"
        />
        <div class="col-12">
          <p class="my-2">
            Total Seleccionado: <strong> {{ totalSeleccionado }}</strong>
          </p>
          <!-- <p>Total General: <strong>{{ totalGeneral() }}</strong></p> -->
        </div>
      </AppFieldset>
      <AppFieldset
        legend="Datos de quien realiza el depósito"
      >
        <AppForm
          :id="'formgenerarcupon'"
          class="col-12 grid"
          :form-submitted="formSubmitted"
          :validation-scope="'formgenerarcupon'"
        >
          <AppDropdown
            id="tipoObservacion"
            v-model="formData.nombreQuienDeposita"
            class="col-12 md:col-6 lg:col-4"
            label="Nombre"
            option-label="name"
            option-value="name"
            :options="nombreQuienDepositaOptions"
            :rules="{ required }"
            show-clear
          />
          <AppCalendar
            id="fechaDeposito"
            v-model="formData.fechaDeposito"
            class="col-12 md:col-6 lg:col-4"
            date-format="dd-mm-yy"
            label="Fecha de Depósito"
            month-navigator
            :rules="{ required }"
            year-navigator
            year-range="1921:2030"
          />
        </AppForm>
        <div
          v-if="formData.nombreQuienDeposita"
          class="col-12"
        >
          <p class="my-2">
            <strong>
              RUN:
            </strong>
            {{ dataQuienRealizaDeposito.run }}
          </p>
          <p class="my-2">
            <strong>
              Teléfono:
            </strong>
            {{ dataQuienRealizaDeposito.telefono }}
          </p>
          <p class="my-2">
            <strong>
              Correo Electrónico:
            </strong>
            {{ dataQuienRealizaDeposito.correoElectronico }}
          </p>
        </div>
      </AppFieldset>
      <div class="grid mb-4">
        <div class="col-12 md:col-6 md:col-offset-6 lg:col-3 lg:col-offset-9">
          <Button
            class="btn-form w-full"
            :disabled="generarBtnDisabled"
            icon="pi pi-sync"
            icon-pos="right"
            label="Generar Listado"
            @click="generarListado"
          />
        </div>
      </div>
      <AppFieldset
        :collapsed="listadoGenerado?.length === 0"
        legend="Listado Generado"
      >
        <TablaListadoGenerado
          :value="listadoGenerado"
          @modal-cupon="modalCuponDeposito"
        />
        <div class="col-12">
          <p class="my-2">
            Total Dinero Cómun:
          </p>
          <p class="my-2">
            Total Ley Drogas / Ley Lavado Dineros:
          </p>
          <p>Total General:</p>
        </div>
      </AppFieldset>
    </TabPanel>
  </TabView>
</section>
<AppFooterBtns
  label="Guardar y Salir"
  @back-step="handleBackStep"
  @next-step="openGuardarYSalir()"
/>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
// compponents
import TablaGenerarCuponDeDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaGenerarCuponDeDeposito.vue'
import AppFooterBtns from '@/modules/global/components/utilities/AppFooterBtns.vue'
import ModalRegistroCuponInconcluso from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/modals/ModalRegistroCuponInconcluso.vue'
import TablaListadoGenerado from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/TablaListadoGenerado.vue'
import ModalCuponDeposito from '@/modules/recepcion-especies-dinero/components/generar-cupon-deposito/modals/ModalCuponDeposito.vue'

// composables
import { useAppDialog, useAppToast, useFormValidation } from '@/modules/common/composables'
import {
  useGenerarCuponDeDeposito,
  useItemsMenuSuperiorCadena
} from '@/modules/recepcion-especies-dinero/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useRouter } from 'vue-router'

const formData = reactive({
  nombreQuienDeposita: '',
  fechaDeposito: null
})
const dinerosAGenerarCupon = ref()

const { required, isFormValid, formSubmitted } = useFormValidation({
  formData,
  validationScope: 'formgenerarcupon'
})

const { launchDialog } = useAppDialog()
const router = useRouter()
const { itemsMenuSuperior } = useItemsMenuSuperiorCadena(actualizar, exportar)

const {
  generarCuponDeDeposito_getListaDineros,
  generarCuponDeDeposito_addgenerarCupon,
  generarCuponDeDeposito_generarCodigoDeBarra,
  generarCuponDeDeposito_guardarCuponYSalir
} = useGenerarCuponDeDeposito()

function getListaDineros () {
  requestUtil({
    action: generarCuponDeDeposito_getListaDineros,
    payload: {
      idFuncionario: '5d93a467-9798-4b70-86d4-7fd236bd4258',
      tipoMoneda: 'A880F899-4264-41C8-8A57-8B8001E52384'
    },
    resolve: (response) => {
      console.log('responsedsfgsdg', response)
      dinerosAGenerarCupon.value = response.listaDinerosCandidatosDeposito
    }
  })
}

onMounted(() => getListaDineros())

function handleBackStep () {
  launchDialog({
    component: ModalRegistroCuponInconcluso,
    header: 'Generar Cupón de Depósito',
    width: '35%',
    confirmLabel: 'Salir'
  })
}

function actualizar () {
  console.log('actualizar')
}

const listadoGenerado = ref([])

function openGuardarYSalir () {
  requestUtil({
    action: generarCuponDeDeposito_guardarCuponYSalir,
    payload: {
      nombreDepositante: dataQuienRealizaDeposito.value.name,
      runDepositante: dataQuienRealizaDeposito.value.run,
      fechaDeposito: dateTimeUtil.formatToBackend(formData.fechaDeposito),
      email: dataQuienRealizaDeposito.value.correoElectronico,
      telefono: dataQuienRealizaDeposito.value.telefono,
      detalle: dinerosSeleccionados.value.map(d => {
        return {
          rue: d.rue,
          ruc: d.ruc,
          tipoDelito: d.tipoDelito,
          fiscaliaRegional: 'string',
          fiscaliaLocal: 'string',
          numeroConvenio: d.numeroDeConvenio,
          cuentaDeposito: d.cuentaDeposito,
          montoDeposito: d.monto
        }
      }
      )
    },
    resolve: () => {
      router.push({ name: 'BandejaCustodio' })
    }
  })
}
function exportar () {
  console.log('exportar')
}

const generarBtnDisabled = ref(true)
const dinerosSeleccionados = ref()
const datosQuienGeneraDeposito = ref()
const dataCodigoBarra = ref()

const { toastError, TOAST_MESSAGES } = useAppToast()

const dataQuienRealizaDeposito = ref()

function generarListado () {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }
  const payload = {
    incautacionComun: true,
    idFuncionario: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    nombreDepositante: dataQuienRealizaDeposito.value.name,
    rutDepositante: dataQuienRealizaDeposito.value.run,
    fechaDeposito: dateTimeUtil.formatToBackend(formData.fechaDeposito),
    email: dataQuienRealizaDeposito.value.correoElectronico,
    telefono: dataQuienRealizaDeposito.value.telefono,
    detalle: dinerosSeleccionados.value.map(d => {
      return {
        NUE: d.nue,
        RUE: d.rue,
        RUC: d.ruc,
        tipoDelito: d.tipoDelito,
        codigoFiscalia: d.codigoFiscalia,
        numeroConvenio: d.numeroDeConvenio,
        cuentaDeposito: d.cuentaDeposito,
        montoDeposito: d.monto,
        esLeyDrogas: d.esLeyDrogas
      }
    }
    )
  }
  requestUtil({
    action: generarCuponDeDeposito_addgenerarCupon,
    payload: {
      payload
    },
    resolve: (res) => {
      listadoGenerado.value = res.detalle
      datosQuienGeneraDeposito.value = res
    }
  })
}
// function totalGeneral () {
//   let total = 0
//   listadoGenerado.value.forEach(d => {
//     total += d.monto
//   })
//   return total
// }

const totalSeleccionado = ref(0)

function updateSelection (data) {
  if (data.length > 0) {
    dinerosSeleccionados.value = data
    generarBtnDisabled.value = false
  } else {
    generarBtnDisabled.value = true
  }
  totalSeleccionado.value = data.reduce(function (accumulator, curValue) {
    return accumulator + curValue.monto
  }, 0)
}

function getDataQuienRealizaDeposito (name) {
  dataQuienRealizaDeposito.value = nombreQuienDepositaOptions.find(q => q.name === name)
}

watch(
  () => formData.nombreQuienDeposita,
  () => getDataQuienRealizaDeposito(formData.nombreQuienDeposita)
)

async function modalCuponDeposito (data) {
  await requestUtil({
    action: generarCuponDeDeposito_generarCodigoDeBarra,
    payload: {
      ruc: data.ruc,
      rue: data.rue,
      monto: `'${data.montoDeposito}'`
    },
    resolve: (res) => {
      dataCodigoBarra.value = res.data.dataUrl
    }
  })
  launchDialog({
    component: ModalCuponDeposito,
    width: '80vw',
    header: 'Cupón de Deposito',
    props: {
      data,
      cuponComprobante: true,
      datosQuienGeneraDeposito,
      dataCodigoBarra
    },
    confirmLabel: 'Cerrar',
    cancelLabel: 'hideCancelLabel'
  })
}

const tabs = ref([
  { title: 'Moneda Nacional', codigo: 'PESO' },
  { title: 'Dólar EE.UU', codigo: 'USD' }
])

const nombreQuienDepositaOptions = [
  {
    name: 'Pablo Solis',
    run: '2670459-3',
    telefono: '+56 9 9257 2286',
    correoElectronico: 'pablo.solis@correo.com'
  },
  {
    name: 'Marcela Cobo',
    run: '5678974-3',
    telefono: '+56 9 6442 6598',
    correoElectronico: 'marcela.cobo@correo.com'
  }
]
</script>
