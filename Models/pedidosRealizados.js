const { Schema, model } = require("mongoose"),
  DatosPedido = require("./DatosPedido"),
  Productos = require("./producto"),
  pedidosRealizadosSchema = new Schema(
    {
      pedido: [Productos.schema],
      fecha: { type: Date },
      entregado: {
        type: {
          aceptado: {
            type:
              { fecha: { type: Date }, operador: { type: String } } ||
              undefined,
          },
          procesado: {
            type:
              { fecha: { type: Date }, operador: { type: String } } ||
              undefined,
          },
          enviado: {
            type:
              { fecha: { type: Date }, operador: { type: String } } ||
              undefined,
          },
          finalizado: {
            type:
              { fecha: { type: Date }, operador: { type: String } } ||
              undefined,
          },
        },
      },
      datosPedido: DatosPedido.schema,
    },
    {
      strict: false,
      timestamps: true,
    }
  );

module.exports = model("PedidosRealizados", pedidosRealizadosSchema);
