const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const sequelize = require("./db");
const User = require("./models/usuario.models");
const Account = require("./models/cuenta.models");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Base de datos sincronizada");

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
      console.log(
        `Jenry David Tapias Vanegas, Jorge Enrique Lozano Obando, Iris Dayana Acosta Moncada`
      );
    });
  } catch (err) {
    console.error("Error inicializando la DB", err);
  }
})();
