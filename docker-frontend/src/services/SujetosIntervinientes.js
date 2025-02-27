export default class SujetosIntervinientes {
  getSujetos () {
    return fetch('/src/data/sujetosStatic.json', {
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
