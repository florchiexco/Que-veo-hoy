const db = require("../lib/conexionbd.js");

const verTodos = (req, res) => {
  db.query(
    "SELECT g.id AS id, g.nombre AS nombre FROM generos AS g",
    function(err, rows) {
      if (err) {
        res.status(500).send("Internal error.");
        throw err;
      }
      if (!rows.length) {
        return res.status(400).send("No hay generos.");
      }
      res.send(rows);
    }
  );
};

module.exports = {
  verTodos
};
