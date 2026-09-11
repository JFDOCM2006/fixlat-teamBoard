const express = require("express");

const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Ruta de autenticación funcionando",
  });
});

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Usuario autenticado",
    user: req.user
  })
})

module.exports = router;