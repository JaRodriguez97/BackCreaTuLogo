let productosController = {},
  Productos = require("../Models/producto");

productosController.getProducts = async (req, res) => {
  await Productos.find()
    .lean()
    .then((products) =>
      products && products.length
        ? res.status(200).send(products)
        : res.status(404).send({
            err: products,
            message: "No hay productos en la base de datos",
          })
    )
    .catch((err) => console.error(err));
};

productosController.getProduct = async (req, res) => {
  let { id } = req.params;

  await Productos.findById(id)
    .lean()
    .then((product) =>
      product
        ? res.status(200).send(product)
        : res.status(404).send({
            err: product,
            message: "No hay productos en la base de datos",
          })
    )
    .catch((err) => console.error(err));
};

module.exports = productosController;
