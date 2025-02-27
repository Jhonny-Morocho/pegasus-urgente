<template>
<section>
  <AppFieldset
    v-if="cargaFiscal"
    legend="Total Causas con Acuerdo Reparatorio"
  >
    <TablaCargaTrabajo
      v-model:selection="causasSeleccionadas"
      selectable
      :loading="tabla.isLoading"
      :rows="cargaUnidadFiscal?.paginacion?.tamanoPagina"
      :total-records="cargaUnidadFiscal?.paginacion?.elementosTotales"
      :value="cargaUnidadFiscal?.data"
    />
  </AppFieldset>
  <AppFieldset
    v-if="cargaUnidad"
    legend="Distribución de Carga de Trabajo por Unidad"
  >
    <TablaCargaTrabajo
      v-model:selection="causasSeleccionadas"
      selectable
      :loading="tabla.isLoading"
      :rows="cargaUnidadFiscal?.paginacion?.tamanoPagina"
      :total-records="cargaUnidadFiscal?.paginacion?.elementosTotales"
      :value="cargaUnidadFiscal?.data"
    />
  </AppFieldset>

  <div v-if="cargaUnidadFiscal?.data.length > 0">
    <AppForm
      class="grid w-full mt-4"
      :form-submitted="formSubmitted"
      validation-scope="consultar-cierre-scope"
    >
      <AppDropdown
        id="nuevo-fiscal"
        v-model="formData.idNuevoFiscal"
        class="col-6"
        label="Seleccione Nuevo Fiscal Asignado"
        option-label="nombresCompletos"
        option-value="funcionarioId"
        :options="fiscales"
        :rules="{ required }"
      />
      <AppDropdown
        id="nuevo-fiscal"
        v-model="formData.idMotivo"
        class="col-6"
        label="Seleccione Motivo"
        option-label="value"
        option-value="id"
        :options="opcionesMotivo"
        :rules="{ required }"
      />
      <AppInput
        v-if="formData.idMotivo === 3"
        id="observacion-otros-motivos"
        v-model="formData.descripcion"
        class="col-12"
        label="Descripción de Otros Motivos"
      />
    </AppForm>

    <Button
      class="btn-primary mt-4 col-3"
      label="Resignar Causa"
      @click="resignarCausas"
    />
  </div>
</section>
</template>

<script setup>
import TablaCargaTrabajo from './TablaCargaTrabajo.vue'
import AppFieldset from '@/modules/common/components/AppFieldset.vue'
import { propTypes } from '@/modules/common/types'
import { defineProps, onMounted, reactive, ref } from 'vue';
import { useAppToast, useConfirmDialog, useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'
import { useGestionDireccionInvestigacionStore, usePostermino } from '../../composables'
import { useMantenedorStore } from '@/modules/global/composables'

const props = defineProps({
  cargaFiscal: Boolean,
  cargaUnidad: Boolean,
  data: propTypes.object,
  mes: propTypes.string,
  idEstadoCausa: propTypes.string
})

const causasSeleccionadas = ref([])

const { launchConfirmDialog } = useConfirmDialog()
const { toastWarning } = useAppToast()

const { 
  fiscales, 
  mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad
} = useMantenedorStore()

const { postermino_setResignarCausa } = usePostermino()
const { cargaUnidadFiscal, gestionDireccionInvestigacion_filtrarCargaUnidadTrabajoFiscal } = useGestionDireccionInvestigacionStore()

const formData = reactive({
  idNuevoFiscal: '',
  idMotivo: '',
  descripcion: ''
})

const tabla = reactive({
  rows: 5,
  isLoading: false,
  firstRecord: 0
})

const { formSubmitted, isFormValid, required } = useFormValidation({ formData, validationScope: 'consultar-cierre-scope' })

const opcionesMotivo = ref([
  {
    id: 1,
    value: 'Inactividad de la Causa'
  },
  {
    id: 2,
    value: 'Licencia Médica, Vacaciones'
  },
  {
    id: 3,
    value: 'Otros Motivos'
  }
])

async function getFiscales () {
  requestUtil({
    action: mantenedor_getFiscalesByIdFiscaliaAndIdEspecialidad,
    payload: {
      idFiscalia: props.data.idFiscalia,
      idEspecialidad: props.data.idEspecialidad
    }
  })
  console.log(fiscales.value)
}

async function getDataInicial(){
  console.log(props.data)
  console.log(props.idEstadoCausa)
  const params = {
    idEspecialidad: props.data.idEspecialidad,
    idFiscalia: props.data.idFiscalia,
    idFiscal: props.data.idFiscal,
    pagina: 0,
    filasPorPagina: tabla.rows
  }

  if(props.mes){ params.mes = props.mes }
  if(props.idEstadoCausa){ params.idEstado = props.idEstadoCausa }

  requestUtil({
    action: gestionDireccionInvestigacion_filtrarCargaUnidadTrabajoFiscal,
    payload: params,
    resolve: () => {
      if(cargaUnidadFiscal?.data?.length <= 0){
        (props.cargaFiscal) 
          ? toastWarning(`El fiscal ${props.data.nombreFiscal} no posee causas asignadas`)
          : toastWarning(`La unidad ${props.data.nombreFiscal} no posee causas asignadas`)
      }
      console.log('causas', cargaUnidadFiscal.value)
    },
    loader: (l) => { tabla.isLoading = l }
  })
}

async function resignarCausas () {
  if (!isFormValid()) {
    return
  }

  if (causasSeleccionadas.value.length <= 0) {
    toastWarning('Debe seleccionar alguna causa')
    return
  }

  launchConfirmDialog({
    header: 'Reasignar Causas',
    message: '¿Está seguro de Reasignar Causa?',
    accept: () => {
      requestUtil({
        action: postermino_setResignarCausa,
        payload: {
          idNuevoFiscal: formData.idNuevoFiscal,
          idMotivo: formData.idMotivo,
          descripcion: formData.descripcion,
          idCausas: causasSeleccionadas.value.map((c) => {
            return {
              id: c.idBandeja
            }
          })
        }
      })
    }
  })
}

onMounted(async () => {
  getDataInicial()
  getFiscales()
})
</script>