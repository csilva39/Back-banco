const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

module.exports = Usuario;
