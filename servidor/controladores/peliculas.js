const db = require("../lib/conexionbd.js");

const verTodas = (req, res) => {
  db.query(
    "SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama FROM peliculas AS p",
    function(err, rows) {
      if (err) {
        res.status(500).send("Internal error.");
        throw err;
      }
      if (!rows.length) {
        return res.status(400).send("No hay peliculas.");
      }
      res.send(rows);
    }
  );
};

module.exports = {
  verTodas
};
