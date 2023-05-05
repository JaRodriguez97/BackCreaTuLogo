const express = require("express"),
  usuariosController = require("../Controllers/usuariosController"),
  router = express.Router();
// { validarToken } = require("../recursos/funciones/auth");

router.get("/", usuariosController.getUsers);
router.get("/:id", usuariosController.getUser);
router.get("/seguimientoPedido/:id", usuariosController.followOrder);
router.post("/login", usuariosController.login);
router.post("/signUp", usuariosController.signUp);
router.post("/updateUser", usuariosController.updateUser);
router.post("/sendOrder", usuariosController.sendOrder);
// router.get("/", validarToken, AnalyticsController.busqueda);

module.exports = router;
