<template>
<div
  v-if="isSupported"
  class="p-fluid py-12 mx-auto"
>
  <!-- Autocomplete location search input -->
  <div
    v-if="autoComplete"
    class="form-group"
  >
    <AppInput
      v-if="!inputsInterval"
      id="placeInput"
      class="w-full placeInput"
      :label="placeHolder"
      @input="changeInputValue($event.target.value)"
    />
    <GMapAutocomplete
      v-show="inputsInterval"
      id="autocomplete"
      ref="placeInput"
      class="w-full p-inputtext"
      :options="{
        componentRestrictions: { country: 'cl' },
      }"
      :placeholder="placeHolder"
      @input="changeInputValue($event.target.value)"
      @place_changed="setPlace"
    />
  </div>
  <GMapMap
    ref="myMapRef"
    :center="place"
    class="mx-auto my-4 w-full"
    :class="height"
    :zoom="zoom"
  >
    <GMapMarker
      v-if="marker"
      :draggable="draggable"
      :position="place"
      @dragend="setOnDragged"
    />
  </GMapMap>
</div>
<!-- TO-DO: Definir una acción para en caso de no ser compatible -->
<div
  v-else
  class="p-fluid py-12 mx-auto"
>
  <span>NO SOPORTADO</span>
</div>
</template>

<script setup>
import {
  ref,
  onMounted,
  defineEmits,
  defineProps,
  watch,
  computed,
  nextTick
} from 'vue'
import { useGeolocation } from '@/services/geolocation/geolocation'
import { propTypes } from '../../types'

const props = defineProps({
  autoComplete: {
    type: Boolean,
    default: true
  },
  zoom: {
    type: Number,
    default: 17
  },
  height: {
    type: String,
    default: 'h-25rem'
  },
  marker: {
    type: Boolean,
    default: true
  },
  draggable: {
    type: Boolean,
    default: true
  },
  onDraggedCustomEvent: {
    type: Boolean,
    default: false
  },
  placeHolder: {
    type: String,
    default: 'Escriba la dirección a referenciar'
  },
  position: propTypes.object
})

const place = ref({
  region: '',
  comuna: '',
  calle: '',
  numero: '',
  ciudad: '',
  lat: 0,
  lng: 0,
  emited: false
})

const placeInput = ref({})
const inputsInterval = ref(false)
const myMapRef = ref(null)
const emit = defineEmits(['setMapValues', 'onDragged', 'other'])

const { coords, isSupported } = useGeolocation()

function changeInputValue (value) {
  if (value.length >= 3) {
    inputsInterval.value = true
    placeInput.value.$el.value = value
    nextTick(() => {
      const autoCompleteInput = document.getElementById('autocomplete')
      autoCompleteInput.focus()
    })
  } else {
    inputsInterval.value = false
    nextTick(() => {
      const placeInput = document.getElementById('placeInput')
      placeInput.value = value
      placeInput.focus()
    })
  }
}

onMounted(() => {
  setCoords(coords.value.latitude, coords.value.longitude)
  myMapRef.value.$mapPromise.then(() => {
    isMapReady.value = true
  })
})

const position = computed(() => {
  return {
    latitude: Number(props.position?.latitude),
    longitude: Number(props.position?.longitude)
  }
})

const isMapReady = ref(false)

watch([isMapReady, position], () => {
  place.value.emited = true

  const { latitude, longitude } = position.value

  if (latitude && longitude && isMapReady.value) {
    const pos = { lat: latitude, lng: longitude }
    getGeocoderData(pos)
  }
})

function setCoords (lat, lng) {
  place.value.lat = lat
  place.value.lng = lng
}

function getGeocoderData ({ lat, lng }) {
  // eslint-disable-next-line no-undef
  const geocoder = new google.maps.Geocoder()
  // setea la latitud y longitud de los parametros y las parsea
  if (!lat && !lng) {
    placeInput.value.$el.value = ''
    return
  }

  setCoords(lat, lng)

  const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) }
  // obtiene los datos de la geolocalizacion basado en la latitud y longitud
  geocoder.geocode({ location: latlng }, (results, status) => {
    // eslint-disable-next-line no-undef
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        setAndEmitValues(results[0])
      } else {
        console.warn('No results found')
      }
    } else {
      console.error('Geocoder failed due to: ' + status)
    }
  })
}

function setAndEmitValues (results) {
  const esChile = results.address_components.some(
    (e) => e.short_name === 'CL'
  )

  if (!esChile) {
    return
  }

  if (props.autoComplete) {
    placeInput.value.$el.value = results.formatted_address // texto de la direccion completa
  }

  // emite el detalle completo de la geolocalizacion
  emitValues(results.address_components)
}

function setPlace ({ address_components, geometry }) {
  const esChile = address_components.some((e) => e.short_name === 'CL')

  if (esChile) {
    place.value.lat = geometry.location.lat()
    place.value.lng = geometry.location.lng()
    emitValues(address_components)
  }
}

function setOnDragged ({ latLng }) {
  if (props.onDraggedCustonEvent) {
    emit('onDragged', latLng)
    return
  }

  getGeocoderData({ lat: latLng.lat(), lng: latLng.lng() })
}

// eslint-disable-next-line space-before-function-paren, no-unused-vars
function emitValues(addressComponents) {
  setAddress(addressComponents)

  emit('setMapValues', {
    ...place.value
  })
}

function setAddress (addressComponents) {
  for (const d of addressComponents) {
    switch (d.types[0]) {
      case 'administrative_area_level_1':
        place.value.region = d.long_name
        break
      case 'administrative_area_level_2':
        place.value.ciudad = d.long_name
        break
      case 'administrative_area_level_3':
        place.value.comuna = d.long_name
        break
      case 'route':
        place.value.calle = d.long_name
        break
      case 'street_number':
        place.value.numero = d.long_name
        break
    }
  }
}
</script>
<style scoped>
.placeInput {
  padding-top: 10px;
}
</style>
