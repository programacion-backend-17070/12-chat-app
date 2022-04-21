const { Router } = require('express');

const router = new Router();

// ruta para las visitas
// /api/visitas
router.get("/visitas", (req, res) => {
  const { contador } = req.session

  res.send({ contador })
})

module.exports = router