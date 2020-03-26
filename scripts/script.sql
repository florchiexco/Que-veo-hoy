CREATE DATABASE que_veo_hoy;
USE que_veo_hoy;

CREATE TABLE peliculas(
	id INT AUTO_INCREMENT,
    titulo VARCHAR(100),
    duracion INT(5),
    director TEXT(400),
    fecha_lanzamiento DATE,
    anio INT(5),
    puntuacion INT(2),
    poster TEXT(300),
    trama TEXT(700),
    CONSTRAINT pk_id_pelicula PRIMARY KEY (id)
);