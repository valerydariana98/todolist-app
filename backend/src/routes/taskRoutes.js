const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/authMiddleware");

const {
   createTaskSchema,
   updateTaskSchema
} = require("../validations/taskValidation");

const {
   getTasks,
   getTaskById,
   createTask,
   updateTask,
   toggleTaskCompleted,
   deleteTask
} = require("../controllers/taskController");


router.use(authMiddleware);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post(
   "/",
   validate(createTaskSchema),
   createTask
);

router.put(
   "/:id",
   validate(updateTaskSchema),
   updateTask
);

router.patch("/:id/completed", toggleTaskCompleted);
router.delete("/:id", deleteTask);

module.exports = router;