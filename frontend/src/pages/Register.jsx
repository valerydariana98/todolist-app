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
    useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await register(
        name,
        email,
        password
      );

      onSuccess();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="view">
      <h1>Registro</h1>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Registrarse
        </button>
      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

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