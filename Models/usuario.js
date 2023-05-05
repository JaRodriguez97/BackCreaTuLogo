const bcrypt = require("bcryptjs"),
  { Schema, model } = require("mongoose"),
  PedidosRealizados = require("./pedidosRealizados"),
  Productos = require("./producto"),
  usuarioSchema = new Schema(
    {
      apellidos: { type: String },
      contrasena: { type: String },
      direccion: { type: String },
      email: { type: String },
      favoritos: { type: Array },
      img: { type: String },
      nombres: { type: String },
      numeroTelefono: { type: Number },
      pedido: [Productos.schema],
      pedidosRealizados: [PedidosRealizados.schema],
      userName: { type: String },
    },
    {
      strict: false,
      timestamps: true,
    }
  );

usuarioSchema.methods.encryptarPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
};

usuarioSchema.methods.validarPassword = async (password, passwordThis) => {
  return await bcrypt.compare(password, passwordThis);
};

module.exports = model("Usuario", usuarioSchema);
