<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Información de las lesiones"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4>¿Presenta lesiones?</h4>
    <span>
      <AppSelectButton
        id="presentaLesionesLaVictima"
        v-model="form.presentaLesiones"
        class="mb-3"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
        @change="resetCampos"
      />
    </span>
  </div>
  <div
    v-if="form.presentaLesiones"
    class="col-12"
  >
    <div class="grid align-items-end">
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppInput
            id="descripcionLesionesImputado"
            v-model="form.descripcionLesion"
            label="Descripción de las lesiones"
            :rules="{ required }"
          />
        </span>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppInput
            id="origenLesionesImputado"
            v-model="form.origenLesiones"
            label="Origen de las lesiones"
            :rules="{ required }"
          />
        </span>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppInput
            id="dauVictima"
            v-model="form.dau"
            label="Numero DAU"
            :rules="{ required }"
          />
        </span>
      </div>
    </div>
  </div>
</AppFieldset>
<AppFieldset
  class="col-12 pb-3"
>
  <div class="field col-12 md:col-6 lg:col-4 m-0 mt-3">
    <span class="p-float-label">
      <AppDropdown
        id="estadoTemperancia"
        v-model="form.estadoTemperancia"
        class="white-space-nowrap text-overflow-ellipsis"
        label="Estado de temperancia del sujeto"
        option-label="descripcion"
        option-value="id"
        :options="estadoTemperancia"
        :retrieve-data-action="mantenedor_getEstadoTemperancia"
        :rules="{ required }"
        show-clear
      />
    </span>
  </div>
  <div
    v-if="mantenedor_getCodigoTipoSujeto(form.tipoSujeto) === '3'"
    class="col-12 md:col-6 lg:col-4"
  >
    <h4 class="m-0">
      ¿Presentó consumo de drogas?
    </h4>
    <span>
      <AppSelectButton
        id="presentoConsumoDeDrogas"
        v-model="form.indicadorConsumoDrogas"
        option-label="name"
        option-value="name"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false },
        ]"
      />
    </span>
  </div>
</AppFieldset>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'

import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '@/modules/global/composables'

const { required } = useFormValidation()
const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const {
  mantenedor_getEstadoTemperancia,
  estadoTemperancia,
  mantenedor_getCodigoTipoSujeto
} = useMantenedorStore()

const form = sujetosIntervinientesInject

function resetCampos () {
  if (!form.presentaLesiones) {
    form.descripcionLesion = ''
    form.origenLesiones = ''
    form.dau = ''
    form.quedoHospitalizado = false
    form.nombresMedico = ''
    form.rutMedicoTratante = ''
    form.idOrganismoSalud = ''
  }
}
</script>
