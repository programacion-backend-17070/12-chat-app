module.exports = (req, res, next) => {
  console.log(req.session.user)
  if (req.session.user) {
    return res.redirect("/cookie")
  }

  next()
}