<template>
<LoaderSkeleton
  v-if="showLoader"
  height="1000px"
/>
<section v-else>
  <PageHeader
    :items-menu-superior="itemsMenuSuperior"
    page-title="Registro de destrucción de documento físico"
  />

  <AppFieldset legend="Autorización Ministro de Fe">
    <AppForm
      class="p-auto w-full flex   justify-content-center"
      :form-submitted="formSubmitted"
      validation-scope="form-firmar-comprobante"
    >
      <div class="flex flex-column align-items-center col-4">
        <AppInput
          id="nombreUsuario"
          v-model="formData.nombreUsuario"
          class="col-12 p-fluid"
          label="Usuario"
          :rules="{ required }"
        />
        <AppInput
          id="password"
          v-model="formData.password"
          class="col-12 p-fluid"
          label="Contraseña"
          :rules="{ required }"
          type="password"
        />
        <div class="col-12">
          <Button
            label="Autorizar"
            @click="autorizarDestruccion"
          />
        </div>
      </div>
    </AppForm>
  </AppFieldset>
  <AppFieldset
    v-if="autenticacionExitosa"
    legend="Comprobante de Destrucción"
  >
    <div class="grid mt-3 col-12 mb-2 lg:mb-0">
      <div class="col-6">
        <p class="mb-4">
          <strong>Nombre Ministro de Fe: </strong> {{ intervineintesRegistroDestruccion?.nombreMinistro }}
        </p>
        <p class="mb-4">
          <strong>Cargo del Ministro de Fe: </strong>{{ intervineintesRegistroDestruccion?.cargoMinistro }}
        </p>
        <p class="mb-4">
          <strong>Metodo de destrucción: </strong>{{ intervineintesRegistroDestruccion?.metodoDestruccion }}
        </p>
        <p class="mb-4">
          <strong>Nombre documento: </strong>{{ documentoAgendamiento?.nombre|| 'N/A' }}
        </p>
        <p class="mb-4">
          <strong>Clase Documental: </strong>{{ documentoAgendamiento?.claseDocumental|| 'N/A' }}
        </p>
      </div>
      <div class="col-6">
        <p class="mb-4">
          <strong>Nombre de quien destruye: </strong>{{ intervineintesRegistroDestruccion?.nombreQuienDestruye }}
        </p>
        <p class="mb-4">
          <strong>Rut de quien destruye: </strong>{{ intervineintesRegistroDestruccion?.rutQuienDestruye }}
        </p>
        <p class="mb-4">
          <strong>RUC/Denuncia/Folio/Archivador: </strong>{{ intervineintesRegistroDestruccion?.rucFolio || 'N/A' }}
        </p>
        <p class="mb-4">
          <strong>Código de Barras: </strong> {{ intervineintesRegistroDestruccion?.codigoBarras }}
        </p>
      </div>
    </div>
  </AppFieldset>

  <AppBtnNextTeleported
    class="btn-primary"
    icon="pi pi-angle-double-right"
    label="Continuar"
    @click="enviarRegistroDeDestruccion()"
  />
</section>
</template>
<script setup>

// COMPONENTS
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'
import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

// UTILS
import { reactive, ref } from 'vue'

// COMPONSABLES
import { requestUtil } from '@/utils'
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { useSolicitudesEncargadoBodega } from '@/modules/catalogo-documental-digital/composables'
import router from '@/router'
const { toastSuccess, toastError } = useAppToast()
const { launchConfirmDialog } = useConfirmDialog()
const { taskId, intervineintesRegistroDestruccion, documentoAgendamiento, solicitudesEncargadoBodega_generarRegistroDeDestruccion } = useSolicitudesEncargadoBodega()

// VALUES
const showLoader = ref(false)
const autenticacionExitosa = ref(false)

const formData = reactive({
  nombreUsuario: null,
  password: null
})

const { formSubmitted, required, isFormValid, resetFormData } = useFormValidation({ formData, validationScope: 'form-firmar-comprobante' })

const itemsMenuSuperior = [

  {
    label: 'Actualizar',
    icon: 'pi pi-replay'
  },
  {
    label: 'Exportar',
    icon: 'pi pi-download'
  }
]

// LOGIC
function autorizarDestruccion () {
  if (!isFormValid()) {
    toastError('Hay campos sin completar')
    return
  }
  autenticacionExitosa.value = true
  toastSuccess('Autorización Éxitosa')
  resetFormData()
  // ACA VA EL LOGING DEL MINISTRO DE FE
  // requestUtil({
  //   action: eliminarDocumentosCDD_autorizar,
  //   payload: {
  //     user: formData.user,
  //     password: formData.password
  //   },
  //   resolve: (data) => {
  //     toastSuccess('Usuario autorizado')
  //     dataMinistro.value = data
  //     userAutentication.value = true
  //   }
  // })
}

function enviarRegistroDeDestruccion () {
  console.log(documentoAgendamiento.value)
  showLoader.value = true
  launchConfirmDialog({
    header: 'Registrar Destrucción',
    acceptLabel: 'Aceptar',
    rejectLabel: 'Cancelar',
    message: '¿Está seguro de Registrar Destrucción del Documento?',
    accept: () => {
      requestUtil({
        action: solicitudesEncargadoBodega_generarRegistroDeDestruccion,
        payload: {
          nombreMinistro: intervineintesRegistroDestruccion.value.nombreMinistro,
          cargoMinistro: intervineintesRegistroDestruccion.value.cargoMinistro,
          metodoDestruccion: documentoAgendamiento.value.idArchivo,
          nombreDestruye: intervineintesRegistroDestruccion.value.nombreQuienDestruye,
          rutDestruye: intervineintesRegistroDestruccion.value.rutQuienDestruye,
          taskId: taskId.value,
          idArchivo: documentoAgendamiento.value.idArchivo
        },
        resolve: (data) => {
          showLoader.value = false
          toastSuccess('Destrucción Registrada')
          router.push({ name: 'CddBandejaEncargadoBodega' })
        },
        reject: () => {
          showLoader.value = false
          toastError('Error al Registrar Destrucción')
        }
      })
    },
    reject: () => {
      showLoader.value = false
    },
    onHide: () => {
      showLoader.value = false
    }
  })
}

</script>
