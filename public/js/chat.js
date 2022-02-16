const modalEl = document.getElementById("modal-full")
const inputNameEl = document.getElementById("input-name")
const chatContainerEl = document.getElementById("chat-container")
const messageInput = document.getElementById("message-input")
const sendBtn = document.getElementById("send-btn")
const msgPool = document.getElementById("message-pool")
const usrList = document.getElementById("user-list")
const groupList = document.getElementById("group-list")

UIkit.modal(modalEl).show();
UIkit.util.on("#modal-full", "hidden", () => {
  chatContainerEl.classList.toggle("hidden")
  document.getElementById("username").innerText = user.name
  msgPool.innerHTML = null
  user.socket = io()

  user.socket.emit("iam", user.name)
  user.socket.on("users", renderUser)
  user.socket.on("offline", deleteUser)
  user.socket.on("message", render)

  resetUserList()
})

sendBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (!messageInput.value) {
    return
  }

  const message = {
    message: messageInput.value,
    date: Date.now(),
    user: user.name,
    destination: ""
  }

  user.socket.emit("message", message)
  render(message)
  messageInput.value = null
})

inputNameEl.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    e.preventDefault();
    if (!e.target.value) {
      return
    }

    user.name = e.target.value
    UIkit.modal(modalEl).hide();
  }
})

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
}

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

function deleteUser(id) {
  resetUserList()
  users.filter(u => u.id !== id).forEach(renderUser)
}

function resetUserList() {
  usrList.innerHTML = null

  const meEl = document.createElement("li")
  meEl.innerHTML = "🙋🏻‍♂️"
  usrList.appendChild(meEl)
}
