<template>
<AppFieldset
  class="mt-3"
  :legend="'Direcciones'"
>
  <div class="grid col-12 mt-1 ml-1">
    <div class="field">
      <Button
        class="btn-fileupload"
        icon="pi pi-plus"
        icon-pos="right"
        label="Agregar Dirección"
        type="button"
        @click="modalAddDireccion"
      />
    </div>
    <div class="field pl-2">
      <Button
        class="btn-form"
        icon="pi pi-save"
        icon-pos="right"
        label="Guardar Direcciones"
      />
    </div>
    <div class="field pl-2">
      <Button
        class="p-button-outlined btn-primary-outline"
        icon="pi pi-search"
        icon-pos="right"
        label="Datos históricos intervinientes"
        @click="solicitarDatos()"
      />
    </div>
    <div class="field pl-2">
      <Button
        id="handleCancelar"
        class="p-button-outlined p-button-warning"
        icon="pi pi-arrow-up-right"
        icon-pos="right"
        label="Ocultar Dirección"
        style="width: auto"
        type="button"
        @click="clickOcultarDireccion()"
      />
    </div>
    <AppDataTable
      class="col-12"
      data-key="ruc"
      :loading="loading"
      responsive-layout="stack"
      :rows="paginacion?.tamanoPagina"
      :total-records="paginacion?.elementosTotales"
      :value="direcciones"
    >
      <Column
        header="Tipo Dirección"
        sortable
      >
        <template #body="slotProps">
          {{
            mantenedor_getTipoDireccionById(slotProps.data.idTipoDireccion) ??
              slotProps.data.idTipoDireccion
          }}
        </template>
      </Column>
      <Column />
      <Column
        header="Comuna"
        sortable
      >
        <template #body="slotProps">
          {{ slotProps.data.comuna }}
        </template>
      </Column>
      <Column />
      <Column
        field="calle"
        header="Calle"
        sortable
      />
      <Column />
      <Column
        field="numeroCalle"
        header="Número"
        sortable
      />
      <Column />
      <Column header="Acciones">
        <template #body="slotProps">
          <span>
            <Button
              class="mr-2 p-button-rounded p-button-outlined btn-primary-outline"
              icon="pi pi-map-marker"
              @click="modalVerDirrecion(slotProps.data)"
            />
            <Button
              class="p-button-rounded p-button-outlined p-button-danger"
              icon="pi pi-trash"
              @click="modalEliminarDireccion(slotProps.data)"
            />
          </span>
        </template>
      </Column>
    </AppDataTable>
  </div>
</AppFieldset>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, computed } from 'vue'

// components
import ModalDireccion from '@/modules/global/components/direcciones/ModalDireccion.vue'
import ModalDatosHistoricos from '../modals/ModalDatosHistoricos.vue'
import { requestUtil } from '@/utils'

// composables
import { useAppDialog, useAppToast } from '@/modules/common/composables'
import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'
import { useDireccionStore } from '@/modules/direccion/composables'

import {
  useMantenedorStore,
  useSujetosIntervinientesStore
} from '@/modules/global/composables'

const { launchDialog } = useAppDialog()
const { launchConfirmDialog } = useConfirmDialog()

const { toastError, toastSuccess } = useAppToast()

const { sujetosIntervinientes_getDatosHistoricos } =
  useSujetosIntervinientesStore()

const {
  direccion_addDireccion,
  direccion_deleteDireccion,
  direccion_getDirecciones,
  direccion_getDireccion,
  direcciones,
  paginacion
} = useDireccionStore()

const {
  mantenedor_getTipoDireccionById,
  mantenedor_getIdTipoDireccionByDescripcion,
  mantenedor_getTiposDireccion
} = useMantenedorStore()

const props = defineProps({
  interviniente: {
    type: Object,
    required: true
  },
  ocultarDireccion: {
    type: Function,
    default: () => undefined
  }
})

function setDirecciones () {
  requestUtil({
    action: direccion_getDirecciones,
    payload: {
      idPersona: props.interviniente.idPersona
    },
    loader: (v) => {
      loading.value = v
    }
  })
}

watch(props, () => setDirecciones())

const loading = ref(true)

const existeDireccionNotificacion = computed(() => {
  return direcciones?.value.some((d) => d.indicadorDireccionNotificacion)
})

onMounted(() => {
  setDirecciones()
})

function getMantenedor () {
  requestUtil({ action: mantenedor_getTiposDireccion })
}
getMantenedor()

function clickOcultarDireccion () {
  props.ocultarDireccion()
}

function modalAddDireccion () {
  launchDialog({
    component: ModalDireccion,
    header: 'Agregar Dirección',
    confirmLabel: 'Guardar Dirección',
    width: '80vw',
    props: {
      data: {
        tipo: '',
        region: '',
        comuna: '',
        calle: '',
        numero: '',
        block: '',
        cuadrante: '',
        sector: '',
        nombrePoblacionVilla: '',
        interseccion: '',
        observacion: '',
        indicadorDireccionNotificacion: false,
        tipoVivienda: '',
        tipoSector: '',
        tipoResidencia: ''
      },
      existeDireccionNotificacion: existeDireccionNotificacion.value
    },
    accept: (payload) => {
      loading.value = true
      const {
        calle,
        comuna,
        cuadrante,
        block,
        interseccion,
        lat,
        lng,
        numero,
        observacion,
        nombrePoblacionVilla,
        region,
        sector,
        tipo,
        tipoResidencia,
        tipoSector,
        tipoVivienda,
        indicadorDireccionNotificacion
      } = payload

      const contract = {
        idDireccion: '',
        persona: props.interviniente.idPersona,
        idTipoDireccion: tipo,
        idRegion: region,
        idComuna: comuna,
        block: block,
        indicadorDireccionNotificacion: indicadorDireccionNotificacion,
        cuadrante: cuadrante,
        calle: calle,
        numeroCalle: numero,
        nombrePoblacionVilla: nombrePoblacionVilla,
        geolocalizacion: {
          lat: lat,
          lon: lng
        },
        tipoVivienda: tipoVivienda,
        tipoSector: tipoSector,
        sector: sector,
        interseccion: interseccion,
        observacion: observacion,
        tipoResidencia: tipoResidencia
      }

      requestUtil({
        action: direccion_addDireccion,
        payload: contract,
        loader: (v) => {
          setTimeout(() => {
            loading.value = v
          }, 2000)
        },
        resolve: () => {
          toastSuccess('Dirección agregada con éxito')
          setDirecciones()
        }
      })
    }
  })
}

function modalVerDirrecion ({ idDireccion, idContactoDueno }) {
  requestUtil({
    action: direccion_getDireccion,
    payload: {
      idDireccion,
      idContactoDueno
    },
    resolve: (data) => {
      const {
        calle,
        cuadrante,
        idTipoDireccion,
        idComuna,
        idRegion,
        numeroCalle,
        sector,
        tipoVivienda,
        block,
        nombrePoblacionVilla,
        interseccion,
        observacion,
        tipoSector,
        indicadorDireccionNotificacion,
        tipoResidencia,
        geolocalizacion
      } = data
      launchDialog({
        component: ModalDireccion,
        header: 'Ver Dirección',
        cancelLabel: 'Cerrar',
        width: '80vw',
        props: {
          readonly: true,
          data: {
            calle,
            cuadrante,
            sector,
            interseccion,
            tipoVivienda,
            tipoSector,
            tipoResidencia,
            tipo: mantenedor_getIdTipoDireccionByDescripcion(idTipoDireccion),
            region: idRegion,
            comuna: idComuna,
            numero: numeroCalle,
            block,
            nombrePoblacionVilla,
            observacion,
            indicadorDireccionNotificacion,
            lat: geolocalizacion.lat,
            lng: geolocalizacion.lon
          }
        }
      })
    }
  })
}

function modalEliminarDireccion ({ idDireccion, idContactoDueno }) {
  launchConfirmDialog({
    message: `¿Está seguro de eliminar esta dirección?`,
    accept: () => {
      loading.value = true
      requestUtil({
        action: direccion_deleteDireccion,
        payload: {
          idDireccion,
          idContactoDueno
        },
        loader: (v) => {
          setTimeout(() => {
            loading.value = v
          }, 2000)
        },
        resolve: () => setDirecciones(),
        reject: (e) => {
          toastError(e)
        }
      })
    }
  })
}
function solicitarDatos () {
  const { numeroDocumento, tipoDocumento, paisDocumento } = props.interviniente
  requestUtil({
    action: sujetosIntervinientes_getDatosHistoricos,
    payload: {
      tipoDocumentoIdentificacion: tipoDocumento,
      paisDocumento: paisDocumento,
      numeroDocumento: numeroDocumento
    },
    resolve: (data) => {
      launchDialog({
        component: ModalDatosHistoricos,
        header: 'Datos Históricos',
        confirmLabel: 'Aceptar',
        width: '40%',
        props: { data }
      })
    },
    reject: (value) => {
      console.error(value.message)
    }
  })
}
</script>
