export const validateEmpty = (models) => {
  const empty = []
  models.forEach((element) => {
    if (element === '') {
      empty.push(element)
    } else {
      return ''
    }
  })
  return empty.length > 0
}
