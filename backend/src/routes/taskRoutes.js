const express = require("express");
const router = express.Router();

const {
   getTasks,
   getTaskById,
   createTask,
   updateTask,
   toggleTaskCompleted,
   deleteTask
} = require("../controllers/taskController");

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/completed", toggleTaskCompleted);
router.delete("/:id", deleteTask);
module.exports = router;