const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/usuario.controller");
const accCtrl = require("../controllers/cuenta.controller");

router.post("/users", userCtrl.createUser);
router.get("/users", userCtrl.listUsers);
router.put("/users/:id", userCtrl.updateUser);
router.delete("/users/:id", userCtrl.deleteUser);

router.post("/accounts", accCtrl.openAccount);
router.get("/accounts", accCtrl.listAccounts);

router.post("/accounts/:accountId/deposit", accCtrl.deposit);
router.post("/accounts/:accountId/withdraw", accCtrl.withdraw);
router.get("/accounts/:accountId/balance", accCtrl.balance);

module.exports = router;
