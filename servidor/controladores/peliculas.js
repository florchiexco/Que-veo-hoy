const db = require("../lib/conexionbd.js");

const verTodas = (req, res) => {
  var { anio, titulo, genero, columna_orden, tipo_orden, pagina, cantidad } = req.query;

  if (!cantidad) {
    cantidad = 40;
  }
  var sql = hacerSQL(titulo, anio, genero, columna_orden, tipo_orden, pagina, cantidad);
  var sqlCount = contarSQL(titulo, anio, genero);

  db.query(sql, function(err, rows, fields) {
    db.query(sqlCount, function(err, rows2, fields) {
      if (err) {
        console.log(rows);
        console.log(rows2);
        
        return res.status(404).send("Internal error.");
      }     
      var respuesta = {
        peliculas: rows,
        total: rows2[0].total
      };      
      res.send(JSON.stringify(respuesta));
    });
  });
};

function hacerSQL( titulo, anio, genero, columna_orden, tipo_orden, pagina, cantidad) {
  var sql = "SELECT * FROM peliculas ORDER BY " + columna_orden + " " + tipo_orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
  if (titulo != undefined || anio != undefined || genero != undefined) {
    sql ="SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama, g.nombre as genero FROM peliculas p INNER JOIN generos AS g ON p.genero_id = g.id WHERE titulo LIKE '" + titulo +"%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "' ORDER BY " + columna_orden + " " + tipo_orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
  }
  return sql;
}

function contarSQL(titulo, anio, genero) {
  var sql = "SELECT COUNT(*) as total FROM peliculas";
  if (titulo != undefined || anio != undefined || genero != undefined) {
    sql =
      "SELECT COUNT(*) AS total FROM peliculas p INNER JOIN generos AS g ON p.genero_id = g.id WHERE titulo LIKE '" + titulo + "%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "'";
  }
  return sql;
}

function getById(req, res) {
  const {id} = req.params;
  let sql = "SELECT p.titulo AS titulo, p.duracion AS duracion, p.trama AS trama, p.director AS director, p.anio AS anio, p.fecha_lanzamiento AS fecha_lanzamiento, p.puntuacion AS puntuacion, p.poster AS poster, a.nombre AS actores, g.nombre FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id INNER JOIN actor_pelicula ac ON p.id = ac.pelicula_id INNER JOIN actor a ON ac.actor_id = a.id WHERE p.id = ?;";
      
  db.query(sql, id, function(err, rows, fields){
      if (err) {
          console.log(error.message);
          return res.status(404).send('Internal error');
      }
        var response = {
        'pelicula': rows[0],
        'actores' : rows,
        'genero' : rows[0]
      };
      res.send(JSON.stringify(response));
  });
}

module.exports = {
  verTodas,
  getById
};
