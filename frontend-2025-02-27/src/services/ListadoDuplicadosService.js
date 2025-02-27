export default class ListadoDuplicadosService {
  getCausasDuplicadas () {
    return fetch('/src/data/causas-duplicadas.json', {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    })
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        return json.data
      })
  }
}
