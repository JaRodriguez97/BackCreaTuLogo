const express = require("express"),
  SendEmailController = require("../Controllers/SendEmailController"),
  router = express.Router();
// { validarToken } = require("../recursos/funciones/auth");

router.post("/contact", SendEmailController.sendMessageContact);
// router.get("/", validarToken, AnalyticsController.busqueda);

module.exports = router;
