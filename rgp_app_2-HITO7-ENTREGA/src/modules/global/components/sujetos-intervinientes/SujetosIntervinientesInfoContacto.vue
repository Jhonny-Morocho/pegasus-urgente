<template>
<AppFieldset
  class="col-12"
  legend="Información de Contacto"
  :toggleable="true"
>
  <div class="col-12">
    <div class="grid">
      <AppDropdown
        id="infoTipoContacto"
        v-model="form.infoTipoContacto"
        class="col-12 md:col-6 lg:col-3"
        label="Tipo Contacto"
        option-label="descripcion"
        option-value="id"
        :options="tipoContacto"
        placeholder
        :retrieve-data-action="mantenedor_getTipoContacto"
        :rules="{
          required,
        }"
        show-clear
      />
      <AppInputMask
        id="telefonoFijoContacto"
        v-model="form.telefonoFijoContacto"
        class="field col-12 md:col-6 lg:col-3"
        label="Teléfono Fijo"
        mask="+99 999999999"
      />
      <AppInputMask
        id="telefonoMovilContacto"
        v-model="form.telefonoMovilContacto"
        class="field col-12 md:col-6 lg:col-3"
        label="Teléfono Movil"
        mask="+999 9999 9999"
        :rules="tipoContactoCode ? { required } : undefined"
      />
      <AppInput
        id="correoElectronicoContacto"
        v-model="form.correoElectronicoContacto"
        class="col-12 md:col-6 lg:col-3"
        label="Correo Electrónico"
        :rules="
          tipoContactoCode
            ? {
              required,
              email,
            }
            : undefined
        "
      />
      <div class="field col-12 md:col-6 lg:col-3">
        <span class="flex flex-column">
          <span class="flex align-items-center justify-content-center pb-2">
            <label for="indicadorDireccionNotificacionContacto">Correo de Notificación</label>
          </span>
          <span class="flex align-items-center justify-content-center">
            <InputSwitch
              v-model="form.indicadorDireccionNotificacion"
              :disabled="form.readonly"
              :rules="{ required }"
            />
          </span>
        </span>
      </div>
      <AppInput
        id="redesSociales"
        v-model="form.redesSociales"
        class="col-12 md:col-6 lg:col-3"
        label="Redes Sociales"
      />
      <AppInput
        id="cualesRedesSociales"
        v-model="form.cualesRedesSociales"
        class="col-12 md:col-6 lg:col-3"
        label="Cuales Redes Sociales"
      />
    </div>
  </div>
</AppFieldset>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useFormValidation } from '@/modules/common/composables'
import { useSujetosIntervinientesInject } from '@/modules/global/composables/useSujetosIntervinientes'
import { useMantenedorStore } from '@/modules/global/composables'

const { sujetosIntervinientesInject } = useSujetosIntervinientesInject()

const form = sujetosIntervinientesInject

const { required, email } = useFormValidation()

const {
  tipoContacto,
  mantenedor_getTipoContacto,
  mantenedor_getCodigoTipoContactoById,
  mantenedor_getIdTipoContactoByCodigo
} = useMantenedorStore()

const tipoContactoCode = computed(
  () => mantenedor_getCodigoTipoContactoById(form.infoTipoContacto) !== '0'
)

watch(
  () => form.infoTipoContacto,
  () => {
    if (!form.infoTipoContacto) { form.infoTipoContacto = mantenedor_getIdTipoContactoByCodigo('0') }
  }
)
</script>
