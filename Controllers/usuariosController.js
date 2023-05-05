let usuariosController = {},
  hbs = require("nodemailer-express-handlebars"),
  transporter = require("../assets/Js/mail"),
  fs = require("fs"),
  path = require("path"),
  Usuario = require("../Models/Usuario");

usuariosController.getUsers = async (req, res) => {
  await Usuario.find()
    .lean()
    .then((users) =>
      users && users.length
        ? res.status(200).send(users)
        : res.status(404).send({
            err: users,
            message: "No hay usuarios en la base de datos",
          })
    );
};

usuariosController.getUser = async (req, res) => {
  let { id } = req.params;

  await Usuario.findById(id, { contrasena: 0 })
    .lean()
    .then((user) =>
      user
        ? res.status(200).send(user)
        : res.status(404).send({
            err: user,
            message:
              "Ocurre un error con tu usuario, por favor inicia sesión de nuevo.",
          })
    );
};
usuariosController.followOrder = async (req, res) => {
  let { id } = req.params;

  await Usuario.findOne(
    { "pedidosRealizados._id": id },
    { pedidosRealizados: 1 }
  )
    .lean()
    .then((user) => {
      let pedido = user.pedidosRealizados.filter((pedido) => pedido._id == id);

      pedido
        ? res.status(200).send(pedido)
        : res.status(404).send({
            err: pedido,
            message:
              "Ocurre un error con tu usuario, por favor inicia sesión de nuevo.",
          });
    });
};

usuariosController.login = async (req, res) => {
  let { body } = req;

  await Usuario.findOne({ numeroTelefono: body.numeroTelefono })
    // .lean()
    .then(async (user) =>
      !user
        ? res.status(404).send({
            err: user,
            message:
              "No se encuentra usuario registrado con ese número de celular",
          })
        : await user
            .validarPassword(body.contrasena, user.contrasena)
            .then((booleanResponse) =>
              !booleanResponse
                ? res.status(400).send({
                    err: booleanResponse,
                    message: "La contraseña es incorrecta",
                  })
                : res.status(200).send(user)
            )
            .catch((err) =>
              console.log(
                "🚀 ~ file: usuariosController.js:81 ~ .then ~ err",
                err
              )
            )
    )
    .catch((err) =>
      console.log(
        "🚀 ~ file: usuariosController.js:88 ~ usuariosController.login= ~ err",
        err
      )
    );
};

usuariosController.signUp = async (req, res) => {
  let { body } = req;

  await Usuario.findOne(
    { numeroTelefono: body.numeroTelefono },
    { contrasena: 0 }
  )
    .lean()
    .then(async (user) => {
      if (user)
        return res.status(400).send({
          err: user,
          message:
            "Número de celular ya está registrado, por favor intentar inicia sesión con los datos personales en el login",
        });

      let data = new Usuario(body);

      await data
        .encryptarPassword(body.contrasena)
        .then((newPass) => (data.contrasena = newPass))
        .then(async () => {
          await data
            .save()
            .then((newUser) => res.status(201).send(newUser))
            .catch((err) =>
              console.error(
                "🚀 ~ file: usuariosController.js:121 ~ .then ~ save",
                { err }
              )
            );
        })
        .catch((err) =>
          console.error(
            "🚀 ~ file: usuariosController.js:128 ~ .then ~ encryptarPassword",
            { err }
          )
        );
    })
    .catch((err) =>
      console.error("🚀 ~ file: usuariosController.js:134 ~ .then", { err })
    );
};

usuariosController.updateUser = async (req, res) => {
  let { body } = req,
    update = {};

  if (body.propiedad) update[body.propiedad] = body.dataUpdate;
  else update = body.dataUpdate;
  console.log(
    "🚀 ~ file: usuariosController.js:144 ~ usuariosController.updateUser= ~ update",
    update
  );

  return await Usuario.findByIdAndUpdate(body.id, update, {
    new: true,
    projection: { contrasena: 0, updatedAt: 0, createdAt: 0 },
  })
    .lean()
    .then((userUpdate) => (res ? res.status(200).send(userUpdate) : userUpdate))
    .catch((err) =>
      console.error("🚀 ~ file: usuariosController.updateUser:152 ~ .then", {
        err,
      })
    );
};

usuariosController.sendOrder = async (req, res) => {
  let { body } = req;

  usuariosController.updateUser(req).then(async (userUpdate) => {
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
        path.join(__dirname, "../assets/Templates") +
          "/mensajePedidoCliente.html",
        "utf8"
      )
      .then(async (data) => {
        await fs.promises
          .writeFile(path.join(__dirname, "../") + "main.handlebars", data)
          .then(async () => {
            console.log("El archivo fue cambiado correctamente");

            let pedidosRealizados = [...userUpdate.pedidosRealizados],
              ultimoPedidoFinalizado = pedidosRealizados.pop(),
              fecha = ultimoPedidoFinalizado.datosPedido.fechaHora
                .toString()
                .split("T")
                .shift(),
              hora = ultimoPedidoFinalizado.datosPedido.fechaHora
                .toString()
                .split("T")
                .pop(),
              origin = req.headers.origin,
              link = `${origin}/follow-order/${ultimoPedidoFinalizado._id}`;

            await transporter
              .sendMail({
                from: `"Pedido en curso" <jhonleninbarrientos53@gmail.com>`,
                to: body.dataUpdate.email,
                subject: "Confirmación Pedido CreaTuLogo",
                template: "main",
                context: {
                  id: ultimoPedidoFinalizado._id,
                  nombreCompleto: [
                    userUpdate.nombres,
                    userUpdate.apellidos,
                  ].join(" "),
                  email: ultimoPedidoFinalizado.datosPedido.email,
                  celular: ultimoPedidoFinalizado.datosPedido.celular,
                  nombre: ultimoPedidoFinalizado.datosPedido.nombre,
                  apellido: ultimoPedidoFinalizado.datosPedido.apellido,
                  fecha,
                  hora,
                  link,
                  direccion: ultimoPedidoFinalizado.datosPedido.direccion,
                  detallesUbicacion:
                    ultimoPedidoFinalizado.datosPedido.detallesUbicacion,
                  detallesPedido:
                    ultimoPedidoFinalizado.datosPedido.detallesPedido,
                },
              })
              .then((resu) => {
                console.log(
                  "🚀 ~ file: usuariosController.js:228 ~ .then ~ resu",
                  resu,
                  userUpdate
                );
                res.status(200).send(userUpdate);
              })
              .catch((err) =>
                console.error(
                  "🚀 ~ file: usuariosController.js:234 ~ .then ~ err",
                  err
                )
              );
          })
          .catch((err) =>
            console.error(
              "🚀 ~ file: usuariosController.js:242 ~ .then ~ err",
              err
            )
          );
      })
      .catch((err) =>
        console.error("🚀 ~ file: usuariosController.js:248 ~ .then ~ err", err)
      );
    return;
  });
};

module.exports = usuariosController;
