const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("postgres", "postgres", "Silva1921.*#", {
  host: "db.goedrzepmfnxhvxsqtmu.supabase.co",
  port: 5432,
  dialect: "postgres",
  logging: false,
});
// const sequelize = new Sequelize("minibanco_db", "postgres", "1921", {
//   host: "127.0.0.1",
//   port: 5432,
//   dialect: "postgres",
//   logging: false,
// });

sequelize
  .authenticate()
  .then(() => console.log("Conexión a PostgreSQL establecida correctamente"))
  .catch((err) => console.error("Error conectando a PostgreSQL:", err));

module.exports = sequelize;
