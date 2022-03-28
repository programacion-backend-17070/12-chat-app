
const { Router } = require('express');

const auth = require("../middlewares/auth")

const router = new Router();

router.get("/", (req, res) => res.render("index"))
router.post("/register", (req, res) => {
  res.cookie("curso", "programacion backend")
  .cookie("signed", "soy una cookie signed", { signed: true })

  req.session.user = req.body.name
  req.session.admin = true

  res.redirect("/cookie")
})
router.get("/chat", auth, (req, res) => res.render("chat", {
  username: req.session.user
}))
router.get("/cookie", auth, (req, res) => res.render("cookie", {
  username: req.session.user
}))
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect("/?error=err")
    }

    res.clearCookie("curso").clearCookie("signed")
    res.redirect("/")
  })
})

module.exports = router