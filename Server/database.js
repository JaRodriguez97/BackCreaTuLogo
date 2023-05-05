const mongoose = require("mongoose"),
  dominioDb = process.env.dominioDb,
  passDb = process.env.passDb,
  userDb = process.env.userDb,
  // URI = `mongodb://${userDb}:${passDb}@${dominioDb}:${portDb}/${nameDb}?authSource=admin`;
  URL = `mongodb+srv://${userDb}:${passDb}@${dominioDb}/test?authSource=admin`;

mongoose.set("strictQuery", false);
mongoose
  .connect(URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    zlibCompressionLevel: 9,
    compressors: "zlib",
  })
  .then(() =>
    console.log(`Base de datos Conectada en el Dominio: ${dominioDb}!`)
  )
  .catch((err) => console.error("🚀 ~ file: database.js:20 ~ err", err));

module.exports = mongoose;
