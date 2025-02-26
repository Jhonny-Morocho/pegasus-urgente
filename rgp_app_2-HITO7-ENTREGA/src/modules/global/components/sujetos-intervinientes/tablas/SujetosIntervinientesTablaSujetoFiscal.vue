<template>
<div class="grid">
  <div class="col-12 p-fluid">
    <AppDataTable
      id="dataTableIntervinientes"
      class="col-12 mt-5"
      :value="sujetosIntervinientes"
    >
      <Column
        field="interviniente"
        filter-field="tipoSujeto"
        header="Tipo"
      >
        <template #body="slotProps">
          <p>{{ slotProps.data.tipoSujeto }}</p>
        </template>
      </Column>
      <Column
        field="numeroDocumentoIdentificacion"
        filter-field="numeroDocumentoIdentificacion"
        header="N° Documento"
      >
        <template #body="slotProps">
          <span>
            <Button
              class="p-button-text pl-0 ml-0"
              :label="
                slotProps.data.interviniente.identificaciones[0]
                  .numeroDocumentoIdentificacion
              "
              @click="
                openInfoDelictual(
                  slotProps.data.interviniente.identificaciones[0]
                    .numeroDocumentoIdentificacion
                )
              "
            />
          </span>
        </template>
      </Column>
      <Column
        field="data.Nombre"
        filter-field="nombre"
        header="Nombre Completo"
      >
        <template #body="slotProps">
          <p>
            {{ slotProps.data.interviniente.nombres }}
            {{ slotProps.data.interviniente.apellidoPaterno }}
            {{ slotProps.data.interviniente.apellidoMaterno }}
          </p>
        </template>
      </Column>
      <Column
        field="alerta"
        filter-field="interviniente.tieneOrdenDetencionVigente"
        header="Alerta"
      >
        <template #body="slotProps">
          <p v-if="slotProps.data.interviniente.tieneOrdenDetencionVigente">
            <i class="pi pi-check" />
          </p>
          <p v-else>
            Sin Alerta
          </p>
        </template>
      </Column>
      <Column
        field="rpa"
        filter-field="interviniente.esRPA"
        header="RPA"
      >
        <template #body="slotProps">
          <p v-if="slotProps.data.esRPA">
            Sí
          </p>
          <p v-else>
            No
          </p>
        </template>
      </Column>
      <Column
        field="nna"
        filter-field="interviniente.esNNA"
        header="NNA"
      >
        <template #body="slotProps">
          <p v-if="slotProps.data.esNNA">
            Sí
          </p>
          <p v-else>
            No
          </p>
        </template>
      </Column>
      <Column
        field="informacion"
        filter-field="interviniente.tieneOrdenDetencionVigente"
        header="Información Delictual"
      >
        <template #body="slotProps">
          <p v-if="slotProps.data.tieneOrdenDetencionVigente">
            Sí
          </p>
          <p v-else>
            No
          </p>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <span class="">
            <Button
              aria-controls="overlay_menu"
              aria-haspopup="true"
              class="p-button-rounded p-button-outlined btn-primary-outline"
              icon="pi pi-ellipsis-v"
              type="button"
              @click="toggleSugeridas($event, data)"
            />
            <Menu
              id="overlay_menu"
              ref="menuSugeridas"
              :model="optionsSugeridasFiscal"
              :popup="true"
            />
          </span>
        </template>
      </Column>
    </AppDataTable>
    <Dialog
      v-model:visible="displayInfoDelictual"
      :base-z-index="1"
      class="py-0"
      header="Información Delictual"
      :maximizable="true"
      :modal="true"
      :style="{ width: '70vw' }"
    >
      <hr>
      <div class="grid pt-4">
        <div class="col-12 md:col-2">
          <img
            alt="sujeto"
            :src="imgSujeto"
          >
        </div>
        <div class="col-12 md:col-4 pl-6 pt-6">
          <span><strong>Imputado: </strong>Jaime Carrasco Tapia</span><br><br>
          <span><strong>N° Documento: </strong>12.345.678-K</span><br><br>
          <span><strong>Número de serie: </strong>382343471</span><br><br>
        </div>
        <div class="col-12 md:col-6 pt-6">
          <Message severity="warn">
            <strong>Atención: </strong>Sujeto presenta órden de detención
          </Message>
        </div>
      </div>

      <div class="mt-5">
        <AppFieldset legend="Causas Asociadas">
          <AppDataTable
            id="causas-asociadas"
            class="col-12"
            :value="tablaCausasAsociadas"
          >
            <Column
              field="antDisponibles"
              header="RUC"
            >
              <template #body="slotProps">
                {{ slotProps.data.ruc }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Causa"
            >
              <template #body="slotProps">
                {{ slotProps.data.causa }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="VIF"
            >
              <template #body="slotProps">
                {{ slotProps.data.vif }}
              </template>
            </Column>
            <Column
              field="origen"
              header="RPA"
            >
              <template #body="slotProps">
                {{ slotProps.data.rpa }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="Fecha Agrupación"
            >
              <template #body="slotProps">
                {{ slotProps.data.fechaAgrupacion }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Estado"
            >
              <template #body="slotProps">
                {{ slotProps.data.estado }}
              </template>
            </Column>
            <Column
              field="actions"
              header="Acciones"
            >
              <template #body>
                <span>
                  <span>
                    <Button
                      aria-controls="overlay_menu"
                      aria-haspopup="true"
                      class="p-button-rounded p-button-outlined btn-primary-outline"
                      icon="pi pi-ellipsis-v"
                      type="button"
                      @click="toggleVerFichaCausa"
                    />
                    <Menu
                      id="overlay_menu"
                      ref="menuVerFicha"
                      :model="optionCausa"
                      :popup="true"
                    />
                  </span>
                </span>
              </template>
            </Column>
          </AppDataTable>
        </AppFieldset>
      </div>
      <div class="mt-5">
        <AppFieldset legend="Órdenes de Detención">
          <AppDataTable
            id="ordenes-detencion"
            class="col-12"
            :value="tablaOrdenesDetencion"
          >
            <Column
              field="antDisponibles"
              header="RUC"
            >
              <template #body="slotProps">
                {{ slotProps.data.ruc }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Fiscalía"
            >
              <template #body="slotProps">
                {{ slotProps.data.fiscalia }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="Fiscal"
            >
              <template #body="slotProps">
                {{ slotProps.data.fiscal }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Delito"
            >
              <template #body="slotProps">
                {{ slotProps.data.delito }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="Estado Causa"
            >
              <template #body="slotProps">
                {{ slotProps.data.estadoCausa }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Fecha Órden"
            >
              <template #body="slotProps">
                {{ slotProps.data.fechaOrden }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Estado Órden fechaTerminoOrden"
            >
              <template #body="slotProps">
                {{ slotProps.data.estadoOrden }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Fecha Término Orden"
            >
              <template #body="slotProps">
                {{ slotProps.data.fechaTerminoOrden }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Tribunal"
            >
              <template #body="slotProps">
                {{ slotProps.data.tribunal }}
              </template>
            </Column>
          </AppDataTable>
        </AppFieldset>
      </div>
      <div class="mt-5">
        <AppFieldset legend="Formalización del Imputado">
          <AppDataTable
            id="formalizacion-imputado"
            class="col-12"
            :value="tablaFormalizacion"
          >
            <Column
              field="antDisponibles"
              header="RUC"
            >
              <template #body="slotProps">
                {{ slotProps.data.ruc }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Audiencia"
            >
              <template #body="slotProps">
                {{ slotProps.data.audiencia }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="Fecha Formalización"
            >
              <template #body="slotProps">
                {{ slotProps.data.fechaFormalizacion }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Delito"
            >
              <template #body="slotProps">
                {{ slotProps.data.delito }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="Fiscalía"
            >
              <template #body="slotProps">
                {{ slotProps.data.fiscalia }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Detalle"
            >
              <template #body="slotProps">
                {{ slotProps.data.detalle }}
              </template>
            </Column>
          </AppDataTable>
        </AppFieldset>
      </div>
      <div class="mt-5">
        <AppFieldset legend="Medidas Cautelares">
          <AppDataTable
            id="medidas-cautelares"
            class="col-12"
            :value="tablaMedidasCautelares"
          >
            <Column
              field="antDisponibles"
              header="RUC"
            >
              <template #body="slotProps">
                {{ slotProps.data.ruc }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Nombre"
            >
              <template #body="slotProps">
                {{ slotProps.data.nombre }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="Medida"
            >
              <template #body="slotProps">
                {{ slotProps.data.medida }}
              </template>
            </Column>
            <Column
              field="origen"
              header="VIF"
            >
              <template #body="slotProps">
                {{ slotProps.data.vif }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="RPA"
            >
              <template #body="slotProps">
                {{ slotProps.data.rpa }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Estado"
            >
              <template #body="slotProps">
                {{ slotProps.data.estado }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Detalle Medida"
            >
              <template #body="slotProps">
                {{ slotProps.data.detalleMedida }}
              </template>
            </Column>
            <Column
              field="actions"
              header="Acciones"
            >
              <template #body>
                <span>
                  <span>
                    <Button
                      aria-controls="overlay_menu"
                      aria-haspopup="true"
                      class="p-button-rounded p-button-outlined btn-primary-outline"
                      icon="pi pi-ellipsis-v"
                      type="button"
                      @click="toggleVerMedidacautelar"
                    />
                    <Menu
                      id="overlay_menu"
                      ref="menuVerMedidacautelar"
                      :model="optionMedidacautelar"
                      :popup="true"
                    />
                  </span>
                </span>
              </template>
            </Column>
          </AppDataTable>
        </AppFieldset>
      </div>
      <div class="mt-5 mb-3">
        <AppFieldset legend="Sentencias">
          <AppDataTable
            id="sentencias"
            class="col-12"
            :value="tablaSentencias"
          >
            <Column
              field="antDisponibles"
              header="RUC"
            >
              <template #body="slotProps">
                {{ slotProps.data.ruc }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Fiscalía"
            >
              <template #body="slotProps">
                {{ slotProps.data.fiscalia }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="Fiscal"
            >
              <template #body="slotProps">
                {{ slotProps.data.fiscal }}
              </template>
            </Column>
            <Column
              field="origen"
              header="VIF"
            >
              <template #body="slotProps">
                {{ slotProps.data.vif }}
              </template>
            </Column>
            <Column
              field="antDisponibles"
              header="RPA"
            >
              <template #body="slotProps">
                {{ slotProps.data.rpa }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Término"
            >
              <template #body="slotProps">
                {{ slotProps.data.termino }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Delito"
            >
              <template #body="slotProps">
                {{ slotProps.data.delito }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Procedimiento"
            >
              <template #body="slotProps">
                {{ slotProps.data.procedimiento }}
              </template>
            </Column>
            <Column
              field="origen"
              header="Fecha Sentencia"
            >
              <template #body="slotProps">
                {{ slotProps.data.fechaSentencia }}
              </template>
            </Column>
            <Column
              field="actions"
              header="Acciones"
            >
              <template #body>
                <span>
                  <span>
                    <Button
                      aria-controls="overlay_menu"
                      aria-haspopup="true"
                      class="p-button-rounded p-button-outlined btn-primary-outline"
                      icon="pi pi-ellipsis-v"
                      type="button"
                      @click="toggleVerSentecia"
                    />
                    <Menu
                      id="overlay_menu"
                      ref="menuVerSentencia"
                      :model="optionSentencia"
                      :popup="true"
                    />
                  </span>
                </span>
              </template>
            </Column>
          </AppDataTable>
        </AppFieldset>
      </div>

      <template #footer>
        <Button
          class="px-8"
          label="Aceptar"
          @click="closeInfoDelictual"
        />
      </template>
    </Dialog>
  </div>
  <SujetosIntervinientesTablaDirecciones
    v-if="Object.keys(intervinienteSeleccionado).length && mostrarDir"
    :interviniente="intervinienteSeleccionado"
  />
</div>
</template>

<script setup>
import { ref } from 'vue'
// commons
import { useConfirmDialog } from '@/modules/common/composables/useConfirmDialog'

// components
import SujetosIntervinientesTablaDirecciones from './SujetosIntervinientesTablaDirecciones.vue'

// store
import { useSujetosIntervinientesStore } from '@/modules/global/composables/useSujetosIntervinientesStore'
// primevue
import Menu from 'primevue/menu'
// consts
const intervinienteSeleccionado = ref({})

const {
  tablaCausasAsociadas,
  tablaOrdenesDetencion,
  tablaFormalizacion,
  tablaMedidasCautelares,
  tablaSentencias,
  sujetosIntervinientes,
  sujetosIntervinientes_deleteSujeto
} = useSujetosIntervinientesStore()

const { launchConfirmDialog } = useConfirmDialog()

// opciones de acciones de menu  fiscal
const menuSugeridas = ref(null)

const mostrarDir = ref(false)

const toggleSugeridas = (event, data) => {
  menuSugeridas.value.toggle(event)
  setIntervinienteSeleccionado(data)
}

const optionsSugeridasFiscal = ref([
  {
    items: [
      {
        label: 'Ver Direcciones',
        icon: 'pi pi-map-marker',
        command: () => {
          mostrarDir.value = !mostrarDir.value
        }
      },
      {
        label: 'Modificar',
        icon: 'pi pi-pencil',
        command: () => {
          console.log('Aquí edita')
        }
      },
      {
        label: 'Necesidad de Pauta',
        icon: 'pi pi-list',
        command: () => {
          console.log('Necesidad de Pauta')
        }
      },
      {
        label: 'Medida de Protección Autónoma',
        icon: 'pi pi-list',
        command: () => {
          console.log('Medida de Protección')
        }
      },
      {
        label: 'Ver Ficha Sujeto',
        icon: 'pi pi-eye',
        command: () => {
          console.log('Abre vista Ficha Sujeto')
        }
      },
      {
        label: 'Ver Información Delictual',
        icon: 'pi pi-eye',
        command: () => {
          openInfoDelictual()
        }
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => {
          handleEliminarInterviniente()
        }
      }
    ]
  }
])

// modal fiscal

const imgSujeto = require('../../../../assets/images/img-sujeto.jpg')
const menuVerFicha = ref()
const menuVerMedidacautelar = ref()
const menuVerSentencia = ref()

const displayInfoDelictual = ref(false)

const openInfoDelictual = () => {
  displayInfoDelictual.value = true
}
const closeInfoDelictual = () => {
  displayInfoDelictual.value = false
}

const setIntervinienteSeleccionado = (data) => {
  intervinienteSeleccionado.value = data
}

const toggleVerFichaCausa = (event) => {
  menuVerFicha.value.toggle(event)
}

const optionCausa = ref([
  {
    items: [
      {
        label: 'Ver Ficha Causa',
        icon: 'pi pi-eye',
        command: () => {
          console.log('Ver Ficha Causa')
        }
      }
    ]
  }
])

const toggleVerMedidacautelar = (event, data) => {
  menuVerMedidacautelar.value.toggle(event)
  setIntervinienteSeleccionado(data)
}

const optionMedidacautelar = ref([
  {
    items: [
      {
        label: 'Ver Medida cautelar',
        icon: 'pi pi-eye',
        command: () => {
          console.log('Ver Medida cautelar')
        }
      }
    ]
  }
])

const toggleVerSentecia = (event) => {
  menuVerSentencia.value.toggle(event)
}

const optionSentencia = ref([
  {
    items: [
      {
        label: 'Ver Sentencia',
        icon: 'pi pi-eye',
        command: () => {
          console.log('Ver Sentencia')
        }
      }
    ]
  }
])

function handleEliminarInterviniente () {
  launchConfirmDialog({
    message: `¿Está seguro de eliminar el funcionario? 
      ${intervinienteSeleccionado.value.interviniente.nombres} 
      ${intervinienteSeleccionado.value.interviniente.apellidoPaterno} 
      ${intervinienteSeleccionado.value.interviniente.apellidoMaterno}
    `,
    accept: () => {
      sujetosIntervinientes_deleteSujeto(
        intervinienteSeleccionado.value.idPersona
      )
    }
  })
}
</script>

<style scoped>
  span {
    font-size: 1.2rem;
  }
</style>
