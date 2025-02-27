export default {
  namespaced: true,
  state: () => ({
    dataComprobante: {
      comprobante: true,
      ruc: '2200938215-8',
      fechaInspeccion: '18-07-2022',
      horaInicioInspeccion: '09:30',
      horaTerminoInspeccion: '12:35',
      fechaTermino: '18-07-2022',
      nombreCausa: 'Hurto simple 4 A 40 UTM a Gustavo',
      solicitanteInspeccion: 'Samuel Núñez Parga',
      fiscaliaLocal: 'Fiscalía Local de Casablanca',
      observaciones: 'Acá la observación que puede ser un texto largo...................................................................................................'
    },
    dataEspeciesDinero: {
      comprobante: true,
      nue: 1939406,
      especiesDineros: [
        {
          rue: '00012345-1',
          familiaEspecie: 'Herramienta',
          tipoEspecie: 'Napoleón',
          descripcion: 'Napoleón marca Stanley',
          alerta: true,
          cantidadMonto: 1,
          observaciones: 'Especie fue encontrada en un bolso de mano',
          bodega: 'Bodega 1',
          sector: 'Sector 1',
          casillero: 'Casillero 1'
        },
        {
          rue: '00012346-1',
          familiaEspecie: 'Herramienta',
          tipoEspecie: 'Alicate',
          descripcion: 'Alicate color rojo',
          alerta: false,
          cantidadMonto: 1,
          observaciones: 'Alicate con grasa',
          bodega: 'Bodega 1',
          sector: 'Sector 2',
          casillero: 'Casillero 2'
        },
        {
          rue: '00012347-1',
          familiaEspecie: 'Herramienta',
          tipoEspecie: 'Llaves',
          descripcion: 'Llave inglesa, llave francesa',
          alerta: false,
          cantidadMonto: 1,
          observaciones: 'Especie fue encontrada en un bolso de mano',
          bodega: 'Bodega 1',
          sector: 'Sector 2',
          casillero: 'Casillero 2'
        }
      ]
    },
    dataPersonasAsisten: {
      comprobante: true,
      personasAsisten: [
        {
          nroDocumento: '12.234.987-0',
          nombreCompleto: 'Miguel Elgueta Elgueta',
          institucion: 'Servicio Médico Legal',
          especialidad: 'Servicio Médico Legal'
        }
      ]
    },
    dataComprobanteTermino: {
      comprobante: true,
      comprobanteTermino: true,
      ruc: '2200938215-8',
      fechaInspeccion: '18-07-2022',
      horaInicioInspeccion: '09:30',
      horaTerminoInspeccion: '12:35',
      fechaTermino: '18-07-2022',
      nombreCausa: 'Hurto simple 4 A 40 UTM a Gustavo',
      solicitanteInspeccion: 'Samuel Núñez Parga',
      fiscaliaLocal: 'Fiscalía Local de Casablanca',
      observaciones:
        'Acá la observación que puede ser un texto largo...................................................................................................'
    },
    dataRegistrosInspeccion: [
      {
        fecha: '27-08-2020',
        horaInicio: '10:30',
        horaTermino: '12:30',
        observaciones: 'Napoleón marca Stanley'
      },
      {
        fecha: '28-08-2020',
        horaInicio: '12:45',
        horaTermino: '14.15',
        observaciones: 'Alicate Color Rojo'
      },
      {
        fecha: '29-08-2020',
        horaInicio: '09:00',
        horaTermino: '10:45',
        observaciones: 'Llave inglesa, llave francesa, llave stillson'
      }
    ]
  })
}
