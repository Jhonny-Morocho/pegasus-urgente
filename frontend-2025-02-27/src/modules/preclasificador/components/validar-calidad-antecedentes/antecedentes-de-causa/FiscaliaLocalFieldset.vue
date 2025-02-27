<template>
<AppFieldset
  class="col-12"
  legend="Fiscalía Local"
>
  <AppDropdown
    id="tipo-fiscalia"
    v-model="fiscaliaLocal.tipoFiscalia"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Tipo Fiscalía"
    option-label="descripcion"
    option-value="descripcion"
    :options="[{ descripcion: fiscaliaLocal.tipoFiscalia, id: 99 }]"
    show-clear
  />
  <AppDropdown
    id="region"
    v-model="fiscaliaLocal.region"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Región"
    option-label="descripcion"
    option-value="descripcion"
    :options="[{ descripcion: fiscaliaLocal.region, id: 99 }]"
    show-clear
  />
  <AppDropdown
    id="nombre-fiscalia"
    v-model="fiscaliaLocal.nombreFiscalia"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Nombre Fiscalía"
    option-label="descripcion"
    option-value="descripcion"
    :options="[{ descripcion: fiscaliaLocal.nombreFiscalia, id: 99 }]"
    show-clear
  />
  <AppInput
    id="numero-fiscalia"
    v-model="fiscaliaLocal.codigoFiscalia"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Número Fiscalía"
  />
  <AppDropdown
    id="rut-atendedor"
    v-model="fiscaliaLocal.rutAtendedor"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="RUT Atendedor"
    option-label="descripcion"
    option-value="descripcion"
    :options="[{ descripcion: fiscaliaLocal.rutAtendedor, id: 99 }]"
    show-clear
  />
  <AppInput
    id="nombre-atendedor"
    v-model="fiscaliaLocal.nombreAtendedor"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Nombre Atendedor"
  />
  <AppDropdown
    id="comuna"
    v-model="fiscaliaLocal.comuna"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Comuna"
    option-label="descripcion"
    option-value="descripcion"
    :options="[{ descripcion: fiscaliaLocal.comuna, id: 99 }]"
    show-clear
  />
  <AppInput
    id="calle"
    v-model="fiscaliaLocal.calle"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Calle"
  />
  <AppInput
    id="numero-calle"
    v-model="fiscaliaLocal.numero"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Número"
  />
  <AppInput
    id="telefono-contacto"
    v-model="fiscaliaLocal.telefonoContacto"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Teléfono Contacto"
  />
  <AppInput
    id="correo-electronico"
    v-model="fiscaliaLocal.correoElectronicoContacto"
    class="col-12 md:col-6 lg:col-4"
    disabled
    label="Correo Electrónico Contacto"
  />
</AppFieldset>
</template>
<script setup>
import { useAntecedentesCausaData } from '@/modules/preclasificador/composables'

const { fiscaliaLocal } = useAntecedentesCausaData()

</script>
