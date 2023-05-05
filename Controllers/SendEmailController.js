let SendEmailController = {},
  fs = require("fs"),
  path = require("path"),
  hbs = require("nodemailer-express-handlebars"),
  transporter = require("../assets/Js/mail");

SendEmailController.sendMessageContact = async (req, res) => {
  let { body } = req;

  transporter.use(
    "compile",
    hbs({
      viewEngine: "express-handlebars",
      viewPath: "./",
    })
  );

  /*
    Editar documento handlebars
  */

  await fs.promises
    .readFile(
      path.join(__dirname, "../assets/Templates") + "/mensajeContacto.html",
      "utf8"
    )
    .then(async (data) => {
      await fs.promises
        .writeFile(path.join(__dirname, "../") + "main.handlebars", data)
        .then(async () => {
          console.log("El archivo fue cambiado correctamente");

          await transporter
            .sendMail({
              from: `"Mensaje de la página web" <jhonleninbarrientos53@gmail.com>`,
              to: [
                "angelithams@hotmail.com",
                "cristi542012@gmail.com",
                "codepro.jr@gmail.com",
                "jhonleninbarrientos53@gmail.com",
              ],
              subject: "Necesito tus servicios!!",
              template: "main",
              context: {
                nombreCompleto: body.nombreCompleto,
                email: body.email,
                mensaje: body.mensaje,
                celular: body.celular,
              },
            })
            .then((resu) => {
              console.log(resu);
              res.status(200).send(resu);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: usuariosController.js:167 ~ .then ~ err",
            err
          );
        });
    })
    .catch((err) => {
      console.log("🚀 ~ file: usuariosController.js:164 ~ .then ~ err", err);
    });
};

module.exports = SendEmailController;
