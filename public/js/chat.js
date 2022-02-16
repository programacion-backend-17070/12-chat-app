// obtenemos todos los elementos de la UI que vamos a manipular
const modalEl = document.getElementById("modal-full")
const inputNameEl = document.getElementById("input-name")
const chatContainerEl = document.getElementById("chat-container")
const messageInput = document.getElementById("message-input")
const sendBtn = document.getElementById("send-btn")
const msgPool = document.getElementById("message-pool")
const usrList = document.getElementById("user-list")

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
})

// callback para saber cuando el usuario ha ingresado su nombre y cerrar el modal
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