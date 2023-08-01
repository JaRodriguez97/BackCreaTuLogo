let express = require("express"),
  dotenv = require("dotenv").config(),
  morgan = require("morgan"),
  compression = require("compression"),
  cors = require("cors"),
  app = express(),
  sendMail = require("../Routes/sendMail.route"),
  productos = require("../Routes/productos.route"),
  usuarios = require("../Routes/usuarios.route");

app.use(cors());
app.use(compression()); // Comprimir todas las respuestas HTTP
app.use(morgan("dev")); //mostrar peticiones por consola
app.use(express.json({ limit: "1000mb" }));
app.use(
  express.urlencoded({
    limit: "1000mb",
    extended: true,
  })
);

//configurar el puerto
app.set("port", process.env.PORT || 3000);

//exponer la carpeta imagenes
app.use("/imagenes", express.static(path.join(__dirname, "../assets/img")));

app.use("/api/productos", productos);
app.use("/api/sendEmail", sendMail);
app.use("/api/usuarios", usuarios);

module.exports = app;
