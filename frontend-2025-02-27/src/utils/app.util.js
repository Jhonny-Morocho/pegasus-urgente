import { dateTimeUtil } from './dateTime.util'
import { cleanParts } from '@fiquu/cl-rut'

export const appUtil = {
  clone (data) {
    return JSON.parse(JSON.stringify(data))
  },

  /**
   * @param { Object } response Objeto complejo de Back-end
   * @param { Object } obj Objeto reactivo del composable
   *
   * Recibe esos dos parametros, iterando el primer parametro y comprobando si sus propiedades son un objeto,
   * para hacer uso de la recursividad en caso de ser necesario y iterar las propiedades de este objeto para luego declarar esa KEY en el objeto,
   * en caso de no existir, será creada.
   */
  rellenarObjeto (response, obj) {
    for (const key in response) {
      if (Object.hasOwnProperty.call(response, key)) {
        const element = response[key]
        const isObject = element instanceof Object

        if (isObject) {
          this.rellenarObjeto(element, obj)
          continue
        }

        obj[key] = element
      }
    }
  },

  createContract (contractObj, dataObj) {
    for (const key in contractObj) {
      if (Object.hasOwnProperty.call(contractObj, key)) {
        const value = dataObj[key]

        const isObject = contractObj[key] instanceof Object
        const isArray = contractObj[key] instanceof Array

        if (isObject && !isArray) {
          this.createContract(contractObj[key], dataObj)
          continue
        }

        contractObj[key] = value
      }
    }
  },

  /**
   *
   * @param { Number } longitud Largo del string a generar
   *
   * Toma la longitud y genera aleatoriamente un string, devolviendo el valor del mismo
   */
  cadenaAleatoria (longitud) {
    // Nota: no usar esta función para cosas criptográficamente seguras.
    const banco =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let aleatoria = ''
    for (let i = 0; i < longitud; i++) {
      aleatoria += banco.charAt(Math.floor(Math.random() * banco.length))
    }
    return aleatoria
  },

  /**
   *
   * @param { Number | string } value Destino del Scroll
   *
   * Toma un valor numérico o el query selector que indica hacia qué parte de la vista se realizará el scroll
   */
  scrollTo (value) {
    if (typeof value === 'number') {
      window.scrollTo({
        top: value,
        behavior: 'smooth'
      })
    }
    if (typeof value === 'string') {
      setTimeout(() => {
        document.querySelector(value)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 10)
    }
  },

  /**
   *
   * @param { String } value Texto a normalizar
   *
   * Toma un valor alfanumérico y lo normaliza cambiando los carácteres con diacríticos
   * al mismo carácter sin diacrítico
   *
   * @returns { String } valor normalizado en lower case
   */
  normalizeString (value) {
    return value
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
  },

  /**
   *
   * @param { String } value - Valor en donde se realiza la búsqueda
   * @param { String } find - Valor a buscar
   *
   * Busca el texto de find en el texto de value
   *
   * @returns {Boolean} Si el valor de find se encuentra también en value
   */
  includeWord (value, find) {
    const valueLower = appUtil.normalizeString(value)
    const findLower = appUtil.normalizeString(find)
    return valueLower?.includes(findLower)
  },

  /**
   *
   * @param {Object} filters filtros de bandejas ingreso directa|oficio|física
   * @returns query filtros de acuerdo a los endpoints
   */
  sanitizeFilters (filters) {
    const sanitizedFilters = {}

    Object.keys(filters).forEach((key) => {
      switch (key) {
        case 'fecha-desde':
        case 'fecha-hasta':
          sanitizedFilters[key] = filters[key]
            ? dateTimeUtil.formatToBackend(filters[key])
            : undefined

          break
        case 'actualTabDenuncia':
          // eslint-disable-next-line no-case-declarations
          const tareaStatus = [
            'curso',
            'tareas-por-vencer',
            'tareas-vencidas',
            'prioritario',
            'tareas-completadas'
          ].find((o) => o === filters[key])

          if (tareaStatus) {
            sanitizedFilters[tareaStatus] = true
          }

          sanitizedFilters[key] = undefined
          break

        case 'actualTabFlagrancia':
          if (filters[key] === 'cerradas') {
            sanitizedFilters['tareas-cerradas'] = true
          }

          sanitizedFilters[key] = undefined
          break

        default:
          sanitizedFilters[key] = filters[key]
          break
      }
    })

    return sanitizedFilters
  },

  /**
   *
   *
   * Retorna true o false aleatoriamente
   *
   * @returns {Boolean} true or false
   */
  /*  randomBoolean () {
    const number = Math.floor(Math.random() * (100 - 0)) + 0
    return number > 50
  }, */

  taskStatus: {
    CREATED: 'Created',
    READY: 'Ready',
    RESERVED: 'Reserved',
    IN_PROGRESS: 'InProgress',
    COMPLETED: 'Completed',
    OBSOLETE: 'Obsolete'
  },

  /**
   *
   * @param { Number } min - Valor mínimo
   * @param { Number } max - Valor máximo
   *
   * Entrega un número aleatorio entre min y max, incluyente
   *
   * @returns {Number} Número aleatorio
   */
  /*   randomNumber (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }, */

  rutFormatToBack (rut) {
    if (!rut) {
      return null
    }
    const arrayRut = cleanParts(rut)
    return arrayRut[0] + '-' + arrayRut[1]
  },

  /**
   *
   * @param {{ruc: string, causa: object, preclasificacion: object, tipoDelito: function}} ruc El RUC de la Causa
   * @param {{ruc: string, causa: object, preclasificacion: object, tipoDelito: function}} causa Causa Actual
   * @param {{ruc: string, causa: object, preclasificacion: object, tipoDelito: function}} preclasificacion Propuesta del Preclasificador
   * @param {{ruc: string, causa: object, preclasificacion: object, tipoDelito: function}} tipoDelito Funcion que retorna la descripcion del tipo de delito en base a su ID
   * @returns {string} Escrito Consulta FR Causa Alta Complejidad
   */
  getEscritoConsultaFR ({ ruc, causa, propuestaPreclasificador, tipoDelito }) {
    let listaDelitos = ''

    if (causa?.delitos.length) {
      listaDelitos = '<li><strong>Delitos:</strong></li>'
      for (const delito of causa?.delitos) {
        listaDelitos += `<li class="ql-indent-1">${tipoDelito(
          delito.tipoDelito
        )}</li>`
      }
    }

    return `<h3>Antecedentes de la Causa</h3>
<br />
<ul>
  <li><strong>RUC: </strong>${ruc}</li>
  <li><strong>Nombre Causa: </strong>${causa?.nombre}</li>
  <li><strong>Fecha/Hora Creación: </strong>${causa?.fechaHoraCreacion}</li>
  ${listaDelitos}
</ul>
<br />
<h3>Propuesta del Preclasificador</h3>
<br />
<ul>
  <li><strong>Propuesta Preclasificador: </strong>${propuestaPreclasificador}</li>
</ul>
<br />
`
  },
  sleep (m) {
    return new Promise((resolve) => setTimeout(resolve, m))
  }
}
