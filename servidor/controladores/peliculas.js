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
  let sql = "SELECT p.titulo AS titulo, p.duracion AS duracion, p.trama AS trama, p.director AS director, p.anio AS anio, p.fecha_lanzamiento AS fecha_lanzamiento, p.puntuacion AS puntuacion, p.poster AS poster, g.nombre FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE p.id = ?;";
      
  db.query(sql, id, (err, results) => {

    if (err) {
      res.status(500).send(err);
    }

    let sql2 = `SELECT actor_id, nombre FROM actor_pelicula ap INNER JOIN actor a ON (a.id = ap.actor_id ) WHERE pelicula_id =?`;
    db.query(sql2, id, (err, results2) => {

      var response= { pelicula: results[0], 
                      actores: results2 , 
                      genero: results[0]};
        
      res.send(JSON.stringify(response));
    
    });
  });
};

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
      return res.status(404).send("Internal error");
    }
    var response = {
      'peliculas': respuesta
    };    
    res.send(JSON.stringify(response));
  });
}

const recomendacionSQL= (genero, anioInicio, anioFin, puntuacion) => {
  let sql = '';
  if (genero != undefined && anioInicio != undefined && anioFin != undefined) {
    sql = "SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama, p.genero_id AS genero_id FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
  }else if(anioInicio != undefined && anioFin != undefined) {
    sql = "SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama, p.genero_id AS genero_id FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE ( fecha_lanzamiento >= '" + anioInicio + "' AND fecha_lanzamiento <= '" + anioFin + "' )";
  }else if(genero != undefined && puntuacion != undefined){
    sql = "SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama, p.genero_id AS genero_id FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "' AND p.puntuacion >= '" + puntuacion + "'";
  }else if(puntuacion != undefined){
    sql = "SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama, p.genero_id AS genero_id FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE  p.puntuacion >= '" + puntuacion + "'";
  }else {
    sql = "SELECT p.id AS id, p.titulo AS titulo, p.duracion AS duracion, p.director AS director, p.fecha_lanzamiento AS fecha_lanzamiento, p.anio AS anio, p.puntuacion AS puntuacion, p.poster AS poster, p.trama AS trama, p.genero_id AS genero_id FROM peliculas p INNER JOIN generos g ON p.genero_id = g.id WHERE g.nombre = '" + genero + "'";
  }
  return sql;
}



module.exports = {
  verTodas,
  buscarPorID,
  verRecomendacion
};
