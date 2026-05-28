const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");

const {
   createTodoListSchema,
   updateTodoListSchema
} = require("../validations/todoListValidation");

const {
   getAllTodoLists,
   getTodoListById,
   createTodoList,
   updateTodoList,
   deleteTodoList
} = require("../controllers/todoListController");

router.get("/", getAllTodoLists);
router.get("/:id", getTodoListById);
router.post(
   "/",
   validate(createTodoListSchema),
   createTodoList
);
router.put(
   "/:id",
   validate(updateTodoListSchema),
   updateTodoList
);
router.delete("/:id", deleteTodoList);
module.exports = router;
