// const socket = io()
const modalEl = document.getElementById("modal-full")
const inputNameEl = document.getElementById("input-name")
const chatContainerEl = document.getElementById("chat-container")

UIkit.modal(modalEl).show();
UIkit.util.on("#modal-full", "hidden", () => {
  chatContainerEl.classList.toggle("hidden")
  document.getElementById("username").innerText = user.name
})

inputNameEl.addEventListener("keyup", (e) => {

  if (e.code === "Enter") {
    e.preventDefault();
    // Trigger the button element with a click
    if (!e.target.value) {
      return
    }

    user.name = e.target.value
    UIkit.modal(modalEl).hide();
  }
})


