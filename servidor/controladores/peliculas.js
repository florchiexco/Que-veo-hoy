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

const buscarPorID= (req, res) => {
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

//Funciones auxiliares

const hacerSQL= ( titulo, anio, genero, columna_orden, tipo_orden, pagina, cantidad) => {
  var sql = "SELECT * FROM peliculas ORDER BY " + columna_orden + " " + tipo_orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
  if (titulo != undefined || anio != undefined || genero != undefined) {
    sql ="SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama, g.nombre as genero FROM peliculas p INNER JOIN generos AS g ON p.genero_id = g.id WHERE titulo LIKE '" + titulo +"%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "' ORDER BY " + columna_orden + " " + tipo_orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
  }
  return sql;
}

const contarSQL= (titulo, anio, genero) => {
  var sql = "SELECT COUNT(*) as total FROM peliculas";
  if (titulo != undefined || anio != undefined || genero != undefined) {
    sql =
      "SELECT COUNT(*) AS total FROM peliculas p INNER JOIN generos AS g ON p.genero_id = g.id WHERE titulo LIKE '" + titulo + "%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "'";
  }
  return sql;
}

const verRecomendacion= (req, res) => {

  const {genero, anioInicio, anioFin, puntuacion} = req.query;
  let sql = recomendacionSQL(genero, anioInicio, anioFin, puntuacion);
  
  db.query(sql, function(err, respuesta, fields){
    if (err) {
      console.log(error.message);
      return res.status(404).send("Internal error");
    }
    var response = {
      'peliculas': respuesta
    };
    console.log(response);
    
    res.send(JSON.stringify(response));
  });
}

const recomendacionSQL= (genero, anioInicio, anioFin, puntuacion) => {
  let sql = '';
  if (genero != undefined && anioInicio != undefined && anioFin != undefined) {
    sql = "SELECT * FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
  }else if(anioInicio != undefined && anioFin != undefined) {
    sql = "SELECT * FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
  }else if(genero != undefined && puntuacion != undefined){
    sql = "SELECT * FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND p.puntuacion >= '" + puntuacion + "'";
  }else if(puntuacion != undefined){
    sql = "SELECT * FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE  p.puntuacion >= '" + puntuacion + "'";
  }else {
    sql = "SELECT * FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "'";
  }
  return sql;
}



module.exports = {
  verTodas,
  buscarPorID,
  verRecomendacion
};
