const bcrypt = require("bcryptjs");
const pool = require("../db/database");

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, active, created_at
      FROM users
      ORDER BY id ASC
    `);

    res.json({
      users: result.rows,
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);

    res.status(500).json({
      message: "Error obteniendo usuarios",
    });
  }
};

// Crear usuario
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nombre, email y contraseña son obligatorios",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "El usuario ya está registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role === "ADMIN" ? "ADMIN" : "USER";

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, active, created_at`,
      [name, email, hashedPassword, userRole, true]
    );

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error creando usuario:", error);

    res.status(500).json({
      message: "Error creando usuario",
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, active } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Nombre, email y rol son obligatorios",
      });
    }

    const existingUser = await pool.query(
      "SELECT id, role, active FROM users WHERE id = $1",
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const currentUser = existingUser.rows[0];

    const duplicateEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, id]
    );

    if (duplicateEmail.rows.length > 0) {
      return res.status(400).json({
        message: "El email ya está siendo utilizado",
      });
    }

    const userRole = role === "ADMIN" ? "ADMIN" : "USER";
    const userActive = active === true;

    // Verificar que siempre exista al menos un administrador activo
    const removingAdmin =
      currentUser.role === "ADMIN" &&
      currentUser.active === true &&
      (userRole !== "ADMIN" || userActive === false);

    if (removingAdmin) {
      const activeAdmins = await pool.query(
        `SELECT COUNT(*) AS total
         FROM users
         WHERE role = 'ADMIN'
         AND active = true`
      );

      if (Number(activeAdmins.rows[0].total) <= 1) {
        return res.status(400).json({
          message: "Debe existir al menos un administrador activo",
        });
      }
    }

    let result;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      result = await pool.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             password = $3,
             role = $4,
             active = $5
         WHERE id = $6
         RETURNING id, name, email, role, active, created_at`,
        [
          name,
          email,
          hashedPassword,
          userRole,
          userActive,
          id,
        ]
      );
    } else {
      result = await pool.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             role = $3,
             active = $4
         WHERE id = $5
         RETURNING id, name, email, role, active, created_at`,
        [
          name,
          email,
          userRole,
          userActive,
          id,
        ]
      );
    }

    res.json({
      message: "Usuario actualizado correctamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);

    res.status(500).json({
      message: "Error actualizando usuario",
    });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Evitar que el administrador se elimine a sí mismo
    if (Number(id) === req.user.id) {
      return res.status(400).json({
        message: "No puedes eliminar tu propio usuario",
      });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("Error eliminando usuario:", error);

    res.status(500).json({
      message: "Error eliminando usuario",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};