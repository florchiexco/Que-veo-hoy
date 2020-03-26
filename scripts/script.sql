CREATE DATABASE que_veo_hoy;
USE que_veo_hoy;
DROP DATABASE que_veo_hoy;

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
	genero_id INT,
    CONSTRAINT pk_id_pelicula PRIMARY KEY (id),
    CONSTRAINT fk_id_genero FOREIGN KEY (genero_id) REFERENCES generos (id)
);

CREATE TABLE generos(
	id INT AUTO_INCREMENT, 
    nombre VARCHAR(30),
    CONSTRAINT pk_id_genero PRIMARY KEY (id)
);

CREATE TABLE actor(
	id INT AUTO_INCREMENT,
    nombre VARCHAR(70),
    CONSTRAINT pk_id_actor PRIMARY KEY (id)
);

CREATE TABLE actor_pelicula(
	id INT AUTO_INCREMENT, 
    actor_id INT,
    pelicula_id INT,
    CONSTRAINT pk_id_actor_pelicula PRIMARY KEY (id),
    CONSTRAINT fk_id_actor FOREIGN KEY (actor_id) REFERENCES actor (id),
    CONSTRAINT fk_id_pelicula FOREIGN KEY (pelicula_id) REFERENCES peliculas (id)
);


