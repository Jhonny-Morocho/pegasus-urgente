<template>
<section class="col-12">
  <AppFieldset legend="Vehiculo">
    <AppDropdown
      id="tipo-vehiculo"
      v-model="formData.tipoVehiculo"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Tipo de Vehiculo"
      option-label="descripcion"
      option-value="id"
      :options="tipoVehiculos"
      :retrieve-data-action="mantenedor_getTipoVehiculos"
      show-clear
    />
    <AppInput
      id="patente-vehiculo"
      v-model="formData.patente"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Patente"
    />
    <AppDropdown
      id="marca-vehiculo"
      v-model="formData.marca"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Marca"
      option-label="descripcion"
      option-value="id"
      :options="tipoMarcaVehiculo"
      :retrieve-data-action="mantenedor_getTipoMarcaVehiculo"
      show-clear
      @change="getModelo"
    />
    <AppDropdown
      id="modelo-vehiculo"
      v-model="formData.modelo"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Modelo"
      option-label="descripcion"
      option-value="id"
      :options="tipoModeloVehiculo"
      show-clear
    />
    <AppInput
      id="color-vehiculo"
      v-model="formData.color"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Color"
    />
    <AppInput
      id="vin-vehiculo"
      v-model="formData.vin"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="VIN o Chasis"
    />
    <AppInput
      id="numero-motor-vehiculo"
      v-model="formData.numeroMotor"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Número de Motor"
    />
    <AppDropdown
      id="tiene-herramientas"
      v-model="formData.herramientasAdentro"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Herramientas en el Vehículo"
      option-label="descripcion"
      option-value="id"
      :options="tieneHerramientasDentro"
      :retrieve-data-action="mantenedor_getTieneHerramientasDentro"
      show-clear
    />
    <AppInput
      id="lugar-custodia"
      v-model="formData.lugarCustodia"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Lugar de Custodia"
    />
    <AppDropdown
      id="estaciona-en"
      v-model="formData.lugarEstacionaComunmente"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Estaciona en"
      option-label="descripcion"
      option-value="id"
      :options="estacionaEn"
      :retrieve-data-action="mantenedor_getEstacionaEn"
      show-clear
    />
    <AppDropdown
      id="estado-vehiculo"
      v-model="formData.estadoVehiculo"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Estado del Vehículo"
      option-label="descripcion"
      option-value="id"
      :options="estadoVehiculo"
      :retrieve-data-action="mantenedor_getEstadoVehiculo"
      show-clear
    />
    <AppDropdown
      id="signos-fuerza"
      v-model="formData.signosFuerza"
      class="col-3 mb-0"
      :disabled="readOnly"
      label="Signos de Fuerza"
      option-label="descripcion"
      option-value="id"
      :options="signoFuerzaVehiculo"
      :retrieve-data-action="mantenedor_getSignosFuerzaVehiculo"
      show-clear
    />
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Vehículo Cerrado?
        </h4>
      </div>
      <AppSelectButton
        id="vehiculo-cerrado"
        v-model="formData.estabaCerradoVehiculo"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Tiene Documentación del Vehículo?
        </h4>
      </div>
      <AppSelectButton
        id="tiene-documentacion"
        v-model="formData.tieneDocumentacionVehiculo"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Tiene Seguro?
        </h4>
      </div>
      <AppSelectButton
        id="tiene-seguro"
        v-model="formData.tieneSeguro"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Tiene Cámaras?
        </h4>
      </div>
      <AppSelectButton
        id="tiene-camaras"
        v-model="formData.tieneCamara"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Tiene Accesorios Adicionales?
        </h4>
      </div>
      <AppSelectButton
        id="tiene-accesorios"
        v-model="formData.accesoriosAdicionales"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Solicita Destinación Provisional?
        </h4>
      </div>
      <AppSelectButton
        id="solicita-destinacion"
        v-model="formData.solicitaDestinacionProvisional"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Porta Placa Patente?
        </h4>
      </div>
      <AppSelectButton
        id="porta-patente"
        v-model="formData.portaPlacaPatente"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Tiene TAG?
        </h4>
      </div>
      <AppSelectButton
        id="tiene-tag"
        v-model="formData.tieneTag"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Tiene Información de Autopistas?
        </h4>
      </div>
      <AppSelectButton
        id="tiene-info-autopista"
        v-model="formData.informacionAutopista"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Tiene Información de Peajes?
        </h4>
      </div>
      <AppSelectButton
        id="tiene-info-peajes"
        v-model="formData.informacionPeajes"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Puede Rodar?
        </h4>
      </div>
      <AppSelectButton
        id="puede-rodar"
        v-model="formData.puedeRodar"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Es Clonado?
        </h4>
      </div>
      <AppSelectButton
        id="es-clonado"
        v-model="formData.clonado"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <div class="col-3 mt-3 text-center mb-0">
      <div class="p-fieldset-legend-text">
        <h4 class="mb-2">
          ¿Está Encargado por Robo?
        </h4>
      </div>
      <AppSelectButton
        id="encargo-por-robo"
        v-model="formData.estaEncargadoPorRobo"
        :disabled="readOnly"
        option-label="name"
        option-value="value"
        :options="[
          { name: 'Si', value: true },
          { name: 'No', value: false }
        ]"
      />
    </div>
    <AppInput
      v-if="formData.estaEncargadoPorRobo"
      id="numero-encargo"
      v-model="formData.numeroEncargo"
      class="col-3 pt-6 mb-0"
      :disabled="readOnly"
      label="Número de Encargo"
    />
    <section class="col-12 mt-4 mb-0 pb-0">
      <AppFieldset
        legend="Datos Complementarios de la Especie"
        no-margin-bottom
      >
        <div class="col-3">
          <div class="p-fieldset-legend-text text-center">
            <h4 class="mb-2">
              ¿Tiene dispositivo geolocalizador?"
            </h4>
          </div>
          <AppSelectButton
            id="tiene-dispositivo-geo"
            v-model="formData.tieneDispositivoGeolocalizacion"
            :disabled="readOnly"
            option-label="name"
            option-value="value"
            :options="[
              { name: 'Si', value: true },
              { name: 'No', value: false }
            ]"
            @change="resetData"
          />
        </div>
        <AppInput
          v-if="formData.tieneDispositivoGeolocalizacion"
          id="empresa-geolocalizacion"
          v-model="formData.empresaGeolocalizacion"
          class="col-3 mb-0 mt-4"
          :disabled="readOnly"
          label="Empresa de Geolocalización"
        />
        <AppFieldset
          v-if="formData.tieneDispositivoGeolocalizacion"
          class="col-12 mt-4"
          legend="Archivo de Geolocalización"
          no-margin-bottom
        >
          <slot name="adjuntar-geolocalizacion" />
        </AppFieldset>
      </AppFieldset>
    </section>
  </AppFieldset>
</section>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'

import { requestUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { useEspeciesDineroInject } from '@/modules/global/composables/useEspeciesDinero'

const {
  tieneHerramientasDentro,
  mantenedor_getTieneHerramientasDentro,
  estacionaEn,
  mantenedor_getEstacionaEn,
  mantenedor_getEstadoVehiculo,
  estadoVehiculo,
  signoFuerzaVehiculo,
  mantenedor_getSignosFuerzaVehiculo,
  mantenedor_getTipoVehiculos,
  tipoVehiculos,
  mantenedor_getTipoModeloVehiculo,
  tipoModeloVehiculo,
  mantenedor_getTipoMarcaVehiculo,
  tipoMarcaVehiculo,
  mantenedor_SET_DEFAULT_STATE_TIPO_MODELO_VEHICULO
} = useMantenedorStore()

defineProps({
  readOnly: Boolean
})

const { especiesDineroInject } = useEspeciesDineroInject()
const formData = especiesDineroInject

onMounted(() => {
  mantenedor_SET_DEFAULT_STATE_TIPO_MODELO_VEHICULO()
  if (formData.marca && !tipoModeloVehiculo.value.length) getModelo()
})

function getModelo () {
  if (!formData.marca) {
    formData.modelo = ''
    mantenedor_SET_DEFAULT_STATE_TIPO_MODELO_VEHICULO()
    return
  }
  requestUtil({
    action: mantenedor_getTipoModeloVehiculo,
    payload: { idMarcaVehiculo: formData.marca }
  })
}

function resetData () {
  formData.empresaGeolocalizacion = ''
}
</script>
