<template>
<section>
  <AppFieldset
    class="col-12"
    :collapsed="origenTabla.length < 1"
    :legend="
      esDinero
        ? 'Listado de Dineros Incautados Pendientes de Recepción'
        : 'Listado de Especies Incautadas Pendientes de Recepción'
    "
    toggleable
  >
    <p
      class="ml-3"
      style="font-size: 1.5em"
    >
      NUE:
      <span
        class="link"
        @click="verCadenaCustodia(nue.nue)"
      >{{
        nue.nue
      }}</span>
    </p>
    <AppDataTable
      id="tabla-lsita-especies-pendietes-recepcion"
      breakpoint="960px"
      class="col-12"
      :loading="loaderDenominacion"
      responsive-layout="stack"
      :rows="10"
      :value="nue.r"
    >
      <Column
        field="familiaEspecie"
        filter-field="familiaEspecie"
        header="Familia Especie"
      >
        <template #body="slotProps">
          {{
            mantenedor_getNombreFamiliaEspecie(
              slotProps.data?.familiaEspecie
            ) ?? "No definido"
          }}
        </template>
      </Column>
      <Column
        field="tipoEspecie"
        filter-field="tipoEspecie"
        header="Tipo Especie"
      >
        <template #body="slotProps">
          {{ tipoEspecie(slotProps.data?.idTipoEspecie) }}
          <i
            v-if="!tipoEspecie(slotProps.data?.idTipoEspecie)"
            class="pi pi-spin pi-spinner"
            style="font-size: 2rem; color: grey"
          />
        </template>
      </Column>
      <Column
        field="descripcion"
        filter-field="descripcion"
        header="Descripción"
      >
        <template #body="slotProps">
          {{ slotProps.data?.descripcion ?? "No definido" }}
        </template>
      </Column>
      <Column
        field="marca"
        filter-field="marca"
        header="Marca"
      >
        <template #body="slotProps">
          {{
            slotProps.data?.idEspeciePeligrosaClase
              ? "Especie Peligrosa " +
                mantenedor_getDescripcionClasesPeligroEspeciesById(
                  slotProps.data?.idEspeciePeligrosaClase
                )
              : "No definido"
          }}
        </template>
      </Column>
      <Column
        field="cantidadMonto"
        filter-field="cantidadMonto"
        :header="esDinero ? 'Monto' : 'Cantidad'"
      >
        <template #body="slotProps">
          {{ esDinero ? dataDinero : slotProps.data?.cantidadEspecie }}
          <!-- {{ esDinero ? getMonto(slotProps.data.idEspecie) : slotProps.data?.cantidadEspecie }} -->
        </template>
      </Column>
      <Column
        field="observaciones"
        filter-field="observaciones"
        header="Observaciones"
      >
        <template #body="slotProps">
          {{ slotProps.observacion ?? "Sin observaciones" }}
        </template>
      </Column>
      <Column
        class="text-center"
        field="imagenes"
        filter-field="imagenes"
        header="Imágenes"
        style="width: 105px"
      >
        <template #body="{data}">
          <i
            v-if="data?.documentos?.find((e) => e.id_filenet) !== undefined"
            class="pi pi-images link"
            style="font-size: 2em"
            @click="openModalImagen(data)"
          />
          <span v-else>Sin Imagen</span>
        </template>
      </Column>
      <Column
        v-if="esDinero"
        field="reglaNegocio"
        filter-field="reglaNegocio"
        header="Resultado Regla de Negocio"
      >
        <template #body="">
          {{ resultadoReglaNegocio ? "Rechazar" : "Recibir" }}
        </template>
      </Column>
      <Column
        v-else
        field="reglaNegocio"
        filter-field="reglaNegocio"
        header="Resultado Regla de Negocio"
      >
        <template #body="slotProps">
          {{ slotProps.data?.especiePeligrosa ? "Rechazar" : "Recibir" }}
        </template>
      </Column>
      <Column
        class="text-center"
        field="acciones"
        filter-field="acciones"
        header="Acciones"
        style="width: 0"
      >
        <template #body="slotProps">
          <Button
            v-if="loaderDenominacion"
            class="p-button-rounded p-button-outlined pi-spin"
            disabled
            icon="pi pi-spinner"
          />
          <Button
            v-else
            aria-controls="overlay_menu"
            aria-haspopup="true"
            class="p-button-rounded p-button-outlined btn-primary-outline"
            icon="pi pi-ellipsis-v"
            type="button"
            @click="toggleAcciones($event, slotProps.data)"
          />
        </template>
      </Column>
    </AppDataTable>
    <Menu
      id="overlay_menu"
      ref="menuAccionesTablaEspeciesIncautadas"
      :model="
        esDinero
          ? accionesTablaEspeciesIncautadasDinero
          : accionesTablaEspeciesIncautadasEspecies
      "
      :popup="true"
    />
  </AppFieldset>
</section>
</template>

<script setup>
// IMPORT COMPONENTS AND FUNCTIONALITIES
import { useMantenedorStore } from '@/modules/global/composables'
import { defineEmits, ref, defineProps, watch } from 'vue'
import { useEspecieIncautadaPendienteRecepcionStore, useIdentificacionNueStore } from '@/modules/recepcion-especies-dinero/composables'
import { requestUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useRouter } from 'vue-router'
import { useAppDialog } from '@/modules/common/composables'
import ModalImagenEvidencia from '@/modules/recepcion-especies-dinero/components/ver-cadena-custodia/modals/ModalImagenEvidencia.vue'
// UTILITIES

const router = useRouter()
// VALUES
const emit = defineEmits([
  'action:marcar-como-peligrosa',
  'action:mostrar-denominacion-dineros',
  'action:numeros-de-serie',
  'action:ver-imagenes'
])

const props = defineProps({
  origenTabla: propTypes.array,
  esDinero: {
    type: Boolean,
    default: () => false
  },
  loaderDenominacion: Boolean,
  nue: propTypes.object,
  resultadoReglaNegocio: Boolean
})

const especieDineroSeleccionada = ref(null)
const menuAccionesTablaEspeciesIncautadas = ref('')

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getAllTiposEspecie,
  mantenedor_getDescripcionClasesPeligroEspeciesById
} = useMantenedorStore()

const {
  stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie
} = useEspecieIncautadaPendienteRecepcionStore()
const { stepIdentificacionNue_obtenerDocumentosByIdEspecie } = useIdentificacionNueStore()
const { launchDialog } = useAppDialog()

const dataDinero = ref()

function getMonto (d) {
  if (d.find(di => di.tipoMoneda)) {
    return d.find(di => di.tipoMoneda)?.monto
  } else {
    return d.find(di => di.monto)?.monto
  }
}

function getDataDinero () {
  requestUtil({
    action: stepEspeciesIncautadasPendientesDeRecepcion_getEspecieByIdEspecie,
    payload: { id: props.nue.r.find(d => d.idEspecie).idEspecie },
    resolve: (r) => {
      dataDinero.value = `$ ${new Intl.NumberFormat('es-CL').format(getMonto(r.dinero))}`
    }
  })
}
watch(
  () => props.loaderDenominacion,
  () => getDataDinero()
)

function tipoEspecie (idTipoEspecie) {
  requestUtil({
    action: mantenedor_getAllTiposEspecie
  })
  return mantenedor_getNombreTipoEspecie(idTipoEspecie)
}

// LOGIC
function toggleAcciones (event, data) {
  menuAccionesTablaEspeciesIncautadas.value.toggle(event)
  especieDineroSeleccionada.value = data
}

const accionesTablaEspeciesIncautadasDinero = ref([
  {
    label: 'Acciones Antecedentes',
    items: [
      {
        label: 'Denominación de Dineros',
        command: () => {
          // setDinero(especieDineroSeleccionada)
          emit(
            'action:mostrar-denominacion-dineros',
            especieDineroSeleccionada.value
          )
        }
      },
      {
        label: 'Ver números de serie',
        command: () => {
          emit('action:numeros-de-serie', especieDineroSeleccionada.value)
        }
      }
    ]
  }
])

const accionesTablaEspeciesIncautadasEspecies = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Marcar como peligrosa',
        command: () => {
          emit('action:marcar-como-peligrosa', especieDineroSeleccionada.value)
        }
      }
    ]
  }
])
function openModalImagen (data) {
  requestUtil({
    action: stepIdentificacionNue_obtenerDocumentosByIdEspecie,
    payload: { idEspecie: data.idEspecie },
    resolve: (data) => {
      console.log('res filent', data)
      launchDialog({
        component: ModalImagenEvidencia,
        header: 'Imágenes',
        width: '80vw',
        heigth: '50vh',
        props: {
          dataDocumento: {
            data
          }
        },
        cancelLabel: 'Cerrar'
      })
    }
  })
}
function verCadenaCustodia (nue) {
  console.log(nue)
  router.push({ path: '/custodia/cadena-custodio/ver-cadena-custodia' })
}
</script>
<style scoped>
.link {
  color: #1450b8 !important;
}
.link:hover {
  background-color: #f5f5f5 !important;
}
</style>
