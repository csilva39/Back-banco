const { Sequelize } = require("sequelize");
const path = require("path");
const sequelize = new Sequelize("postgres", "postgres.goedrzepmfnxhvxsqtmu", "Silva1921.*#", {
  host: "aws-0-us-west-2.pooler.supabase.com",
  port: 6543,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate()
  .then(() => console.log("Conexión a Supabase vía Pooler establecida correctamente"))
  .catch((err) => console.error("Error conectando a Supabase:", err));

module.exports = sequelize;

// const sequelize = new Sequelize("postgres", "postgres", "Silva1921.*#", {
//   host: "aws-0-us-west-2.pooler.supabase.com",
//   port: 6543,
//   dialect: "postgres",
//   logging: false,
// });
// // const sequelize = new Sequelize("minibanco_db", "postgres", "1921", {
// //   host: "127.0.0.1",
// //   port: 5432,
// //   dialect: "postgres",
// //   logging: false,
// // });

// sequelize
//   .authenticate()
//   .then(() => console.log("Conexión a PostgreSQL establecida correctamente"))
//   .catch((err) => console.error("Error conectando a PostgreSQL:", err));

// module.exports = sequelize;
