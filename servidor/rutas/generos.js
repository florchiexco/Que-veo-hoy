const express = require("express");
const generosController = require("../controladores/generos.js");
const router = express.Router();

/* getters */
router.get("/", generosController.verTodos);

module.exports = router;