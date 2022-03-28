const { Router } = require('express');

const router = new Router();

// ruta para las visitas

api.get("/visitas", (req, res) => res.send("OK"))

module.exports = router