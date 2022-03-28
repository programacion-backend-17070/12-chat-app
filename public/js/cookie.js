const cookiesEl = document.getElementById("cookies")

function cookieParser() {
  return (document.cookie || "").split("; ").reduce((obj, cookie) => {
    const [ name, value ] = cookie.split("=")
    obj[name] = value
    return obj
  }, {})
}

const cookies = cookieParser()

cookiesEl.innerHTML = JSON.stringify(cookies)