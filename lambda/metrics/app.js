const { Client } = require("pg");

exports.handler = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Pendiente') AS pendientes,
        COUNT(*) FILTER (WHERE status = 'En_curso') AS en_curso,
        COUNT(*) FILTER (WHERE status = 'Hecho') AS hechos
      FROM notes
    `);

    const metrics = result.rows[0];

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5174",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
      },

      body: JSON.stringify({
        total: Number(metrics.total),
        pendientes: Number(metrics.pendientes),
        en_curso: Number(metrics.en_curso),
        hechos: Number(metrics.hechos),
      }),
    };
  } catch (error) {
    console.error("Error obteniendo métricas:", error);

    return {
      statusCode: 500,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5174",
      },

      body: JSON.stringify({
        message: "Error obteniendo métricas",
      }),
    };
  } finally {
    await client.end();
  }
};