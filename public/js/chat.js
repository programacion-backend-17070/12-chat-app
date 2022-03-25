// obtenemos todos los elementos de la UI que vamos a manipular
const modalEl = document.getElementById("modal-full")
const inputNameEl = document.getElementById("input-name")
const inputEmailEl = document.getElementById("input-email")
const chatContainerEl = document.getElementById("chat-container")
const messageInput = document.getElementById("message-input")
const sendBtn = document.getElementById("send-btn")
const enterBtn = document.getElementById("enter-btn")
const msgPool = document.getElementById("message-pool")
const usrList = document.getElementById("user-list")
const groupList = document.getElementById("group-list")

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

  // conectar con socket io
  user.socket = io()

  // escuchar diferentes eventos

  // enviamos nuestro nombre de usuario al server para que los demas nos conozcan
  user.socket.emit("iam", user.name)

  // escuchar la lista de usuarios conectados actualmente
  user.socket.on("users", renderUser)

  // escuchar cuando un usuario se ha desconectado
  user.socket.on("offline", deleteUser)

  // escuchar cuando un nuevo mensaje ha sido recibido
  user.socket.on("message", render)

  user.socket.on("messages", (data) => {
    const author = new normalizr.schema.Entity("authors", {}, { idAttribute: "email" })
    const mensaje = new normalizr.schema.Entity("mensajes", {
      author: author
    })

    const schemaMensajes = new normalizr.schema.Entity("data", {
      mensajes: [mensaje]
    })

    const denormalzedData = normalizr.denormalize("mensajes", schemaMensajes, data.entities) 
    console.log(denormalzedData.mensajes)

    denormalzedData.mensajes.forEach(m => render2(m))
  })

  // resetar la lista de usuarios, poniendo siempre al inicio al usuario de la app
  resetUserList()
})

// callback para enviar mensaje cuando damos click  en el boton
sendBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (!messageInput.value) {
    return
  }

  const message = {
    author: {
      email: user.email,
      name: user.name
    },
    text: messageInput.value,
    date: Date.now()
  }

  console.log(message)

  // enviamos el mensaje y renderizamos el mismo en la lista de mensajes
  user.socket.emit("message", message)

  // render(message)
  messageInput.value = null
})

// callback para saber cuando el usuario ha ingresado su nombre y cerrar el modal
enterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const email = inputEmailEl.value
  const name = inputNameEl.value
  if (!email || !name) {
    return
  }

  user.name = name
  user.email = email
  console.log(user)
  UIkit.modal(modalEl).hide();
})

// rendizar un mensaje
// distinguiendo entre mensaje enviado o mensaje recibido
function render(data) {
  const msgElement = document.createElement("div")
  const userEl = `<span class="user">${data.user}</span>`
  const timeEl = `<span class="date-time">${new Date(data.date).toLocaleString()}</span> &nbsp;`
  const cssClass = data.user == user.name ? "local" : "remote"
  msgElement.classList.add(cssClass)
  msgElement.innerHTML = `
    <div class="message-data uk-text-small ${cssClass === "local" ? "align-right" : ""}">
      ${cssClass === "local" ? userEl + timeEl : timeEl + userEl}
    </div>
    <div class="message-body">${data.message}</div>
  `
  msgPool.appendChild(msgElement)
  msgPool.scrollTop = msgPool.scrollHeight
}

function render2(data) {
  const msgElement = document.createElement("div")
  const userEl = `<span class="user">${data.author.name}</span>`
  const timeEl = `<span class="date-time">${new Date(data.date).toLocaleString()}</span> &nbsp;`
  const cssClass = data.author.name == user.name ? "local" : "remote"
  msgElement.classList.add(cssClass)
  msgElement.innerHTML = `
    <div class="message-data uk-text-small ${cssClass === "local" ? "align-right" : ""}">
      ${cssClass === "local" ? userEl + timeEl : timeEl + userEl}
    </div>
    <div class="message-body">${data.text}</div>
  `
  msgPool.appendChild(msgElement)
  msgPool.scrollTop = msgPool.scrollHeight
}

// renderizar un usuario en la lista
function renderUser(u) {
  if (u.name == user.name) {
    return
  }
  users.push(u)
  const liEl = document.createElement("li")
  liEl.innerHTML = u.name
  liEl.dataset.id = u.id
  usrList.appendChild(liEl)
}

// borrar un usuario de la lista
function deleteUser(id) {
  resetUserList()
  users.filter(u => u.id !== id).forEach(renderUser)
}


// inicializar la lista de usuarios
function resetUserList() {
  usrList.innerHTML = null

  const meEl = document.createElement("li")
  meEl.innerHTML = "🙋🏻‍♂️"
  usrList.appendChild(meEl)
}
