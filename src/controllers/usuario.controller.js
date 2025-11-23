const User = require("../models/usuario.models");
const Cuenta = require("../models/cuenta.models");

module.exports = {
  async createUser(req, res) {
    try {
      const { idNumber, names } = req.body;
      if (!idNumber || !names)
        return res
          .status(400)
          .json({ error: "Identificación y Nombre requerido" });

      const [user, created] = await User.findOrCreate({
        where: { idNumber },
        defaults: { names },
      });

      if (!created)
        return res.status(409).json({ error: "Usuario ya existe." });
      return res.status(201).json({ message: "Usuario creado", user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error interno" });
    }
  },

  async listUsers(req, res) {
    const users = await User.findAll({ include: "accounts" });
    res.json(users);
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { idNumber, names } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (idNumber) user.idNumber = idNumber;
      if (names) user.names = names;

      await user.save();

      return res.json({ message: "Usuario actualizado", user });
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // elimianr usuarios
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, { include: "accounts" });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar si tiene cuentas con saldo > 0
      const accounts = user.accounts || [];
      const haySaldoPendiente = accounts.some((c) => Number(c.balance) > 0);

      if (haySaldoPendiente) {
        return res.status(400).json({
          message:
            "No se puede eliminar el usuario: tiene cuentas con saldo mayor a cero.",
        });
      }

      // Si tiene cuentas con saldo 0, las eliminamos primero
      await Cuenta.destroy({ where: { userId: id } });

      // Luego eliminamos al usuario
      await user.destroy();

      return res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
