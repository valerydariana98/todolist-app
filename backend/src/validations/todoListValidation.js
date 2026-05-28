const { z } = require("zod");

const createTodoListSchema = z.object({
   title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title too long"),

   user: z
      .string()
      .optional()
});

const updateTodoListSchema = z.object({
   title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(100)
      .optional(),

   user: z
      .string()
      .optional()
});

module.exports = {
   createTodoListSchema,
   updateTodoListSchema
};