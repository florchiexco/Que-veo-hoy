const express = require("express");
const peliculasController = require("../controladores/peliculas.js");
const router = express.Router();

/* getters */
router.get("/", peliculasController.verTodas);

module.exports = router;