const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),

  email: z
    .string()
    .email("Correo electronico invalido"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Correo electronico invalido"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
});

module.exports = {
  registerSchema,
  loginSchema
};