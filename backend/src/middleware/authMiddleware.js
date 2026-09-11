const jwt = require("jsonwebtoken");
const pool = require("../db/database");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization recibido:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "Token de autenticación requerido",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token de autenticación requerido",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Verificar que el usuario todavía exista y esté activo
    const result = await pool.query(
      `SELECT id, name, email, role, active
       FROM users
       WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    const user = result.rows[0];

    if (!user.active) {
      return res.status(403).json({
        message: "Tu usuario está inactivo. Contacta al administrador.",
      });
    }

    // Guardar usuario actualizado en la petición
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};

module.exports = authMiddleware;