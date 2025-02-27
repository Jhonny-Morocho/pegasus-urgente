<template>
<section>
  <AppFieldset
    :legend="
      esDinero
        ? 'Comprobante de Recepción de Dinero'
        : 'Comprobante de Recepción de Especies'
    "
  >
    <div
      class="col-12 md:col-6"
      style="font-size: 1.1em"
    >
      <p class="my-2">
        Institución que entrega:
        <span class="font-bold">
          {{ comprobante.idInstitucion ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        Unidad:
        <span class="font-bold">
          {{ comprobante.idUnidadEntrega ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        Destacamento:
        <span class="font-bold">
          {{ comprobante.idDestacamentoEntrega ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        Nombre quien entrega:
        <span class="font-bold">
          {{ comprobante.nombreQuienEntrega ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        Cargo quien entrega:
        <span class="font-bold">
          {{ comprobante.idCargoQuienEntrega ?? 'No definido' }}
        </span>
      </p>
      <div v-if="esPeligrosaLaEspecie">
        <p class="my-2">
          Clase Especie Peligrosa:
          <span
            v-for="especie in comprobante.especiesRecepcionadas"
            :key="especie.idClasePeligro"
            class="font-bold"
          >
            {{
              mantenedor_getDescripcionClasesPeligroEspeciesById(
                especie.idClasePeligro
              ) ?? 'No definido'
            }}
          </span>
        </p>
        <p class="my-2">
          Peso Especie Peligrosa:
          <span
            v-for="especie in comprobante.especiesRecepcionadas"
            :key="especie.idClasePeligro"
            class="font-bold"
          >
            {{ especie.pesoEspeciePeligrosa ?? 'No definido' }}
          </span>
        </p>
      </div>
      <p class="my-2">
        Tipo de Observación:
        <span class="font-bold">
          {{ comprobante.idTipoObservacion ?? 'No definido' }}
        </span>
      </p>
    </div>
    <div
      class="col-12 md:col-6"
      style="font-size: 1.1em"
    >
      <p class="my-2">
        Fiscalía que Recepciona:
        <span class="font-bold">
          {{ comprobante.fiscaliaRecepciona ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        Nombre Receptor(a):
        <span class="font-bold">
          {{ comprobante.nombreReceptor ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        Cargo quien recepciona:
        <span class="font-bold">
          {{ comprobante.idUnidadEntrega ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        Fecha / Hora recepción:
        <span class="font-bold">
          {{
            dateTimeUtil.formatToFrontendWithTime(
              comprobante.fechaRecepcion
            ) ?? 'No definido'
          }}
        </span>
      </p>
      <p class="my-2">
        RUC:
        <span class="font-bold">
          {{ comprobante.ruc ?? 'No definido' }}
        </span>
      </p>
      <p class="my-2">
        NUE:
        <span class="font-bold">
          {{ comprobante.nue ?? 'No definido' }}
        </span>
      </p>
      <p
        v-if="comprobante.firmado"
        class="my-2"
      >
        Documento Firmado:
        <span class="font-bold">
          {{ comprobante.firmado ? 'Si' : 'No' }}
        </span>
      </p>
      <p
        v-if="comprobante.firmado"
        class="my-2"
      >
        Fecha / Hora de Firma:
        <span class="font-bold">
          {{
            dateTimeUtil.formatToFrontendWithTime(comprobante.fechaFirma) ??
              'No definido'
          }}
        </span>
      </p>
    </div>
  </AppFieldset>
  <TablaDinerosRecepcionados v-if="esDinero" />
  <TablaEspeciesRecepcionadas
    v-else
    :data="comprobante.especiesRecepcionadas"
  />
  <div class="ml-4 my-5">
    <Button
      class="p-button-raised p-button-outlined px-4"
      icon="pi pi-file"
      icon-pos="right"
      label="Vista Previa del Comprobante"
      @click="abrirModalComprobante"
    />
  </div>
  <div class="ml-4 my-5">
    <div class="upload-container">
      <FileUpload
        accept="image/*,application/pdf"
        cancel-icon="pi pi-times"
        choose-label="Subir Comprobante Firmado"
        class="boton p-button-raised px-5"
        :custom-upload="true"
        :disabled="showProgress"
        :max-file-size="16000000"
        mode="basic"
        name="file"
        @uploader="onUploader"
      />
      <ProgressBar
        :show-value="showProgress"
        :value="progress"
      />
    </div>
    <div>
      <AppBtnNextTeleported
        label="Recepcionar Especies"
        @click="handleNextStep"
      />
    </div>
  </div>
</section>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import TablaEspeciesRecepcionadas from '../../components/comprobante-de-recepcion-rechazo/TablaEspeciesRecepcionadas.vue'
import TablaDinerosRecepcionados from '../../components/comprobante-de-recepcion-rechazo/TablaDinerosRecepcionados.vue'
import ComprobanteDeRecepcionDeEspecies from '@/modules/recepcion-especies-dinero/components/comprobante-de-recepcion-rechazo/modals/ComprobanteDeRecepcionDeEspecies.vue'
import ComprobanteDeRecepcionDeDinero from '../../components/comprobante-de-recepcion-rechazo/modals/ComprobanteDeRecepcionDeDinero.vue'
import {
  useAppDialog,
  useAppToast,
  useConfirmDialog
} from '@/modules/common/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { useComprobanteDeRecepcionRechazoStore } from '@/modules/recepcion-especies-dinero/composables'

// UTILITIES
const emit = defineEmits(['next-step'])
const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()

const { mantenedor_getDescripcionClasesPeligroEspeciesById } =
  useMantenedorStore()

const esDinero = false

const { comprobante, stepComprobanteDeRecepcionRechazo_subirArchivo } =
  useComprobanteDeRecepcionRechazoStore()
const { toastError, toastSuccess } = useAppToast()

function handleNextStep () {
  launchConfirmDialog({
    header: 'Especies Recepcionadas',
    message: `¿Está seguro de querer Continuar para comenzar con el Ingreso de la Especie?`,
    accept: () => {
      // emit('next-step', '/custodia/custodio/nuevo-ingreso/ingresar-datos-adicionales')
      emit('next-step', '/custodia/custodio')
    }
  })
}
function abrirModalComprobante () {
  launchDialog({
    component: esDinero
      ? ComprobanteDeRecepcionDeDinero
      : ComprobanteDeRecepcionDeEspecies,
    width: '60%',
    showHeader: false,
    cancelLabel: 'Cerrar'
  })
}

const progress = ref(0)

const showProgress = ref(false)

function onUploader (e) {
  const especiesIds = comprobante.value.especiesRecepcionadas.filter(
    (e) => e.idEspecie
  )
  if (!e.files.length) return
  showProgress.value = true
  const file = e.files.find((e) => e)
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    startProgress()
    const base64 = reader.result.split(',')[1]
    requestUtil({
      action: stepComprobanteDeRecepcionRechazo_subirArchivo,
      payload: {
        especies: especiesIds.map((e) => e.idEspecie),
        contenido: base64,
        extensionArchivo: file.type.split('/').pop(),
        titulo: file.name,
        descripcion: file.name,
        procedencia: 'Comprobante Recepcion o rechazo',
        metadata: [{ RUC: comprobante.value.ruc }]
      },
      loader: (l) => (showProgress.value = l),
      resolve: (data) => {
        // retorna el FileId del archivo subido
        console.log(data)
        toastSuccess('El archivo se subió correctamente')
        endProgress()
      },
      reject: () => {
        toastError('Ocurrió un error inesperado, intenta nuevamente rejected')
        endProgress()
      }
    })
  }
  reader.onerror = () => {
    toastError('Ocurrió un error inesperado, intenta nuevamente')
    endProgress()
  }

  const interval = ref(null)
  const startProgress = () => {
    interval.value = setInterval(() => {
      let newValue = (progress.value += 10)
      if (newValue >= 100) {
        newValue = 100
      }
      progress.value = newValue
    }, 700)
  }
  const endProgress = () => {
    progress.value = 0
    clearInterval(interval.value)
    interval.value = null
  }
}

const esPeligrosaLaEspecie = comprobante.value.especiesRecepcionadas.some(
  (s) => s.esPeligrosa
)
</script>

<style lang="scss" scoped>
::v-deep(.upload-container) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: fit-content;
  position: relative;
  .boton {
    background-color: #606e84 !important;
  }
  .p-progressbar {
    background-color: #606e84;
    margin-top: -2px;
    padding-bottom: 6px;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.1);
    max-width: 100%;
  }
  .p-message-error {
    position: absolute;
    top: 32px;
    width: 300px;
  }
}
</style>
