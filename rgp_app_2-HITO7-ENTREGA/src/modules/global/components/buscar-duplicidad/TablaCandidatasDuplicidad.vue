<template>
<section class="col-12">
  <AppDataTable
    v-model:selection="candidataSeleccionada"
    responsive-layout="stack"
    v-bind="{ ...$attrs }"
  >
    <Column
      header="Ver más"
      style="width: 74px"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <span>
            <Button
              class="p-button-rounded p-button-outlined mr-2"
              icon="pi pi-plus"
              @click="openModalVerMas(data)"
            />
          </span>
        </div>
      </template>
    </Column>

    <Column
      header="Seleccionar"
      style="width: 48px"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <input
            :id="data.id"
            v-model="candidataSeleccionada"
            class="p-checkbox"
            type="radio"
            :value="data"
          >
        </div>
      </template>
    </Column>

    <Column
      field="rolUnico"
      header="RUC"
      header-style="width: 14%"
      sortable
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline w-max"
          :label="data?.rolUnico"
          @click="sendToDenuncia(data)"
        />
      </template>
    </Column>
    <Column
      v-if="route.name === 'DOValidarDuplicidad'"
      header="Denunciante"
    >
      <template #body="{ data }">
        {{ getInterviniente(data.intervinientes, "1") }}
      </template>
    </Column>
    <Column
      v-if="route.name !== 'DOValidarDuplicidad'"
      header="Víctima"
      header-style="width: 16%"
    >
      <template #body="{ data }">
        {{ getInterviniente(data.intervinientes, "6") }}
      </template>
    </Column>
    <Column
      v-if="route.name !== 'DOValidarDuplicidad'"
      header="Imputado"
    >
      <template #body="{ data }">
        {{ getInterviniente(data.intervinientes, "3") }}
      </template>
    </Column>
    <Column
      v-if="route.name == 'DOValidarDuplicidad'"
      field="estadoCausa"
      header="Estado"
      sortable
    >
      <template #body="{ data }">
        {{ data?.estadoCausa }}
      </template>
    </Column>
    <Column
      field="delitos"
      header="Delito"
      sortable
    >
      <template #body="{ data }">
        {{ getNombreTipoDelitoById(data.delitos[0].idTipoDelito) }}
      </template>
    </Column>
    <Column
      field="fechaDenuncia"
      header="Fecha Delito"
      sortable
    >
      <template #body="{ data }">
        {{
          data?.fechaDenuncia &&
            dateTimeUtil.formatToFrontend(data?.fechaDenuncia)
        }}
      </template>
    </Column>
    <Column
      v-if="route.name !== 'DOValidarDuplicidad'"
      header="VIF"
    >
      <template #body="{ data }">
        <i
          v-if="!!data.delitos.find((d) => d.esVif === true)"
          class="pi pi-exclamation-triangle"
          style="font-size: 1.5rem; color: red"
        />
        <p v-else>
          No
        </p>
      </template>
    </Column>
  </AppDataTable>
  <AppBtnNextTeleported
    v-if="route.name !== 'DOValidarDuplicidad'"
    class="mx-3 btn-form"
    :disabled="!candidataSeleccionada"
    icon="pi pi-clone"
    label="Generar Duplicidad"
    :loading="loadingGenerarDuplicidad"
    @click="openModalDuplicidad()"
  />
</section>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import {
  useBuscarDuplicidadStore,
  useMantenedorStore,
  usePamStore
} from '@/modules/global/composables'
import { dateTimeUtil, requestUtil } from '@/utils'
import {
  useAppDialog,
  useConfirmDialog,
  useAppToast
} from '@/modules/common/composables'
import { useRouter, useRoute } from 'vue-router'

import AppBtnNextTeleported from '@/modules/common/components/buttons/AppBtnNextTeleported.vue'
import ModalVerMas from '@/modules/global/components/buscar-duplicidad/modales/ModalVerMas.vue'
import { useFichaCausa } from '@/modules/ficha-causa/composables'

const { buscarDuplicidad_decisionCausaDuplicada } = useBuscarDuplicidadStore()
const { launchConfirmDialog } = useConfirmDialog()

const { launchDialog } = useAppDialog()

const { toastWarning, toastSuccess, toastError } = useAppToast()

const { procesoPam } = usePamStore()

// const { fichaCausa_getCausa } = useFichaCausaStore()
const { flujoOrigen, sendToFichaCausa } = useFichaCausa()

const router = useRouter()
const route = useRoute()

const loadingGenerarDuplicidad = ref(false)
const candidataSeleccionada = ref(null)

const { mantenedor_getNombreTipoDelito, mantenedor_getIdTipoSujetoByCodigo } =
  useMantenedorStore()

defineExpose({ candidataSeleccionada })

function getNombreTipoDelitoById (id) {
  return mantenedor_getNombreTipoDelito(id)
}

function openModalVerMas (data) {
  launchDialog({
    component: ModalVerMas,
    header: `Dirección del Delito y Relato del Hecho`,
    width: '50%',
    props: {
      candidata: {
        ...data
      }
    }
  })
}

function openModalDuplicidad () {
  launchConfirmDialog({
    header: 'Generar Duplicidad',
    message: '¿Está seguro de Generar Duplicidad?',
    accept: () => {
      const samplePayload = {
        procesoPam: { ...procesoPam.value, usuario: 'usuario' },
        dataCausaDuplicada: {
          idSolicitudCausa: procesoPam.value.idCausa,
          rolUnicoCausaOriginal: candidataSeleccionada.value.rolUnico,
          esCausaDuplicada: true,
          tipoDenuncia: 'directa'
        }
      }
      requestUtil({
        action: buscarDuplicidad_decisionCausaDuplicada,
        payload: {
          ...samplePayload
        },
        resolve: () => {
          toastSuccess('Se aceptó la denuncia como Causa Duplicada!')
          router.push('/ingreso/denuncia-directa')
        },
        loader: (l) => (loadingGenerarDuplicidad.value = l),
        reject: (err) => {
          toastError('Ha ocurrido un error', err)
        }
      })
    },
    reject: () => {
      toastWarning('Se cancelo generar duplicidad de la denuncia')
    }
  })
}

async function sendToDenuncia (data) {
  const ruc = data.rolUnico
  sendToFichaCausa({
    origenCausa: flujoOrigen.TRANSVERSAL,
    ruc,
    idCausa: data.idCausa,
    idDenuncia: data.idDenuncia,
    newTab: true
  })
}

//  codigoTipoSujeto: 6=>VICTIMA 1=>DENUNCIANTE 3=>IMPUTADO

function getInterviniente (intervinientes, codigoTipoSujeto) {
  const nombreSujeto = intervinientes.find(
    (i) => {
      if (codigoTipoSujeto === '6' && i.esVictima) {
        return i
      } else if (i.idTipoInterviniente ===
      mantenedor_getIdTipoSujetoByCodigo(codigoTipoSujeto)) {
        return i
      } else {
        return null
      }
    })
  return nombreSujeto?.nombre ?? 'Sin Información'
}
</script>
