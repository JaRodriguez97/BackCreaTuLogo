const express = require("express"),
  productosController = require("../Controllers/productosController"),
  router = express.Router();
// { validarToken } = require("../recursos/funciones/auth");

router.get("/", productosController.getProducts);
router.get("/:id", productosController.getProduct);
// router.post("/login", productosController.login);
// router.post("/signUp", productosController.signUp);
// router.post("/updateUser", productosController.updateUser);
// router.get("/", validarToken, AnalyticsController.busqueda);

module.exports = router;
