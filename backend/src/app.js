const express = require("express");
const app = express();
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const todoListRoutes = require("./routes/todoListRoutes");

app.use(express.json());

app.use(cors());

app.use("/api/tasks", taskRoutes);

app.use("/api/todolists", todoListRoutes);

app.use((req, res) => {

   res.status(404).json({
      error: {
         message: "Route not found",
         status: 404
      }
   });

});

app.use((err, req, res, next) => {

   res.status(500).json({
      error: {
         message: err.message,
         status: 500
      }
   });

});

module.exports = app;