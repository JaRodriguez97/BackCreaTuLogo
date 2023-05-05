const { Schema, model } = require("mongoose"),
  productoSchema = new Schema(
    {
      descuento: { type: Number },
      img: { type: String },
      incluye: { type: String },
      nombre: { type: String },
      precio: { type: Number },
      REF: { type: String },
    },
    {
      strict: false,
      timestamps: true,
    }
  );

module.exports = model("Productos", productoSchema);
