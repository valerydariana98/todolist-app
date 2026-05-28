const { z } = require("zod");

const createTaskSchema = z.object({

   title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title too long"),

   todoList: z
      .string()
      .optional(),

   completed: z
      .boolean()
      .optional()

});

const updateTaskSchema = z.object({

   title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(100)
      .optional(),

   completed: z
      .boolean()
      .optional(),

   todoList: z
      .string()
      .optional()

});

module.exports = {
   createTaskSchema,
   updateTaskSchema
};