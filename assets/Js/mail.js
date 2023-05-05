let { createTransport } = require("nodemailer");

let transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

transporter
  .verify()
  .then(() => console.log("Listo para enviar mensajes"))
  // .then(() => console.log({ user: process.env.user, pass: process.env.pass }))
  .catch((err) => console.log("🚀 ~ file: mail.js:26 ~ err", err));

module.exports = transporter;
