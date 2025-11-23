const sequelize = require("../db");
const Cuenta = require("../models/cuenta.models");
const Usuario = require("../models/usuario.models");

module.exports = {
  // Crear cuenta Banco
  async openAccount(req, res) {
    try {
      const { idNumber, accountId, type } = req.body;
      if (!idNumber || !accountId || !type)
        return res
          .status(400)
          .json({ error: "Identificación y ID cuenta son requeridos" });

      const user = await Usuario.findOne({ where: { idNumber } });
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado." });

      const existing = await Cuenta.findOne({ where: { accountId } });
      if (existing)
        return res.status(409).json({ error: "ID de cuenta ya existe." });

      const cuenta = await Cuenta.create({
        accountId,
        type,
        userId: user.id,
        balance: 0.0,
      });

      return res.status(201).json({ message: "Cuenta creada", cuenta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Consignar dinero
  async deposit(req, res) {
    const t = await sequelize.transaction();
    try {
      const { accountId } = req.params;
      const { monto, amount } = req.body;

      const montoNumerico = parseFloat(monto || amount);
      if (isNaN(montoNumerico) || montoNumerico <= 0) {
        await t.rollback();
        return res.status(400).json({ error: "Monto inválido" });
      }

      const cuenta = await Cuenta.findOne({
        where: { accountId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!cuenta) {
        await t.rollback();
        return res.status(404).json({ error: "Cuenta no encontrada" });
      }

      cuenta.balance = parseFloat(cuenta.balance) + montoNumerico;
      await cuenta.save({ transaction: t });
      await t.commit();

      return res.json({ message: "Consignación exitosa", cuenta });
    } catch (err) {
      console.error("Error en consignación:", err);
      await t.rollback();
      return res.status(500).json({ error: "Error al consignar dinero" });
    }
  },

  // Retirar dinero
  async withdraw(req, res) {
    const t = await sequelize.transaction();
    try {
      const { accountId } = req.params;
      const { monto, amount } = req.body;

      const montoNumerico = parseFloat(monto || amount);
      if (isNaN(montoNumerico) || montoNumerico <= 0) {
        await t.rollback();
        return res.status(400).json({ error: "Monto inválido" });
      }

      const cuenta = await Cuenta.findOne({
        where: { accountId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!cuenta) {
        await t.rollback();
        return res.status(404).json({ error: "Cuenta no encontrada" });
      }

      if (parseFloat(cuenta.balance) < montoNumerico) {
        await t.rollback();
        return res.status(400).json({ error: "Saldo insuficiente" });
      }

      cuenta.balance = parseFloat(cuenta.balance) - montoNumerico;
      await cuenta.save({ transaction: t });
      await t.commit();

      return res.json({ message: "Retiro realizado con éxito", cuenta });
    } catch (error) {
      console.error("Error en retiro:", error);
      await t.rollback();
      res.status(500).json({ error: "Error al realizar el retiro" });
    }
  },

  // Consultar saldo
  async balance(req, res) {
    try {
      const { accountId } = req.params;
      const cuenta = await Cuenta.findOne({ where: { accountId } });
      if (!cuenta)
        return res.status(404).json({ error: "Cuenta no encontrada" });

      return res.json({
        accountId: cuenta.accountId,
        balance: cuenta.balance,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error interno" });
    }
  },

  async listAccounts(req, res) {
    try {
      const cuentas = await Cuenta.findAll({
        include: [
          {
            model: Usuario,
            as: "user",
            attributes: ["names", "idNumber"],
          },
        ],
      });

      res.json(
        cuentas.map((c) => ({
          accountId: c.accountId,
          type: c.type,
          balance: c.balance,
          names: c.user?.names || "—",
          idNumber: c.user?.idNumber || "—",
        }))
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al listar cuentas" });
    }
  },
};
