<template>
<div>
  <hr>
  <div class="mt-4 mb-6 header">
    {{ parseDataOrganismoColaborador(prueba?.institucionDenunciante) }}
  </div>

  <AppFieldset
    class="mb-5"
    legend="Antecedentes de la Denuncia"
    :toggleable="true"
  >
    <div class="col-12 md:col-6">
      <p><strong>Tipo de denuncia: </strong>{{ prueba?.denuncia?.tipoDenunciaDescripcion }}</p>
      <p><strong>Region: </strong>{{ prueba?.denuncia?.regionFiscaliaDescripcion }}</p>
      <p><strong>Nombre Fiscalia: </strong>{{ prueba?.denuncia?.fiscaliaDescripcion }}</p>
      <p><strong>Institución Policial: </strong>{{ prueba?.denuncia?.unidadPoliciaOrganismo }}</p>
      <p><strong>Nro del Parte: </strong>{{ prueba?.denuncia?.numeroDenuncia }}</p>
    </div>
    <div class="col-12 md:col-6">
      <p><strong>Fecha Denuncia: </strong>{{ dateTimeUtil.formatToFrontendWithTime(prueba?.denuncia?.fechaIngreso) }}</p>
      <p><strong>Hora Denuncia: </strong>{{ dateTimeUtil.formatToFrontendWithTime(prueba?.denuncia?.fechaIngreso) }}</p>
      <p><strong>Unidad Policial: </strong>{{ prueba?.denuncia?.unidadPoliciaOrganismo }}</p>
      <p><strong>Prefectura: </strong>{{ prueba?.denuncia?.prefecturaDependenciaUP }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    v-if="!isDenunciaDirecta"
    class="mb-5"
    :collapsed="true"
    legend="Funcionario que confecciona el Parte"
    :toggleable="true"
  >
    <div class="col-12">
      <p><strong>Nombre: </strong>{{ data?.infoDenuncia?.funcionarioParte?.nombreFuncionario }}</p>
      <p><strong>RUT: </strong>{{ data?.infoDenuncia?.funcionarioParte?.rutFuncionario }}</p>
      <p><strong>Grado: </strong>{{ data?.infoDenuncia?.funcionarioParte?.gradoFuncionario }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    v-if="!isDenunciaDirecta"
    class="mb-5"
    :collapsed="true"
    legend="Funcionario a Cargo del Procedimiento"
    :toggleable="true"
  >
    <div class="col-12">
      <p><strong>Nombre: </strong>{{ data?.antecedentesCausa?.antecedentes?.funcionarioCargoProcedimiento }}</p>
      <p><strong>RUT: </strong>{{ data?.infoDenuncia?.funcionarioProcedimiento?.rutFuncionario }}</p>
      <p><strong>Grado: </strong>{{ data?.infoDenuncia?.funcionarioProcedimiento?.gradoFuncionario }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Antecedentes del Delito"
    :toggleable="true"
  >
    <div class="col-12 md:col-6">
      <p><strong>Codigo Delito: </strong>{{ parseDataDelito(prueba?.denunciaHechoDelectual?.data)?.codigoDelito }}</p>
      <p><strong>Fecha Delito: </strong>{{ parseDataDelito(prueba?.denunciaHechoDelectual?.data)?.fechaDelito }}</p>
      <p><strong>Hora Delito: </strong>{{ parseDataDelito(prueba?.denunciaHechoDelectual?.data)?.horaDelito }}</p>
    </div>
    <div class="col-12 md:col-6">
      <p><strong>Lugar Ocurrencia: </strong>{{ parseDataDelito(prueba?.denunciaHechoDelectual?.data)?.lugarOcurrencia }}</p>
      <p>
        <strong>Direccion del Delito: </strong>
        {{ parseDataDelito(prueba?.denunciaHechoDelectual?.data)?.direccionDelito }}
      </p>
      <p><strong>Region: </strong>{{ parseDataDelito(prueba?.denunciaHechoDelectual?.data)?.regionDelito }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Identificación del Denunciante"
    :toggleable="true"
  >
    <div class="col-12 md:col-6">
      <p><strong>Tipo Doc. Identificación: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.tipoDocumento }}</p>
      <p><strong>Nro. Doc. Identificación: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.nroDocumento }}</p>
      <p><strong>Nombres: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.nombres }}</p>
      <p><strong>Apellido Paterno: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.apePaterno }}</p>
      <p><strong>Apellido Materno: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.apeMaterno }}</p>
      <p><strong>Nacionalidad: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.nacionalidad }}</p>
    </div>
    <div class="col-12 md:col-6">
      <p><strong>Sexo: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.sexo }}</p>
      <p><strong>Fecha Nacimiento: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.fechaNacimiento }}</p>
      <p><strong>Dirección Denunciante: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.dirDenunciante }}</p>
      <p><strong>Comuna: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.comuna }}</p>
      <p><strong>Región: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.region }}</p>
      <p><strong>Telefonos: </strong>{{ parseDataSujeto(infoSujetoDenunciante)?.telefonos }}</p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Relato del Hecho"
    :toggleable="true"
  >
    <div class="col-12">
      <p class="text-justify">
        <Editor
          id="editor-ver-escrito"
          v-model="relatoParsed"
          class="w-full"
          editor-style="height: 256px"
          :readonly="true"
        >
          <template #toolbar>
            <p class="m-0 p-0 w-0 h-0" />
          </template>
        </Editor>
      </p>
    </div>
  </AppFieldset>

  <AppFieldset
    class="mb-5"
    legend="Mas Información"
    :toggleable="true"
  >
    <div class="flex flex-column">
      <p class="line-height-4">
        <strong>Especies Sustraídas: </strong>{{ parseDataEspecies(prueba?.especieDineros)?.especiesSustraidas }}
      </p>
      <p class="line-height-4">
        <strong>Avaluo: </strong>$ {{ parseDataEspecies(prueba?.especieDineros)?.avaluos }}
      </p>
      <p class="line-height-4">
        <strong>Testigos: </strong>{{ parseDataEspecies(prueba?.especieDineros)?.testigos }}
      </p>
      <p class="line-height-4">
        <strong>Camaras: </strong>{{ parseDataEspecies(prueba?.especieDineros)?.camaras }}
      </p>
      <p class="line-height-4">
        <strong>Seguros: </strong>{{ parseDataEspecies(prueba?.especieDineros)?.seguros }}
      </p>
      <p class="line-height-4">
        <strong>Citación: </strong>{{ parseDataEspecies(prueba?.especieDineros)?.citacion }}
      </p>
    </div>
  </AppFieldset>

  <div class="mt-6 mb-4 footer">
    {{ parseDataOrganismoColaborador(prueba?.institucionDenunciante) }}
  </div>
</div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'
import { requestUtil, dateTimeUtil, appUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const {
  mantenedor_getTiposDenuncia,
  mantenedor_getTipoDenunciaNombreById,
  mantenedor_getComunas,
  mantenedor_getRegiones,
  mantenedor_getNombreTipoSujeto,
  mantenedor_getTiposDocumento,
  mantenedor_getTipoSexo,
  mantenedor_getPaises,
  tiposDocumento,
  tipoSexo,
  comuna,
  regiones,
  paises
} = useMantenedorStore()

const {
  idDenuncia,
  ruc,
  dirigirInvestigacion_getObtenerDetalleDenunciaCompleto
} = useDirigirInvestigacionStore()

const dialogRef = inject('dialogRef')
const isDenunciaDirecta = computed(() => {
  return mantenedor_getTipoDenunciaNombreById(data?.antecedentesCausa?.antecedentes?.idTipoDenuncia) === 'DIRECTA'
})

const data = reactive({
  ...dialogRef.value?.data
})

const infoSujetoDenunciante = computed(() => {
  let sujetoDenunciante = null

  if (prueba.value?.personaRelacionClase) {
    if (prueba.value?.personaRelacionClase.length >= 1) {
      prueba.value.personaRelacionClase.forEach(suj => {
        const tipoSuj = mantenedor_getNombreTipoSujeto(suj.tipoSujeto)
        if (tipoSuj === 'DENUNCIANTE') {
          sujetoDenunciante = suj
        }
      })
    }
  }
  return sujetoDenunciante
})

const relatoParsed = ref(null)

const prueba = ref({})

async function getDataInicial () {
  await requestUtil({
    action: dirigirInvestigacion_getObtenerDetalleDenunciaCompleto,
    payload: {
      ruc: ruc.value,
      idDenuncia: idDenuncia.value
    },
    resolve: (_res) => {
      console.warn(_res)
      prueba.value = _res
    }
  })
}

function parseDataDelito (_delitos) {
  let delito = null
  if (_delitos) {
    if (_delitos.length) {
      delito = _delitos[0]

      const nombreDelito = delito?.delito?.familiaDelito + ' - ' + delito?.delito?.tipoDelito
      const fechaDelito = formatDate(delito?.fechaOcurrencia)
      const lugarOcurrencia = delito?.lugarDelito?.lugarOcurrencia
      const direccionDelito = delito?.direccionDelito?.calle + ' ' + delito?.direccionDelito?.numero
      const regionDelito = delito?.direccionDelito?.regionNombre

      return {
        codigoDelito: nombreDelito,
        fechaDelito,
        horaDelito: fechaDelito,
        lugarOcurrencia,
        direccionDelito,
        regionDelito
      }
    }
  }
}

function parseDataEspecies (_especies) {
  let especies = null
  if (_especies) {
    if (_especies.length) {
      especies = _especies[0]

      const especiesSustraidas = especies?.tipoEspecie
      const avaluos = especies?.avaluoEstimado

      return {
        especiesSustraidas,
        avaluos,
        testigos: '',
        camaras: '',
        seguros: '',
        citacion: ''
      }
    }
  }
}

function parseDataSujeto (_sujeto) {
  if (_sujeto) {
    const tipoDocumento = retornarDescripcionTipoDoc(_sujeto?.tipoDocumento)?.descripcion
    const nroDocumento = _sujeto?.numeroDocumento
    const nombres = _sujeto?.nombres
    const apePaterno = _sujeto?.apellidoPaterno
    const apeMaterno = _sujeto?.apellidoMaterno
    const nacionalidad = retornarDescripcionNacionalidad(_sujeto?.idNacionalidad)?.descripcion
    const sexo = retornarDescripcionSexo(_sujeto?.sexoBiologico)?.descripcion
    const fechaNacimiento = dateTimeUtil.formatToFrontend(_sujeto?.fechaNacimiento)
    const dirDenunciante = () => {
      if (_sujeto?.direccion) {
        return `${_sujeto?.direccion?.calle} ${_sujeto?.direccion?.numeroCalle}`
      }
    }
    const comuna = retornarDescripcionComuna(_sujeto?.direccion?.idComuna)?.descripcion
    const region = retornarDescripcionRegion(_sujeto?.direccion?.idRegion)?.descripcion

    return {
      tipoDocumento,
      nroDocumento,
      nombres,
      apePaterno,
      apeMaterno,
      nacionalidad,
      sexo,
      fechaNacimiento,
      dirDenunciante: dirDenunciante(),
      comuna,
      region,
      telefonos: ''
    }
  }
}

function parseDataOrganismoColaborador (_organismo) {
  let tituloOrganismoColaborador = ''
  if (_organismo) {
    if (_organismo.unidadPoliciaOrganismoDescripcion) {
      tituloOrganismoColaborador += _organismo.unidadPoliciaOrganismoDescripcion + '\n'
    }
    if (_organismo.prefecturaDependenciaUPDescripcion) {
      tituloOrganismoColaborador += _organismo.prefecturaDependenciaUPDescripcion + '\n'
    }
    if (_organismo.comisariaDescripcion || _organismo.destacamentoDescripcion) {
      if (appUtil.includeWord(_organismo.comisariaDescripcion, _organismo.destacamentoDescripcion)) {
        tituloOrganismoColaborador += _organismo.comisariaDescripcion
      } else {
        tituloOrganismoColaborador += _organismo.comisariaDescripcion + '\n'
        tituloOrganismoColaborador += _organismo.destacamentoDescripcion
      }
    }
  }

  return tituloOrganismoColaborador
}

function formatDate (date) {
  if (!date) {
    return ''
  }
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function retornarDescripcionTipoDoc (_idTipoDoc) {
  if (tiposDocumento.value.length) {
    return tiposDocumento.value.find((el) => el.id === _idTipoDoc)
  }
}

function retornarDescripcionNacionalidad (_idNacionalidad) {
  if (paises.value.length) {
    return paises.value.find((el) => el.id === _idNacionalidad)
  }
}

function retornarDescripcionSexo (_idTipoSexo) {
  if (tipoSexo.value.length) {
    return tipoSexo.value.find((el) => el.id === _idTipoSexo)
  }
}

function retornarDescripcionComuna (_idComuna) {
  if (comuna.value.length) {
    return comuna.value.find((el) => el.id === _idComuna)
  }
}

function retornarDescripcionRegion (_idRegion) {
  if (regiones.value.length) {
    return regiones.value.find((el) => el.id === _idRegion)
  }
}

onMounted(async () => {
  requestUtil({ action: mantenedor_getTiposDocumento })
  requestUtil({ action: mantenedor_getTiposDenuncia })
  requestUtil({ action: mantenedor_getComunas })
  requestUtil({ action: mantenedor_getRegiones })
  requestUtil({ action: mantenedor_getPaises })
  requestUtil({ action: mantenedor_getTipoSexo })
  relatoParsed.value = data?.relato?.relato

  await getDataInicial()
})
</script>

<style scoped>
strong {
  color: #686868;
  font-weight: 400;
  line-height: 1.5;
}

.header {
  font-weight: 500;
  width: 160px;
  font-size: 14px;
  line-height: 22px;
}
.footer {
  font-weight: 500;
  width: 160px;
  font-size: 14px;
  line-height: 22px;
}
</style>
