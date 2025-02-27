<template>
<section>
  <hr>
  <div class="grid p-3 m-0">
    <div class="col-12 md:col-6">
      <ul>
        <li><strong>RUC: </strong>{{ ruc }}</li>
        <li><strong>N° de Documento: </strong>{{ interviniente?.identificacion?.numeroDocumento }}</li>
        <li><strong>Nombres: </strong> {{ interviniente?.nombre?.nombres }}</li>
        <li><strong>Apellido Materno: </strong> {{ interviniente?.nombre?.segundoApellido }}</li>
        <li><strong>Sexo Biológico: </strong> {{ interviniente?.sexo?.sexoBiologico }}</li>
        <li><strong>Etnia: </strong> {{ interviniente?.pueblosOriginarios ?? 'Sin Etnia' }}</li>
        <li><strong>Estado Civil: </strong> {{ interviniente?.estadoCivil }}</li>
        <li><strong>Escolaridad: </strong> {{ interviniente?.escolaridad ?? 'Sin Escolaridad' }}</li>
        <li><strong>Dirección: </strong> {{ interviniente?.direccionCompleta ?? 'Boccaccio 123, Las Condes' }}</li>
        <li><strong>Teléfono Móvil: </strong> {{ interviniente?.telefonoMovilContacto }}</li>
      </ul>
    </div>
    <div class="col-12 md:col-6">
      <ul>
        <li>
          <strong>Tipo de Documento: </strong>
          {{ interviniente?.identificacion?.tipoDocumento.toLowerCase() === 'rut'
            ? 'Carnet de Identidad'
            : interviniente?.identificacion?.tipoDocumento }}
        </li>
        <li><strong>País de documento de identificación: </strong> {{ interviniente?.identificacion?.paisEmisorDocumento }}</li>
        <li><strong>Apellido Paterno: </strong> {{ interviniente?.nombre?.primerApellido }}</li>
        <li><strong>Nacionalidad: </strong> {{ interviniente?.nacionalidad }}</li>
        <li><strong>Sexo Declarado: </strong> {{ interviniente?.sexo?.sexoDeclarado }}</li>
        <li><strong>Fecha de Nacimiento: </strong> {{ interviniente?.persona?.fechaNacimiento }}</li>
        <li><strong>Profesión: </strong> {{ interviniente?.profesionOficioOcupacion ?? 'Sin Profesión' }}</li>
        <li><strong>Teléfono Fijo: </strong> {{ interviniente?.telefonoFijoContacto }}</li>
        <li><strong>Correo Electrónico: </strong> {{ interviniente?.correoElectronicoContacto }}</li>
      </ul>
    </div>

    <div class="col-12">
      <h3 class="pb-3">
        Comentario:
      </h3>
      <AppForm
        :form-submitted="formSubmitted"
        validation-scope="comentario"
      >
        <AppTextarea
          id="comentario-cierre"
          v-model="formData.comentarioCierre"
          auto-resize
          cols="85"
          label="Comentarios de la Solicitud"
          rows="4"
          :rules="{required}"
        />
      </AppForm>
    </div>
  </div>
</section>
</template>

<script setup>
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { propTypes } from '@/modules/common/types'
import { defineProps, defineExpose, reactive } from 'vue'

const { toastError } = useAppToast()

const formData = reactive({
  comentarioCierre: ''
})

defineProps({
  interviniente: propTypes.object,
  ruc: propTypes.string
})

const { required, isFormValid, formSubmitted } = useFormValidation({ formData, validationScope: 'comentario' })

function retrieveData (retrieveCb) {
  if (!isFormValid()) {
    toastError('Debes agregar un comentario para realizar la solicitud')
    return
  }

  retrieveCb?.(formData)
}

defineExpose({ retrieveData })
</script>

<style lang="scss" scoped>

hr {
  border: 1px solid #ccc;
}

::v-deep(textarea) {
  width: 100%;
}

ul {
  list-style: none;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
li {
  font-size: 1.2rem;
}
</style>
