const { Schema, model } = require("mongoose"),
  datosPedidoSchema = new Schema(
    {
      nombre: { type: String },
      apellido: { type: String },
      email: { type: String },
      fechaHora: { type: String },
      celular: { type: Number },
      direccion: { type: String },
      detallesUbicacion: { type: String },
      detallesPedido: { type: String },
    },
    {
      strict: false,
      timestamps: true,
    }
  );

module.exports = model("DatosPedido", datosPedidoSchema);
