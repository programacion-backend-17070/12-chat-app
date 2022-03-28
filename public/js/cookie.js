const cookiesEl = document.getElementById("cookies")
const visitasEl = document.getElementById("visitas")

function cookieParser() {
  return (document.cookie || "").split("; ").reduce((obj, cookie) => {
    const [name, value] = cookie.split("=")
    obj[name] = decodeURI(value)
    return obj
  }, {})
}

// cookieParser convierte el string document.cookie en un objeto:
// { 
//   curso: "programacion backend",
//   server: "express"
// }

const objCookies = cookieParser()

console.log(objCookies)

cookiesEl.innerHTML = JSON.stringify(objCookies)

// asi podemos comunicarnos con nuestra API
fetch("http://localhost:8080/api/visitas")
  .then(response => response.json())
  .then(data => {
    visitasEl.innerHTML = data.contador
  });