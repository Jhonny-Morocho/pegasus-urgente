<template>
<AppFieldset
  class="col-12"
  legend="Información de Contacto"
>
  <div class="grid p-fluid">
    <AppDropdown
      id="tipoDeContacto"
      v-model="formData.tipoDeContacto"
      class="col-12 md:col-3"
      label="Tipo de Contacto"
      option-label="name"
      option-value="name"
      :options="listaTipoContacto"
      :rules="{
        required
      }"
      show-clear
    />
    <AppInputMask
      id="telefonoFijoContacto"
      v-model="formData.telefonoFijoContacto"
      class="field md:col-6 lg:col-3"
      label="Teléfono Fijo"
      mask="99999999999"
      :rules="{ required }"
    />
    <AppInputMask
      id="telefonoMovilContacto"
      v-model="formData.telefonoMovilContacto"
      class="field md:col-6 lg:col-3"
      label="Teléfono Movil"
      mask="99999999999"
      :rules="{ required }"
    />
    <div class="col-12 md:col-3">
      <AppInput
        id="correoElectronicoContacto"
        v-model="formData.correoElectronicoContacto"
        class="p-fluid"
        label="Correo Electrónico"
        :rules="{
          required
        }"
      />
    </div>
    <div class="col-12 md:col-3">
      <span class="flex flex-column">
        <span class="flex align-items-center justify-content-center pb-2">
          <label for="indicadorDireccionNotificacionContacto">Correo de Notificación</label>
        </span>
        <span class="flex align-items-center justify-content-center">
          <InputSwitch
            v-model="formData.indicadorDireccionNotificacionContacto"
            :class="{
              'p-invalid': !formData.indicadorDireccionNotificacionContacto
            }"
          />
        </span>
      </span>
      <small
        v-if="!formData.indicadorDireccionNotificacionContacto"
        class="p-error flex ml-2 mt-2"
      >
        Se debe ingresar notificación de Correo electrónico
      </small>
    </div>
    <div class="col-12 md:col-3">
      <AppInput
        id="redesSociales"
        v-model="formData.redesSociales"
        class="p-fluid"
        label="Redes Sociales"
      />
    </div>
    <div class="col-12 md:col-3">
      <AppInput
        id="cualesRedesSociales"
        v-model="formData.cualesRedesSociales"
        class="p-fluid"
        label="Cuales redes sociales"
      />
    </div>
  </div>
</AppFieldset>
</template>

<script setup>
import { useFormValidation } from '@/modules/common/composables'
import { reactive, defineProps } from 'vue'
import { propTypes } from '@/modules/common/types/prop.types'

defineProps({
  validationScope: propTypes.string
})

const { required } = useFormValidation()

const listaTipoContacto = [{ name: 'Particular' }, { name: 'Otro' }]

const formData = reactive({
  telefonoFijoContacto: '',
  telefonoMovilContacto: '',
  correoElectronicoContacto: '',
  indicadorDireccionNotificacionContacto: true,
  redesSociales: '',
  tipoDeContacto: ''
})
</script>
