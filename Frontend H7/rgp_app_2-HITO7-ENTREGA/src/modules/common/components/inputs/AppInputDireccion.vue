<template>
<AppInput
  :id="id"
  v-model="model"
  class="w-full z-5"
  :label="label"
  placeholder=""
/>
</template>

<script setup>
import { defineProps, onMounted, defineEmits, reactive, ref, defineExpose } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = process.env.VUE_APP_GMAPS_APIKEY

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places']
})

const props = defineProps({
  id: {
    type: String,
    default: 'input-direccion'
  },
  label: {
    type: String,
    default: 'Ingrese dirección'
  }
})

const model = ref('')

const placeDet = reactive({
  region: '',
  comuna: '',
  calle: '',
  numero: '',
  ciudad: '',
  lat: '',
  lng: '',
  string: ''
})

function resetModel () {
  model.value = ''
}

const emit = defineEmits(['setPlace'])

function assignLongName (addressComponents) {
  for (const d of addressComponents) {
    switch (d.types[0]) {
      case 'administrative_area_level_1':
        placeDet.region = d.long_name
        break
      case 'administrative_area_level_2':
        placeDet.ciudad = d.long_name
        break
      case 'administrative_area_level_3':
        placeDet.comuna = d.long_name
        break
      case 'route':
        placeDet.calle = d.long_name
        break
      case 'street_number':
        placeDet.numero = d.long_name
        break
    }
  }
}

onMounted(() => {
  loader
    .load()
    .then((google) => {
      const placeInput = document.getElementById(props.id)

      const options = {
        componentRestrictions: { country: 'cl' },
        types: ['geocode']
      }

      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(
        placeInput,
        options
      )

      // eslint-disable-next-line no-undef
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        const place = autocomplete.getPlace()
        const detalles = place.address_components

        assignLongName(detalles)

        // devolver el lugar
        emit('setPlace', {
          ...placeDet,
          string: placeInput.value
        })
      })
    })
    .catch((_e) => {
      console.error('Algo ocurrió y Google Map Library no fue inicializada correctamente')
    })
})

defineExpose({ resetModel, placeDet })
</script>
