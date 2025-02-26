<script setup>
import { markRaw, reactive, ref } from 'vue'
import TablaActasDocumentosAdjuntos from '@/modules/global/components/detalle-denuncia/TablaActasDocumentosAdjuntos.vue'
import TablaParteDenunciaRegistrado from '@/modules/global/components/detalle-denuncia/TablaParteDenunciaRegistrado.vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { useAppToast, useFormValidation } from '@/modules/common/composables'
import { requestUtil } from '@/utils'

const { required, maxLength } = useFormValidation()

const {
  familiasDelito,
  tiposDelito,
  mantenedor_getTiposDelito,
  mantenedor_getFamiliasDelito
} = useMantenedorStore()

const tipoDelitoLoading = ref(false)
const tipoDelitoOptions = ref([])

function getTipoDelito () {
  tipoDelitoLoading.value = true
  requestUtil({
    action: mantenedor_getTiposDelito,
    loader: (l) => {
      tipoDelitoLoading.value = l
    },
    resolve: () => {
      const tipoDelitos = tiposDelito.value?.filter(
        (td) => td.idPadre === formData.idFamiliaDelito
      )
      tipoDelitoOptions.value = tipoDelitos?.length
        ? tipoDelitos
        : [{ descripcion: 'Sin Tipo Delito', id: 'sin-tipo' }]
    }
  })
}

// Assign the custom component a library
const library = markRaw({
  TablaDocumentos: TablaActasDocumentosAdjuntos,
  TablaParteDenunciaRegistrado
})

const data = reactive({
  editando: false,
  familiasDelito: familiasDelito,
  tipoDelitoOptions: tipoDelitoOptions,
  tipoDelitoLoading,
  handleEdit: {
    onClick: () => {
      data.editando = !data.editando
    }
  },
  handleDropdown: {
    onChange: (e) => {
      console.log(e.value)
    }
  },
  handleDropdownFamiliaDelito: {
    onChange: () => {
      getTipoDelito()
    }
  },
  // mantenedor
  mantenedor_getFamiliasDelito,
  /* Evento onChange nativo de JS, se crean como propiedades y luego hacemos un bind de dichas propiedades mediante bind:handleEnviarParteDenuncia en el obj schema */
  handleEnviarParteDenuncia: {
    onClick: () => {
      registrarParteDenuncia()
    }
  },
  handleEmits: {
    onModificar: (data) => {
      console.log('modificar', data)
    },
    'onTablaParteDenuncia:modificar': (data) => {
      console.log('tabla-parte-denuncia', data)
    }
  }
})
// modelValues de input sueltos
const fechaHoraDenuncia = ref('')
const idFamiliaDelito = ref(null)
const idTipoDelito = ref(null)
const parteDenuncia = ref(null)

const formData = reactive({
  idFamiliaDelito,
  idTipoDelito,
  fechaHoraDenuncia,
  parteDenuncia
})

const { formSubmitted, isFormValid } = useFormValidation({
  formData: formData,
  validationScope: 'formIngresarParteDenuncia'
})

// ingresar ParteDenuncia form with formKit Schema

const schema = [
  {
    $cmp: 'AppForm',
    props: {
      id: 'registro-parte',
      formSubmitted: formSubmitted,
      legend: 'Ingresar Parte/Denuncia',
      validationScope: 'formIngresarParteDenuncia'
    },
    children: [
      {
        $cmp: 'AppFieldset',
        props: {
          id: 'fieldset-registro-parte',
          formSubmitted: false,
          legend: 'Ingresar Parte/Denuncia'
        },
        children: [
          {
            $cmp: 'AppInput',
            props: {
              id: 'numero-parte-denuncia',
              label: 'Nº Parte/Denuncia',
              class: 'col-12 md:col-6 lg:col-3',
              modelValue: parteDenuncia,
              rules: {
                required,
                maxLength: maxLength(16)
              }
            }
          },
          {
            $cmp: 'AppCalendar',
            props: {
              id: 'fecha-hora-denuncia',
              label: 'Fecha y Hora denuncia',
              class: 'col-12 md:col-6 lg:col-3',
              modelValue: fechaHoraDenuncia,
              showTime: true,
              rules: {
                required
              }
            }
          },
          {
            $cmp: 'AppDropdown',
            props: {
              id: 'familiaDelito',
              label: 'Familia del Delito',
              class: 'col-12 md:col-6 lg:col-3',
              optionLabel: 'descripcion',
              optionValue: 'id',
              showClear: true,
              modelValue: idFamiliaDelito,
              rules: {
                required
              },
              // mantenedor
              retrieveDataAction: mantenedor_getFamiliasDelito,
              options: '$familiasDelito'
            },
            // de esta manera manejamos el evento @change del dropdown
            bind: '$handleDropdownFamiliaDelito'
          },
          {
            $cmp: 'AppDropdown',
            props: {
              id: 'tipoDelito',
              label: 'Tipo de Delito',
              class: 'col-12 md:col-6 lg:col-3',
              modelValue: idTipoDelito,
              optionLabel: 'descripcion',
              optionValue: 'id',
              showClear: true,
              loading: '$tipoDelitoLoading',
              options: '$tipoDelitoOptions',
              rules: {
                required
              }
            }
          },
          {
            $cmp: 'TablaDocumentos',
            props: {
              class: 'w-full'
            },
            bind: '$handleEmits'
          },
          {
            $el: 'div',
            attrs: {
              class: 'flex justify-content-center col-12'
            },
            children: [
              {
                $cmp: 'Button',
                props: {
                  class: 'p-button-outlined p-button-warning mr-3',
                  label: 'Cancelar',
                  icon: 'pi pi-times-circle',
                  iconPos: 'right',
                  style: 'width: auto'
                },
                if: '$editando'
              },
              {
                $cmp: 'Button',
                props: {
                  class: 'btn-form',
                  label: {
                    if: '$editando',
                    then: 'Modificar Parte',
                    else: 'Guardar Parte/Denuncia'
                  },
                  icon: 'pi pi-plus',
                  iconPos: 'right',
                  style: 'width: auto'
                },
                bind: '$handleEnviarParteDenuncia'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    $cmp: 'TablaParteDenunciaRegistrado'
  }
]
const { toastError, TOAST_MESSAGES } = useAppToast()

function registrarParteDenuncia () {
  console.log(formData)
  if (!isFormValid()) {
    toastError(TOAST_MESSAGES.formInvalid)
  }
}

</script>

<template>
<FormKitSchema
  :data="data"
  :library="library"
  :schema="schema"
/>
</template>
