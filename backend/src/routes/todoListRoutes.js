const express = require("express");
const router = express.Router();

const {
   getAllTodoLists,
   getTodoListById,
   createTodoList,
   updateTodoList,
   deleteTodoList
} = require("../controllers/todoListController");

router.get("/", getAllTodoLists);
router.get("/:id", getTodoListById);
router.post("/", createTodoList);
router.put("/:id", updateTodoList);
router.delete("/:id", deleteTodoList);
module.exports = router;
