
const { Router } = require('express');
const auth = require("../middlewares/auth")
const historial = require("../middlewares/historial")
const isLogged = require("../middlewares/isLogged")

const router = new Router();

router.get("/", isLogged, (req, res) => res.render("index"))

// crear las vistas de /register y /cookie

router.post("/register", (req, res) => {

  console.log(req.body)
  // asi creamos una cookie nombre=valor
  res.cookie("username", req.body.name)
  // res.cookie("curso", "programacion backend")
  // res.cookie("nombre", "inserte nombre de usuario")
  // res.cookie("server", "express", {
  //   maxAge: 1000 * 60 * 2 // 2 minutos
  // })

  // res.cookie("firmada", "esto es un valor que debe verificarse", {
  //   signed: true
  // })

  req.session.user = {
    name: req.body.name,
    email: req.body.email,
    admin: true
  }

  res.redirect("/cookie")
})

router.get("/cookie", auth, historial, (req, res) => {
  // console.log(req.cookies) // cookies no firmadas
  // console.log(req.signedCookies) // cookies firmadas
  console.log(req.session)
  res.render("cookie")
})

router.get("/bye", (req, res) => {
  res.render("bye")
})

router.get("/chat", auth, historial, (req, res) => {
  // console.log(req.cookies) // cookies no firmadas
  // console.log(req.signedCookies) // cookies firmadas
  console.log(req.session)
  res.render("chat")
})

router.get("/logout", (req, res) => {
  const nombre = ""
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/?error=" + err)
    }

    res.clearCookie("username")
    // res.clearCookie("nombre")
    // res.clearCookie("server")

    res.redirect("/bye?name=" + nombew)

  })
})

module.exports = router