const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Usuario = require("./usuario.models");

const Cuenta = sequelize.define(
  "Cuenta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accountId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cuentas",
    timestamps: false,
  }
);

Cuenta.belongsTo(Usuario, { foreignKey: "userId", as: "user" });
Usuario.hasMany(Cuenta, { foreignKey: "userId", as: "accounts" });

module.exports = Cuenta;
