const express = require("express");

const app = express();

const taskRoutes = require("./routes/taskRoutes");
const todoListRoutes = require("./routes/todoListRoutes");

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/todolists", todoListRoutes);

module.exports = app;