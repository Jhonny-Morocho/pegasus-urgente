<template>
<section class="col-12">
  <AppDataTable
    id="dataTableIntervinientes"
    v-model:selection="sujetoSeleccionado"
    class="col-12 pt-0"
    v-bind="{ ...$attrs }"
    :rows="paginacion?.tamanoPagina"
    :total-records="paginacion?.elementosTotales"
    :value="sujetosIntervinientes"
  >
    <Column
      v-if="props.isSolicitud"
      header="Seleccionar"
      style="width: 48px"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center">
          <input
            :id="data"
            v-model="sujetoSeleccionado"
            class="p-checkbox"
            type="radio"
            :value="data"
          >
        </div>
      </template>
    </Column>

    <Column
      v-if="!esDenunciante"
      :header="esFichaCausa ? 'Tipo Sujeto' : 'Tipo de Interviniente'"
    >
      <template #body="{ data }">
        {{
          mantenedor_getNombreTipoSujeto(data?.tipoSujeto) ??
            mantenedor_getNombreTipoSujeto('0')
        }}
        {{
          (mantenedor_getCodigoTipoSujeto(data?.tipoSujeto) ||
            data?.tipoSujeto) === '1' && data.esVictima
            ? '(Víctima)'
            : ''
        }}
      </template>
    </Column>
    <Column header="N° Documento">
      <template #body="{ data }">
        <p
          v-if="
            (data.numeroDocumento &&
              mantenedor_getCodigoTipoDocumentoIdentidad(
                data.tipoDocumento
              ) === '1') ||
              data.rutJuridico
          "
        >
          {{
            data.representaInstitucion
              ? format(data.rutJuridico)
              : format(data.numeroDocumento)
          }}
        </p>
        <p v-else>
          {{ data.numeroDocumento ?? 'S/N' }}
        </p>
      </template>
    </Column>
    <Column
      :header="esFichaCausa ? 'Nombre Completo' : 'Nombre del Interviniente'"
    >
      <template #body="{ data }">
        {{
          data.representaInstitucion
            ? data.razonSocial
            : getNombreCompleto(
              data?.nombres,
              data?.apellidoPaterno,
              data?.apellidoMaterno
            )
        }}
      </template>
    </Column>
    <Column
      v-if="esFichaCausa"
      field="nacionalidad"
      filter-field="nacionalidad"
      header="Nacionalidad"
    >
      <template #body="{ data }">
        {{ data.idNacionalidad }}
      </template>
    </Column>
    <Column
      v-if="esFichaCausa"
      field="fechaNacimiento"
      filter-field="fechaNacimiento"
      header="Fecha de nacimiento"
    >
      <template #body="{ data }">
        <p v-if="data.fechaNacimiento">
          {{ dateTimeUtil.formatToFrontend(data.fechaNacimiento) }}
        </p>
        <p v-else>
          No Informado
        </p>
      </template>
    </Column>
    <Column
      v-if="esFichaCausa"
      field="edad"
      filter-field="edad"
      header="Edad"
    >
      <template #body="{ data }">
        {{ data.edad }}
      </template>
    </Column>
    <Column
      v-if="esFichaCausa"
      field="genero"
      filter-field="genero"
      header="Género"
    >
      <template #body="{ data }">
        {{ mantenedor_getIdentidadDeGeneroNombreById(data.sexoDeclarado) }}
      </template>
    </Column>
    <!-- PRECLASIFICADOR -->
    <section v-if="isPreclasificador">
      <Column
        field="alerta"
        filter-field="alerta"
        header="Alerta"
      >
        <template
          v-if="isPreclasificador"
          #body="{ data }"
        >
          <div
            v-if="data?.alertas?.length"
            class="flex"
          >
            <ChipAlerta
              v-for="(alerta, index) in data?.alertas"
              :key="index"
              :alerta="alerta"
              :is-chip-con-modal="true"
            />
          </div>

          <span v-else>--</span>
        </template>
      </Column>
      <Column
        field="esRpa"
        filter-field="esRpa"
        header="RPA"
      >
        <template
          v-if="isPreclasificador"
          #body="{ data }"
        >
          {{
            data.esRPA ? 'Si' : 'No' /*Preclasificador tiene otro contrato*/
          }}
        </template>
        <template
          v-else
          #body="{ data }"
        >
          {{ data.interviniente.esRPA ? 'Si' : 'No' }}
        </template>
      </Column>
      <Column
        field="esNna"
        filter-field="esNna"
        header="NNA"
      >
        <template
          v-if="isPreclasificador"
          #body="{ data }"
        >
          {{ textoNNA(data.esNNA) /*Preclasificador tiene otro contrato*/ }}
        </template>
        <template
          v-else
          #body="{ data }"
        >
          {{ data.interviniente.esNNA ? 'Si' : 'No' }}
        </template>
      </Column>
      <Column
        field="informacionDelictual"
        filter-field="informacionDelictual"
        header="Información Delictual"
      >
        <template
          v-if="isPreclasificador"
          #body="{ data }"
        >
          {{
            data.detencion
              ? 'Si'
              : 'No' /*Preclasificador tiene otro contrato*/
          }}
        </template>
        <template
          v-else
          #body="{ data }"
        >
          {{
            (mantenedor_getCodigoTipoSujeto(data?.tipoSujeto) ||
              data?.tipoSujeto) === '6'
              ? 'No'
              : 'Si'
          }}
        </template>
      </Column>
    </section>
    <section v-if="!props.isSolicitud">
      <Column
        v-if="!isEditando && !readOnly"
        class="text-center"
        header="Acciones"
        style="width: 0"
      >
        <template #body="slotProps">
          <AppMenuOptions
            v-model="sujetoSeleccionado"
            :menu-options="
              esFichaCausa ? opcionesFichaCausa : opcionesTablaSujetos
            "
            :slot-props="slotProps"
          />
        </template>
      </Column>
    </section>
  </AppDataTable>
  <Menu
    v-if="!isPreclasificador"
    id="overlay_menu"
    ref="menuEspecie"
    :model="esFichaCausa ? menuEspecieFichaCausa : opcionesTablaSujetos"
    :popup="true"
    @click="toggleAcciones($event, data)"
  />
  <SujetosIntervinientesTablaDirecciones
    v-if="Object.keys(sujetoSeleccionado).length && mostrarDir"
    :interviniente="sujetoSeleccionado"
    :ocultar-direccion="displayMapaDir"
  />
</section>
</template>

<script setup>
import { defineEmits, ref, defineProps, defineExpose, onMounted } from 'vue'
import { useAppDialog } from '@/modules/common/composables'
import { format } from '@fiquu/cl-rut'

// store
import { useSujetosIntervinientesStore } from '@/modules/global/composables/useSujetosIntervinientesStore'

// components
import SujetosIntervinientesTablaDirecciones from '@/modules/global/components/sujetos-intervinientes/tablas/SujetosIntervinientesTablaDirecciones.vue'
import ModalInformacionDelictualSujeto from '@/modules/global/components/modals/ModalInformacionDelictualSujeto.vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'

// MODALES FICHA CAUSA
import ModalVerRepresentados from '@/modules/global/components/ficha-causa/modals/ModalVerRepresentados.vue'
import {
  useFichaCausaStore,
  useMantenedorStore
} from '@/modules/global/composables'
import { useRouter } from 'vue-router'

const { launchDialog } = useAppDialog()

const router = useRouter()

const props = defineProps({
  isEditando: Boolean,
  isSolicitud: Boolean,
  isPreclasificador: Boolean,
  readOnly: Boolean,
  esFichaCausa: Boolean,
  esDenunciante: Boolean,
  isDisabled: { type: Boolean, default: false }
})

function getNombreCompleto (n, ap, am) {
  let nombreCompleto = ''
  if (n && ap) {
    nombreCompleto = `${n} ${ap} ${am ?? ''}`
    return nombreCompleto
  } else {
    return 'No definido'
  }
}

const {
  sujetosIntervinientes,
  paginacion,
  sujetosIntervinientes_getInformacionDelictual,
  sujetosIntervinientes_getSujetosByIdRelacionSujeto,
  sujetosInvervinientes_getInformacionSrcel
} = useSujetosIntervinientesStore()

const { fichaCausa_SET_SUJETO_SELECCIONADO } = useFichaCausaStore()
const sujetoPrevSeleccionado = ref(null)
const sujetoSeleccionado = ref({})

defineExpose({ sujetoSeleccionado })

const {
  mantenedor_getNombreTipoSujeto,
  mantenedor_getCodigoTipoSujeto,
  mantenedor_getIdentidadDeGeneroNombreById,
  mantenedor_getCodigoTipoDocumentoIdentidad,
  mantenedor_getComunas
} = useMantenedorStore()

const mostrarDir = ref(false)
const opcionesTablaSujetos = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Modificar',
        command: () => {
          if (props.isPreclasificador) {
            editarSujetoAfuera(sujetoSeleccionado.value)
          } else {
            handleEditarSujeto(sujetoSeleccionado.value.idRelacionSujeto)
          }
        },
        disabled: props.isDisabled
      },
      {
        label: 'Necesidad de Pauta',
        command: () => {
          console.log('Necesidad de Pauta')
        },
        disabled: true,
        visible: () => {
          return false
        }
      },
      {
        label: 'Medida de Protección Autónoma',
        disabled: true,
        command: () => {
          console.log('Medida de Protección')
        },
        visible: () => false
      },
      {
        label: 'Eliminar',
        command: () => {
          emit('eliminar-sujeto', sujetoSeleccionado.value)
        },
        disabled: props.isDisabled
      },
      {
        label: 'Ver Información Delictual',
        command: () => emit('ver-ficha-sujeto', sujetoSeleccionado.value),
        visible: () => props.isPreclasificador
      },
      {
        label: 'Ver Más',
        command: () => verMas(sujetoSeleccionado.value),
        visible: () => props.isPreclasificador
      },
      {
        label: 'Ver Dirección',
        command: () => {
          displayMapaDir()
        }
      },
      {
        label: 'Solicitar Contactar a la Víctima',
        command: () => emit('contactar-victima', sujetoSeleccionado.value),
        visible: () =>
          (sujetoSeleccionado.value.tipoSujeto === 'VICTIMA' ||
            sujetoSeleccionado.value.tipoSujeto === 'Víctima') &&
          props.isPreclasificador
      }
    ]
  }
])
const opcionesFichaCausa = ref([
  {
    label: 'Acciones',
    items: [
      {
        label: 'Ver Ficha Sujeto',
        command: () => {
          requestUtil({
            action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
            payload: {
              idRelacionSujeto: sujetoSeleccionado.value.idRelacionSujeto
            },
            resolve: (r) => {
              const { interviniente } = r

              const payload = {
                tipoId: interviniente.identificacion.tipoDocumento,
                numeroId: interviniente.identificacion.numeroDocumento
              }
              requestUtil({
                action: sujetosInvervinientes_getInformacionSrcel,
                payload,
                resolve: (response) => {
                  const { fotografia, firma } = response
                  fichaCausa_SET_SUJETO_SELECCIONADO({
                    foto: fotografia.base64Data,
                    firma: firma.base64Data,
                    ...r
                  })
                  abrirFichaSujeto()
                }
              })
            }
          })
        }
      },
      {
        visible: () =>
          sujetosIntervinientes?.tipoSujeto ===
          '281FF82F-253B-4AD1-90A9-6EEF9559FE9A',
        label: 'Ver Representados',
        command: () => abrirModalDeRepresentados()
      }
    ]
  }
])

const emit = defineEmits([
  'set-sujeto-editar',
  'set-modo-lectura',
  'contactar-victima',
  'eliminar-sujeto',
  'ver-ficha-sujeto'
])
const menuEspecie = ref()

function toggleAcciones (event, data) {
  sujetoSeleccionado.value = data
  menuEspecie.value.toggle(event)
}

/*eslint-disable*/
const { tiposPersona } = useMantenedorStore();

async function handleEditarSujeto(idRelacionSujeto) {
  requestUtil({
    action: sujetosIntervinientes_getSujetosByIdRelacionSujeto,
    payload: {
      idRelacionSujeto: idRelacionSujeto
    },
    resolve: (sujeto) => {
      const idRepresentaInstitucion =
        sujeto.representaInstitucion === false
          ? tiposPersona.value[0].id
          : tiposPersona.value[1].id;
      emit('set-sujeto-editar', { ...sujeto, idRepresentaInstitucion });
    }
  });
}

function editarSujetoAfuera(sujeto) {
  emit('set-sujeto-editar', sujeto);
}

function verMas(sujeto) {
  emit('set-modo-lectura', sujeto);
}

function verInfoDelictual() {
  if (props.isPreclasificador) {
    launchDialog({
      component: ModalInformacionDelictualSujeto,
      header: 'Información Delictual',
      width: '80%',
      props: {
        data: sujetoSeleccionado.value
      }
    });
  } else {
    const idPersona = sujetoSeleccionado.value.idPersona;
    requestUtil({
      action: sujetosIntervinientes_getInformacionDelictual,
      payload: { idPersona },
      resolve: (data) => {
        launchDialog({
          component: ModalInformacionDelictualSujeto,
          header: 'Información Delictual',
          width: '80%',
          props: {
            data: {
              ...data
            }
          }
        });
      }
    });
  }
}
function abrirFichaSujeto() {
  router.push('/ficha-sujeto');
}

function displayMapaDir() {
  if (
    !mostrarDir.value ||
    sujetoSeleccionado.value.idRelacionSujeto !== sujetoPrevSeleccionado.value
  ) {
    sujetoPrevSeleccionado.value = sujetoSeleccionado.value.idRelacionSujeto;
    mostrarDir.value = true;
  } else {
    sujetoSeleccionado.value = {};
    mostrarDir.value = false;
  }
}

function abrirModalDeRepresentados() {
  launchDialog({
    component: ModalVerRepresentados,
    header: 'Ver Representados',
    width: '80%',
    props: {},
    cancelLabel: 'Cerrar'
  });
}

function textoNNA(value) {
  if (!value) {
    return 'No';
  }
  return 'Si';
}

onMounted(() => {
  requestUtil({ action: mantenedor_getComunas });
});
</script>
