import moment from 'moment'
moment.locale('es')

const serverDifferenceWithCLtime = 3

export const dateTimeUtil = {
  /**
   * obtiene la edad en años apartir de la fecha de nacimiento con la fecha actual
   *
   * @param {string} birthday
   * @returns Number
   */
  getEdad (birthday) {
    const momentBirthday = moment(birthday, 'YYYY-MM-DD')
    const momentToday = moment(new Date(), 'YYYY-MM-DD')

    return momentToday.diff(momentBirthday, 'years')
  },

  /**
   * parsea la fecha a formato YYYY-MM-DD HH:mm
   *
   * @param {string} date
   * @returns string: 2022-02-17 13:13
   */
  getFechaDetencion (date) {
    return moment(date, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')
  },

  /**
   * parsea la fecha a formato YYYY-MM-DD
   *
   * @param {string} date
   * @returns string: 2022-02-25
   */
  formatToBackend (date) {
    return moment(date).format('YYYY-MM-DD')
  },

  /**
   * parsea la fecha y hora a formato YYYY-MM-DDTHH:mm:ss.SSS
   *
   * @param {string} date
   * @returns string: 2022-02-25T10:02:57.000
   */
  formatToBackendWithTime (date) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS')
  },
  /**
   * parsea la fecha y hora desde backend al formato admitido
   * por el v-model del componente AppCalendar
   *
   * @param {string} date
   */
  formatFromBackendToModel (date) {
    return moment(date).toDate()
  },

  /**
   * parsea la fecha a formato DD-MM-YYYY
   *
   * @param {string} date
   * @returns string: 25-02-2022
   */
  formatToFrontend (date) {
    return moment(date).format('DD-MM-YYYY')
  },

  /**
   * parsea la fecha y hora a formato DD-MM-YYYY HH:mm
   *
   * @param {string} date
   * @param {number} serverDifference horas a restar
   * @returns string: 25-02-2022 12:31
   */
  formatToFrontendWithTime (date, serverDifference) {
    if (serverDifference) {
      return moment(date)
        .subtract(serverDifference, 'hours')
        .format('DD-MM-YYYY HH:mm')
    } else {
      return moment(date).format('DD-MM-YYYY HH:mm')
    }
  },
  /*
   * @returns string: 2022-02-17
      comentario de PC
   */
  getFechaNacimiento (date) {
    return moment(date, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
  },
  /**
   * parsea la fecha y hora a formato DD-MM-YYYY HH:mm y le suma la cantidad de minutos
   *
   * @param {string} date fecha
   * @param {number} minutes minutos a agregar
   * @returns string: 25-02-2022 12:31
   */
  addNMinutes (date, minutes) {
    return moment(date).add(minutes, 'minutes').format('DD-MM-YYYY HH:mm')
  },
  /**
   * parsea la fecha y hora a formato YYYY-MM-DDTHH:mm:ss.SSS y le suma la cantidad de dias
   *
   * @param {string} date fecha
   * @param {number} days minutos a agregar
   * @returns string: 2022-02-25T10:02:57.000
   */
  addDays (date, days) {
    return moment(date).add(days, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS')
  },

  /**
   * obtiene la fecha y hora en valores separados con la diferencia del servidor y la hora de Chile
   */
  getDateTimeFormatInCLtime (dateTime, server) {
    let timestamp

    if (server) {
      timestamp = moment(dateTime)
        .add(serverDifferenceWithCLtime, 'hours')
        .format('HH:mm')
    } else {
      timestamp = moment(dateTime).format('HH:mm')
    }

    const date = moment(dateTime).format('DD-MM-YYYY')
    // .subtract(serverDifferenceWithCLtime, 'hours')
    return { date, timestamp }
  }
}
