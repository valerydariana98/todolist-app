const express = require("express");
const router = express.Router();
const {
  getAllTodoLists,
  getTodoListById,
  createTodoList,
  updateTodoList,
  deleteTodoList,
} = require("../controllers/todoListController");

router.get("/", getAllTodoLists);
router.post("/", createTodoList);
router.get("/:id", getTodoListById);
router.put("/:id", updateTodoList);
router.delete("/:id", deleteTodoList);

module.exports = router;
