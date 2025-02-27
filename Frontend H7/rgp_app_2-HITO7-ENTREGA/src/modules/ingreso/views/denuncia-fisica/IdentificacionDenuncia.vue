<template>
<AppForm
  id="identificacion-denuncia"
  :form-submitted="formSubmitted"
  validation-scope="identificacionDenunciaFisica"
>
  <div
    v-if="loadingTables.idDenuncia"
    class="col-12"
  >
    <LoaderSkeleton />
  </div>
  <div
    v-show="!loadingTables.idDenuncia"
    class="grid"
  >
    <IdentificacionDenuncia
      ref="identificacion"
      class="col-12 lg:col-8"
      validation-scope="identificacionDenunciaFisica"
    />
    <IdentificacionOfPartes
      ref="ofpartes"
      class="col-12 md:col-8 lg:col-4"
    />
    <RucRit
      ref="rucRit"
      class="col-12 md:col-8"
    />
    <FiscaliaLocal
      ref="fiscaliaLocal"
      class="col-12"
      :loading="loadingTables.fiscaliaLocal"
    />
    <IdentificacionDenunciaInformacionInstitucion
      ref="informacionInstitucionRef"
      class="col-12"
    />
    <Funcionarios
      ref="funcionarios"
      class="col-12"
      :loading="loadingTables.fiscaliaLocal"
    />
  </div>
  <AppBtnNextTeleported
    label="Sujetos Intervinientes"
    :loading="loadingStepSujetos"
    @click="handleSubmitForm"
  />
</AppForm>
</template>

<script setup>
import { defineEmits, onMounted, ref, reactive } from 'vue'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'

import IdentificacionDenuncia from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaIdentificacionDenunciaFisica.vue'
import IdentificacionOfPartes from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaIdentificacionOfPartes.vue'
import RucRit from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaRucRitFieldset.vue'
import FiscaliaLocal from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaFiscaliaLocalFieldset.vue'
import IdentificacionDenunciaInformacionInstitucion from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaInformacionInstitucion.vue'
import Funcionarios from '@/modules/global/components/identificacion-denuncia/IdentificacionDenunciaFuncionarioFieldset.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

import {
  useMantenedorStore,
  usePamStore,
  useFuncionarios
} from '@/modules/global/composables'
import { requestUtil } from '@/utils'
import {
  useCrearCausaStore,
  useIdentificacionDenunciaStore
} from '@/modules/ingreso/composables'
import {
  useAppToast,
  useFormValidation,
  useAppGlobalProperties
} from '@/modules/common/composables'

const { $userFiscaliaActual } = useAppGlobalProperties()
const { toastError, TOAST_MESSAGES } = useAppToast()
const { tipoDenuncia } = useCrearCausaStore()
const { isFormValid, formSubmitted } = useFormValidation({
  formData: {},
  validationScope: 'identificacionDenunciaFisica'
})
const { funcionarios_getFuncionarioIdDenuncia } = useFuncionarios()

const identificacion = ref(null)
const ofpartes = ref(null)
const fiscaliaLocal = ref(null)
const informacionInstitucionRef = ref(null)
const funcionarios = ref(null)
const loadingStepSujetos = ref(false)
const loadingTables = reactive({
  fiscaliaLocal: false,
  idDenuncia: false,
  funcionarios: false
})

const { procesoPam } = usePamStore()

const {
  identificacionDenuncia_addIdentificacion,
  identificacionDenuncia_getByIdDenuncia,
  identificacionDenuncia,
  informacionInstitucion,
  identificacionDenuncia_guardarInformacionInstitucion,
  identificacionDenuncia_getInformacionInstitucion
} = useIdentificacionDenunciaStore()

const {
  mantenedor_getTiposDenuncia,
  mantenedor_getTipoDenunciaId,
  mantenedor_getCodigoFiscaliaById,
  mantenedor_getIdTiposFiscaliaByDescripcion,
  mantenedor_getIdTiposFiscaliaByCodigoFiscalia,
  mantenedor_getIdFiscaliaByCodigo,
  mantenedor_getIdRegionByCodigo
} = useMantenedorStore()

onMounted(() => {
  getDataIdentificacionDenunciaById()
})

function getDataMantenedor () {
  requestUtil({ action: mantenedor_getTiposDenuncia })
}
getDataMantenedor()

function getDataIdentificacionDenunciaById () {
  getIdentificacionParteDenuncia()
  getInformacionInstitucion()
  getFuncionarios()
}

function getIdentificacionParteDenuncia () {
  const identificacionParteDenuncia = {
    numeroParteDenuncia: identificacionDenuncia?.value?.numeroParteDenuncia,
    fechaParteDenuncia:
      identificacionDenuncia?.value?.fechaParteDenunciaBandeja ??
      identificacionDenuncia?.value?.fechaParteDenuncia,
    fechaIngresoPartes:
      identificacionDenuncia?.value?.fechaIngresoPartesBandeja ??
      identificacionDenuncia?.value?.fechaIngresoPartes,
    idDenuncia: procesoPam?.value.idDenuncia
  }
  requestUtil({
    action: identificacionDenuncia_getByIdDenuncia,
    payload: identificacionParteDenuncia,
    reject: (err) => {
      console.log(err)
    },
    loader: (l) => {
      loadingTables.idDenuncia = l
    },
    resolve: (r) => {
      setTimeout(() => {
        setData(r)
      }, 1000)
    }
  })
}

function getInformacionInstitucion () {
  requestUtil({
    action: identificacionDenuncia_getInformacionInstitucion,
    payload: {
      idDenuncia: procesoPam.value?.idDenuncia
    },
    loader: (l) => {
      loadingTables.fiscaliaLocal = l
    }
  })
}

function getFuncionarios () {
  requestUtil({
    action: funcionarios_getFuncionarioIdDenuncia,
    payload: {
      idDenuncia: procesoPam.value?.idDenuncia
    },
    loader: (l) => {
      loadingTables.funcionarios = l
    }
  })
}
const tipoDenunciaFisica = mantenedor_getTipoDenunciaId(tipoDenuncia.value)

function setData (data) {
  const {
    numeroParteDenuncia, numeroDenuncia,
    esReservada, identificadorUnicoDenuncia,
    fechaParteDenuncia
  } = identificacionDenuncia.value
  // identificacion denuncia
  identificacion.value?.populateData({
    numeroParteDenuncia:
      numeroParteDenuncia ||
      numeroDenuncia,
    esReservada,
    identificadorUnicoDenuncia,
    idTipoDenuncia: tipoDenunciaFisica,
    medioDeRecepcion: 'Físico',
    fechaParteDenuncia
  })
  // parte denuncia
  ofpartes.value?.populateData({
    ...identificacionDenuncia.value
  })
  // Informacion Institucion
  if (informacionInstitucion.value) {
    informacionInstitucionRef.value?.populateData({
      ...informacionInstitucion.value
    })
  }
  if (data.idFiscaliaMantenedor) {
    fiscaliaLocal.value.populateData({
      ...data,
      tipoFiscalia: mantenedor_getIdTiposFiscaliaByDescripcion(
        data.tipoFiscalia
      ),
      nombreFiscalia: data.idFiscaliaMantenedor.toUpperCase(),
      region: data.regionFiscalia,
      numeroFiscalia: mantenedor_getCodigoFiscaliaById(
        data.idFiscaliaMantenedor
      )
    })
  } else {
    fiscaliaLocal.value.populateData({
      tipoFiscalia: mantenedor_getIdTiposFiscaliaByCodigoFiscalia(
        $userFiscaliaActual.value.idFiscalia
      ),
      nombreFiscalia: mantenedor_getIdFiscaliaByCodigo(
        $userFiscaliaActual.value.idFiscalia
      ),
      region: mantenedor_getIdRegionByCodigo(
        $userFiscaliaActual.value.region.toString()
      ),
      numeroFiscalia: $userFiscaliaActual.value.fiscalia
    })
  }
}

const addIdentificacion = () => {
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
    return
  }

  // Informacion Institucion
  const {
    unidadPolicialOrganismo,
    prefecturaDependencia,
    destacamento,
    telefonoContacto,
    correoElectronicoContacto,
    region,
    comuna,
    calle,
    poblacion,
    numeroCalle,
    idOrganismoColaboradorUnidadDireccion,
    comisaria
  } = informacionInstitucionRef.value.formData

  const informacionInstitucionPayload = {
    organismoColaboradorUnidad: {
      organismoColaborador: {
        categoria: unidadPolicialOrganismo, // Valor de unidad policial u organismo - Ejemplo = Carabineros
        division: prefecturaDependencia // Valor de Prefectura/Dependencia U.P - Ejemplo = VII ZONA TALCA
      },
      comisaria,
      destacamento,
      telefono: telefonoContacto,
      email: correoElectronicoContacto
    },
    direccion: {
      idDireccion: idOrganismoColaboradorUnidadDireccion,
      idRegion: region,
      idComuna: comuna,
      calle: calle,
      numeroCalle: numeroCalle,
      nombrePoblacionVilla: poblacion
    },
    idDenuncia: procesoPam?.value.idDenuncia
  }

  requestUtil({
    action: identificacionDenuncia_guardarInformacionInstitucion,
    payload: {
      contrato: informacionInstitucionPayload,
      ref: informacionInstitucionRef.value.formData
    },
    resolve: () => {
      addIdentificacionDenuncia()
    },
    loader: (v) => (loadingStepSujetos.value = v),
    reject: () => {
      toastError('Ocurrió un error al guardar el organismo colaborador')
    }
  })
}

function addIdentificacionDenuncia () {
  const formData = {
    ...fiscaliaLocal.value.formData,
    ...identificacion.value.formData,
    ...ofpartes.value.formData
  }
  // identificacion Denuncia
  const identificacionDenunciaPayload = {
    identificadorUnicoDenuncia:
      identificacionDenuncia.value.identificadorUnicoDenuncia,
    idMedioRecepcion: formData.medioDeRecepcion,
    idTipoDenuncia: tipoDenunciaFisica,
    fechaIngreso: formData.fechaDeDenuncia,
    numeroDenuncia: formData.numeroParteDenuncia,
    esReservada: formData.esReservada,
    tipoDenuncia: 'fisica',
    idDenuncia: procesoPam?.value.idDenuncia,
    idFiscalia: formData.nombreFiscalia
  }

  requestUtil({
    action: identificacionDenuncia_addIdentificacion,
    payload: identificacionDenunciaPayload,
    loader: (v) => (loadingStepSujetos.value = v),
    resolve: () => {
      nextStep()
    },
    reject: () => {
      toastError('Ocurrió un error inesperado')
    }
  })
}

const emit = defineEmits(['next-step'])

async function handleSubmitForm () {
  if (identificacionDenuncia.value) {
    addIdentificacion()
  } else {
    loadingStepSujetos.value = true
    setTimeout(() => {
      loadingStepSujetos.value = false
      emit(
        'next-step',
        '/ingreso/denuncia-fisica/nueva-denuncia/sujetos-intervinientes'
      )
    }, 500)
  }
}

function nextStep () {
  emit(
    'next-step',
    '/ingreso/denuncia-fisica/nueva-denuncia/sujetos-intervinientes'
  )
}
</script>
