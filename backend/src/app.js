const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const cacheMiddleware = require("./middlewares/cacheMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const taskRoutes = require("./routes/taskRoutes");
const todoListRoutes = require("./routes/todoListRoutes");
const app = express();

app.set("etag", true);

app.use(cors({
   origin: process.env.CLIENT_URL,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
   credentials: true
}));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cacheMiddleware);
app.use("/api/tasks", taskRoutes);
app.use("/api/todolists", todoListRoutes);

app.use((req, res) => {
   res.status(404).json({
      success: false,
      error: {
         message: "Route not found",
         status: 404
      }
   });
});

app.use(errorHandler);

module.exports = app;