const pool = require("../db/database");

const createNote = async (req, res) => {
  try {
    const {
      title,
      content,
      status,
      position_x,
      position_y,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "El título es obligatorio",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO notes (
        user_id,
        title,
        content,
        status,
        position_x,
        position_y
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        req.user.id,
        title,
        content || "",
        status || "Pendiente",
        position_x ?? 100,
        position_y ?? 100,
      ]
    );

    res.status(201).json({
      message: "Nota creada correctamente",
      note: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM notes
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json({
      notes: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      status,
      position_x,
      position_y,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE notes
      SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        status = COALESCE($3, status),
        position_x = COALESCE($4, position_x),
        position_y = COALESCE($5, position_y),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      AND user_id = $7
      RETURNING *
      `,
      [
        title,
        content,
        status,
        position_x,
        position_y,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Nota no encontrada",
      });
    }

    res.json({
      message: "Nota actualizada correctamente",
      note: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM notes
      WHERE id = $1
      AND user_id = $2
      RETURNING id
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Nota no encontrada",
      });
    }

    res.json({
      message: "Nota eliminada exitosamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};