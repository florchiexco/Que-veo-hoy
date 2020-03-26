module.exports = routes = app => {
    app.use("/api/peliculas", require("./peliculas"));
  };