
const { Router } = require('express');

const router = new Router();

router.get("/", (req, res) => res.render("index"))
// router.post("/register", (req, res) => {
//   res.cookie("curso", "programacion backend")
//   .cookie("signed", "soy una cookie signed", { signed: true }).redirect("/cookie")
// })
// router.get("/chat", (req, res) => res.render("index"))
// router.get("/cookie", (req, res) => res.render("cookie"))
// router.get("/logout", (req, res) => {
//   res.clearCookie("curso").clearCookie("signed")
//   res.redirect("/")
// })

module.exports = router