<template>
<section>
  <AppDataTable
    id="antecedentes-solicitados"
    class="col-12"
    :rows="5"
    :value="antecedentesSolicitados"
  >
    <Column header="Antecedentes Solicitados">
      <template #body="slotProps">
        <span>
          {{ slotProps.data.nombreAntecedente ?? fichaCausa_getNombreAntecedentes(slotProps.data.idAntecedenteSolicitado) }}
        </span>
      </template>
    </Column>
    <Column header="Origen">
      <template #body="slotProps">
        <span>
          {{ slotProps.data.nombreOrigen ?? fichaCausa_getNombreOrigenAntecedentes(slotProps.data.idOrigen) }}
        </span>
      </template>
    </Column>
    <Column header="Ámbito">
      <template #body="slotProps">
        <span>
          {{ slotProps.data.idAmbito }}
        </span>
      </template>
    </Column>
    <Column header="Tipo Sujeto/Familia Especie ">
      <template #body="slotProps">
        <span>
          {{ mantenedor_getNombreTipoSujeto(slotProps.data.idTipoSujeto) }}
          {{ mantenedor_getNombreFamiliaEspecie(slotProps.data.idFamiliaEspecie) }}
        </span>
      </template>
    </Column>
    <Column
      header="Sujeto/Tipo Especie"
    >
      <template #body="slotProps">
        <span>
          {{ slotProps.data.personaSujeto }}
          {{ mantenedor_getNombreTipoEspecie(slotProps.data.idTipoEspecie) }}
        </span>
      </template>
    </Column>
    <Column header="Fecha de Solicitud">
      <template #body="slotProps">
        <span>
          {{ dateTimeUtil.formatToFrontend(slotProps.data.fechaUltimaModifica) }}
        </span>
      </template>
    </Column>
    <Column header="Estado">
      <template #body="slotProps">
        <span>
          {{ slotProps.data.estado === '' ? 'Solicitado' : slotProps.data.estado }}
        </span>
      </template>
    </Column>
    <Column
      header="Acciones"
      style="width: 74px"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <Button
            aria-controls="overlay_menu"
            aria-haspopup="true"
            class="p-button-rounded p-button-outlined btn-primary-outline"
            icon="pi pi-ellipsis-v"
            type="button"
            @click="toggleAcciones($event, data)"
          />
        </div>
      </template>
    </Column>
  </AppDataTable>
  <Menu
    id="overlay_menu"
    ref="menuAccionesAntecedentes"
    :model="opcionesAccionMenuAntecedentes"
    :popup="true"
  />
</section>
</template>
<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { ref, defineProps } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import { useFichaCausaStore, useMantenedorStore } from '@/modules/global/composables'
import { useAppToast, useAppDialog } from '@/modules/common/composables'
import ModalRespuestaSolicitudAntecedentesEspecificos from '@/modules/preclasificador/components/validar-calidad-antecedentes/documentos/modales/ModalRespuestaSolicitudAntecedentesEspecificos.vue'

defineProps({
  ruc: propTypes.string
})

const { toastSuccess, toastError } = useAppToast()
const { launchDialog } = useAppDialog()

const menuAccionesAntecedentes = ref(null)

const {
  mantenedor_getNombreFamiliaEspecie,
  mantenedor_getNombreTipoEspecie,
  mantenedor_getNombreTipoSujeto
} = useMantenedorStore()

const {
  antecedentesSolicitados,
  fichaCausa_postResolicitarAntecedentesSolicitados,
  fichaCausa_getNombreAntecedentes,
  fichaCausa_getNombreOrigenAntecedentes
} = useFichaCausaStore()

const antecedenteSeleccionado = ref(null)

function toggleAcciones (event, data) {
  menuAccionesAntecedentes.value.toggle(event)
  antecedenteSeleccionado.value = data
}

const opcionesAccionMenuAntecedentes = ref([
  {
    label: 'Acciones Antecedentes',
    items: [
      {
        label: 'Ver Respuesta',
        command: () => {
          launchDialog({
            component: ModalRespuestaSolicitudAntecedentesEspecificos,
            header: 'Respuesta Solicitud',
            width: '60%'
          })
        }
      },
      {
        label: 'Re-Solicitar',
        command: () => {
          console.log('reSolicitar()')
          requestUtil({
            action: fichaCausa_postResolicitarAntecedentesSolicitados,
            payload: {
              antecedente: antecedenteSeleccionado.value
            },
            resolve: (res) => {
              console.log('resolve =>', res)
              toastSuccess('Se a re solicitado el antecedente correctamente')
            },
            reject: (err) => {
              console.log(err)
              toastError('Ha ocurrido un error al re solicitar el antecedente.\n', err)
            }
          })
        }
      }
    ]
  }
])
</script>
