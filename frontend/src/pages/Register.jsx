import { useState } from "react";

import { register } from "../services/authService";

function Register({
  onSuccess,
  onLogin,
}) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      return setError(
        "El nombre debe tener al menos 2 caracteres."
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return setError(
        "El correo no tiene un formato válido."
      );
    }

    if (password.length < 6) {
      return setError(
        "La contraseña debe tener al menos 6 caracteres."
      );
    }

    try {
      setLoading(true);

      await register(
        name,
        email,
        password
      );

      onSuccess();
    } catch (error) {
      let message =
        error.message ||
        "Error al registrarse.";

      try {
        const parsed =
          JSON.parse(message);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          message = parsed
            .map((e) => e.message)
            .join(" ");
        }
      } catch {
        // ignorar
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="view">
      <h1>Registro</h1>

      <form
        noValidate
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <input
          className="auth-input"
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="auth-input"
          type="text"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Registrando..."
            : "Registrarse"}
        </button>
      </form>

      <button
        className="btn-back"
        onClick={onLogin}
      >
        Ya tengo cuenta
      </button>
    </div>
  );
}

export default Register;