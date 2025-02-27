<template>
<AppFieldset
  class="col-12 pb-3"
  legend="Uso de Fuerza"
>
  <div class="col-12 md:col-6 lg:col-3 text-center">
    <h4>
      ¿Se aplicó alguna fuerza en contra del Sujeto?(*)
    </h4>
    <span>
      <AppSelectButton
        id="seAplicoFuerzaContraElSujeto"
        v-model="form.seAplicoFuerza"
        option-label="name"
        option-value="value"
        :options="seAplicoFuerzaOptions"
        :rules="{ required }"
        @change="resetCampos"
      />
    </span>
  </div>
  <AppFieldset
    v-if="form.seAplicoFuerza"
    class="col-12"
    :collapsed="!form.seAplicoFuerza"
    legend="Datos de la persona que aplico la fuerza"
    :toggleable="true"
  >
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppInput
            id="descripcionQuienAplico"
            v-model="form.descripcionQuienAplico"
            label="¿Quien Aplicó la fuerza?"
            :rules="{ required }"
          />
        </span>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppDropdown
            id="quienAplicoLaFuerzaContraSujeto"
            v-model="form.idOrganismoPertenecienteRol"
            label="Organismo al cual pertenece"
            option-label="descripcion"
            option-value="id"
            :options="organismoRol"
            :retrieve-data-action="mantenedor_getOrganismoRol"
            :rules="form.seAplicoFuerza ? { required } : undefined"
            show-clear
          />
        </span>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <RutInput
            id="rutDeQuienAplicoFuerzaAlSujeto"
            v-model="form.rutQuienUtilizoFuerza"
            label="RUT"
            :rules="form.seAplicoFuerza ? { required } : undefined"
          />
        </span>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppInput
            id="nombreCompletoDeQuienAplicoLaFuerzaSujeto"
            v-model="form.nombresQuienAplicoFuerza"
            label="Nombre Completo"
            :rules="
              form.seAplicoFuerza
                ? { required, alfabetico }
                : undefined
            "
          />
        </span>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppDropdown
            id="tipo-contacto-aplico-fuerza"
            v-model="form.tipoTelefono"
            label="Tipo Contacto"
            option-label="descripcion"
            option-value="descripcion"
            :options="[
              { descripcion: 'Teléfono Fijo' },
              { descripcion: 'Teléfono Móvil' },
            ]"
            :rules="form.seAplicoFuerza ? { required } : undefined"
            show-clear
          />
        </span>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppInputMask
            id="fonoFijoDeQuienAplicoLaFuerzaSujeto"
            v-model="form.telefonoQuienAplicoFuerza"
            label="Teléfono"
            mask="99999999999"
            :rules="form.seAplicoFuerza ? { required } : undefined"
          />
        </span>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <span class="p-float-label">
          <AppInput
            id="correoDeQuienAplicoLaFuerzaSujeto"
            v-model="form.correoElectronicoQuienAplicoFuerza"
            label="Correo Electrónico"
            :rules="
              form.seAplicoFuerza ? { required, email } : undefined
            "
          />
        </span>
      </div>
    </div>
  </AppFieldset>
</AppFieldset>
</template>
<script setup>
import { useFormValidation } from '@/modules/common/composables'
import RutInput from '@/modules/common/components/inputs/RutInput.vue'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '@/modules/global/composables'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()
const { mantenedor_getOrganismoRol, organismoRol } = useMantenedorStore()

const form = sujetosIntervinientesInject
const { required, alfabetico, email } = useFormValidation({ form, validationScope: 'formSeAplicoFuerza' })

const seAplicoFuerzaOptions = [
  { name: 'Si', value: true },
  { name: 'No', value: false }
]

function resetCampos () {
  if (!form.seAplicoFuerza) {
    form.descripcionQuienAplico = ''
    form.idOrganismoPertenecienteRol = null
    form.rutQuienUtilizoFuerza = ''
    form.nombresQuienAplicoFuerza = ''
    form.tipoTelefono = null
    form.telefonoQuienAplicoFuerza = ''
    form.correoElectronicoQuienAplicoFuerza = ''
  }
}
</script>
