const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "TeamBoard API Funcionando",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/users", usersRoutes)

module.exports = app;
