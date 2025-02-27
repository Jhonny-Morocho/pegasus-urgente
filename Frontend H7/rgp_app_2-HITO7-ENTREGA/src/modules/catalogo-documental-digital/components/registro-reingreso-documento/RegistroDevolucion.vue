<template>
<AppFieldset
  class="p-fluid pb-6"
  legend="Registro de Devolución"
>
  <AppForm
    id="RegistroDevolucion"
    class="col-12"
    :form-submitted="formSubmitted"
    validation-scope="RegistroDevolucion"
  >
    <section>
      <div class="col-12 md:col-12 p-fluid">
        <div class="grid formgrid">
          <div class="col-4">
            <AppDropdown
              id="devueltoPor"
              v-model="formData.devueltoPor"
              label="Devuelto por"
              option-label="descripcion"
              option-value="id"
              :options="funcionarios"
              :rules="{ required }"
              show-clear
            />
          </div>

          <div
            v-if="formData.devueltoPor !== getIdFuncionarioByCogido('2')"
            class="col-4"
          >
            <AppDropdown
              id="devueltoPorIdentificador"
              v-model="formData.devueltoPorIdentificador"
              :label="
                formData.devueltoPor === getIdFuncionarioByCogido('1')
                  ? 'Seleccione Funcionario'
                  : 'Seleccione Quien devuelve'
              "
              option-label="descripcion"
              option-value="id"
              :rules="{ required }"
              show-clear
            />
          </div>
          <div
            v-if="formData.devueltoPor === getIdFuncionarioByCogido('2')"
            class="col-4"
          >
            <AppInput
              id="nombreFuncionario"
              v-model="formData.devueltoPorIdentificador"
              label="Seleccione Sujeto/Interviniente"
              :rules="{ required }"
            />
          </div>
          <AppCalendar
            id="fechaDevolucion"
            v-model="formData.fechaDevolucion"
            class="col-3"
            date-format="dd-mm-yy"
            label="Fecha de Devolución"
            :max-date="new Date('2100-12-31')"
            :min-date="new Date()"
            :rules="{ required }"
          />
          <div>
            <i
              v-if="
                formatDate(props?.data?.fechaDevolucionRequerida) ===
                  formatDate(formData.fechaDevolucion)
              "
              class="pi text-3xl mx-2 pi-check-circle text-green-600 pt-2"
            />
            <i
              v-if="
                formData.fechaDevolucion &&
                  formatDate(props?.data?.fechaDevolucionRequerida) !==
                  formatDate(formData.fechaDevolucion)
              "
              class="pi text-3xl mx-2 pi-ban text-red-600 pt-2"
            />
          </div>
        </div>
      </div>
      <div class="col-12 md:col-12 p-fluid">
        <div class="grid formgrid">
          <div class="col-4">
            <AppDropdown
              id="estadoDocumento"
              v-model="formData.estadoDocumento"
              label="Estado del Documento"
              option-label="descripcion"
              option-value="id"
              :options="estadoDocumento"
              :rules="{ required }"
              show-clear
            />
          </div>
        </div>
      </div>
      <div class="col-12 md:col-12 p-fluid">
        <div class="grid formgrid">
          <div class="col-4">
            <AppDropdown
              id="ubicacion"
              v-model="formData.ubicacionFisica"
              label="Ubicación Física"
              option-label="name"
              option-value="name"
              :options="[
                { name: 'Bodega Externa', id: 1 },
                { name: 'Bodega Interna', id: 2 }
              ]"
              :rules="{ required }"
              show-clear
            />
          </div>
          <div class="col-4">
            <AppDropdown
              id="edificio"
              v-model="formData.edificio"
              label="Edificio"
              option-label="nombre"
              option-value="id"
              :options="ubicacionEdificios"
              :rules="{ required }"
              show-clear
            />
          </div>
          <div class="col-4">
            <AppDropdown
              id="bodega"
              v-model="formData.bodega"
              label="Bodega"
              option-label="nombre"
              option-value="id"
              :options="ubicacionBodegas"
              :rules="{ required }"
              show-clear
            />
          </div>
        </div>
      </div>
      <div class="col-12 md:col-12 p-fluid">
        <div class="grid formgrid">
          <div class="col-4">
            <AppDropdown
              id="funcionario"
              v-model="formData.pasillo"
              label="Pasillo"
              option-label="nombre"
              option-value="id"
              :options="ubicacionPasillos"
              :rules="{ required }"
              show-clear
            />
          </div>
          <div class="col-4">
            <AppDropdown
              id="estante"
              v-model="formData.estante"
              label="Estante"
              option-label="nombre"
              option-value="id"
              :options="ubicacionEstantes"
              show-clear
            />
          </div>
          <div class="col-4">
            <AppDropdown
              id="casillero"
              v-model="formData.casillero"
              label="Casillero"
              option-label="nombre"
              option-value="id"
              :options="ubicacionCasilleros"
              show-clear
            />
          </div>
        </div>
      </div>
      <div class="col-12 md:col-12 p-fluid">
        <div class="py-2">
          <AppTextarea
            id="observaciones"
            v-model="formData.observacionesReingreso"
            :auto-resize="true"
            class="p-fluid col-12"
            cols="50"
            placeholder="Observaciones"
            rows="10"
          />
        </div>
      </div>
    </section>
  </AppForm>
</AppFieldset>
</template>
<script setup>
import { reactive, defineExpose, defineProps } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useMantenedorCDD } from '../../composables'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'

const {
  ubicacionPasillos,
  funcionarios,
  estadoDocumento,
  ubicacionEdificios,
  ubicacionBodegas,
  ubicacionEstantes,
  ubicacionCasilleros
} = useMantenedorCDD()

const formData = reactive({
  devueltoPor: '',
  devueltoPorIdentificador: '',
  fechaDevolucion: '',
  estadoDocumento: '',
  ubicacionFisica: '',
  funcionario: '',
  idEdificio: 'BC395F59-1479-4153-88DE-AA6D8D1C0350',
  idBodega: '114A35FB-95B6-411C-ACC6-84B3397B91CE',
  idEstante: '1469AAF9-1E5B-48D9-83B1-B41A4D95BD0D',
  idPasillo: 'FA5674E1-7C25-4CC6-B9C8-FB1151400DB9',
  idCasillero: '45B04A36-C8CD-4733-B489-E9ADA899F9C7',
  observacionesReingreso: ''
})

const props = defineProps({
  data: propTypes.object
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}
const { formSubmitted, required, isFormValid, resetFormData } =
  useFormValidation({
    formData,
    validationScope: 'RegistroDevolucion'
  })
function populateData (data) {
  console.log(data)
  Object.assign(formData, data)
  console.log(formData)
  formData.estadoDocumento = getIdpasilloByCodigo(1)
}

function getIdpasilloByCodigo (codigoPasillo) {
  return ubicacionPasillos.value?.find(
    (pasillo) => pasillo.codigo === codigoPasillo
  )?.id
}
function getIdFuncionarioByCogido (codigoFuncionario) {
  return funcionarios.value?.find((f) => f.codigo === codigoFuncionario)?.id
}
defineExpose({ formData, isFormValid, resetFormData, populateData })
</script>

<style scoped>
.Selection {
  font-size: 18px;
  padding-bottom: 15px;
  text-align: start;
}
</style>
