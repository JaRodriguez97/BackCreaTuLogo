const app = require("./app"),
  { mongoose } = require("./database");

//inicializamos puerto
app.listen(app.get("port"), () =>
  console.log(`server conectado en puerto: ${app.get("port")}`)
);
