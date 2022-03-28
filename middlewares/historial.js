module.exports = (req, res, next) => {
  // Crea aqui un middleware que guarde en la session un contador de visitas al sitio
  // a las rutas /chat y /cookies
  // el contador se debe de aumentar en 1 cada vez que se acceda cualquiera de estas rutas

  // por ejemplo
  // req.session.contador++

  // si el contador no existe, iniciarlo en 1

  // crear una ruta en la api /api/visitas que regrese ese numero del contador

  // bonus llamar ese contador en el frontend con fetch

  if (!req.session.contador) {
    req.session.contador = 1
  } else {
    req.session.contador++
  }

  console.log(req.session.contador)
  next()

}