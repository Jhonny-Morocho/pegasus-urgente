const DotEnv = require('dotenv')

module.exports = function () {
  const environment = process.env.NODE_ENV

  const path = `./.env.${environment}`

  const config = DotEnv.config({ path }).parsed

  if (!config) {
    console.log('No se ha encontrado una configuración de entorno. Por favor, lea README.md')
    process.exit(0)
  }
}
