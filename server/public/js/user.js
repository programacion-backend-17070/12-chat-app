// guardar el nombre de usuario del input en una cookie
// Obten el nombre de usuario de la cookie y muestralo en el elemento #username de HTML
// puedes utilizar la funcion cookie parser
// obten el elemento html
// cambiale su innerHTML al elemento de la cookie
// OJO: La cookie debe crearse al momento del register

// document.getElementById()
function cookieParser() {
  return (document.cookie || "").split("; ").reduce((obj, cookie) => {
    const [ name, value ] = cookie.split("=")
    obj[name] = decodeURI(value)
    return obj
  }, {})
}

const userNameEl = document.getElementById("username")

const cookies = cookieParser()

userNameEl.innerHTML = cookies.username

