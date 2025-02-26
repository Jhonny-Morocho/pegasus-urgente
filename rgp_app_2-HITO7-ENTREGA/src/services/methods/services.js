// devuelve la fecha miníma para ser menor de edad.
export const menorDeEdad = function () {
  const date18YrsAgo = new Date()
  date18YrsAgo.setFullYear(date18YrsAgo.getFullYear() - 18)
  return date18YrsAgo
}
