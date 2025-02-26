<template>
<div class="container w-full h-screen">
  <div class="setup-container p-4" />
  <div class="preview p-6">
    <FormKit
      v-model="data"
      type="group"
    >
      <FormKitSchema
        :data="data"
        :schema="schema"
      />
    </FormKit>
    <button @click="handleSubmit">
      Submit
    </button>
    <h3>Data</h3>

    <h3>form Data</h3>
  </div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { FormKitSchema } from '@formkit/vue'
import { useFormValidation } from '@/modules/common/composables'

const backObjResponse =
  {
    nombreDrop: '',
    nombreDrop2: '',
    nombreDrop3: '',
    nombreFieldset: 'prueba'
  }

const data = ref({})

const { isFormValid } =
  useFormValidation({
    formData: data.value,
    validationScope: 'formBuilderScope'
  })

function handleSubmit () {
  if (!isFormValid()) {
    return
  }

  for (const key in backObjResponse) {
    if (Object.hasOwnProperty.call(backObjResponse, key)) {
      backObjResponse[key] = data.value[key]
    }
  }
  console.log(backObjResponse)
}

const schema = reactive([
  {
    $formkit: 'FormKitAppSteps',
    value: [
      {
        label: 'Index Builder',
        to: { name: 'formBuilder' }
      },
      {
        label: 'Sujetos Form Builder',
        to: { name: 'formSujetosIntervinientes' }
      }
    ]
  },
  {
    $cmp: 'AppFieldset',
    props: {
      id: 'fieldset-registro-parte',
      formSubmitted: false,
      legend: 'Test Formkit builder'
    },
    children: [
      {
        $formkit: 'FormKitDropdown',
        name: 'nombreDrop',
        appLabel: 'Selecciona un idioma',
        id: 'nombreDrop',
        value: 1,
        showClear: true,
        optionLabel: 'label',
        optionValue: 'value',
        options: [
          {
            label: 'Español',
            value: 1
          },
          {
            label: 'Ingles',
            value: 2
          }
        ],
        filter: false,
        class: 'test',
        rules: { // reglas de validacion
          ordinaryRules: ['required'], // esto debe encajar con las property keys de las reglas de validacion
          maxLength: 100,
          minLength: 0
        }
      },
      {
        $el: 'div',
        attrs: {
          class: 'formgrid grid'
        },
        children: [
          // componente wraper de primeVue custom
          {
            $formkit: 'FormKitInput',
            name: 'nombreInput',
            value: null,
            disabled: false,
            appLabel: 'Nombres',
            id: 'nombres',
            class: 'field col',
            rules: {
              ordinaryRules: ['required'],
              minLength: 3,
              maxLength: 10
            }
          },
          {
            $formkit: 'FormKitInput',
            name: 'apellidosInput',
            appLabel: 'Apellidos',
            id: 'apellidos',
            value: null,
            class: 'field col',
            rules: {
              ordinaryRules: ['required']
            }
          }
        ]
      },
      {
        $formkit: 'FormKitCalendar',
        name: 'fechaHora',
        value: null,
        appLabel: 'Fecha',
        id: 'calendar-id',
        class: 'field col-4',
        dateFormat: 'yy-mm-dd',
        yearRange: '2023:2030',
        rules: {
          ordinaryRules: ['required']
        }
      },
      {
        $formkit: 'FormKitFieldset',
        id: 'nombreFieldset',
        legend: 'Fieldset',
        class: 'field col-12',
        schema: [
          {
            $formkit: 'FormKitInput',
            name: 'fieldsetName',
            value: null,
            disabled: false,
            appLabel: 'fieldsetName',
            id: 'fieldsetName',
            class: 'field col',
            rules: {
              ordinaryRules: ['required'],
              minLength: 3,
              maxLength: 10
            }
          },
          {
            $formkit: 'FormKitInput',
            name: 'fieldsetLastName',
            appLabel: 'fieldsetLastName',
            id: 'fieldsetLastName',
            value: null,
            class: 'field col',
            rules: {
              ordinaryRules: ['required'],
              minLength: 3,
              maxLength: 10
            }
          }
        ]
      },
      {
        $formkit: 'FormKitSelectButton',
        name: 'SelectButton',
        id: 'selectButtonID',
        value: null,
        class: 'field col-6',
        optionLabel: 'label',
        optionValue: 'value',
        rules: {
          ordinaryRules: ['required']
        },
        options: [
          {
            label: 'Si',
            value: 1
          },
          {
            label: 'No',
            value: 2
          }
        ]
      },
      {
        $formkit: 'FormKitEditor',
        name: 'editor',
        id: 'editor',
        value: null,
        class: 'field col-12 h-6',
        rules: {
          ordinaryRules: ['required']
        },
        editorStyle: 'height: 256px'
      },
      {
        $formkit: 'FormKitCheckbox',
        name: 'checkbox',
        binary: true,
        id: 'checkId',
        labelLeft: 'checkbox label left',
        value: null,
        class: ''
      },
      {
        $formkit: 'FormKitInputSwitch',
        name: 'switcher',
        id: 'switcher',
        labelRight: 'switch label Right',
        value: null,
        parentClass: 'field col-6'
      },
      {
        $formkit: 'FormKitInputMask',
        name: 'mask',
        id: 'maskId',
        appLabel: 'input mask',
        value: null,
        mask: '999-999-9999',
        class: 'field col-6 mt-4',
        rules: {
          ordinaryRules: ['required']
        }
      }
    ]
  }
])
</script>

<style scoped>
.container {
    display: grid;
    grid-template-columns: 1fr 2fr;
}
.setup-container {
    width: 100%;
    background-color: #f1f1f1;
}
.preview {
    width: 100%;
    background-color: #f8f8f5;
}
</style>
