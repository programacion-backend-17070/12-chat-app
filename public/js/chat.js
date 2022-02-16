// obtenemos todos los elementos de la UI que vamos a manipular
const modalEl = document.getElementById("modal-full") // modal
const inputNameEl = document.getElementById("input-name") // input del modal
const chatContainerEl = document.getElementById("chat-container")
const messageInput = document.getElementById("message-input") // input del chat
const sendBtn = document.getElementById("send-btn") // boton de enviar
const msgPool = document.getElementById("message-pool") // lista de mensajes
const usrList = document.getElementById("user-list") // lista de usuarios

const user = {}
const users = []

// Utilizamos el modal de UI para iniciar 
// el usuario debe de ingresar su nombre para poder utilizarlo
UIkit.modal(modalEl).show();

// escuchar el evento cuando el modal se cierra y ejecutar la logica inicial
UIkit.util.on("#modal-full", "hidden", () => {

  // mostamos el contenedor del chat que estaba escondido
  chatContainerEl.classList.toggle("hidden")
  document.getElementById("username").innerText = user.name
  msgPool.innerHTML = null

  // iniciar socket io
  user.socket = io()

  // se envia el nombre de usuario
  user.socket.emit("iam", user.name)

  user.socket.on("users", renderUser)

  user.socket.on("message", render) // nuevo mensaje recibido

  resetUserList()
})

// callback para saber cuando el usuario ha ingresado su nombre y cerrar el modal
inputNameEl.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    if (!e.target.value) {
      return
    }

    user.name = e.target.value // guardar nombre de usuario en un objeto global
    UIkit.modal(modalEl).hide(); // cerrar el modal
  }
})

sendBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (!messageInput.value) {
    return
  }

  const message = {
    message: messageInput.value,
    date: Date.now(),
    user: user.name
  }

  user.socket.emit("message", message) // ya envie el mensaje
  render(message)
  messageInput.value = null
})

function render(data) {
  const msgElement = document.createElement("div")
  const userEl = `<span class="user">${data.user}</span>`
  const timeEl = `<span class="date-time">${new Date(data.date).toLocaleString()}</span> &nbsp;`
  const cssClass = data.user == user.name ? "local" : "remote"
  msgElement.innerHTML = `
    <div class="message-data uk-text-small ${cssClass === "local" ? "align-right" : ""}">
      ${cssClass === "local" ? userEl + timeEl : timeEl + userEl}
    </div>
    <div class="message-body">${data.message}</div>
  `

  msgPool.appendChild(msgElement)
  msgPool.scrollTop = msgPool.scrollHeight // scroll hasta abajo
}

function renderUser(u) {
  if (u.name == user.name) {
    return
  }

  users.push(u)

  const liEl = document.createElement("li")
  liEl.innerHTML = u.name
  usrList.appendChild(liEl)
}

function resetUserList() {
  usrList.innerHTML = null

  const meEl = document.createElement("li") // <li>🙋🏻‍♂️</li>
  meEl.innerHTML = "🙋🏻‍♂️"
  usrList.appendChild(meEl)
}