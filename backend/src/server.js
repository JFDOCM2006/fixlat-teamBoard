const app = require("./app")
const pool = require("./db/database")
const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()")
.then((result) => {
    console.log("PostgreSQL conectado correctamente");
    console.log("Hora de PostgreSQL", result.rows[0].now);
})
.catch((error) => {
    console.error("Error conectando a PostgreSQL: ", error);
});


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http//localhost:${PORT}`)    
})