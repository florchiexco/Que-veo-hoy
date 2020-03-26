module.exports = routes = app => {
    app.use("/peliculas", require("./peliculas"));
    app.use("/generos", require("./generos"));
  };