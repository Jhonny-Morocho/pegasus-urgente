<template>
<section>
  <AppFieldset legend="Datos del Denunciante">
    <AppDataTable
      id="dataTableIntervinientes"
      class="col-12 pt-0"
      :lazy="true"
      :value="props.dataDenunciante"
      v-bind="{ ...$attrs }"
    >
      <Column header="N° Documento">
        <template #body="{ data }">
          {{ data.numeroDocumento }}
        </template>
      </Column>
      <Column header="Nombre Completo">
        <template #body="{ data }">
          {{
            data?.nombres +' '+ data?.apellidoPaterno + ' ' + data?.apellidoMaterno
          }}
        </template>
      </Column>
      <Column header="Tipo persona ">
        <template #body="{ data }">
          {{ data.datarepresentaInstitucion === true ? "Persona Jurídica" : "Persona Natural" }}
        </template>
      </Column>
      <Column header="Nacionalidad">
        <template #body="{ data }">
          {{ data.idNacionalidad }}
        </template>
      </Column>
      <Column header="Fecha de nacimiento">
        <template #body="{ data }">
          {{ dateTimeUtil.formatToFrontend(data.fechaNacimiento) }}
        </template>
      </Column>
      <Column header="Edad">
        <template #body="{ data }">
          {{ data.edad }}
        </template>
      </Column>
      <Column header="Género">
        <template #body="{ data }">
          {{ mantenedor_getIdentidadDeGeneroNombreById(data.sexoDeclarado) }}
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
  </AppFieldset>
  <Menu
    id="overlay_menu"
    ref="menuDenunciantes"
    :model="accionesTablaDenunciantes"
    :popup="true"
  />
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps, ref } from 'vue'
import { dateTimeUtil, requestUtil } from '@/utils'
import { useMantenedorStore } from '../../composables/useMantenedorStore.js'
import { useRouter } from 'vue-router'
import { useSujetosIntervinientesStore } from '../../composables/useSujetosIntervinientesStore.js'
import { useFichaCausaStore } from '../../composables/useFichaCausaStore.js'

const router = useRouter()

const props = defineProps({
  dataDenunciante: propTypes.array
})
const { mantenedor_getIdentidadDeGeneroNombreById } = useMantenedorStore()
const { sujetosIntervinientes_getSujetosByIdRelacionSujeto } = useSujetosIntervinientesStore()
const { fichaCausa_SET_SUJETO_SELECCIONADO } = useFichaCausaStore()

const menuDenunciantes = ref()
const denuncianteSeleccionado = {}

function toggleAcciones (event, data) {
  denuncianteSeleccionado.value = data
  menuDenunciantes.value.toggle(event)
}

function abrirFichaSujeto () {
  router.push('/ficha-sujeto')
}
const accionesTablaDenunciantes = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Ficha Sujeto',
        command: () => {
          abrirFichaSujeto()
          requestUtil({
            action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
            payload: { idRelacionSujeto: denuncianteSeleccionado.value.idRelacionSujeto },
            resolve: (r) => {
              fichaCausa_SET_SUJETO_SELECCIONADO(r)
            }
          })
        }
      }
    ]
  }
])

</script>
